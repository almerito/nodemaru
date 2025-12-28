/**
 * SceneManager - Scene management for Editor (Composition Pattern)
 */

import { BaseNode } from './Node.js';
import { Connection } from './Connection.js';
import { NODES_CONFIG } from '../ui/LibraryCallbacks.js';

export class SceneManager {
    /**
     * @param {Editor} editor - Reference to the parent Editor instance
     */
    constructor(editor) {
        this.editor = editor;

        // Scene State
        this.scenes = [];
        this.currentSceneIndex = 0;
        this.selectedScene = null;
        this.sceneCounter = 0;

        // Scene Playback Runtime
        this.scenePlaybackActive = false;
        this.playbackSceneIndex = 0;
        this.playbackRepeatCount = 0;
        this.playbackStartTime = 0;
        this.playbackDurationTimer = null;
        this.isInitializingPlayback = false;
    }

    // ==================== Scene Panel Setup ====================

    setupPanel() {
        const panel = document.getElementById('scenes-panel');
        const header = panel.querySelector('.scenes-panel-header');
        const btnScenes = document.getElementById('btn-scenes');
        const btnClose = document.getElementById('btn-close-scenes');
        const btnAddScene = document.getElementById('btn-add-scene');

        btnScenes.addEventListener('click', () => {
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                this.renderList();
            }
        });

        btnClose.addEventListener('click', () => {
            panel.classList.add('hidden');
        });

        btnAddScene.addEventListener('click', () => {
            this.add();
        });

        // Make panel draggable
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

    // ==================== Scene CRUD ====================

    createDefault() {
        this.sceneCounter++;
        return {
            id: `scene_${this.sceneCounter}`,
            name: `Scene ${this.sceneCounter}`,
            color: this.getRandomColor(),
            durationType: 'seconds',
            durationValue: 30,
            repetitions: 1,
            follow: 'stay',
            transitionIn: { type: 'none', duration: 0 },
            transitionOut: { type: 'none', duration: 0 },
            midiTrigger: {
                portId: '',
                channel: 0,
                ccNumber: 1,
                comparison: '>=',
                ccValue: 64
            },
            patch: {
                nodes: [],
                connections: []
            }
        };
    }

    getRandomColor() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    add() {
        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        const scene = this.createDefault();

        // Create empty scene with just 'out' node at center
        const rect = this.editor.canvasContainer.getBoundingClientRect();
        const centerX = (rect.width / 2 - this.editor.transform.x) / this.editor.transform.k;
        const centerY = (rect.height / 2 - this.editor.transform.y) / this.editor.transform.k;

        scene.patch = {
            nodes: [{
                id: 'node_1',
                type: 'out',
                position: { x: centerX, y: centerY },
                currentValue: {}
            }],
            connections: []
        };

        this.scenes.push(scene);
        this.selectedScene = scene;
        this.loadToCanvas(scene);
        this.renderList();
        this.openDrawer(scene);
        this.editor.saveState();
    }

    saveCurrentToSelected() {
        if (!this.selectedScene) return;

        this.selectedScene.patch = {
            nodes: Array.from(this.editor.nodes.values()).map(n => ({
                id: n.id,
                type: n.type,
                position: { ...n.position },
                currentValue: JSON.parse(JSON.stringify(n.currentValue || {}))
            })),
            connections: Array.from(this.editor.connections.values()).map(c => ({
                id: c.id,
                sourceNodeId: c.sourceNodeId,
                sourcePortType: c.sourcePortType,
                targetNodeId: c.targetNodeId,
                targetPortType: c.targetPortType
            }))
        };
    }

    remove(sceneId) {
        const index = this.scenes.findIndex(s => s.id === sceneId);
        if (index === -1) return;

        this.scenes.splice(index, 1);

        if (this.selectedScene?.id === sceneId) {
            this.selectedScene = this.scenes[0] || null;
            if (this.selectedScene) {
                this.openDrawer(this.selectedScene);
            } else {
                this.editor.closeDrawer();
            }
        }

        this.renderList();
        this.editor.saveState();
    }

    select(sceneId) {
        const scene = this.scenes.find(s => s.id === sceneId);
        if (!scene) return;

        if (this.selectedScene?.id === sceneId) {
            this.openDrawer(scene);
            return;
        }

        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        this.selectedScene = scene;
        this.currentSceneIndex = this.scenes.findIndex(s => s.id === scene.id);
        this.loadToCanvas(scene);
        this.renderList();
        this.openDrawer(scene);
        this.editor.saveState();
    }

    loadToCanvas(scene) {
        if (!scene) return;

        // Clear current canvas
        const beforeNodes = this.editor.nodes.size;
        this.editor.nodes.forEach(n => n.element.remove());
        this.editor.nodes.clear();
        this.editor.connections.forEach(c => c.element.remove());
        this.editor.connections.clear();
        this.editor.svgLayer.innerHTML = '';
        this.editor.svgLayer.appendChild(this.editor.tempConnectionPath);

        let maxNodeId = 0;
        let maxConnId = 0;

        // Load nodes from scene patch
        scene.patch.nodes.forEach(n => {
            const config = NODES_CONFIG[n.type];
            if (config) {
                const node = new BaseNode(n.id, n.type, config, this.editor);
                node.position = n.position;
                node.currentValue = JSON.parse(JSON.stringify(n.currentValue || {}));
                node.updatePosition();
                this.editor.nodes.set(n.id, node);
                this.editor.canvas.appendChild(node.element);

                const num = parseInt(n.id.split('_')[1]);
                if (!isNaN(num) && num > maxNodeId) maxNodeId = num;
            }
        });
        this.editor.nodeCounter = maxNodeId;

        // Load connections from scene patch
        scene.patch.connections.forEach(c => {
            const conn = new Connection(c.id, c.sourceNodeId, c.sourcePortType, c.targetNodeId, c.targetPortType, this.editor);
            this.editor.connections.set(c.id, conn);
            this.editor.svgLayer.appendChild(conn.element);
            conn.update();

            const num = parseInt(c.id.split('_')[1]);
            if (!isNaN(num) && num > maxConnId) maxConnId = num;
        });
        this.editor.connectionCounter = maxConnId;

        this.editor.updateImplicitConnections();
        this.editor.refreshExecution();
    }

    // ==================== Scene UI Rendering ====================

    renderList() {
        const list = document.getElementById('scenes-list');
        list.innerHTML = '';

        this.scenes.forEach((scene, index) => {
            const item = document.createElement('div');
            item.classList.add('scene-item');
            item.dataset.sceneId = scene.id;
            item.draggable = true;

            if (this.selectedScene?.id === scene.id) {
                item.classList.add('selected');
            }

            const dot = document.createElement('div');
            dot.classList.add('scene-color-dot');
            dot.style.backgroundColor = scene.color;
            item.appendChild(dot);

            const name = document.createElement('span');
            name.classList.add('scene-name');
            name.innerText = scene.name;
            item.appendChild(name);

            const handle = document.createElement('span');
            handle.classList.add('scene-drag-handle');
            handle.innerHTML = '⋮⋮';
            item.appendChild(handle);

            item.addEventListener('click', () => {
                this.select(scene.id);
            });

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', scene.id);
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
                const newOrder = [];
                list.querySelectorAll('.scene-item').forEach(el => {
                    const s = this.scenes.find(sc => sc.id === el.dataset.sceneId);
                    if (s) newOrder.push(s);
                });
                this.scenes = newOrder;
                this.editor.saveState();
            });

            list.appendChild(item);
        });
    }

    openDrawer(scene) {
        const drawer = document.getElementById('property-drawer');
        const content = document.getElementById('properties-content');
        drawer.classList.remove('hidden');
        content.innerHTML = '';

        const title = document.createElement('div');
        title.classList.add('node-title-label');
        title.innerText = 'Scene Properties';
        content.appendChild(title);

        // Name
        const nameWrapper = document.createElement('div');
        nameWrapper.classList.add('param-wrapper');
        nameWrapper.innerHTML = '<label class="param-label">Name</label>';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.classList.add('param-input');
        nameInput.value = scene.name;
        nameInput.addEventListener('input', () => {
            scene.name = nameInput.value;
            this.renderList();
            this.editor.saveState();
        });
        nameWrapper.appendChild(nameInput);
        content.appendChild(nameWrapper);

        // Color
        const colorWrapper = document.createElement('div');
        colorWrapper.classList.add('param-wrapper');
        colorWrapper.innerHTML = '<label class="param-label">Color</label>';
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.classList.add('param-input');
        colorInput.value = scene.color;
        colorInput.addEventListener('input', () => {
            scene.color = colorInput.value;
            this.renderList();
            this.editor.saveState();
        });
        colorWrapper.appendChild(colorInput);
        content.appendChild(colorWrapper);

        // Duration Type
        const durationTypeWrapper = document.createElement('div');
        durationTypeWrapper.classList.add('param-wrapper');
        durationTypeWrapper.innerHTML = '<label class="param-label">Duration Type</label>';
        const durationTypeSelect = document.createElement('select');
        durationTypeSelect.classList.add('param-input');
        ['seconds', 'minutes', 'beats', 'midi'].forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerText = t.charAt(0).toUpperCase() + t.slice(1);
            if (scene.durationType === t) opt.selected = true;
            durationTypeSelect.appendChild(opt);
        });
        durationTypeWrapper.appendChild(durationTypeSelect);
        content.appendChild(durationTypeWrapper);

        // Duration Value
        const durationValueWrapper = document.createElement('div');
        durationValueWrapper.classList.add('param-wrapper');
        durationValueWrapper.innerHTML = '<label class="param-label">Duration Value</label>';
        const durationValueInput = document.createElement('input');
        durationValueInput.type = 'number';
        durationValueInput.classList.add('param-input');
        durationValueInput.value = scene.durationValue;
        durationValueInput.min = 0;
        durationValueInput.addEventListener('input', () => {
            scene.durationValue = parseFloat(durationValueInput.value) || 0;
            this.editor.saveState();
        });
        durationValueWrapper.appendChild(durationValueInput);
        content.appendChild(durationValueWrapper);

        // MIDI Trigger container
        const midiContainer = document.createElement('div');
        midiContainer.classList.add('midi-trigger-container');
        content.appendChild(midiContainer);

        const updateDurationUI = () => {
            const isMidi = durationTypeSelect.value === 'midi';
            durationValueWrapper.style.display = isMidi ? 'none' : 'block';
            midiContainer.style.display = isMidi ? 'block' : 'none';
            if (isMidi) {
                this.renderMidiTriggerUI(scene, midiContainer);
            }
        };

        durationTypeSelect.addEventListener('change', () => {
            scene.durationType = durationTypeSelect.value;
            updateDurationUI();
            this.editor.saveState();
        });
        updateDurationUI();

        // Repetitions
        const repWrapper = document.createElement('div');
        repWrapper.classList.add('param-wrapper');
        repWrapper.innerHTML = '<label class="param-label">Repetitions</label>';
        const repInput = document.createElement('input');
        repInput.type = 'number';
        repInput.classList.add('param-input');
        repInput.value = scene.repetitions;
        repInput.min = 1;
        repInput.addEventListener('input', () => {
            scene.repetitions = parseInt(repInput.value) || 1;
            this.editor.saveState();
        });
        repWrapper.appendChild(repInput);
        content.appendChild(repWrapper);

        // Follow
        const followWrapper = document.createElement('div');
        followWrapper.classList.add('param-wrapper');
        followWrapper.innerHTML = '<label class="param-label">Follow (Next Scene)</label>';
        const followSelect = document.createElement('select');
        followSelect.classList.add('param-input');
        const followOptions = [
            { value: 'stay', label: 'Stay on this scene' },
            { value: 'previous', label: 'Previous scene' },
            { value: 'next', label: 'Next scene' },
            { value: 'first', label: 'First scene' },
            { value: 'last', label: 'Last scene' },
            { value: 'random', label: 'Random (any)' },
            { value: 'randomOther', label: 'Random (except this)' }
        ];
        followOptions.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.innerText = opt.label;
            if (scene.follow === opt.value) o.selected = true;
            followSelect.appendChild(o);
        });
        followSelect.addEventListener('change', () => {
            scene.follow = followSelect.value;
            this.editor.saveState();
        });
        followWrapper.appendChild(followSelect);
        content.appendChild(followWrapper);

        // Transitions
        this.renderTransitionUI(scene, content, 'transitionIn', 'Transition In');
        this.renderTransitionUI(scene, content, 'transitionOut', 'Transition Out');

        // Delete button
        const deleteWrapper = document.createElement('div');
        deleteWrapper.classList.add('delete-container');
        deleteWrapper.style.marginTop = '20px';
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Scene';
        deleteBtn.classList.add('btn-delete-node');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete scene "${scene.name}"?`)) {
                this.remove(scene.id);
            }
        });
        deleteWrapper.appendChild(deleteBtn);
        content.appendChild(deleteWrapper);
    }

    renderTransitionUI(scene, container, propName, label) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('param-wrapper');
        wrapper.innerHTML = `<label class="param-label">${label}</label>`;

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '8px';

        const typeSelect = document.createElement('select');
        typeSelect.classList.add('param-input');
        typeSelect.style.flex = '1';

        const typeLabels = {
            'none': 'None',
            'crossFade': 'Cross Fade',
            'fadeBlack': 'Fade to Black',
            'wipe': 'Wipe L-R',
            'wipe-v': 'Wipe U-D',
            'radial': 'Radial Circ',
            'glitch': 'Glitch / Noise',
            'zoom': 'Zoom In/Out',
            'pixelate': 'Pixelate',
            'melt': 'Luminance Melt'
        };

        Object.keys(typeLabels).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerText = typeLabels[t];
            if (scene[propName].type === t) opt.selected = true;
            typeSelect.appendChild(opt);
        });

        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.classList.add('param-input');
        durationInput.style.width = '80px';
        durationInput.placeholder = 'sec';
        durationInput.value = scene[propName].duration;
        durationInput.min = 0;
        durationInput.step = 0.1;

        const updateVisibility = () => {
            durationInput.style.display = typeSelect.value === 'none' ? 'none' : 'block';
        };

        typeSelect.addEventListener('change', () => {
            scene[propName].type = typeSelect.value;
            updateVisibility();
            this.editor.saveState();
        });

        durationInput.addEventListener('input', () => {
            scene[propName].duration = parseFloat(durationInput.value) || 0;
            this.editor.saveState();
        });

        updateVisibility();
        row.appendChild(typeSelect);
        row.appendChild(durationInput);
        wrapper.appendChild(row);
        container.appendChild(wrapper);
    }

    renderMidiTriggerUI(scene, container) {
        container.innerHTML = '';

        // MIDI Port
        const portWrapper = document.createElement('div');
        portWrapper.classList.add('param-wrapper');
        portWrapper.innerHTML = '<label class="param-label">MIDI Port</label>';
        const portSelect = document.createElement('select');
        portSelect.classList.add('param-input');
        portSelect.innerHTML = '<option value="">Select port...</option>';

        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(access => {
                Array.from(access.inputs.values()).forEach(input => {
                    const opt = document.createElement('option');
                    opt.value = input.id;
                    opt.innerText = input.name;
                    if (scene.midiTrigger.portId === input.id) opt.selected = true;
                    portSelect.appendChild(opt);
                });
            });
        }
        portSelect.addEventListener('change', () => {
            scene.midiTrigger.portId = portSelect.value;
            this.editor.saveState();
        });
        portWrapper.appendChild(portSelect);
        container.appendChild(portWrapper);

        // Channel
        const chWrapper = document.createElement('div');
        chWrapper.classList.add('param-wrapper');
        chWrapper.innerHTML = '<label class="param-label">Channel</label>';
        const chSelect = document.createElement('select');
        chSelect.classList.add('param-input');
        const chOpt = document.createElement('option');
        chOpt.value = 'all';
        chOpt.innerText = 'All';
        if (scene.midiTrigger.channel === 'all') chOpt.selected = true;
        chSelect.appendChild(chOpt);
        for (let i = 1; i <= 16; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerText = `Channel ${i}`;
            if (scene.midiTrigger.channel === i) opt.selected = true;
            chSelect.appendChild(opt);
        }
        chSelect.addEventListener('change', () => {
            scene.midiTrigger.channel = chSelect.value === 'all' ? 'all' : parseInt(chSelect.value);
            this.editor.saveState();
        });
        chWrapper.appendChild(chSelect);
        container.appendChild(chWrapper);

        // CC Number
        const ccWrapper = document.createElement('div');
        ccWrapper.classList.add('param-wrapper');
        ccWrapper.innerHTML = '<label class="param-label">CC Number</label>';
        const ccInput = document.createElement('input');
        ccInput.type = 'number';
        ccInput.classList.add('param-input');
        ccInput.value = scene.midiTrigger.ccNumber;
        ccInput.min = 0;
        ccInput.max = 127;
        ccInput.addEventListener('input', () => {
            scene.midiTrigger.ccNumber = parseInt(ccInput.value) || 0;
            this.editor.saveState();
        });
        ccWrapper.appendChild(ccInput);
        container.appendChild(ccWrapper);

        // Comparison + Value
        const compRow = document.createElement('div');
        compRow.classList.add('param-wrapper');
        compRow.innerHTML = '<label class="param-label">Trigger Condition</label>';
        const compContainer = document.createElement('div');
        compContainer.style.display = 'flex';
        compContainer.style.gap = '8px';

        const compSelect = document.createElement('select');
        compSelect.classList.add('param-input');
        compSelect.style.width = '80px';
        ['<', '<=', '=', '>=', '>'].forEach(op => {
            const opt = document.createElement('option');
            opt.value = op;
            opt.innerText = op;
            if (scene.midiTrigger.comparison === op) opt.selected = true;
            compSelect.appendChild(opt);
        });
        compSelect.addEventListener('change', () => {
            scene.midiTrigger.comparison = compSelect.value;
            this.editor.saveState();
        });

        const valInput = document.createElement('input');
        valInput.type = 'number';
        valInput.classList.add('param-input');
        valInput.style.flex = '1';
        valInput.value = scene.midiTrigger.ccValue;
        valInput.min = 0;
        valInput.max = 127;
        valInput.addEventListener('input', () => {
            scene.midiTrigger.ccValue = parseInt(valInput.value) || 0;
            this.editor.saveState();
        });

        compContainer.appendChild(compSelect);
        compContainer.appendChild(valInput);
        compRow.appendChild(compContainer);
        container.appendChild(compRow);
    }

    // ==================== Scene Playback Runtime ====================

    startPlayback() {
        if (this.scenes.length === 0) return;

        if (this.selectedScene) {
            this.saveCurrentToSelected();
        }

        this.scenePlaybackActive = true;
        this.playbackSceneIndex = -1;
        this.playbackRepeatCount = 0;
        this.isInitializingPlayback = true;

        try {
            //console.log("[Playback] Clearing active synth to black...");
            if (this.editor.synth) {
                this.editor.synth.solid(0, 0, 0, 1).out();
            }
        } catch (e) {
            console.error("Clear synth error:", e);
        }

        setTimeout(() => {
            this.isInitializingPlayback = false;
            this.play(0);
        }, 100);
    }

    stopPlayback() {
        this.scenePlaybackActive = false;
        if (this.playbackDurationTimer) {
            clearTimeout(this.playbackDurationTimer);
            this.playbackDurationTimer = null;
        }
    }

    play(index) {
        if (!this.scenePlaybackActive) return;
        if (index < 0 || index >= this.scenes.length) return;

        const scene = this.scenes[index];
        const isFirstScene = this.playbackSceneIndex === -1 && index === 0;

        //console.log(`[Scene Playback] Playing scene "${scene.name}" (${index + 1}/${this.scenes.length})`);

        this.selectedScene = scene;
        this.renderList();

        const hasTransitionIn = scene.transitionIn && scene.transitionIn.type !== 'none';

        if (isFirstScene && !hasTransitionIn) {
            this.playbackSceneIndex = index;
            this.playbackStartTime = performance.now();
            this.loadToCanvas(scene);

            const script = this.editor.compiler.compile();
            try {
                const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
                const run = new AsyncFunction('h', `with(h) { ${script} }`);
                run(this.editor.synth).catch(e => console.error("Scene script error:", e));
            } catch (e) {
                console.error("Scene compile error:", e);
            }
        } else {
            this.startTransition(scene);
            this.playbackSceneIndex = index;
            this.playbackStartTime = performance.now();
        }

        this.scheduleNext(scene);
    }

    scheduleNext(scene) {
        if (this.playbackDurationTimer) {
            clearTimeout(this.playbackDurationTimer);
        }

        if (scene.durationType === 'midi') {
            //console.log(`[Scene Playback] Waiting for MIDI Trigger on Scene "${scene.name}"`);
            return;
        }

        if (scene.durationValue === 0) {
            //console.log(`[Scene Playback] Scene "${scene.name}" has no timed transition`);
            return;
        }

        let durationMs;
        switch (scene.durationType) {
            case 'seconds':
                durationMs = scene.durationValue * 1000;
                break;
            case 'minutes':
                durationMs = scene.durationValue * 60 * 1000;
                break;
            case 'beats':
                const bpm = this.editor.globalSettings.bpm || 30;
                const beatDurationMs = (60 / bpm) * 1000;
                durationMs = scene.durationValue * beatDurationMs;
                break;
            default:
                durationMs = scene.durationValue * 1000;
        }

        //console.log(`[Scene Playback] Scene "${scene.name}" duration: ${durationMs}ms`);

        this.playbackDurationTimer = setTimeout(() => {
            if (!this.scenePlaybackActive) return;

            this.playbackRepeatCount++;
            if (this.playbackRepeatCount < scene.repetitions) {
                //console.log(`[Scene Playback] Repeating scene "${scene.name}"`);
                this.playbackStartTime = performance.now();
                this.scheduleNext(scene);
            } else {
                this.playbackRepeatCount = 0;
                const nextIndex = this.getNextIndex(scene);

                if (nextIndex !== null && nextIndex !== this.playbackSceneIndex) {
                    this.play(nextIndex);
                } else if (nextIndex !== null && nextIndex === this.playbackSceneIndex) {
                    //console.log(`[Scene Playback] Random picked same scene, continuing`);
                    this.playbackStartTime = performance.now();
                    this.scheduleNext(scene);
                } else {
                    //console.log(`[Scene Playback] Staying on scene "${scene.name}"`);
                }
            }
        }, durationMs);
    }

    getNextIndex(scene) {
        const currentIndex = this.playbackSceneIndex;
        const total = this.scenes.length;

        switch (scene.follow) {
            case 'stay': return null;
            case 'previous': return currentIndex > 0 ? currentIndex - 1 : total - 1;
            case 'next': return currentIndex < total - 1 ? currentIndex + 1 : 0;
            case 'first': return 0;
            case 'last': return total - 1;
            case 'random': return Math.floor(Math.random() * total);
            case 'randomOther':
                if (total <= 1) return null;
                let rand;
                do { rand = Math.floor(Math.random() * total); } while (rand === currentIndex);
                return rand;
            default: return null;
        }
    }

    // ==================== Compositor & Transitions ====================

    startCompositorLoop() {
        const canvasA = document.getElementById('hydra-canvas-a');
        const canvasB = document.getElementById('hydra-canvas-b');

        const renderFrame = () => {
            if (!this.editor.compositor) return;

            try {
                if (canvasA.width === 0 || canvasB.width === 0) {
                    this.editor.compositorAnimationId = requestAnimationFrame(renderFrame);
                    return;
                }

                if (this.editor.isTransitioning) {
                    const elapsed = performance.now() - this.editor.transitionStartTime;
                    this.editor.transitionProgress = Math.min(elapsed / this.editor.transitionDuration, 1);

                    if (this.editor.activeHydra === 'A') {
                        this.editor.compositor.blend(canvasA, canvasB, this.editor.transitionProgress, this.editor.transitionMode);
                    } else {
                        this.editor.compositor.blend(canvasB, canvasA, this.editor.transitionProgress, this.editor.transitionMode);
                    }

                    if (this.editor.transitionProgress >= 1) {
                        this.finishTransition();
                    }
                } else {
                    const activeCanvas = this.editor.activeHydra === 'A' ? canvasA : canvasB;
                    this.editor.compositor.copy(activeCanvas);
                }
            } catch (e) {
                console.error("[Compositor] Render Error:", e);
                this.stopCompositorLoop();
                return;
            }

            this.editor.compositorAnimationId = requestAnimationFrame(renderFrame);
        };

        renderFrame();
    }

    stopCompositorLoop() {
        if (this.editor.compositorAnimationId) {
            cancelAnimationFrame(this.editor.compositorAnimationId);
            this.editor.compositorAnimationId = null;
        }
    }

    startTransition(nextScene) {
        if (this.editor.isTransitioning) return;

        const currentSceneIdx = this.playbackSceneIndex;
        const currentScene = this.scenes[currentSceneIdx];
        const transitionOut = currentScene?.transitionOut || { type: 'none', duration: 0 };
        const transitionIn = nextScene?.transitionIn || { type: 'none', duration: 0 };

        const outDuration = transitionOut.type !== 'none' ? transitionOut.duration * 1000 : 0;
        const inDuration = transitionIn.type !== 'none' ? transitionIn.duration * 1000 : 0;
        const totalDuration = Math.max(outDuration, inDuration);

        if (totalDuration === 0) {
            this.loadToActiveInstance(nextScene);
            return;
        }

        const mode = transitionOut.type !== 'none' ? transitionOut.type : transitionIn.type;

        this.editor.isTransitioning = true;
        this.editor.transitionProgress = 0;
        this.editor.transitionStartTime = performance.now();
        this.editor.transitionDuration = totalDuration;
        this.editor.transitionMode = mode;

        const inactiveSynth = this.editor.activeHydra === 'A' ? this.editor.synthB : this.editor.synthA;

        try {
            this.loadToCanvas(nextScene);
            const script = this.editor.compiler.compile();

            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            const run = new AsyncFunction('h', `with(h) { ${script} }`);
            run(inactiveSynth).catch(e => console.error("Transition scene error:", e));
        } catch (e) {
            console.error("Transition compile error:", e);
            this.editor.isTransitioning = false;
            return;
        }

        //console.log(`[Transition] Starting ${mode} transition (${totalDuration}ms)`);
    }

    finishTransition() {
        this.editor.isTransitioning = false;
        this.editor.transitionProgress = 0;

        this.editor.activeHydra = this.editor.activeHydra === 'A' ? 'B' : 'A';
        this.editor.synth = this.editor.activeHydra === 'A' ? this.editor.synthA : this.editor.synthB;
        this.editor.hydraInstance = this.editor.activeHydra === 'A' ? this.editor.hydraInstanceA : this.editor.hydraInstanceB;

        //console.log(`[Transition] Complete. Active instance: ${this.editor.activeHydra}`);
    }

    loadToActiveInstance(scene) {
        this.loadToCanvas(scene);
        const script = this.editor.compiler.compile();

        try {
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            const run = new AsyncFunction('h', `with(h) { ${script} }`);
            run(this.editor.synth).catch(e => console.error("Scene script error:", e));
        } catch (e) {
            console.error("Scene compile error:", e);
        }
    }

    // ==================== MIDI Trigger Handler ====================

    handleMidiMessage(message) {
        if (!this.scenePlaybackActive) return;

        const currentScene = this.scenes[this.playbackSceneIndex];
        if (!currentScene || currentScene.durationType !== 'midi') return;

        const trigger = currentScene.midiTrigger;
        if (!trigger || !trigger.portId) return;

        const status = message.data[0];
        const data1 = message.data[1];
        const data2 = message.data[2];

        if (trigger.portId && message.target.id !== trigger.portId) return;

        const channel = status & 0x0F;
        if (trigger.channel > 0 && channel !== (trigger.channel - 1)) return;

        const isCC = (status & 0xF0) === 0xB0;

        if (isCC && data1 === trigger.ccNumber) {
            let thresholdMet = false;
            const val = trigger.ccValue;

            switch (trigger.comparison) {
                case '>': thresholdMet = data2 > val; break;
                case '<': thresholdMet = data2 < val; break;
                case '>=': thresholdMet = data2 >= val; break;
                case '<=': thresholdMet = data2 <= val; break;
                case '==': thresholdMet = data2 === val; break;
            }

            if (thresholdMet) {
                //console.log(`[MIDI Trigger] Matched! CC${data1} Val:${data2} ${trigger.comparison} ${val}`);

                this.playbackRepeatCount++;
                if (this.playbackRepeatCount < currentScene.repetitions) {
                    //console.log(`[Scene Playback] Repeating scene "${currentScene.name}" (MIDI Triggered)`);
                    this.scheduleNext(currentScene);
                } else {
                    this.playbackRepeatCount = 0;
                    const nextIndex = this.getNextIndex(currentScene);
                    if (nextIndex !== null && nextIndex !== this.playbackSceneIndex) {
                        this.play(nextIndex);
                    } else if (nextIndex !== null && nextIndex === this.playbackSceneIndex) {
                        //console.log(`[Scene Playback] Random picked same scene, continuing`);
                        this.scheduleNext(currentScene);
                    }
                }
            }
        }
    }

    // ==================== Serialization ====================

    /**
     * Export scene state for persistence
     */
    exportState() {
        return {
            scenes: this.scenes,
            selectedSceneId: this.selectedScene?.id || null,
            sceneCounter: this.sceneCounter
        };
    }

    /**
     * Import scene state from persistence
     */
    importState(data) {
        if (!data) return;

        this.scenes = data.scenes || [];
        this.sceneCounter = data.sceneCounter || 0;

        if (data.selectedSceneId) {
            this.selectedScene = this.scenes.find(s => s.id === data.selectedSceneId) || null;
        }
    }
}
