
import { createShaderNode } from './node_manager.js';
import { HydraCompiler } from './hydra_compiler.js';
import { NodeGraph } from 'nodegraph-js';
import * as bootstrap from 'bootstrap';

export class SceneManager {
    constructor(graph) {
        this.graph = graph;
        this.scenes = [];
        this.selectedScene = null;
        this.sceneCounter = 0;

        // Playback State
        this.scenePlaybackActive = false;
        this.playbackSceneIndex = -1;
        this.playbackRepeatCount = 0;
        this.playbackDurationTimer = null;

        // Shadow Graph for Headless Compilation
        const div = document.createElement('div');
        div.style.display = 'none';
        document.body.appendChild(div);

        this.compilationGraph = new NodeGraph(div, {
            grid: { enabled: false },
            zoom: { min: 0.1, max: 1 }
        });

        // Setup UI
        this.setupPanel();
    }

    setupPanel() {
        const panel = document.getElementById('scenes-panel');
        if (!panel) return;

        const header = panel.querySelector('.scenes-panel-header');
        const btnScenes = document.getElementById('btn-scenes') || document.querySelector('.scenes'); // In case ID missing
        const btnClose = document.getElementById('btn-close-scenes');
        const btnAddScene = document.getElementById('btn-add-scene');

        // Toggle panel
        if (btnScenes) {
            btnScenes.addEventListener('click', (e) => {
                e.preventDefault();
                panel.classList.toggle('d-none');
                if (!panel.classList.contains('d-none')) {
                    this.renderList();
                }
            });
        }

        // Close panel
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                panel.classList.add('d-none');
            });
        }

        // Add Scene
        if (btnAddScene) {
            btnAddScene.addEventListener('click', () => {
                this.add();
            });
        }

        // Draggable Logic
        if (header) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            header.addEventListener('mousedown', (e) => {
                if (e.target === btnClose) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = panel.offsetLeft;
                startTop = panel.offsetTop;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                panel.style.left = (startLeft + dx) + 'px';
                panel.style.top = (startTop + dy) + 'px';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }
    }

    getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    createDefault() {
        this.sceneCounter++;
        return {
            id: `scene_${Date.now()}_${this.sceneCounter}`,
            name: `Scene ${this.sceneCounter}`,
            color: this.getRandomColor(),
            // Basic params
            durationType: 'seconds',
            durationValue: 30,
            repetitions: 1,
            follow: 'stay',
            // Transitions
            transitionIn: { type: 'none', duration: 1000 },
            transitionOut: { type: 'none', duration: 1000 },
            patch: {
                nodes: [],
                connections: []
            }
        };
    }

    add() {
        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        const scene = this.createDefault();

        this.scenes.push(scene);
        this.selectedScene = scene;

        // Clear canvas for new scene
        this.graph.clear();

        this.renderList();

        // Do not open properties automatically
        // this.renderSceneProperties(scene);

        // Ensure UI updates
        // Force refresh of selection if needed
        this.select(scene);
    }



    serializeCurrentPatch() {
        // Delegate to NodeGraph serialization
        // This includes nodes, connections, groups, and viewport state
        return this.graph.serialize();
    }

    saveCurrentToSelected() {
        if (!this.selectedScene) return;
        this.selectedScene.patch = this.serializeCurrentPatch();
    }

    restorePatch(patchData) {
        if (!patchData) return;

        // Delegate to NodeGraph deserialization
        // This clears the canvas and restores the full state
        try {
            //console.log('[SceneManager] Clearing graph before restore...');
            this.graph.clear(); // Explicitly clear just in case
            //console.log('[SceneManager] Deserializing patch...');
            this.graph.deserialize(patchData);

            // Validate all node connections after restore
            if (window.validateAllNodeConnections) {
                setTimeout(() => window.validateAllNodeConnections(), 100);
            }
        } catch (err) {
            console.error('[SceneManager] Failed to restore patch:', err.message);
            // Don't reload - just skip restoring and start fresh
            console.warn('[SceneManager] Starting with empty canvas due to restore error');
        }
    }

    loadToCanvas(scene) {
        if (!scene) return;
        this.restorePatch(scene.patch);
    }

    reset() {
        this.scenes = [];
        this.sceneCounter = 0;
        this.selectedScene = null;
        this.add(); // Adds a default scene 1
    }

    // ==================== Selection & Properties ====================

    async select(scene) {
        if (this.selectedScene && this.selectedScene !== scene) {
            this.saveCurrentToSelected();
        }

        this.selectedScene = scene;
        this.loadToCanvas(scene);
        this.renderList();

        // Immediate visual update if Hydra is running (Preview Mode)
        // We only do this if NOT in playback mode, as playback handles its own execution
        if (!this.scenePlaybackActive && window.hydraManager) {
            //console.log('[SceneManager] Selecting scene, updating preview...');
            await window.hydraManager.execute({ target: 'Active' });
        }
    }

    renderSceneProperties(scene) {
        const drawer = document.getElementById('nodeParamsDrawer');
        const content = document.getElementById('drawerContent');
        const title = document.getElementById('drawerNodeTitle');

        if (!drawer || !content) return;

        // Open drawer
        const bsDrawer = new bootstrap.Offcanvas(drawer);
        bsDrawer.show();

        if (title) title.textContent = 'Scene Properties';

        content.innerHTML = '';

        // Helper to create input fields
        const createField = (label, type, value, onChange, step = 1, min = 0) => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            const lbl = document.createElement('label');
            lbl.className = 'form-label text-muted small';
            lbl.textContent = label;
            const input = document.createElement('input');
            input.type = type;
            input.className = 'form-control bg-dark text-white border-secondary';
            input.value = value;
            if (step) input.step = step;
            if (min !== undefined) input.min = min;

            if (type === 'color') input.className += ' form-control-color w-100';

            input.addEventListener('input', (e) => onChange(e.target.value));

            div.appendChild(lbl);
            div.appendChild(input);
            return div;
        };

        const createSelect = (label, options, value, onChange) => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            const lbl = document.createElement('label');
            lbl.className = 'form-label text-muted small';
            lbl.textContent = label;
            const select = document.createElement('select');
            select.className = 'form-select bg-dark text-white border-secondary';

            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                if (opt.value === value) o.selected = true;
                select.appendChild(o);
            });

            select.addEventListener('change', (e) => onChange(e.target.value));
            div.appendChild(lbl);
            div.appendChild(select);
            return div;
        };

        // Name
        content.appendChild(createField('Name', 'text', scene.name, (val) => {
            scene.name = val;
            this.renderList();
        }));

        // Color
        content.appendChild(createField('Color', 'color', scene.color, (val) => {
            scene.color = val;
            this.renderList();
        }));

        // Duration Section
        const durHeader = document.createElement('h6');
        durHeader.className = 'text-white border-bottom border-secondary pb-2 mt-4 mb-3';
        durHeader.textContent = 'Timing';
        content.appendChild(durHeader);

        // Duration Type
        content.appendChild(createSelect('Duration Type', [
            { value: 'seconds', label: 'Seconds' },
            { value: 'minutes', label: 'Minutes' },
            { value: 'beats', label: 'Beats' }
        ], scene.durationType, (val) => {
            scene.durationType = val;
        }));

        // Duration Value
        content.appendChild(createField('Duration Value', 'number', scene.durationValue, (val) => {
            scene.durationValue = parseFloat(val) || 0;
        }));

        // Follow
        content.appendChild(createSelect('Follow Action', [
            { value: 'stay', label: 'Stay on this scene' },
            { value: 'previous', label: 'Previous scene' },
            { value: 'next', label: 'Next scene' },
            { value: 'first', label: 'First scene' },
            { value: 'last', label: 'Last scene' },
            { value: 'random', label: 'Random (any)' },
            { value: 'random_exclude', label: 'Random (except this)' }
        ], scene.follow, (val) => {
            scene.follow = val;
        }));

        // Transitions Section
        const transHeader = document.createElement('h6');
        transHeader.className = 'text-white border-bottom border-secondary pb-2 mt-4 mb-3';
        transHeader.textContent = 'Transitions';
        content.appendChild(transHeader);

        // Helper for transition UI
        const createTransitionUI = (label, transObj) => {
            const container = document.createElement('div');
            container.className = 'mb-3 border border-secondary rounded p-2';

            const title = document.createElement('div');
            title.className = 'small fw-bold text-info mb-2';
            title.textContent = label;
            container.appendChild(title);

            // Type
            container.appendChild(createSelect('Type', [
                { value: 'none', label: 'None' },
                { value: 'crossFade', label: 'Cross Fade' },
                { value: 'fadeBlack', label: 'Fade to Black' },
                { value: 'wipe_lr', label: 'Wipe L-R' },
                { value: 'wipe_ud', label: 'Wipe U-D' },
                { value: 'radial', label: 'Radial Circ' },
                { value: 'glitch', label: 'Glitch / Noise' },
                { value: 'zoom', label: 'Zoom In/Out' },
                { value: 'pixelate', label: 'Pixelate' },
                { value: 'melt', label: 'Luminance Melt' }
            ], transObj.type || 'none', (val) => {
                transObj.type = val;
            }));

            // Duration
            container.appendChild(createField('Duration (ms)', 'number', transObj.duration || 1000, (val) => {
                transObj.duration = parseFloat(val);
            }, 100, 0));

            return container;
        };

        // Ensure objects exist (for older saved scenes)
        if (!scene.transitionIn) scene.transitionIn = { type: 'none', duration: 1000 };
        if (!scene.transitionOut) scene.transitionOut = { type: 'none', duration: 1000 };

        content.appendChild(createTransitionUI('Transition In', scene.transitionIn));
        content.appendChild(createTransitionUI('Transition Out', scene.transitionOut));

        // Delete
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-danger w-100 mt-4';
        btnDelete.textContent = 'Delete Scene';
        btnDelete.addEventListener('click', () => {
            if (confirm('Delete this scene?')) {
                this.remove(scene);
                bsDrawer.hide();
            }
        });
        content.appendChild(btnDelete);
    }

    // ==================== Scene Playback Runtime ====================

    startPlayback() {
        if (this.scenes.length === 0) return;

        // Ensure current edits are saved to the current selected scene before switching
        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        this.scenePlaybackActive = true;
        this.playbackSceneIndex = -1;
        this.playbackRepeatCount = 0;

        //console.log('[SceneManager] Starting Playback');

        // Warn if first scene is set to Stay
        if (this.scenes[0].follow === 'stay') {
            /*  import('toastr').then(m => m.default.warning("First scene follow action is set to 'Stay'. It will not transition automatically.")); */
        }

        // Initial play
        this.play(0);
    }

    stopPlayback() {
        //console.log('[SceneManager] Stopping Playback');
        this.scenePlaybackActive = false;
        if (this.playbackDurationTimer) {
            clearTimeout(this.playbackDurationTimer);
            this.playbackDurationTimer = null;
        }
    }

    async play(index) {
        if (!this.scenePlaybackActive) return;
        if (index < 0 || index >= this.scenes.length) return;

        const scene = this.scenes[index];
        const isFirstScene = this.playbackSceneIndex === -1;

        //console.log(`[SceneManager] Playing scene "${scene.name}" (${index + 1}/${this.scenes.length})`);

        // HEADLESS PLAYBACK: Do not change selection or main graph
        // Load into compilation graph
        try {
            this.compilationGraph.clear();
            this.compilationGraph.deserialize(scene.patch);
            // Sync settings?
            this.compilationGraph.globalSettings = this.graph.globalSettings;
        } catch (e) {
            console.error('[SceneManager] Failed to load scene into compiler:', e);
            // Skip broken scene?
            return;
        }

        const hm = window.hydraManager;
        if (!hm) {
            console.error('HydraManager not found');
            return;
        }

        // Compile
        // const { HydraCompiler } = await import('./hydra_compiler.js');
        const compiler = new HydraCompiler(this.compilationGraph);
        const script = compiler.compile(); // This returns string
        console.log('[SceneManager] Generated Hydra Code:\n', script);

        // We also need custom shader types. HydraManager usually extracts from its graph.
        // We must extract from compilationGraph.
        const shaderTypes = this._extractShaderTypes(this.compilationGraph);

        // 1. Compile & Execute
        // If first scene, run on Active immediately.
        // If transition, run on Inactive.

        const targetInstance = isFirstScene ? 'Active' : 'Inactive';

        // Execute passing code directly
        await hm.execute({
            target: targetInstance,
            code: script,
            customShaders: shaderTypes
        });

        // 2. Handle Transition
        if (isFirstScene) {
            this.playbackSceneIndex = index;
            // No transition needed, just running
        } else {
            const prevScene = this.scenes[this.playbackSceneIndex];
            const transOut = prevScene?.transitionOut || { type: 'none', duration: 0 };
            const transIn = scene.transitionIn || { type: 'none', duration: 0 };

            let mode = 'none';
            let duration = 0;

            if (transOut.type !== 'none') {
                mode = transOut.type;
                duration = transOut.duration; // Stored in ms
            } else if (transIn.type !== 'none') {
                mode = transIn.type;
                duration = transIn.duration; // Stored in ms
            }

            if (mode !== 'none' && duration > 0) {
                hm.transitionTo(mode, duration);
            } else {
                // Cut
                hm.transitionTo('none', 0);
            }

            this.playbackSceneIndex = index;
        }

        // 3. Schedule Next
        this.scheduleNext(scene);
    }

    _extractShaderTypes(graph) {
        const types = new Set();
        if (!graph || !graph.nodes) return [];
        graph.nodes.forEach(node => {
            const name = node.data?.shaderData?.name || node.type;
            const systemTypes = ['out', 'render', 'init', 'midi', 'audio', 'midi_data', 'audio_data', 'lfo', 'array', 'group', 'comment', 'src'];
            if (name && !systemTypes.includes(name) && name !== 'src') {
                types.add(name);
            }
        });
        return [...types];
    }

    scheduleNext(scene) {
        if (this.playbackDurationTimer) {
            clearTimeout(this.playbackDurationTimer);
            this.playbackDurationTimer = null;
        }

        // TODO: Handle 'midi' duration type event listener logic
        if (scene.durationType === 'midi') {
            return;
        }

        if (scene.durationValue <= 0) return;

        let durationMs = 0;
        switch (scene.durationType) {
            case 'seconds': durationMs = scene.durationValue * 1000; break;
            case 'minutes': durationMs = scene.durationValue * 60 * 1000; break;
            case 'beats':
                // Need BPM. Assuming 120 or global setting
                const bpm = window.graph?.globalSettings?.bpm || 60;
                durationMs = (60000 / bpm) * scene.durationValue;
                break;
            default: durationMs = scene.durationValue * 1000;
        }

        this.playbackDurationTimer = setTimeout(() => {
            if (!this.scenePlaybackActive) return;

            // Repetitions
            this.playbackRepeatCount++;
            if (this.playbackRepeatCount < scene.repetitions) {
                this.scheduleNext(scene);
            } else {
                this.playbackRepeatCount = 0;
                const nextIndex = this.getNextIndex(scene);
                if (nextIndex !== null) {
                    this.play(nextIndex);
                }
            }

        }, durationMs);
    }

    getNextIndex(scene) {
        const currentIndex = this.scenes.indexOf(scene);
        const total = this.scenes.length;

        // Follow Logic
        switch (scene.follow) {
            case 'stay': return null;
            case 'next': return currentIndex < total - 1 ? currentIndex + 1 : 0;
            case 'previous': return currentIndex > 0 ? currentIndex - 1 : total - 1;
            case 'first': return 0;
            case 'last': return total - 1;
            case 'random': return Math.floor(Math.random() * total);
            case 'random_exclude':
                if (total <= 1) return null;
                let r;
                do { r = Math.floor(Math.random() * total); } while (r === currentIndex);
                return r;
            default: return null;
        }
    }

    // ==================== UI Rendering ====================

    renderList() {
        const list = document.getElementById('scenes-list');
        if (!list) return;

        list.innerHTML = '';

        this.scenes.forEach(scene => {
            const item = document.createElement('div');
            item.className = 'scene-item';
            item.dataset.sceneId = scene.id; // Added ID for D&D logic
            if (this.selectedScene === scene) item.classList.add('selected');

            // Color dot
            const dot = document.createElement('div');
            dot.className = 'scene-color-dot';
            dot.style.backgroundColor = scene.color;
            item.appendChild(dot);

            // Name
            const name = document.createElement('span');
            name.className = 'scene-name';
            name.textContent = scene.name;
            item.appendChild(name);

            // Handle
            const handle = document.createElement('span');
            handle.className = 'scene-drag-handle';
            handle.innerHTML = '⋮⋮';
            item.appendChild(handle);

            // Selection Click
            item.addEventListener('click', () => {
                this.select(scene);
                // Only open properties if we want to? User requested specific behavior.
                this.renderSceneProperties(scene);
            });

            // Drag and Drop
            item.draggable = true;
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', this.scenes.indexOf(scene));
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = list.querySelector('.dragging');
                if (draggingItem && draggingItem !== item) {
                    const rect = item.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    if (e.clientY < midY) {
                        list.insertBefore(draggingItem, item);
                    } else {
                        list.insertBefore(draggingItem, item.nextSibling);
                    }
                }
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const newScenes = [];
                list.querySelectorAll('.scene-item').forEach(el => {
                    const id = el.dataset.sceneId;
                    const s = this.scenes.find(sc => sc.id === id);
                    if (s) newScenes.push(s);
                });
                if (newScenes.length === this.scenes.length) {
                    this.scenes = newScenes;
                }
                item.classList.remove('dragging');
            });
            item.dataset.sceneId = scene.id;

            list.appendChild(item);
        });
    }

    // ==================== Persistence ====================

    exportState() {
        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        return {
            scenes: this.scenes,
            sceneCounter: this.sceneCounter,
            selectedSceneId: this.selectedScene ? this.selectedScene.id : null
        };
    }

    importState(data) {
        if (!data || !data.scenes) return;

        this.scenes = data.scenes;
        this.sceneCounter = data.sceneCounter || this.scenes.length;

        let targetScene = null;
        if (data.selectedSceneId) {
            targetScene = this.scenes.find(s => s.id === data.selectedSceneId);
        }

        if (!targetScene && this.scenes.length > 0) {
            targetScene = this.scenes[0];
        }

        this.selectedScene = targetScene;
        this.renderList();

        if (this.selectedScene) {
            this.loadToCanvas(this.selectedScene);
        }
    }
}

export function setupSceneManager(graph) {
    window.sceneManager = new SceneManager(graph);
    //console.log('Scene Manager Initialized');
}
