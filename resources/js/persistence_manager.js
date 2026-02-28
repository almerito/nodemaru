
import { createShaderNode, setNodeCounter } from './node_manager.js';
import { HydraCompiler } from './hydra_compiler.js';
import { extractCustomShaders } from './hydra_utils.js';
import toastr from 'toastr';

export class PersistenceManager {
    constructor(graph) {
        this.graph = graph;
        this.STORAGE_KEY = 'Nodemaru-state';

        // Auto-save debounced
        this.debouncedSave = this.debounce(() => this.saveToLocalStorage(), 1000);

        this.setupAutoSave();
        this.setupMenuActions();
    }

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    setupAutoSave() {
        // Use the new global 'change' event from nodegraph-js
        this.graph.on('change', (event) => {
            //console.log('Graph change:', event.type, event.item);
            this.debouncedSave();
        });

        // Also hook into global window events for property changes which might not fire graph events
        // (e.g. typing in inputs inside the drawer)
        window.addEventListener('mouseup', () => {
            this.debouncedSave();
        });

        window.addEventListener('keyup', () => {
            this.debouncedSave();
        });
    }

    resetProject() {
        if (confirm('Create new project? Unsaved changes will be lost.')) {
            // 1. Clear LocalStorage
            localStorage.removeItem(this.STORAGE_KEY);

            // 2. Reset Settings
            this.graph.globalSettings = { bpm: 30, speed: 1, renderEngine: 'glsl3', numOutputs: 4 };
            this.graph.recordingSettings = { fps: 60, width: 1920, height: 1080 };

            // 3. Reset Scene Manager (creates default Scene 1)
            if (window.sceneManager) {
                window.sceneManager.reset();
            }

            // 4. Save new clean state immediately
            setNodeCounter(0); // Reset ID counter
            this.saveToLocalStorage();
            toastr.info('New project created');
        }
    }

    checkAuthOrLogin() {
        if (!window.user) {
            toastr.warning('Please login to perform this action');
            const loginModal = document.getElementById('loginModal');
            if (loginModal && window.bootstrap) {
                const modal = new window.bootstrap.Modal(loginModal);
                modal.show();
            }
            return false;
        }
        return true;
    }

    setupMenuActions() {
        const btnExport = document.getElementById('menu-export');
        const btnImport = document.getElementById('menu-import');
        const btnNew = document.getElementById('menu-new');

        // --- API Integration Hooks ---
        const btnSave = document.getElementById('menu-save');
        const btnLoad = document.getElementById('menu-load');
        const btnSaveAs = document.getElementById('menu-save-as'); // explicit Save As button

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        if (btnNew) {
            btnNew.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetProject();
            });
        }

        if (btnExport) {
            btnExport.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.checkAuthOrLogin()) {
                    this.exportState();
                }
            });
        }

        if (btnImport) {
            btnImport.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.checkAuthOrLogin()) {
                    fileInput.click();
                }
            });
        }

        if (btnSave) {
            btnSave.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.checkAuthOrLogin()) return;

                if (this.currentPatchId && this.isPatchOwner) {
                    this.savePatch(false); // Quick Save
                } else {
                    // Trigger Save As Modal
                    const modalEl = document.getElementById('saveAsModal');
                    if (modalEl && window.bootstrap) {
                        const modal = new window.bootstrap.Modal(modalEl);
                        modal.show();
                    }
                }
            });
        }

        if (btnSaveAs) {
            btnSaveAs.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.checkAuthOrLogin()) return;

                const modalEl = document.getElementById('saveAsModal');
                if (modalEl && window.bootstrap) {
                    const modal = new window.bootstrap.Modal(modalEl);
                    modal.show();
                }
            });
        }

        if (btnLoad) {
            btnLoad.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.checkAuthOrLogin()) return;

                // Just open modal, let it handle fetching via infinite scroll
                window.dispatchEvent(new CustomEvent('open-load-modal'));
            });
        }

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importState(file);
            }
            fileInput.value = ''; // reset
        });

        // Expose for UI
        window.persistenceManager = this;
    }

    // --- API Methods ---

    async fetchPatches() {
        try {
            const response = await fetch('/patches');
            if (!response.ok) throw new Error('Failed to fetch patches');
            return await response.json();
        } catch (error) {
            console.error('Fetch Patches Error:', error);
            toastr.error('Failed to load patch list');
            return [];
        }
    }

    async loadPatch(id) {
        try {
            const response = await fetch(`/patches/${id}`);
            if (!response.ok) throw new Error('Failed to load patch');
            const patch = await response.json();

            // patch.data contains the JSON state
            const state = patch.data;
            if (window.sceneManager) {
                window.sceneManager.importState(state);
            }

            // Metadata
            this.currentPatchId = patch.id;
            this.currentPatchLabel = patch.label;
            // logic requirement: is_owner flag from server
            this.isPatchOwner = patch.is_owner;

            toastr.success(`Loaded "${patch.label}"`);

            // Save to local storage to persist current session
            this.saveToLocalStorage();

        } catch (error) {
            console.error('Load Patch Error:', error);
            toastr.error('Failed to load patch');
        }
    }

    /**
     * @param {boolean} saveAs Force new creation
     * @param {object} metadata { label, description, is_public }
     */
    async savePatch(saveAs = false, metadata = {}) {
        if (!window.user) {
            toastr.warning('You must be logged in to save.');
            return;
        }

        const state = window.sceneManager ? window.sceneManager.exportState() : {};

        // COMPILE GRAPH FOR PREVIEW
        // We always re-compile to ensure the preview code matches the saved state exactly.
        try {
            // const { HydraCompiler } = await import('./hydra_compiler.js');
            // const { extractCustomShaders } = await import('./hydra_utils.js');

            const compiler = new HydraCompiler(this.graph);
            const previewCode = compiler.compile();
            const shaderTypes = extractCustomShaders(this.graph);

            if (previewCode) {
                state.previewCode = previewCode;
                state.previewShaders = shaderTypes;

                // Also update global cache just in case
                window.lastCompiledHydraCode = previewCode;
                window.lastShaderTypes = shaderTypes;
            }
        } catch (err) {
            console.warn("[PersistenceManager] Failed to compile preview code:", err);
            // Fallback to last known if available
            if (window.lastCompiledHydraCode) {
                state.previewCode = window.lastCompiledHydraCode;
            }
        }

        // Prepare payload
        // If updating (saveAs=false), we might keep existing label if not provided
        // But for Quick Save, metadata is empty.

        const payload = {
            data: state,
            ...metadata
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        };

        try {
            let url = '/patches';
            let method = 'POST';

            if (!saveAs && this.currentPatchId && this.isPatchOwner) {
                url = `/patches/${this.currentPatchId}`;
                method = 'PUT';
            } else {
                // Should have label if creating new
                if (!metadata.label && !this.currentPatchLabel) {
                    // Should trigger modal instead
                    toastr.warning('Please use Save As to name your patch');
                    return;
                }
                // If forking, ensure we have a label (maybe reuse old one + " Copy"?)
                // The UI Modal should handle gathering the label.
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Save failed');
            }

            const result = await response.json();

            this.currentPatchId = result.patch_id;
            this.isPatchOwner = true; // Created or Updated means I own it now
            if (metadata.label) this.currentPatchLabel = metadata.label;

            toastr.success(result.message);
            this.saveToLocalStorage(); // Persist "saved" state locally too
            return true;

        } catch (error) {
            console.error('Save Patch Error:', error);
            toastr.error(error.message);
            return false;
        }
    }

    async deletePatch(id) {
        if (!confirm('Are you sure you want to delete this patch?')) return false;

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch(`/patches/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Delete failed');
            }

            toastr.success('Patch deleted');

            // If we deleted the current patch, reset current ID
            if (this.currentPatchId == id) {
                this.currentPatchId = null;
                this.isPatchOwner = false;
                this.currentPatchLabel = null;
                this.saveToLocalStorage();
            }

            return true;
        } catch (error) {
            console.error('Delete Patch Error:', error);
            toastr.error(error.message);
            return false;
        }
    }

    // --- End API Methods ---

    // This method is now only for local file export
    exportState() {
        if (!window.sceneManager) return;
        const state = window.sceneManager.exportState();
        const json = JSON.stringify(state, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `nodemaru-project-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // This method is now only for local file import
    importState(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const state = JSON.parse(e.target.result);
                if (window.sceneManager) {
                    window.sceneManager.importState(state);
                    this.currentPatchId = null; // Reset ID on manual import (treated as new/unsaved)
                    this.isPatchOwner = false;
                    this.currentPatchLabel = null;
                    toastr.success('Project loaded locally');
                    this.saveToLocalStorage();
                }
            } catch (err) {
                console.error('Failed to parse JSON', err);
                toastr.error('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }

    // The original serialize/deserialize methods are now largely handled by SceneManager
    // and the new API methods. These are kept for compatibility or specific local storage needs.
    serialize() {
        // 1. Get Scene Data (delegated to SceneManager)
        let sceneData = { scenes: [], sceneCounter: 0, selectedSceneId: null };
        if (window.sceneManager) {
            sceneData = window.sceneManager.exportState();
        }

        // 2. Serialize Settings
        const globalSettings = this.graph.globalSettings || {};
        const recordingSettings = this.graph.recordingSettings || {};

        // 3. Assemble Unified State Object
        return {
            version: '2.0',
            timestamp: Date.now(),
            globalSettings,
            recordingSettings,
            ...sceneData, // Spreads: scenes, sceneCounter, selectedSceneId

            // Session Metadata (Patch Identity)
            currentPatchId: this.currentPatchId || null,
            isPatchOwner: this.isPatchOwner || false,
            currentPatchLabel: this.currentPatchLabel || null
        };
    }

    deserialize(data) {
        if (!data) return false;

        // 1. Restore Settings
        if (data.globalSettings) {
            this.graph.globalSettings = { ...this.graph.globalSettings, ...data.globalSettings };
        }
        if (data.recordingSettings) {
            this.graph.recordingSettings = { ...this.graph.recordingSettings, ...data.recordingSettings };
        }

        // 2. Restore Scenes (delegated to SceneManager)
        if (window.sceneManager) {
            window.sceneManager.importState(data);

            // Restore implicit connections
            if (window.graph && window.graph.nodes && window.updateImplicitConnections) {
                window.graph.nodes.forEach(node => {
                    window.updateImplicitConnections(node);
                });
            }
        } else {
            // Fallback if no scene manager (shouldn't happen in full app)
            this.clearCanvas();
            // Legacy or manual node restoration could go here if needed
        }

        // 3. Scan for max node ID to initialize counter
        this.initializeNodeCounter(data);

        // 4. Restore Session Metadata
        if (data.currentPatchId) {
            this.currentPatchId = data.currentPatchId;
            this.isPatchOwner = data.isPatchOwner || false;
            this.currentPatchLabel = data.currentPatchLabel;

            // Update UI
            const nameEl = document.getElementById('patch-name');
            if (nameEl && this.currentPatchLabel) {
                nameEl.textContent = this.currentPatchLabel;
            }
        } else {
            // Reset if no ID found (clean state)
            this.currentPatchId = null;
            this.isPatchOwner = false;
            this.currentPatchLabel = null;
            const nameEl = document.getElementById('patch-name');
            if (nameEl) nameEl.textContent = "New Patch";
        }

        return true;
    }

    initializeNodeCounter(data) {
        // Find max node id across all scenes
        let maxId = 0;

        // Helper to parsing
        const checkNodes = (nodes) => {
            if (!nodes) return;
            nodes.forEach(n => {
                let idx = undefined;
                if (n.nodeIndex !== undefined) idx = n.nodeIndex;
                else if (n.data && n.data.nodeIndex !== undefined) idx = n.data.nodeIndex;

                if (idx !== undefined) {
                    const num = parseInt(idx);
                    if (!isNaN(num) && num > maxId) maxId = num;
                } else if (n.id && typeof n.id === 'string' && n.id.startsWith('node-')) {
                    // Fallback for legacy nodes
                    const num = parseInt(n.id.replace('node-', ''));
                    if (!isNaN(num) && num > maxId) maxId = num;
                }
            });
        };

        if (data.scenes) {
            data.scenes.forEach(scene => {
                if (scene.patch && scene.patch.nodes) {
                    checkNodes(scene.patch.nodes);
                }
            });
        }

        setNodeCounter(maxId);
    }

    clearCanvas() {
        this.graph.clear();
    }

    saveToLocalStorage() {
        try {
            const data = this.serialize();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save state', e);
        }
    }

    restoreFromLocalStorage() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                this.deserialize(data);
                toastr.success('Session restored');
            }
        } catch (e) {
            console.warn('Failed to restore state', e);
        }
    }

    exportState() {
        try {
            const data = this.serialize();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nodemaru-patch-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toastr.success('Project exported');
        } catch (e) {
            toastr.error('Export failed');
            console.error(e);
        }
    }

    importState(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.deserialize(data);
                this.saveToLocalStorage(); // persist immediately
                toastr.success('Project imported');
            } catch (err) {
                toastr.error('Invalid project file');
                console.error(err);
            }
        };
        reader.readAsText(file);
    }
}

export function setupPersistence(graph) {
    const pm = new PersistenceManager(graph);
    // Restore on load
    pm.restoreFromLocalStorage();

    // Ensure at least one scene exists (first visit or corrupted data)
    if (window.sceneManager && window.sceneManager.scenes.length === 0) {
        window.sceneManager.add();
    }

    window.persistenceManager = pm;
}
