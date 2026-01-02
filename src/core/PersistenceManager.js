/**
 * PersistenceManager.js
 * Handles state saving, loading, export, import, history (undo/redo)
 */

import { BaseNode } from './Node.js';
import { Connection } from './Connection.js';
import { NODES_CONFIG } from '../ui/LibraryCallbacks.js';

export class PersistenceManager {
    constructor(editor) {
        this.editor = editor;

        // History State
        this.history = [];
        this.historyIndex = -1;
        this.isRestoring = false;
    }

    resetProject() {
        this.editor.nodes.forEach(n => n.element.remove());
        this.editor.nodes.clear();
        this.editor.connections.forEach(c => c.element.remove());
        this.editor.connections.clear();
        this.editor.svgLayer.innerHTML = '';
        this.editor.svgLayer.appendChild(this.editor.tempConnectionPath);
        this.editor.nodeCounter = 0;
        this.editor.connectionCounter = 0;

        this.editor.implicitConnections.forEach(el => el.remove());
        this.editor.implicitConnections.clear();
        this.editor.selectedNodes.clear();

        this.editor.globalSettings = { bpm: 30, speed: 1, renderEngine: 'glsl3' };

        // Reset scenes
        this.editor.sceneManager.scenes = [];
        this.editor.sceneManager.sceneCounter = 1;

        // 1. Create Default Scene
        const defaultScene = {
            id: 'scene_1',
            name: 'Scene 1',
            color: '#2196f3',
            durationType: 'seconds',
            durationValue: 0,
            repetitions: 1,
            follow: 'stay',
            transitionIn: { type: 'none', duration: 0 },
            transitionOut: { type: 'none', duration: 0 },
            midiTrigger: { portId: 'all', channel: 'all', ccNumber: 1, comparison: '>=', ccValue: 64 },
            patch: { nodes: [], connections: [] }
        };
        this.editor.sceneManager.scenes.push(defaultScene);
        this.editor.sceneManager.currentSceneIndex = 0;
        this.editor.sceneManager.selectedScene = defaultScene;

        localStorage.removeItem('hydra-composer-state');

        // Add a default "out" node at screen center
        const rect = this.editor.canvasContainer.getBoundingClientRect();
        const centerScreenX = rect.width / 2;
        const centerScreenY = rect.height / 2;
        // Convert screen-relative coords to canvas coords (accounting for zoom/pan)
        const centerX = (centerScreenX - this.editor.transform.x) / this.editor.transform.k;
        const centerY = (centerScreenY - this.editor.transform.y) / this.editor.transform.k;
        this.editor.addNode('out', centerX, centerY);

        // Save initial state to scene object explicitly
        this.editor.sceneManager.saveCurrentToSelected();
        this.editor.sceneManager.renderList();

        console.log("Project Reset");
        this.editor.refreshExecution(); // Trigger update
    }


    /* --- Persistence --- */
    saveState() {
        if (this.isRestoring) return;

        // Force sync current canvas nodes/connections to the active scene object
        // This ensures the snapshot contains the latest edits.
        if (this.editor.sceneManager.scenes.length > 0 && this.editor.sceneManager.selectedScene) {
            this.editor.sceneManager.saveCurrentToSelected();
        }

        const data = {
            nodes: [],
            connections: [],
            globalSettings: JSON.parse(JSON.stringify(this.editor.globalSettings)),
            scenes: JSON.parse(JSON.stringify(this.editor.sceneManager.scenes)),
            sceneCounter: this.editor.sceneManager.sceneCounter,
            // Calculate index dynamically to be robust
            currentSceneIndex: this.editor.sceneManager.selectedScene ? this.editor.sceneManager.scenes.findIndex(s => s.id === this.editor.sceneManager.selectedScene.id) : 0
        };

        this.editor.nodes.forEach(node => {
            // Clone currentValue but exclude blobUrl for remote images (they're temporary)
            let currentValueCopy = JSON.parse(JSON.stringify(node.currentValue || {}));
            if (node.type === 'init' && currentValueCopy.type === 'remote image') {
                delete currentValueCopy.blobUrl;
            }

            data.nodes.push({
                id: node.id,
                type: node.type,
                position: { ...node.position },
                currentValue: currentValueCopy
            });
        });

        this.editor.connections.forEach(conn => {
            data.connections.push({
                id: conn.id,
                sourceNodeId: conn.sourceNodeId,
                sourcePortType: conn.sourcePortType,
                targetNodeId: conn.targetNodeId,
                targetPortType: conn.targetPortType
            });
        });

        // History Management
        const stateStr = JSON.stringify(data);
        const lastStateStr = this.historyIndex >= 0 ? JSON.stringify(this.history[this.historyIndex]) : null;

        // Only push if different from last state
        if (stateStr !== lastStateStr) {
            // If we are not at the end of history, truncate future
            if (this.historyIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.historyIndex + 1);
            }

            this.history.push(data);
            this.historyIndex++;

            // Limit history size (e.g. 50 steps)
            if (this.history.length > 50) {
                this.history.shift();
                this.historyIndex--;
            }
        }

        localStorage.setItem('hydra-composer-state', stateStr);

        // Persist undo history with truncation if quota exceeded
        let savedHistory = false;
        let tempHistory = this.history;
        let tempIndex = this.historyIndex;
        let attempt = 0;

        while (!savedHistory && tempHistory.length > 0 && attempt < 20) {
            try {
                const historyData = {
                    history: tempHistory,
                    index: tempIndex
                };
                localStorage.setItem('hydra-composer-history', JSON.stringify(historyData));
                savedHistory = true;
            } catch (e) {
                // Quota exceeded or error
                // console.warn('History save failed, truncating...', e);

                // Create a shallow copy if not already
                if (tempHistory === this.history) {
                    tempHistory = [...this.history];
                }

                // Remove oldest items (aggressive truncation to recover quickly)
                const removeCount = Math.max(1, Math.ceil(tempHistory.length * 0.2)); // Remove 20%
                tempHistory.splice(0, removeCount);
                tempIndex = Math.max(0, tempIndex - removeCount);

                attempt++;
            }
        }

        if (!savedHistory) {
            console.warn('Could not save history even after truncation');
        }

        this.editor.uiRenderers.updateImplicitConnections();
    }

    loadState() {
        const raw = localStorage.getItem('hydra-composer-state');
        if (!raw) return false;

        try {
            const data = JSON.parse(raw);
            const success = this.restoreState(data);
            if (success) {
                const rawHistory = localStorage.getItem('hydra-composer-history');
                let historyLoaded = false;

                if (rawHistory) {
                    try {
                        const hData = JSON.parse(rawHistory);
                        if (Array.isArray(hData.history) && typeof hData.index === 'number') {
                            this.history = hData.history;
                            this.historyIndex = hData.index;
                            historyLoaded = true;
                        }
                    } catch (e) {
                        console.warn('Corrupt history data, resetting.');
                    }
                }

                if (!historyLoaded) {
                    this.history = [data];
                    this.historyIndex = 0;
                }
            }

            // Auto-fetch remote images after restoring state
            this.fetchRemoteImages();

            return success;
        } catch (e) {
            console.error("Failed to load state", e);
            return false;
        }
    }

    /**
     * Fetch all remote images in 'init' nodes and convert to blobs.
     * This is called after restoring state since blob URLs are not persisted.
     */
    async fetchRemoteImages() {
        const initNodes = Array.from(this.editor.nodes.values()).filter(n =>
            n.type === 'init' && n.currentValue?.type === 'remote image' && n.currentValue?.url
        );

        // Try multiple proxy services in order
        const proxyServices = [
            (u) => u, // Try direct first (works if server has CORS enabled)
            (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
            (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`
        ];

        for (const node of initNodes) {
            const url = node.currentValue.url;
            console.log(`[Remote Image] Fetching: ${url}`);

            let success = false;
            for (let i = 0; i < proxyServices.length && !success; i++) {
                try {
                    const proxyUrl = proxyServices[i](url);
                    const response = await fetch(proxyUrl);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const blob = await response.blob();

                    if (blob.size === 0) {
                        throw new Error('Empty response');
                    }

                    const blobUrl = URL.createObjectURL(blob);
                    node.currentValue.blobUrl = blobUrl;
                    node.clearError();

                    const proxyName = i === 0 ? 'direct' : i === 1 ? 'proxy1' : 'proxy2';
                    console.log(`[Remote Image] Loaded: ${url} (${Math.round(blob.size / 1024)}KB via ${proxyName})`);
                    success = true;

                } catch (e) {
                    // Try next proxy
                }
            }

            if (!success) {
                console.error(`[Remote Image] Failed to load ${url} (all proxies failed)`);
                node.currentValue.blobUrl = null;
                node.setError(`Failed to load remote image from all sources`);
            }
        }
    }

    restoreState(data) {
        this.isRestoring = true;
        try {
            // Restore Global Settings
            if (data.globalSettings) {
                this.editor.globalSettings = data.globalSettings;
            }

            // Clear existing
            this.editor.nodes.clear(); // Clear memory map
            this.editor.connections.clear(); // Clear memory map
            this.editor.implicitConnections.clear();

            // Clear DOM
            this.editor.canvas.innerHTML = '';

            // Re-setup SVG Layer (it was removed by string clear)
            this.editor.svgLayer.innerHTML = ''; // Clear lines inside SVG
            this.editor.canvas.appendChild(this.editor.svgLayer);
            this.editor.svgLayer.appendChild(this.editor.tempConnectionPath);


            // Reset counters
            let maxNodeId = 0;
            let maxConnId = 0;


            // FIX: If scenes are present, IGNORE root nodes/connections to prevent double loading or garbage data
            if (data.scenes && data.scenes.length > 0) {
                data.nodes = [];
                data.connections = [];
            }

            data.nodes.forEach(n => {
                const config = NODES_CONFIG[n.type];
                if (config) {
                    const node = new BaseNode(n.id, n.type, config, this.editor);
                    node.position = n.position;
                    // Ensure deep copy of currentValue to avoid link to history object
                    node.currentValue = JSON.parse(JSON.stringify(n.currentValue || {}));
                    node.updatePosition();
                    this.editor.nodes.set(n.id, node);
                    this.editor.canvas.appendChild(node.element);

                    const num = parseInt(n.id.split('_')[1]);
                    if (!isNaN(num) && num > maxNodeId) maxNodeId = num; // check NaN check
                }
            });
            this.editor.nodeCounter = maxNodeId;

            data.connections.forEach(c => {
                const conn = new Connection(c.id, c.sourceNodeId, c.sourcePortType, c.targetNodeId, c.targetPortType, this.editor);
                this.editor.connections.set(c.id, conn);
                this.editor.svgLayer.appendChild(conn.element);
                conn.update();

                const num = parseInt(c.id.split('_')[1]);
                if (!isNaN(num) && num > maxConnId) maxConnId = num;
            });
            this.editor.connectionCounter = maxConnId;

            this.editor.uiRenderers.updateImplicitConnections();
            this.validateLoadedDevices();

            // Restore MIDI Clock sync state
            this.editor.uiRenderers.restoreMidiClockSync();

            // Restore Scenes via SceneManager
            if (data.scenes && data.scenes.length > 0) {
                const sceneImportData = {
                    scenes: data.scenes,
                    sceneCounter: data.sceneCounter,
                    selectedSceneId: data.scenes[0].id // Force first scene
                };

                this.editor.sceneManager.importState(sceneImportData);

                // SAFETY: Double check selection
                if (!this.editor.sceneManager.selectedScene && this.editor.sceneManager.scenes.length > 0) {
                    this.editor.sceneManager.selectedScene = this.editor.sceneManager.scenes[0];
                    this.editor.sceneManager.currentSceneIndex = 0;
                }

                // Force load of current scene to canvas
                const currentScene = this.editor.sceneManager.selectedScene;
                if (currentScene) {
                    this.editor.sceneManager.loadToCanvas(currentScene);
                }
            } else {
                this.editor.sceneManager.importState({
                    scenes: [],
                    sceneCounter: 1
                });

                const defaultScene = {
                    id: 'scene_1',
                    name: 'Main',
                    color: '#2196f3',
                    durationType: 'seconds',
                    durationValue: 0,
                    repetitions: 1,
                    follow: 'stay',
                    transitionIn: { type: 'none', duration: 0 },
                    transitionOut: { type: 'none', duration: 0 },
                    midiTrigger: { portId: 'all', channel: 'all', ccNumber: 1, comparison: '>=', ccValue: 64 },
                    patch: {
                        nodes: data.nodes || [],
                        connections: data.connections || []
                    }
                };

                this.editor.sceneManager.scenes = [defaultScene];
                this.editor.sceneManager.currentSceneIndex = 0;
                this.editor.sceneManager.selectedScene = defaultScene;
                this.editor.sceneManager.sceneCounter = 1;
            }

            this.editor.refreshExecution(); // Ensure visual update
            this.editor.sceneManager.renderList(); // Update UI list if open

            this.isRestoring = false;
            return true;
        } catch (e) {
            console.error("Error restoring state:", e);
            this.isRestoring = false;
            return false;
        }
    }

    /* --- Undo / Redo --- */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const data = this.history[this.historyIndex];
            // Deep copy to prevent modification of history during restoration
            if (this.restoreState(JSON.parse(JSON.stringify(data)))) {
                this.saveState();
            }
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const data = this.history[this.historyIndex];
            if (this.restoreState(JSON.parse(JSON.stringify(data)))) {
                this.saveState();
            }
        }
    }

    // Export state as object (for preset saving)
    exportState() {
        const sceneData = this.editor.sceneManager.exportState();

        const data = {
            nodes: [],
            connections: [],
            globalSettings: this.editor.globalSettings,
            recordingSettings: this.editor.recordingManager.recordingSettings,
            scenes: sceneData.scenes,
            sceneCounter: sceneData.sceneCounter,
            // Include selectedSceneId to stay on the same scene after save/load
            selectedSceneId: sceneData.selectedSceneId
        };

        return data;
    }

    // Load state from data object (for preset loading)
    async loadFromData(data) {
        if (!data || !data.nodes) return false;

        try {
            console.log("[Persistence] loadFromData called. Delegating to restoreState.");

            // Use the centralized restoreState method which now handles Scene Priority and safeguards.
            const success = this.restoreState(data);

            if (success) {
                // Save the new state after successful import so it persists on reload
                this.editor.saveState();
            }

            return success;
        } catch (e) {
            console.error("Error loading state from data:", e);
            return false;
        }
    }

    // Validate devices after loading a preset - match or clear invalid references
    async validateLoadedDevices() {
        let warnings = [];

        // Get available devices
        let availableAudioDevices = [];
        let availableMidiPorts = [];

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop()));
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableAudioDevices = devices.filter(d => d.kind === 'audioinput');
        } catch (e) {
            console.log('Audio device enumeration not available');
        }

        try {
            const midiAccess = await navigator.requestMIDIAccess();
            midiAccess.inputs.forEach(input => availableMidiPorts.push({ id: input.id, name: input.name }));
        } catch (e) {
            console.log('MIDI not available');
        }

        for (const node of this.editor.nodes.values()) {
            if (node.type === 'audio') {
                const cur = node.currentValue || {};

                // Only validate device-type audio nodes
                if (cur.type === 'device') {
                    // Check if saved deviceId still exists
                    if (cur.deviceId) {
                        const found = availableAudioDevices.find(d => d.deviceId === cur.deviceId);
                        if (found) {
                            // Device still exists, all good
                            node.clearError();
                        } else {
                            // Device not found - try to rematch by name
                            let matched = null;
                            if (cur.deviceName) {
                                matched = availableAudioDevices.find(d =>
                                    d.label && d.label.toLowerCase().includes(cur.deviceName.toLowerCase())
                                );
                            }

                            if (matched) {
                                // Found by name match
                                cur.deviceId = matched.deviceId;
                                cur.deviceName = matched.label;
                                node.clearError();
                                console.log(`[validateLoadedDevices] Audio node ${node.id}: Rematched device by name to "${matched.label}"`);
                            } else if (availableAudioDevices.length > 0) {
                                // No match found, use first available device
                                const fallback = availableAudioDevices[0];
                                cur.deviceId = fallback.deviceId;
                                cur.deviceName = fallback.label;
                                node.clearError();
                                console.log(`[validateLoadedDevices] Audio node ${node.id}: Device not found, using fallback "${fallback.label}"`);
                                warnings.push(`Audio device for ${node.id} was remapped to "${fallback.label || 'Default Device'}"`);
                            } else {
                                // No devices available at all
                                const msg = "No audio input devices found";
                                node.setError(msg);
                                warnings.push(msg);
                            }
                        }
                    } else {
                        // No deviceId saved, try to set first available
                        if (availableAudioDevices.length > 0) {
                            const fallback = availableAudioDevices[0];
                            cur.deviceId = fallback.deviceId;
                            cur.deviceName = fallback.label;
                            node.clearError();
                        } else {
                            const msg = "No audio input devices found";
                            node.setError(msg);
                            warnings.push(msg);
                        }
                    }
                }

                // Verify Blob URL validity for file-type audio nodes
                if (cur.type === 'file' && cur.blobUrl) {
                    try {
                        const res = await fetch(cur.blobUrl);
                        if (!res.ok) throw new Error();
                        node.clearError();
                    } catch (e) {
                        const msg = "Local file missing (reload needed)";
                        node.setError(msg);
                    }
                }
            }

            if (node.type === 'midi') {
                const cur = node.currentValue || {};

                if (cur.portId) {
                    const found = availableMidiPorts.find(p => p.id === cur.portId);
                    if (!found) {
                        const nameMatch = availableMidiPorts.find(p =>
                            cur.portName && p.name.toLowerCase().includes(cur.portName.toLowerCase())
                        );

                        if (nameMatch) {
                            cur.portId = nameMatch.id;
                            node.clearError();
                        } else {
                            const msg = "MIDI device missing";
                            node.setError(msg);
                        }
                    } else {
                        node.clearError();
                    }
                }
            }

            // Init Nodes Validation
            if (node.type === 'init') {
                const cur = node.currentValue || {};
                if (cur.blobUrl) {
                    try {
                        const res = await fetch(cur.blobUrl);
                        if (!res.ok) throw new Error();
                    } catch (e) {
                        const msg = "Local file missing (reload needed)";
                        node.setError(msg);
                    }
                }
            }
        }

        // Show alert if there were any warnings
        if (warnings.length > 0) {
            alert('Device validation warnings:\n\n' + warnings.join('\n'));
        }
    }

    // Load preset by ID from API
    async loadPresetById(id, apiUrl, presetInfo = null) {
        try {
            const response = await fetch(`${apiUrl}?action=load&id=${id}`);
            const result = await response.json();

            if (result.success && result.preset) {
                const data = typeof result.preset.data === 'string'
                    ? JSON.parse(result.preset.data)
                    : result.preset.data;
                this.loadFromData(data);

                // Track the loaded preset for save/overwrite
                const name = presetInfo?.name || result.preset.name || null;
                const author = presetInfo?.author || result.preset.author || null;
                const userId = presetInfo?.user_id || result.preset.user_id || null;
                this.editor.setCurrentPatch(id, name, author, userId);
            } else {
                alert('Error loading preset: ' + (result.error || 'Unknown'));
            }
        } catch (e) {
            alert('Network error: ' + e.message);
        }
    }

}
