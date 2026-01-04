import { BaseNode } from './Node.js';
import { Connection } from './Connection.js';
// Import Library definitions
import { NODES_CONFIG, CATEGORY_LABELS, SUBCATEGORY_LABELS } from '../ui/LibraryCallbacks.js';
import { getParamHint } from '../ui/ParamHints.js';
import { HydraCompiler } from './HydraCompiler.js';
import { WebGLCompositor } from './WebGLCompositor.js';
import { authManager } from './AuthManager.js';
import { SceneManager } from './SceneManager.js';
import { RecordingManager } from './RecordingManager.js';
import { NodeUIRenderers } from './NodeUIRenderers.js';
import { AuthUI } from '../ui/AuthUI.js';
import { PersistenceManager } from './PersistenceManager.js';
// import Hydra from 'hydra-synth'; // Removed static import for dynamic engine loading
import fixWebmDuration from 'fix-webm-duration';


export class Editor {
    constructor() {
        this.nodes = new Map();
        this.connections = new Map();

        this.canvasContainer = document.getElementById('editor-container');
        this.canvas = document.getElementById('node-canvas');
        this.svgLayer = document.getElementById('connections-layer');

        this.transform = { x: 0, y: 0, k: 1 };

        this.isDragging = false;
        this.dragMode = null; // 'pan', 'node', 'connection'
        this.activeDragObj = null;
        this.dragStart = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };

        this.selectedNode = null;
        this.connectionCounter = 0;
        this.previewActive = false; // Preview feature state
        this.clipboard = null; // Store copied nodes/connections
        this.mousePosition = { x: 0, y: 0 }; // Track global mouse position for pasting

        // Undo/Redo History
        // Hydra Compiler
        this.compiler = new HydraCompiler(this);
        this.hydraInstance = null; // Will init on play (backward compat - points to active)
        this.capturedExtensions = []; // Store extensions for re-application to playback instances

        // Dual Hydra for Scene Transitions
        this.hydraInstanceA = null;
        this.hydraInstanceB = null;
        this.synthA = null;
        this.synthB = null;
        this.activeHydra = 'A'; // 'A' or 'B'
        this.compositor = null;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionStartTime = 0;
        this.transitionDuration = 0;
        this.transitionMode = 'crossFade';
        this.transitionAnimationId = null;

        // Temporary connection line for creating new links
        this.tempConnectionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.tempConnectionPath.classList.add('connection-line');
        this.tempConnectionPath.style.pointerEvents = 'none';
        this.tempConnectionPath.style.strokeDasharray = "5,5";
        this.svgLayer.appendChild(this.tempConnectionPath);
        this.tempConnectionHidden = true;

        // Multi-Selection State
        this.selectedNodes = new Set();
        this.implicitConnections = new Map(); // For visualizing parameter references
        this.globalSettings = { bpm: 30, speed: 1, renderEngine: 'glsl3', numOutputs: 4 }; // Default Global Settings

        // Scene Management (delegated to SceneManager)
        this.sceneManager = new SceneManager(this);

        // Recording Manager
        this.recordingManager = new RecordingManager(this);
        this.uiRenderers = new NodeUIRenderers(this);
        this.authUI = new AuthUI(this);
        this.persistenceManager = new PersistenceManager(this);

        // MIDI Access
        this.midiInputs = new Map();
        this.initMidiAccess();

        this.selectionBox = { x: 0, y: 0, w: 0, h: 0, active: false };
        this.selectionBoxEl = document.createElement('div');
        this.selectionBoxEl.classList.add('selection-box');
        this.canvasContainer.appendChild(this.selectionBoxEl);

        // Current loaded patch info (for save/overwrite logic)
        this.currentPatch = {
            id: null,
            name: null,
            author: null
        };
        this.updatePatchTitle();

        this.setupEvents();
        this.setupKeyboard();

        // Load saved state or create default nodes
        const loaded = this.persistenceManager.loadState();
        if (!loaded) {
            // Init some demo nodes if nothing loaded
            this.addNode('osc', 100, 100);
            this.addNode('out', 500, 100);
        }

        // Play Button Logic
        this.setupTopBarEvents();

        // Stop Execution Button (X button in fullscreen modal)
        document.getElementById('btn-stop-execution').addEventListener('click', () => {
            this.stopExecution();
        });

        // Setup Preview Hydra for library node previews
        this._initPreviewHydra();

        // Make preview window draggable
        this._makeDraggable(document.getElementById('preview-container'));
    }

    async _loadHydraLib() {
        if (this.HydraClass) return this.HydraClass;

        const engine = this.globalSettings.renderEngine;
        console.log(`[Editor] Loading Hydra Engine: ${engine || 'glsl3'}`);

        // Load GLSL3 engine only
        const module = await import('hydra-synth');
        this.HydraClass = module.default || module;

        return this.HydraClass;
    }

    async _initPreviewHydra() {
        // Initialize the main Hydra instance on a DEDICATED canvas for library previews
        // This avoids WebGL context conflicts with the compositor (which uses #hydra-canvas)
        if (!this.hydraInstance || this._libraryPreviewContextLost) {
            const libraryPreviewCanvas = document.getElementById('library-preview-canvas');
            libraryPreviewCanvas.width = 400;
            libraryPreviewCanvas.height = 300;

            // If reinitializing due to context loss, clean up first
            if (this.hydraInstance && this._libraryPreviewContextLost) {
                console.log('[Library Preview] Reinitializing Hydra due to context loss');
                this.hydraInstance = null;
            }

            const HydraClass = await this._loadHydraLib();
            this.hydraInstance = new HydraClass({
                canvas: libraryPreviewCanvas,
                detectAudio: false,
                numOutputs: this.globalSettings.numOutputs || 4,
                makeGlobal: true
            });
            this.synth = this.hydraInstance.synth;

            this._libraryPreviewContextLost = false;

            // Listen for context lost events
            libraryPreviewCanvas.addEventListener('webglcontextlost', (e) => {
                console.warn('[Library Preview] WebGL context lost!');
                this._libraryPreviewContextLost = true;
                e.preventDefault(); // Allow context restoration
            });

            libraryPreviewCanvas.addEventListener('webglcontextrestored', () => {
                console.log('[Library Preview] WebGL context restored');
                this._libraryPreviewContextLost = false;
            });

            // Hook into window.setFunction to capture extensions
            // This is critical because extra-shaders uses window.setFunction,
            // but playback instances (A/B) are isolated (makeGlobal: false).
            if (window.setFunction) {
                const originalSetFunction = window.setFunction;
                window.setFunction = (def) => {
                    // Deep clone definition before Hydra modifies it in-place
                    const defClone = JSON.parse(JSON.stringify(def));
                    originalSetFunction(def); // Apply to global/preview
                    this.capturedExtensions.push(defClone); // Capture clean definition for A/B
                };
            }

            // Load extra shaders globally (loadScript is on window when makeGlobal: true)
            try {
                await window.loadScript('shaders/extra-shaders-for-hydra.js');
                await window.loadScript('shaders/HydraFCS.js');
                await window.loadScript('shaders/MaximilianAscari.js');
                console.log(`Extra shaders loaded. Captured ${this.capturedExtensions.length} extensions.`);
            } catch (e) {
                console.warn('Could not load extra shaders:', e);
            }
        }
    }

    /**
     * Update the patch title display in toolbar
     */
    updatePatchTitle() {
        const titleEl = document.getElementById('patch-title');
        if (!titleEl) return;

        if (this.currentPatch.name) {
            titleEl.textContent = this.currentPatch.name;
            titleEl.classList.remove('new-patch');
            titleEl.title = `Loaded: ${this.currentPatch.name}${this.currentPatch.author ? ' by ' + this.currentPatch.author : ''}`;
        } else {
            titleEl.textContent = 'New Patch';
            titleEl.classList.add('new-patch');
            titleEl.title = 'Unsaved new patch';
        }
    }

    /**
     * Reset current patch to new state
     */
    resetCurrentPatch() {
        this.currentPatch = {
            id: null,
            name: null,
            author: null,
            user_id: null
        };
        this.updatePatchTitle();
    }

    /**
     * Set current patch info after loading
     */
    setCurrentPatch(id, name, author = null, userId = null) {
        this.currentPatch = { id, name, author, user_id: userId };
        this.updatePatchTitle();
    }

    showNodePreview(type, itemElement, category = 'source') {
        const container = document.getElementById('node-preview-container');
        const previewCanvas = document.getElementById('node-preview-canvas');

        // Check if library preview context was lost and needs reinitialization
        if (this._libraryPreviewContextLost) {
            console.log('[showNodePreview] Context was lost, reinitializing...');
            this._initPreviewHydra();
        }

        // Always use the main hydra instance synth for library previews
        // (this.synth may point to synthA/B during playback)
        const previewSynth = this.hydraInstance ? this.hydraInstance.synth : this.synth;
        if (!previewSynth || !container || !previewCanvas) return;

        // Check if this function exists in main synth (only for source nodes)
        if (category === 'source' && typeof previewSynth[type] !== 'function') {
            container.style.display = 'none';
            return;
        }

        // Position preview above the item, horizontally centered (using viewport coords)
        const rect = itemElement.getBoundingClientRect();
        const previewWidth = 200;
        const previewHeight = 120;

        // Center horizontally relative to node
        const leftPos = rect.left + (rect.width / 2) - (previewWidth / 2);

        // Position above node with 10px gap
        const topPos = rect.top - previewHeight - 10;

        container.style.left = `${leftPos}px`;
        container.style.top = `${topPos}px`;
        container.style.display = 'block';

        // Build preview code with default params
        try {
            const config = NODES_CONFIG[type];

            // Build params string
            let paramsStr = '';
            if (config.params) {
                const args = [];
                Object.keys(config.params).forEach(key => {
                    const p = config.params[key];
                    if (p.type === 'multiple' && p.items && p.items[0]) {
                        args.push(p.items[0].default ?? 0);
                    } else if (p.default !== undefined) {
                        args.push(p.default);
                    }
                });
                paramsStr = args.join(', ');
            }

            // Build code based on category
            let code;
            if (category === 'source') {
                if (config.subcategory === 'source_input') {
                    // Source Input nodes: type(input, params).out()
                    code = `osc(10, 0.1, 0.8).out(o0); ${type}(src(o0), ${paramsStr}).out()`;
                } else {
                    // Standard Source nodes: type(params).out()
                    code = `${type}(${paramsStr}).out()`;
                }
            } else if (category === 'geometry' || category === 'color') {
                // Special case for color nodes with source_input subcategory
                if (category === 'color' && config.subcategory === 'source_input') {
                    // Color source_input nodes: osc().out(o0); src(o0).type(params)
                    code = `osc(40, 0.1, 0.8).out(o0); src(o0).${type}(${paramsStr}).out()`;
                } else {
                    // Geometry/Color nodes: osc().type(params).out()
                    code = `osc(40, 0.1, 0.8).${type}(${paramsStr}).out()`;
                }
            } else {
                code = `${type}(${paramsStr}).out()`;
            }

            // Execute on main synth (always use previewSynth for library previews)
            const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            const run = new AsyncFunction('h', `with(h) { ${code} }`);
            run(previewSynth).catch(() => {
                container.style.display = 'none';
            });

            // Start render loop to copy main canvas to preview
            this._startPreviewRenderLoop();
            this._isPreviewingNode = true;
        } catch (e) {
            container.style.display = 'none';
        }
    }

    _startPreviewRenderLoop() {
        if (this._previewAnimId) {
            cancelAnimationFrame(this._previewAnimId);
        }

        // Use the dedicated library preview canvas (not hydra-canvas which is compositor output)
        const sourceCanvas = document.getElementById('library-preview-canvas');
        const previewCanvas = document.getElementById('node-preview-canvas');
        if (!sourceCanvas || !previewCanvas) return;

        const ctx = previewCanvas.getContext('2d');

        const render = () => {
            // Copy library preview canvas to the visible preview element (scaled)
            ctx.drawImage(sourceCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
            this._previewAnimId = requestAnimationFrame(render);
        };
        this._previewAnimId = requestAnimationFrame(render);
    }

    hideNodePreview() {
        const container = document.getElementById('node-preview-container');
        if (container) {
            container.style.display = 'none';
        }

        // Stop render loop
        if (this._previewAnimId) {
            cancelAnimationFrame(this._previewAnimId);
            this._previewAnimId = null;
        }

        // Clear and restore normal state
        this._isPreviewingNode = false;

        // Clear the synth
        if (this.synth) {
            try {
                const run = new Function('h', `with(h) { solid(0,0,0,0).out() }`);
                run(this.synth);
            } catch (e) { }
        }
    }

    /**
     * Show a toast notification at the top of the screen
     * @param {string} message - The message to display
     * @param {string} type - 'error' | 'warning' | 'info' | 'success'
     * @param {number} duration - How long to show the toast in ms (default 5000)
     */
    showToast(message, type = 'warning', duration = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast');
        if (type !== 'error') {
            toast.classList.add(type);
        }
        toast.textContent = message;

        container.appendChild(toast);

        // Start fade out before removal
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300); // Match the fadeOut animation duration
        }, duration);
    }

    /**
     * Show login modal with custom message prompting user to log in
     * @param {string} message - The message to display
     */
    showLoginPrompt(message) {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            const errorDiv = document.getElementById('login-error');
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('hidden');
                errorDiv.classList.add('info');
            }
        }
    }

    /**
     * Run a Hydra sketch code on a specific canvas
     * @param {string} code - The code to execute
     * @param {string} canvasId - The ID of the canvas element
     */


    async startExecution(backgroundMode = false) {
        const modal = document.getElementById('execution-modal');
        const stopBtn = document.getElementById('btn-stop-execution');

        if (backgroundMode) {
            modal.classList.add('background-execution');
        } else {
            modal.classList.remove('background-execution');

            // Setup mouse movement tracking for close button visibility
            this._setupCloseButtonVisibility(modal, stopBtn);
        }
        modal.classList.remove('hidden');

        // FORCE CLOSE PREVIEW if entering Full Screen Mode
        if (!backgroundMode && this.previewActive) {
            this.previewActive = false;
            document.getElementById('btn-preview').classList.remove('active');
            document.getElementById('preview-container').classList.add('hidden');
            const pv = document.getElementById('preview-video');
            if (pv) {
                pv.pause();
                pv.srcObject = null;
            }
        }

        // Compile Script
        const script = this.compiler.compile();
        console.log("Compiling Nodemaru Script:\n", script);

        // Init Dual Hydra instances if not exist
        if (!this.hydraInstanceA) {
            const canvasA = document.getElementById('hydra-canvas-a');
            const canvasB = document.getElementById('hydra-canvas-b');
            const outputCanvas = document.getElementById('hydra-canvas');

            // Set canvas sizes
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvasA.width = w;
            canvasA.height = h;
            canvasB.width = w;
            canvasB.height = h;
            outputCanvas.width = w;
            outputCanvas.height = h;

            // Init Hydra A
            const HydraClass = await this._loadHydraLib();
            this.hydraInstanceA = new HydraClass({
                canvas: canvasA,
                detectAudio: false,
                numOutputs: this.globalSettings.numOutputs || 4,
                makeGlobal: false
            });
            this.synthA = this.hydraInstanceA.synth;

            // Init Hydra B
            this.hydraInstanceB = new HydraClass({
                canvas: canvasB,
                detectAudio: false,
                numOutputs: this.globalSettings.numOutputs || 4,
                makeGlobal: false
            });
            this.synthB = this.hydraInstanceB.synth;

            // Apply captured extensions to synth instances
            if (this.capturedExtensions.length > 0) {
                console.log(`[Editor] Applying ${this.capturedExtensions.length} extensions to Hydra A/B...`);
                this.capturedExtensions.forEach(def => {
                    try {
                        this.synthA.setFunction(def);
                        this.synthB.setFunction(def);
                    } catch (e) {
                        console.warn(`[Editor] Failed to apply extension ${def.name}:`, e);
                    }
                });
            }

            // Init Compositor on main output canvas
            this.compositor = new WebGLCompositor(outputCanvas);
            this.compositor.resize(w, h);

            // Set default active instance
            this.activeHydra = 'A';
        }

        // Reset active instance to A on each new play
        this.activeHydra = 'A';
        // But for running scripts inside the dual hydra, we MUST set this.synth to A or B
        this.synth = this.synthA;
        this.isTransitioning = false;

        // Start/restart compositor render loop (must happen every play)
        this.sceneManager.stopCompositorLoop(); // Stop any existing loop first
        this.sceneManager.startCompositorLoop();

        // Run Script logic
        try {
            // If scenes exist, we skip running the current editor script to avoid flashing the selected scene before playback starts.
            // Instead, startScenePlayback will handle the initial state (black).
            if (this.sceneManager.scenes.length === 0) {
                // Use AsyncFunction to allow await in the script
                const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

                // Using 'with' to scope the eval to the synth instance methods
                const run = new AsyncFunction('h', `
                    with(h) {
                        ${script}
                    }
                `);

                // Execute async function and catch runtime errors
                run(this.synth).catch(e => {
                    console.error("Nodemaru Runtime Error:", e);
                    // Show toast for runtime errors (visible in both modes)
                    this.showToast("Runtime Error: " + e.message, 'error', 8000);
                });
            } else {
                console.log("[Playback] Skipping initial script run (Scenes mode active)");
            }

            // Start live value update loop for data nodes
            this.startValueUpdateLoop();

            // Start scene playback if scenes exist and duration is set
            if (this.sceneManager.scenes.length > 0 && !this.sceneManager.scenePlaybackActive) {
                this.sceneManager.startPlayback();
            }
        } catch (e) {
            console.error("Nodemaru Execution Error:", e);
            if (!backgroundMode) alert("Error in Nodemaru Script: " + e.message);
        }
    }

    refreshExecution() {
        if (this.isTransitioning || this.isInitializingPlayback) return;

        // Only refresh if preview is active or modal is open
        const modal = document.getElementById('execution-modal');
        const isPreview = this.previewActive;
        const isFullScreen = !modal.classList.contains('hidden') && !modal.classList.contains('background-execution');

        if (isPreview || isFullScreen) {
            if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
            this.refreshTimeout = setTimeout(() => {
                // Maintain background mode if currently in background or if preview is active and not full screen
                const isBackground = this.previewActive && !isFullScreen;
                this.startExecution(isBackground);
            }, 150); // Debounce
        }
    }

    stopExecution() {
        const modal = document.getElementById('execution-modal');
        modal.classList.add('hidden');
        modal.classList.remove('background-execution');

        // Stop scene playback
        this.sceneManager.stopPlayback();

        // Stop compositor
        this.sceneManager.stopCompositorLoop();

        // Clean up playback Hydra instances to free WebGL contexts
        // This ensures the library preview Hydra instance can function properly
        if (this.hydraInstanceA) {
            try {
                this.synthA.solid(0, 0, 0, 0).out();
            } catch (e) { /* ignore */ }
            this.hydraInstanceA = null;
            this.synthA = null;
        }
        if (this.hydraInstanceB) {
            try {
                this.synthB.solid(0, 0, 0, 0).out();
            } catch (e) { /* ignore */ }
            this.hydraInstanceB = null;
            this.synthB = null;
        }
        if (this.compositor) {
            this.compositor.dispose();
            this.compositor = null;
        }

        // Revert to main Hydra instance (single canvas) if available
        // This fixes the issue where library previews (which use main canvas) don't show up
        // because this.synth was still pointing to synthA/synthB
        if (this.hydraInstance && this.hydraInstance.synth) {
            this.synth = this.hydraInstance.synth;
        }

        // Force render on main instance to restore its context
        if (this.synth) {
            this.synth.solid(0, 0, 0, 0).out();
        }

        // Clean up Audio (HTML Audio Elements created by HydraCompiler)
        if (window._audioElements) {
            Object.values(window._audioElements).forEach(el => {
                if (el) {
                    el.pause();
                    el.muted = true;
                    el.currentTime = 0;
                }
            });
        }

        // Find and stop ALL audio elements in the document (catch any rogues)
        document.querySelectorAll('audio').forEach(el => {
            if (!el.paused) {
                el.pause();
                el.muted = true;
            }
        });

        // Clean up Audio Analyzers (Meyda/Context)
        if (window._audioAnalyzers) {
            Object.values(window._audioAnalyzers).forEach(wrapper => {
                // Stop the audio element stored in the wrapper
                if (wrapper.audio) {
                    wrapper.audio.pause();
                    wrapper.audio.currentTime = 0;
                }
                if (wrapper.analyzer) wrapper.analyzer.stop();
                if (wrapper.context && wrapper.context.state !== 'closed') wrapper.context.close();
            });
            window._audioAnalyzers = {}; // Clear state
        }
        if (window._audioElements) window._audioElements = {};
        if (window._audioState) window._audioState = {};
        if (window._adaptiveRanges) window._adaptiveRanges = {}; // Reset adaptive ranges

        // Stop value update loop
        this.stopValueUpdateLoop();

        // Clean up close button visibility handler
        this._cleanupCloseButtonVisibility();

        // Also Force Close Preview UI if it was active
        if (this.previewActive) {
            this.previewActive = false;
            const btn = document.getElementById('btn-preview');
            if (btn) btn.classList.remove('active');
            const cont = document.getElementById('preview-container');
            if (cont) cont.classList.add('hidden');
            const pv = document.getElementById('preview-video');
            if (pv) {
                pv.pause();
                pv.srcObject = null;
            }
        }
    }

    // ==================== Recording Methods ====================

    // Setup mouse movement tracking to show/hide the close button with fade effect
    _setupCloseButtonVisibility(modal, stopBtn) {
        // Clear any existing handlers first
        this._cleanupCloseButtonVisibility();

        // Timer for hiding the button after inactivity
        let hideTimer = null;

        // Handler for mouse movement
        const handleMouseMove = () => {
            // Show the button
            stopBtn.classList.add('visible');

            // Clear existing timer
            if (hideTimer) {
                clearTimeout(hideTimer);
            }

            // Set timer to hide after 2 seconds of inactivity
            hideTimer = setTimeout(() => {
                stopBtn.classList.remove('visible');
            }, 1500);
        };

        // Store references for cleanup
        this._closeButtonHandler = handleMouseMove;
        this._closeButtonTimer = () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        };

        // Add event listener
        modal.addEventListener('mousemove', handleMouseMove);

        // Trigger initial state (hidden until mouse moves)
        stopBtn.classList.remove('visible');
    }

    // Cleanup the close button visibility handler
    _cleanupCloseButtonVisibility() {
        const modal = document.getElementById('execution-modal');
        const stopBtn = document.getElementById('btn-stop-execution');

        // Remove event listener if it exists
        if (this._closeButtonHandler) {
            modal.removeEventListener('mousemove', this._closeButtonHandler);
            this._closeButtonHandler = null;
        }

        // Clear timer if it exists
        if (this._closeButtonTimer) {
            this._closeButtonTimer();
            this._closeButtonTimer = null;
        }

        // Hide the button
        if (stopBtn) {
            stopBtn.classList.remove('visible');
        }
    }

    startValueUpdateLoop() {
        // Reset tracking at start of execution
        if (window._resetValueTracking) window._resetValueTracking();

        // Update data node labels with live values
        const updateValues = () => {
            this.nodes.forEach(node => {
                const typesToUpdate = ['array', 'lfo', 'midi', 'audio_data', 'midi_data'];
                if (node.valueLabel && typesToUpdate.includes(node.type)) {
                    try {
                        // Try to get the compiled function from window scope
                        const fn = window[node.id];
                        if (typeof fn === 'function') {
                            const value = fn();

                            // Track value for min/max stats
                            if (window._trackValue) {
                                window._trackValue(node.id, value);
                            }

                            // Get tracked stats
                            const stats = window._getValueStats ? window._getValueStats(node.id) : null;

                            if (stats && typeof value === 'number') {
                                // Show current, min, max
                                const cur = value.toFixed(2);
                                const min = stats.min.toFixed(2);
                                const max = stats.max.toFixed(2);
                                node.valueLabel.innerText = `${cur} [${min}…${max}]`;
                            } else {
                                // Show just the value (header already shows friendly name)
                                const formatted = typeof value === 'number' ? value.toFixed(4) : value;
                                node.valueLabel.innerText = formatted;
                            }
                        } else if (Array.isArray(fn)) {
                            // Array nodes - show current cycling value
                            node.valueLabel.innerText = '[...]';
                        }
                    } catch (e) {
                        console.error(`Error updating node ${node.id}:`, e);
                    }
                }

                // Update MIDI clock display for nodes with sync enabled
                if (node.type === 'midi' && node.currentValue?.syncClock) {
                    this.uiRenderers.updateMidiNodeClockDisplay(node);
                }
            });

            this.valueUpdateAnimationId = requestAnimationFrame(updateValues);
        };

        this.valueUpdateAnimationId = requestAnimationFrame(updateValues);
    }



    stopValueUpdateLoop() {
        if (this.valueUpdateAnimationId) {
            cancelAnimationFrame(this.valueUpdateAnimationId);
            this.valueUpdateAnimationId = null;
        }

        // Reset labels to empty (header shows the friendly name)
        this.nodes.forEach(node => {
            if (node.valueLabel && (node.type === 'array' || node.type === 'lfo' || node.type === 'midi' || node.type === 'audio')) {
                node.valueLabel.innerText = '';
            }
        });
    }

    setupEvents() {
        // Track mouse position for pasting
        this.canvasContainer.addEventListener('mousemove', (e) => {
            this.mousePosition = { x: e.clientX, y: e.clientY };
        });

        // Pan and Zoom on Container
        this.canvasContainer.addEventListener('mousedown', (e) => {
            // Right Click = Selection Box
            if (e.button === 2) {
                const containerRect = this.canvasContainer.getBoundingClientRect();
                const relX = e.clientX - containerRect.left;
                const relY = e.clientY - containerRect.top;

                this.selectionBox.active = true;
                this.selectionBox.start = { x: e.clientX, y: e.clientY };
                this.selectionBox.containerOffset = { x: containerRect.left, y: containerRect.top };
                this.selectionBox.x = relX;
                this.selectionBox.y = relY;
                this.selectionBox.w = 0;
                this.selectionBox.h = 0;

                this.selectionBoxEl.style.display = 'block';
                this.selectionBoxEl.style.left = relX + 'px';
                this.selectionBoxEl.style.top = relY + 'px';
                this.selectionBoxEl.style.width = '0px';
                this.selectionBoxEl.style.height = '0px';
                return;
            }

            if (e.button === 0 || e.button === 1) { // Left or Middle
                // If clicking directly on background (not node/port), deselect
                if (e.target.id === 'editor-container' || e.target.id === 'node-canvas' || e.target.id === 'connections-layer') {
                    // Only clear if NOT holding shift
                    if (!e.shiftKey) {
                        this.deselectAll();
                    }
                }
                this.startPan(e);
            }
        });

        // Prevent context menu while dragging selection
        this.canvasContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        this.canvasContainer.addEventListener('wheel', (e) => {
            this.handleZoom(e);
        });

        window.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        window.addEventListener('mouseup', (e) => {
            this.handleMouseUp(e);
        });

        // Load library
        this.renderLibrary();

        // Double Click to Add Node
        this.canvasContainer.addEventListener('dblclick', (e) => {
            // Don't trigger if clicked on node
            if (e.target.closest('.node')) return;
            this.openAddNodeModal({ x: e.clientX, y: e.clientY });
        });
    }

    /**
     * Open the Add Node modal
     * @param {Object|null} position - Optional {x, y} position for node placement
     */
    openAddNodeModal(position = null) {
        this.addNodePosition = position;
        document.getElementById('node-modal').classList.remove('hidden');
    }

    /* --- Copy & Paste --- */
    copySelection() {
        if (this.selectedNodes.size === 0) return;

        const nodes = [];
        const connections = [];
        const nodeIds = new Set();
        const nodesArray = Array.from(this.selectedNodes);

        // 1. Serialize Nodes
        nodesArray.forEach(node => {
            nodes.push({
                type: node.type,
                x: node.position.x,
                y: node.position.y,
                currentValue: JSON.parse(JSON.stringify(node.currentValue || {})),
            });
            nodeIds.add(node.id);
        });

        // 2. Serialize Internal Connections
        this.connections.forEach(conn => {
            if (nodeIds.has(conn.sourceNodeId) && nodeIds.has(conn.targetNodeId)) {
                // Find index in the 'nodes' array
                const sourceIdx = nodesArray.findIndex(n => n.id === conn.sourceNodeId);
                const targetIdx = nodesArray.findIndex(n => n.id === conn.targetNodeId);

                if (sourceIdx !== -1 && targetIdx !== -1) {
                    connections.push({
                        sourceIndex: sourceIdx,
                        sourcePortType: conn.sourcePortType,
                        targetIndex: targetIdx,
                        targetPortType: conn.targetPortType
                    });
                }
            }
        });

        // 3. Calculate Bounding Box for Offset
        let minX = Infinity, minY = Infinity;
        nodes.forEach(n => {
            if (n.x < minX) minX = n.x;
            if (n.y < minY) minY = n.y;
        });

        this.clipboard = {
            nodes: nodes.map(n => ({ ...n, offsetX: n.x - minX, offsetY: n.y - minY })),
            connections: connections
        };
        console.log('Copied to specific clipboard:', this.clipboard);
    }

    pasteSelection() {
        if (!this.clipboard) return;

        this.deselectAll();
        const newNodes = [];

        // Determine paste origin (Mouse Position transformed to Canvas Space)
        // Transform: global = (canvas * k) + t -> canvas = (global - t) / k
        const startX = (this.mousePosition.x - this.transform.x) / this.transform.k;
        const startY = (this.mousePosition.y - this.transform.y) / this.transform.k;

        // 1. Create New Nodes
        this.clipboard.nodes.forEach(data => {
            const x = startX + data.offsetX;
            const y = startY + data.offsetY;

            // Create node
            const node = this.addNode(data.type, x, y);

            if (node) {
                // Restore parameters
                // Merge strategies: prefer clipboard values, but respect 'unique' constraints handled by addNode
                const pastedVal = data.currentValue;
                const nodeConfig = NODES_CONFIG[node.type];

                Object.keys(pastedVal).forEach(key => {
                    const isUnique = nodeConfig.params?.[key]?.unique;
                    // Only overwrite if NOT unique (unique ones are auto-generated by addNode)
                    if (!isUnique) {
                        if (!node.currentValue) node.currentValue = {};
                        node.currentValue[key] = pastedVal[key];
                    }
                });

                // Select the new node
                this.toggleNodeSelection(node, true);
                newNodes.push(node);
            } else {
                newNodes.push(null); // Keep index alignment
            }
        });

        // 2. Re-create Connections
        this.clipboard.connections.forEach(connData => {
            const sourceNode = newNodes[connData.sourceIndex];
            const targetNode = newNodes[connData.targetIndex];

            if (sourceNode && targetNode) {
                // Create connection
                const id = `conn_${++this.connectionCounter}`;
                // Direct instantiation like completeConnection
                const conn = new Connection(id, sourceNode.id, connData.sourcePortType, targetNode.id, connData.targetPortType, this);
                this.connections.set(id, conn);
                this.svgLayer.appendChild(conn.element);
                conn.update();
            }
        });

        this.persistenceManager.saveState();
        this.refreshExecution();
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                    return;
                }

                if (this.selectedNodes.size > 0) {
                    // Create copy to iterate while deleting
                    const nodesToDelete = new Set(this.selectedNodes);
                    nodesToDelete.forEach(node => {
                        this.removeNode(node.id);
                    });
                    this.selectedNodes.clear();
                    this.selectedNode = null;
                    this.closeDrawer();
                } else if (this.selectedConnection) {
                    this.removeConnection(this.selectedConnection.id);
                    this.selectedConnection = null;
                }
            }

            // Copy & Paste (Ctrl+C, Ctrl+V)
            const isCtrl = e.ctrlKey || e.metaKey;
            if (isCtrl && (e.key === 'c' || e.key === 'C')) {
                const activeEl = document.activeElement;
                // prevent copy if typing in input
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

                this.copySelection();
            }
            if (isCtrl && (e.key === 'v' || e.key === 'V')) {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

                this.pasteSelection();
            }

            // Undo (Ctrl+Z)
            if (isCtrl && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

                e.preventDefault();
                this.persistenceManager.undo();
            }

            // Redo (Ctrl+Y or Ctrl+Shift+Z)
            const isRedo = (isCtrl && (e.key === 'y' || e.key === 'Y')) || (isCtrl && e.shiftKey && (e.key === 'z' || e.key === 'Z'));
            if (isRedo) {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

                e.preventDefault();
                this.persistenceManager.redo();
            }
        });
    }

    selectConnection(connection) {
        this.deselectAll();
        this.selectedConnection = connection;
        this.selectedConnection.element.classList.add('selected');
    }

    deselectAll() {
        this.selectedNodes.forEach(node => {
            node.element.classList.remove('selected');
        });
        this.selectedNodes.clear();
        this.selectedNode = null;
        this.closeDrawer();

        if (this.selectedConnection) {
            this.selectedConnection.element.classList.remove('selected');
            this.selectedConnection = null;
        }
    }

    toggleNodeSelection(node, isSelect) {
        if (isSelect) {
            this.selectedNodes.add(node);
            node.element.classList.add('selected');
        } else {
            this.selectedNodes.delete(node);
            node.element.classList.remove('selected');
            if (this.selectedNode === node) {
                this.selectedNode = null;
                this.closeDrawer();
            }
        }
    }

    /* --- Node Management --- */
    addNode(type, x, y) {
        const config = NODES_CONFIG[type];
        if (!config) {
            console.error(`Node type ${type} not found`);
            return;
        }

        const id = `node_${++this.nodeCounter}`;
        const node = new BaseNode(id, type, config, this);

        // Initialize currentValue with defaults from all params
        if (config.params) {
            if (!node.currentValue) node.currentValue = {};

            Object.entries(config.params).forEach(([key, paramConfig]) => {
                // Set default value if defined
                if (paramConfig.default !== undefined) {
                    node.currentValue[key] = paramConfig.default;
                }

                // Handle unique params (auto-increment)
                if (paramConfig.unique) {
                    let val = paramConfig.default;
                    let unique = false;
                    while (!unique) {
                        unique = true;
                        // Check all existing nodes of same type
                        for (const [existingId, existingNode] of this.nodes) {
                            if (existingNode.type === type) {
                                const existingVal = existingNode.currentValue?.[key] ?? paramConfig.default;
                                if (existingVal == val) { // Lax equality for number/string match
                                    unique = false;
                                    val++; // Increment and try again
                                    break;
                                }
                            }
                        }
                    }
                    node.currentValue[key] = val;
                }
            });
        }

        // Special handling for audio_data: auto-link to first audio node
        if (type === 'audio_data') {
            const audioNodes = Array.from(this.nodes.values()).filter(n => n.type === 'audio');
            if (audioNodes.length > 0) {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue.source = audioNodes[0].id;
            }
        }

        // Special handling for midi_data: auto-link to first midi node
        if (type === 'midi_data') {
            const midiNodes = Array.from(this.nodes.values()).filter(n => n.type === 'midi');
            if (midiNodes.length > 0) {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue.source = midiNodes[0].id;
            }
        }

        // Special handling for audio: set default type
        if (type === 'audio') {
            if (!node.currentValue) node.currentValue = {};
            node.currentValue.type = node.currentValue.type || 'file';
        }

        node.position = { x, y };
        node.updatePosition();

        this.nodes.set(id, node);
        this.canvas.appendChild(node.element);

        this.persistenceManager.saveState();
        this.refreshExecution(); // Trigger update
        return node;
    }

    removeNode(id) {
        const node = this.nodes.get(id);
        if (!node) return;

        // Remove connections attached to this node
        const toRemove = [];
        this.connections.forEach(conn => {
            if (conn.sourceNodeId === id || conn.targetNodeId === id) {
                toRemove.push(conn.id);
            }
        });
        toRemove.forEach(cid => this.removeConnection(cid));

        node.element.remove();
        this.nodes.delete(id);
        this.uiRenderers.updateImplicitConnections(); // Remove invalid dashed lines
        this.persistenceManager.saveState();
        this.refreshExecution(); // Trigger update
    }

    selectNode(node, multi = false) {
        if (!multi) {
            this.deselectAll();
        }

        this.selectedNodes.add(node);
        node.element.classList.add('selected');
        this.selectedNode = node; // Primary selection
        this.openDrawer(node);
    }

    /* --- Connection Management --- */
    startConnection(nodeId, portType, portElement, event) {
        console.log('startConnection', nodeId, portType);
        this.dragMode = 'connection';
        this.activeDragObj = {
            sourceNodeId: nodeId,
            sourcePortType: portType,
            startEl: portElement
        };
        this.tempConnectionHidden = false;
        // Don't start pan
        event.stopPropagation();
    }

    completeConnection(targetNodeId, targetPortType, targetEl) {
        if (this.dragMode !== 'connection') return;
        const src = this.activeDragObj;

        // Validate connection
        // 1. Not same node
        if (src.sourceNodeId === targetNodeId) return;

        let fromNode = src.sourceNodeId;
        let fromPort = src.sourcePortType;
        let toNode = targetNodeId;
        let toPort = targetPortType;

        // Port type categories
        const isMainOutput = (t) => t === 'output';
        const isMainInput = (t) => t === 'input';
        const isParamOutput = (t) => t === 'param-out';
        const isParamInput = (t) => t === 'param-in';

        // Determine if we need to swap (user dragged from input to output)
        // Valid connections: output→input, param-out→param-in

        let valid = false;

        // Case 1: Main output to Main input
        if (isMainOutput(fromPort) && isMainInput(toPort)) {
            valid = true;
        } else if (isMainInput(fromPort) && isMainOutput(toPort)) {
            // Swap direction
            [fromNode, toNode] = [toNode, fromNode];
            [fromPort, toPort] = [toPort, fromPort];
            valid = true;
        }
        // Case 2: Param output to Param input
        else if (isParamOutput(fromPort) && isParamInput(toPort)) {
            valid = true;
        } else if (isParamInput(fromPort) && isParamOutput(toPort)) {
            // Swap direction
            [fromNode, toNode] = [toNode, fromNode];
            [fromPort, toPort] = [toPort, fromPort];
            valid = true;
        }

        if (!valid) {
            const message = "Incompatible ports: main↔main or param↔param only";
            console.warn(message);
            this.showToast(message, 'warning');
            return;
        }

        // Check acceptParams constraint (e.g., render node only accepts 'out' nodes)
        if (toPort === 'param-in') {
            const targetNode = this.nodes.get(toNode);
            const sourceNode = this.nodes.get(fromNode);

            if (targetNode && targetNode.config.acceptParams) {
                const allowedTypes = targetNode.config.acceptParams;
                const typeMatch = allowedTypes.includes(sourceNode.type);
                const categoryMatch = allowedTypes.includes(sourceNode.config.category);

                if (!typeMatch && !categoryMatch) {
                    // Get human-readable names
                    const targetName = targetNode.config.name || targetNode.type;
                    const allowedNames = allowedTypes.map(t => {
                        const cfg = NODES_CONFIG[t];
                        return cfg ? cfg.name : t;
                    }).join(', ');

                    const message = `Node "${targetName}" only accepts params from: ${allowedNames}`;
                    console.warn(message);
                    this.showToast(message, 'warning');
                    return;
                }
            }
        }

        // Check acceptNodes constraint for main input (e.g., source_input color effects only accept 'src' nodes)
        if (toPort === 'input') {
            const targetNode = this.nodes.get(toNode);
            const sourceNode = this.nodes.get(fromNode);

            if (targetNode && targetNode.config.acceptNodes) {
                const allowedTypes = targetNode.config.acceptNodes;
                const typeMatch = allowedTypes.includes(sourceNode.type);
                const categoryMatch = allowedTypes.includes(sourceNode.config.category);

                if (!typeMatch && !categoryMatch) {
                    // Get human-readable names
                    const targetName = targetNode.config.name || targetNode.type;
                    const allowedNames = allowedTypes.map(t => {
                        const cfg = NODES_CONFIG[t];
                        return cfg ? cfg.name : t;
                    }).join(', ');

                    const message = `Node "${targetName}" only accepts input from: ${allowedNames}`;
                    console.warn(message);
                    this.showToast(message, 'warning');
                    return;
                }
            }
        }


        // Enforce connection limits:
        // - Main output (fromPort='output'): can only connect to ONE input
        // - Param input (toPort='param-in'): can only receive ONE param output
        // - 'out' node input: can only receive ONE connection (exception to normal multi-input rule)

        // Remove existing connections that violate limits
        const toRemove = [];
        this.connections.forEach((conn, id) => {
            // Rule 1: Main output → only 1 connection allowed
            // If we're connecting from output, remove any existing connection from same output
            if (fromPort === 'output') {
                if (conn.sourceNodeId === fromNode && conn.sourcePortType === 'output') {
                    toRemove.push(id);
                }
            }

            // Rule 2: Param input → only 1 connection allowed
            // If we're connecting to param-in, remove any existing connection to same param-in
            if (toPort === 'param-in') {
                if (conn.targetNodeId === toNode && conn.targetPortType === 'param-in') {
                    toRemove.push(id);
                }
            }

            // Rule 3: 'out' node input → only 1 connection allowed
            // If we're connecting to an 'out' node's input, remove any existing connection to it
            if (toPort === 'input') {
                const targetNode = this.nodes.get(toNode);
                if (targetNode && targetNode.type === 'out') {
                    if (conn.targetNodeId === toNode && conn.targetPortType === 'input') {
                        toRemove.push(id);
                    }
                }
            }
        });

        // Remove old connections (without triggering saveState for each)
        toRemove.forEach(id => {
            const conn = this.connections.get(id);
            if (conn) {
                conn.element.remove();
                this.connections.delete(id);
            }
        });

        // Create connection
        const id = `conn_${++this.connectionCounter}`;
        const conn = new Connection(id, fromNode, fromPort, toNode, toPort, this);
        this.connections.set(id, conn);
        this.svgLayer.appendChild(conn.element);
        conn.update();

        this.persistenceManager.saveState();
    }

    removeConnection(id) {
        const conn = this.connections.get(id);
        if (conn) {
            conn.element.remove();
            this.connections.delete(id);
            this.persistenceManager.saveState();
            this.refreshExecution(); // Trigger update
        }
    }

    updateConnectionsForNode(nodeId) {
        // Find all connections involving this node and update them
        this.connections.forEach(conn => {
            if (conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId) {
                conn.update();
            }
        });
    }

    updateImplicitConnections() {
        if (this.uiRenderers) {
            this.uiRenderers.updateImplicitConnections();
        }
    }

    /* --- Persistence Delegations --- */
    saveState() {
        if (this.persistenceManager) this.persistenceManager.saveState();
    }

    loadState() {
        if (this.persistenceManager) return this.persistenceManager.loadState();
        return false;
    }

    exportState() {
        if (this.persistenceManager) return this.persistenceManager.exportState();
        return null;
    }

    loadFromData(data) {
        if (this.persistenceManager) return this.persistenceManager.loadFromData(data);
        return false;
    }

    resetProject() {
        if (this.persistenceManager) this.persistenceManager.resetProject();
    }

    /* --- Interaction (Pan/Zoom/Move) --- */
    startPan(e) {
        this.isDragging = true;
        this.dragMode = 'pan';
        this.lastMouse = { x: e.clientX, y: e.clientY };
    }

    startDraggingNode(node, e) {
        this.isDragging = true;
        this.dragMode = 'node';
        this.activeDragObj = node;
        this.lastMouse = { x: e.clientX, y: e.clientY };

        // Multi-selection logic
        if (this.selectedNodes.has(node)) {
            // Already selected: Keep selection (active node becomes primary)
            this.selectedNode = node;
            this.openDrawer(node);
        } else {
            // Not selected: Select it (Shift adds, otherwise exclusive)
            this.selectNode(node, e.shiftKey);
        }
    }

    handleMouseMove(e) {
        if (this.selectionBox.active) {
            const currentX = e.clientX;
            const currentY = e.clientY;

            // Calculate relative coordinates using the stored container offset
            const offsetX = this.selectionBox.containerOffset?.x || 0;
            const offsetY = this.selectionBox.containerOffset?.y || 0;
            const relCurrentX = currentX - offsetX;
            const relCurrentY = currentY - offsetY;
            const relStartX = this.selectionBox.start.x - offsetX;
            const relStartY = this.selectionBox.start.y - offsetY;

            const width = currentX - this.selectionBox.start.x;
            const height = currentY - this.selectionBox.start.y;

            this.selectionBox.w = width;
            this.selectionBox.h = height;

            // Handle negative width/height for CSS
            if (width < 0) {
                this.selectionBoxEl.style.left = relCurrentX + 'px';
                this.selectionBoxEl.style.width = Math.abs(width) + 'px';
            } else {
                this.selectionBoxEl.style.left = relStartX + 'px';
                this.selectionBoxEl.style.width = width + 'px';
            }

            if (height < 0) {
                this.selectionBoxEl.style.top = relCurrentY + 'px';
                this.selectionBoxEl.style.height = Math.abs(height) + 'px';
            } else {
                this.selectionBoxEl.style.top = relStartY + 'px';
                this.selectionBoxEl.style.height = height + 'px';
            }
            return;
        }

        if (!this.isDragging && this.dragMode !== 'connection') return;

        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        this.lastMouse = { x: e.clientX, y: e.clientY };

        if (this.dragMode === 'pan') {
            this.transform.x += dx;
            this.transform.y += dy;
            this.updateTransform();
        }
        else if (this.dragMode === 'node') {
            // Move ALL selected nodes
            // const node = this.activeDragObj;

            // If dragging a selected node, move all selected nodes
            // If dragging an unselected node (should have been selected on mousedown), just move it (logic in startDragging ensure it is selected)

            this.selectedNodes.forEach(node => {
                node.position.x += dx / this.transform.k;
                node.position.y += dy / this.transform.k;
                node.updatePosition();
            });
            // Update connection lines for all moved nodes?
            // Yes, iterating all connections is expensive? better to update only related
            this.connections.forEach(conn => {
                // Optimization: only update if source or target is in selectedNodes
                if (this.selectedNodes.has(this.nodes.get(conn.sourceNodeId)) ||
                    this.selectedNodes.has(this.nodes.get(conn.targetNodeId))) {
                    conn.update();
                }
            });
            this.uiRenderers.updateImplicitConnections(); // Update dashed lines during drag
        }
        else if (this.dragMode === 'connection') {
            this.renderTempConnection(e.clientX, e.clientY);
        }
    }

    handleMouseUp(e) {
        if (this.selectionBox.active) {
            this.selectionBox.active = false;
            this.selectionBoxEl.style.display = 'none';

            // Calculate Box in Screen Space
            // Use getBoundingClientRect of the box element to handle negative width/height easily?
            // Or just use the math we already have. 
            // Important: Handle negative width/height logic for intersection.

            const startX = this.selectionBox.start.x;
            const startY = this.selectionBox.start.y;
            const curX = e.clientX;
            const curY = e.clientY;

            const boxLeft = Math.min(startX, curX);
            const boxRight = Math.max(startX, curX);
            const boxTop = Math.min(startY, curY);
            const boxBottom = Math.max(startY, curY);

            // Select Intersecting Nodes
            if (!e.shiftKey) {
                this.deselectAll();
            }

            this.nodes.forEach(node => {
                const nodeRect = node.element.getBoundingClientRect();

                // AABB Intersection
                // nodeRect is in screen space? Yes.

                const intersect = !(nodeRect.right < boxLeft ||
                    nodeRect.left > boxRight ||
                    nodeRect.bottom < boxTop ||
                    nodeRect.top > boxBottom);

                if (intersect) {
                    this.toggleNodeSelection(node, true);
                }
            });

            return;
        }

        if (this.dragMode === 'connection') {
            // Check if dropped on a port OR anywhere on a node
            let target = document.elementFromPoint(e.clientX, e.clientY);

            // If dropped directly on a port, use it
            if (target && target.classList.contains('port')) {
                const nodeId = target.dataset.nodeId;
                const type = target.dataset.type;
                this.completeConnection(nodeId, type, target);
            }
            // If dropped on a node (or child element of node), find the appropriate port
            else {
                const nodeEl = target?.closest('.node');
                if (nodeEl) {
                    const nodeId = nodeEl.dataset.id;
                    const targetNode = this.nodes.get(nodeId);

                    if (targetNode) {
                        // Determine which port to connect to based on what we're dragging from
                        const srcPortType = this.activeDragObj.sourcePortType;
                        let targetPortType = null;

                        // If dragging from output, connect to input
                        if (srcPortType === 'output' && targetNode.config.hasInput) {
                            targetPortType = 'input';
                        }
                        // If dragging from input, connect to output (reversed)
                        else if (srcPortType === 'input' && targetNode.config.hasOutput) {
                            targetPortType = 'output';
                        }
                        // If dragging from param-out, connect to param-in
                        else if (srcPortType === 'param-out' && targetNode.config.hasParamInput) {
                            targetPortType = 'param-in';
                        }
                        // If dragging from param-in, connect to param-out (reversed)
                        else if (srcPortType === 'param-in' && targetNode.config.hasParamOutput) {
                            targetPortType = 'param-out';
                        }

                        if (targetPortType) {
                            const portEl = targetNode.getPortElement(targetPortType);
                            if (portEl) {
                                this.completeConnection(nodeId, targetPortType, portEl);
                            }
                        }
                    }
                }
            }

            // Clear temp line
            this.tempConnectionPath.setAttribute('d', '');
        }

        // Save state after any drag operation (node movement or connection)
        if (this.isDragging || this.dragMode === 'connection') {
            this.persistenceManager.saveState();
        }

        this.isDragging = false;
        this.dragMode = null;
        this.activeDragObj = null;
    }

    handleZoom(e) {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const newScale = this.transform.k - e.deltaY * zoomSpeed;

        // Clamp zoom
        const scale = Math.min(Math.max(0.1, newScale), 5);

        // Get mouse position relative to canvas container
        const rect = this.canvasContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the point in canvas space before zoom
        const canvasX = (mouseX - this.transform.x) / this.transform.k;
        const canvasY = (mouseY - this.transform.y) / this.transform.k;

        // Apply new scale
        this.transform.k = scale;

        // Adjust translation so the point under the mouse stays fixed
        this.transform.x = mouseX - canvasX * scale;
        this.transform.y = mouseY - canvasY * scale;

        this.updateTransform();
    }

    updateTransform() {
        this.canvas.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.k})`;
    }

    renderTempConnection(mouseX, mouseY) {
        // Redraw temp path from source port to mouse
        const src = this.activeDragObj;
        const sourceNode = this.nodes.get(src.sourceNodeId);
        const portEl = sourceNode.getPortElement(src.sourcePortType);

        // Calculate start point (same as Connection logic)
        const rect = portEl.getBoundingClientRect();

        const p1 = {
            x: (rect.left + rect.width / 2 - this.canvasContainer.getBoundingClientRect().left - this.transform.x) / this.transform.k,
            y: (rect.top + rect.height / 2 - this.canvasContainer.getBoundingClientRect().top - this.transform.y) / this.transform.k
        };

        const p2 = {
            x: (mouseX - this.canvasContainer.getBoundingClientRect().left - this.transform.x) / this.transform.k,
            y: (mouseY - this.canvasContainer.getBoundingClientRect().top - this.transform.y) / this.transform.k
        };

        // Bezier for temp connection too
        let c1 = { ...p1 };
        let c2 = { ...p2 };
        const curvature = 50;

        // Guess direction based on source port type
        if (src.sourcePortType === 'output') c1.x += curvature;
        else if (src.sourcePortType === 'param-out') c1.y += curvature;

        c2.x -= curvature;

        const d = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
        this.tempConnectionPath.setAttribute('d', d);
    }

    /* --- UI Helpers --- */
    renderLibrary(activeCategory = 'source', activeSubcategory = null) {
        const categories = Object.keys(CATEGORY_LABELS);

        // Render Tabs
        const CATEGORY_COLORS = {
            'source': '#00151d',
            'ext_source': '#003447',
            'geometry': '#004211',
            'color': '#6e2562',
            'blend': '#3f285e',
            'modulate': '#382127',
            'data': '#4e0707',
            'data_math': '#691e0c',
            'output': '#15164b'
        };

        const tabsContainer = document.getElementById('category-tabs');
        let activeColor = CATEGORY_COLORS[activeCategory] || '#444';
        const transparency = "66";

        // Store active subcategory per category
        // Use undefined to mean "not set yet", null means "General" tab
        if (!this._activeSubcategories) this._activeSubcategories = {};
        // Always update the active subcategory when explicitly passed (including null for General)
        this._activeSubcategories[activeCategory] = activeSubcategory;

        // Build category tabs (first level)
        if (tabsContainer.children.length === 0) {
            categories.forEach(cat => {
                const btn = document.createElement('div');
                btn.classList.add('tab-btn');
                btn.innerText = CATEGORY_LABELS[cat];
                btn.dataset.category = cat;

                const color = CATEGORY_COLORS[cat] || '#444';

                if (cat === activeCategory) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = color;
                    btn.style.borderColor = color;
                    btn.style.color = '#fff';
                } else {
                    btn.style.backgroundColor = color + transparency;
                    btn.style.borderColor = color;
                }

                btn.onclick = () => {
                    this.renderLibrary(cat, this._activeSubcategories[cat] || null);
                };

                tabsContainer.appendChild(btn);
            });
        } else {
            // Update existing tabs styles
            Array.from(tabsContainer.children).forEach(b => {
                const bCat = b.dataset.category;
                const bColor = CATEGORY_COLORS[bCat] || '#444';

                b.className = 'tab-btn';
                if (bCat === activeCategory) {
                    b.classList.add('active');
                    b.style.backgroundColor = bColor;
                    b.style.borderColor = bColor;
                    b.style.color = '#fff';
                } else {
                    b.style.backgroundColor = 'transparent';
                    b.style.borderColor = 'transparent';
                    b.style.color = '';
                }
            });
        }

        const list = document.getElementById('node-list');
        list.innerHTML = '';

        // Get all nodes for this category
        const categoryNodes = Object.keys(NODES_CONFIG).filter(type => {
            return NODES_CONFIG[type].category === activeCategory;
        });

        // Group nodes by subcategory
        const subcategoryGroups = {};
        const noSubcategoryNodes = [];

        categoryNodes.forEach(type => {
            const subcat = NODES_CONFIG[type].subcategory;
            if (subcat) {
                if (!subcategoryGroups[subcat]) subcategoryGroups[subcat] = [];
                subcategoryGroups[subcat].push(type);
            } else {
                noSubcategoryNodes.push(type);
            }
        });

        const subcategories = Object.keys(subcategoryGroups);
        const hasSubcategories = subcategories.length > 0;

        // Determine active subcategory
        let currentSubcat = this._activeSubcategories[activeCategory] || null;

        // If no active subcategory set, default to null (General) if there are nodes without subcategory,
        // otherwise default to first subcategory
        if (currentSubcat === null && hasSubcategories && noSubcategoryNodes.length === 0) {
            currentSubcat = subcategories[0];
            this._activeSubcategories[activeCategory] = currentSubcat;
        }

        // Render subcategory tabs (second level) if there are any
        if (hasSubcategories || noSubcategoryNodes.length > 0) {
            const subcatTabsContainer = document.createElement('div');
            subcatTabsContainer.classList.add('subcategory-tabs');

            // "General" tab for nodes without subcategory
            if (noSubcategoryNodes.length > 0) {
                const generalBtn = document.createElement('div');
                generalBtn.classList.add('subcategory-tab');
                generalBtn.innerText = 'General';

                if (currentSubcat === null) {
                    generalBtn.classList.add('active');
                    generalBtn.style.backgroundColor = activeColor; // Dynamic color
                }

                // Hover handled by CSS .subcategory-tab:hover

                generalBtn.onclick = () => {
                    this.renderLibrary(activeCategory, null);
                };

                subcatTabsContainer.appendChild(generalBtn);
            }

            // Subcategory tabs
            subcategories.forEach(subcat => {
                const btn = document.createElement('div');
                btn.classList.add('subcategory-tab');
                btn.innerText = SUBCATEGORY_LABELS[subcat] || subcat;

                if (currentSubcat === subcat) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = activeColor; // Dynamic color
                }

                // Hover handled by CSS .subcategory-tab:hover

                btn.onclick = () => {
                    this.renderLibrary(activeCategory, subcat);
                };

                subcatTabsContainer.appendChild(btn);
            });

            list.appendChild(subcatTabsContainer);
        }

        // Container for node items
        const nodesContainer = document.createElement('div');
        nodesContainer.classList.add('nodes-container');

        // Get nodes to display based on active subcategory
        let nodesToDisplay;
        if (currentSubcat === null) {
            nodesToDisplay = noSubcategoryNodes;
        } else {
            nodesToDisplay = subcategoryGroups[currentSubcat] || [];
        }

        // If no subcategories at all, show all nodes
        if (!hasSubcategories && noSubcategoryNodes.length === 0) {
            nodesToDisplay = categoryNodes;
        } else if (!hasSubcategories) {
            nodesToDisplay = noSubcategoryNodes;
        }

        nodesToDisplay.forEach(type => {
            const item = document.createElement('div');
            item.classList.add('node-item');
            item.innerText = NODES_CONFIG[type].name;

            // Add hover preview for source, geometry, and color nodes
            const nodeConfig = NODES_CONFIG[type];
            const previewCategories = ['source', 'geometry', 'color'];
            if (previewCategories.includes(nodeConfig.category)) {
                // Source nodes without input, or geometry/color nodes
                const shouldPreview = nodeConfig.category === 'source' ? !nodeConfig.hasInput : true;
                if (shouldPreview) {
                    item.addEventListener('mouseenter', () => {
                        this.showNodePreview(type, item, nodeConfig.category);
                    });
                    item.addEventListener('mouseleave', () => {
                        this.hideNodePreview();
                    });
                }
            }

            item.onclick = () => {
                let x, y;

                if (this.addNodePosition) {
                    const clientX = this.addNodePosition.x;
                    const clientY = this.addNodePosition.y;

                    const rect = this.canvasContainer.getBoundingClientRect();
                    x = (clientX - rect.left - this.transform.x) / this.transform.k;
                    y = (clientY - rect.top - this.transform.y) / this.transform.k;

                    this.addNodePosition = null;
                } else {
                    x = 150 - this.transform.x / this.transform.k;
                    y = 150 - this.transform.y / this.transform.k;
                }

                this.addNode(type, x, y);
                this.hideNodePreview(); // Hide preview when node is added
                document.getElementById('node-modal').classList.add('hidden');
            };
            nodesContainer.appendChild(item);
        });

        list.appendChild(nodesContainer);
    }

    openDrawer(node) {
        const drawer = document.getElementById('property-drawer');
        const errorContainer = document.getElementById('properties-error');
        const content = document.getElementById('properties-content');

        drawer.classList.remove('hidden');

        // Reset Error Container
        errorContainer.innerHTML = '';
        if (node.errorMessage) {
            const errorBox = document.createElement('div');
            errorBox.classList.add('node-error-box');
            errorBox.innerHTML = `<span>⚠️ ${node.errorMessage}</span>`;
            errorContainer.appendChild(errorBox);
        }

        content.innerHTML = `<h4>${node.name}</h4><p class="text-xs text-gray-500">${node.id}</p>`;

        // Check for Custom UI first
        if (this.uiRenderers.renderCustomUI(node, content)) {
            // Handled by custom UI
            return;
        }

        // Render Standard Params
        this.uiRenderers.renderNodeParams(node, content);

        // Add Delete Button
        const deleteContainer = document.createElement('div');
        deleteContainer.classList.add('delete-container');
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Node';
        deleteBtn.classList.add('btn-delete-node');
        deleteBtn.onclick = () => {
            this.removeNode(node.id);
            this.selectedNode = null;
            this.closeDrawer();
        };
        deleteContainer.appendChild(deleteBtn);
        content.appendChild(deleteContainer);
    }

    closeDrawer() {
        const drawer = document.getElementById('property-drawer');
        drawer.classList.add('hidden');
    }

    /* --- Top Bar Actions --- */
    setupTopBarEvents() {
        // Play Button
        document.getElementById('btn-play').addEventListener('click', () => {
            const modal = document.getElementById('execution-modal');
            const isHidden = modal.classList.contains('hidden');
            const isBackground = modal.classList.contains('background-execution');

            // If Preview is active, stop it first to avoid conflicts
            if (this.previewActive) {
                this.previewActive = false;
                document.getElementById('btn-preview').classList.remove('active');
                document.getElementById('preview-container').classList.add('hidden');
                const pv = document.getElementById('preview-video');
                if (pv) {
                    pv.pause();
                    pv.srcObject = null;
                }
                // Stop background execution before restarting in full screen mode
                this.stopExecution();
            }

            // Allow starting execution if modal is hidden OR if it's in background (preview) mode
            if (isHidden || isBackground) {
                this.startExecution(); // Full screen mode
            }
        });

        // Preview Toggle
        document.getElementById('btn-preview').addEventListener('click', () => {
            const previewBtn = document.getElementById('btn-preview');
            const previewContainer = document.getElementById('preview-container');
            const previewVideo = document.getElementById('preview-video');
            const modal = document.getElementById('execution-modal');

            if (this.previewActive) {
                // --- Stop Preview ---
                this.previewActive = false;
                previewBtn.classList.remove('active');
                previewContainer.classList.add('hidden');

                // ALWAYS stop execution when preview is deactivated (don't check background-execution)
                this.stopExecution();

                // Clear video
                previewVideo.pause();
                previewVideo.srcObject = null;

                // Force reinitialize the library preview Hydra instance
                // This ensures a completely clean state after Preview mode
                if (this.hydraInstance) {
                    this.hydraInstance = null;
                    this._initPreviewHydra();
                }

            } else {
                // --- Start Preview ---
                this.previewActive = true;
                previewBtn.classList.add('active');
                previewContainer.classList.remove('hidden');

                // Start execution in background if not already running
                if (modal.classList.contains('hidden')) {
                    this.startExecution(true); // TRUE = background mode
                }

                // Connect stream
                const canvas = document.getElementById('hydra-canvas');
                // Ensure canvas exists (startExecution should have created it if null, but it's in DOM static)
                try {
                    const stream = canvas.captureStream(30); // 30 FPS
                    previewVideo.srcObject = stream;
                    previewVideo.play().catch(e => console.error("Video play error:", e));
                } catch (e) {
                    console.error("Capture stream error:", e);
                }
            }
        });

        // New Project
        document.getElementById('btn-new').addEventListener('click', () => {
            if (confirm('Are you sure you want to create a new project? This will delete the current sketch.')) {
                this.persistenceManager.resetProject();
                this.resetCurrentPatch(); // Reset patch name for new project
            }
        });

        // Scenes Panel
        this.sceneManager.setupPanel();

        // Settings Modal
        const settingsModal = document.getElementById('settings-modal');
        const bpmInput = document.getElementById('input-bpm');
        const speedInput = document.getElementById('input-speed');
        const numOutputsInput = document.getElementById('input-num-outputs');

        // Recording Settings elements
        const recFpsInput = document.getElementById('input-rec-fps');
        const recFormatInput = document.getElementById('input-rec-format');
        const recQualityInput = document.getElementById('input-rec-quality');
        const recAudioCheckbox = document.getElementById('input-rec-audio');
        const recAudioDeviceSelect = document.getElementById('input-rec-audio-device');
        const audioDeviceField = document.getElementById('audio-device-field');
        const refreshAudioBtn = document.getElementById('btn-refresh-audio-devices');

        // Audio checkbox toggles device and gain selector visibility
        const audioGainField = document.getElementById('audio-gain-field');
        const audioGainInput = document.getElementById('input-rec-audio-gain');
        const audioGainDisplay = document.getElementById('audio-gain-display');

        recAudioCheckbox.addEventListener('change', () => {
            const show = recAudioCheckbox.checked ? 'block' : 'none';
            audioDeviceField.style.display = show;
            audioGainField.style.display = show;
            if (recAudioCheckbox.checked && recAudioDeviceSelect.options.length <= 1) {
                this.recordingManager.populateAudioDevices(recAudioDeviceSelect);
            }
        });

        // Refresh audio devices button
        refreshAudioBtn.addEventListener('click', () => {
            this.recordingManager.populateAudioDevices(recAudioDeviceSelect);
        });

        // Audio gain slider real-time update
        audioGainInput.addEventListener('input', () => {
            audioGainDisplay.innerText = `${audioGainInput.value}%`;
        });

        // Quality display element
        const qualityDisplay = document.getElementById('quality-display');

        // Helper to format quality display
        const updateQualityDisplay = (value) => {
            const num = parseInt(value);
            qualityDisplay.innerText = num >= 100 ? 'Lossless' : `${num} Mbps`;
        };

        // Quality slider real-time update
        recQualityInput.addEventListener('input', () => {
            updateQualityDisplay(recQualityInput.value);
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            // Load current values
            bpmInput.value = this.globalSettings.bpm;
            speedInput.value = this.globalSettings.speed;
            if (numOutputsInput) numOutputsInput.value = this.globalSettings.numOutputs || 4;

            // Load recording settings
            recFpsInput.value = this.recordingManager.recordingSettings.fps;
            recFormatInput.value = this.recordingManager.recordingSettings.format;
            recQualityInput.value = this.recordingManager.recordingSettings.qualityMbps;
            updateQualityDisplay(this.recordingManager.recordingSettings.qualityMbps);
            recAudioCheckbox.checked = this.recordingManager.recordingSettings.audioEnabled;
            audioDeviceField.style.display = this.recordingManager.recordingSettings.audioEnabled ? 'flex' : 'none';
            audioGainField.style.display = this.recordingManager.recordingSettings.audioEnabled ? 'block' : 'none';
            audioGainInput.value = this.recordingManager.recordingSettings.audioGain || 100;
            audioGainDisplay.innerText = `${this.recordingManager.recordingSettings.audioGain || 100}%`;

            // Load audio devices if audio is enabled, then select saved device
            if (this.recordingManager.recordingSettings.audioEnabled) {
                this.recordingManager.populateAudioDevices(recAudioDeviceSelect).then(() => {
                    if (this.recordingManager.recordingSettings.audioDeviceId) {
                        recAudioDeviceSelect.value = this.recordingManager.recordingSettings.audioDeviceId;
                    }
                });
            }

            settingsModal.classList.remove('hidden');
        });

        document.getElementById('btn-close-settings').addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });

        document.getElementById('btn-save-settings').addEventListener('click', () => {
            // Save global settings
            this.globalSettings.bpm = parseFloat(bpmInput.value) || 30;
            this.globalSettings.speed = parseFloat(speedInput.value) || 1;

            const oldNumOutputs = this.globalSettings.numOutputs || 4;
            this.globalSettings.numOutputs = parseInt(numOutputsInput.value) || 4;
            const outputsChanged = oldNumOutputs !== this.globalSettings.numOutputs;

            const needsReload = outputsChanged; // Only outputs change requires reload now

            // Save recording settings
            this.recordingManager.recordingSettings.fps = parseInt(recFpsInput.value) || 60;
            this.recordingManager.recordingSettings.format = recFormatInput.value || 'webm';
            this.recordingManager.recordingSettings.qualityMbps = parseInt(recQualityInput.value) || 50;
            this.recordingManager.recordingSettings.audioEnabled = recAudioCheckbox.checked;
            this.recordingManager.recordingSettings.audioDeviceId = recAudioDeviceSelect.value || '';
            this.recordingManager.recordingSettings.audioGain = parseInt(audioGainInput.value) || 100;

            this.persistenceManager.saveState();
            this.recordingManager.saveRecordingSettings(); // Save to localStorage
            settingsModal.classList.add('hidden');

            this.showToast('Settings saved', 'success', 2000);

            // Prompt reload if render engine or outputs changed
            if (needsReload) {
                if (confirm('Settings changed that require reload. Reload page to apply?')) {
                    location.reload();
                }
            }
        });

        // Record Button - Requires Authentication
        document.getElementById('btn-record').addEventListener('click', () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                this.showLoginPrompt('Please login to record videos');
                return;
            }

            if (this.recordingManager.isRecording) {
                // Already recording - stop it
                this.recordingManager.stopRecording();
            } else {
                // Start execution first (if not running), then start recording
                const modal = document.getElementById('execution-modal');
                if (modal.classList.contains('hidden')) {
                    this.startExecution(false); // Full screen mode
                }
                // Give a short delay for canvas to render, then start recording
                setTimeout(() => {
                    this.recordingManager.startRecording();
                }, 500);
            }
        });

        // Also stop recording when execution stops
        const originalStopExecution = this.stopExecution.bind(this);
        this.stopExecution = () => {
            if (this.recordingManager.isRecording) {
                this.recordingManager.stopRecording();
            }
            originalStopExecution();
        };

        // Help Page
        document.getElementById('btn-help').addEventListener('click', () => {
            window.open('help.html', '_blank');
        });

        // Credits Page
        document.getElementById('btn-credits').addEventListener('click', () => {
            window.open('credits.html', '_blank');
        });

        // === Preset Save/Load ===
        const savePresetModal = document.getElementById('save-preset-modal');
        const loadPresetModal = document.getElementById('load-preset-modal');
        const presetApiUrl = './api/presets.php'; // Relative path for subfolder deployment

        // Close modal buttons
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                savePresetModal.classList.add('hidden');
                loadPresetModal.classList.add('hidden');
            });
        });

        // Open Save Modal - Requires Authentication
        document.getElementById('btn-save-preset').addEventListener('click', () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                // Show login prompt
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.remove('hidden');
                    // Show a message that login is needed
                    const errorDiv = document.getElementById('login-error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Please login to save presets to the cloud';
                        errorDiv.classList.remove('hidden');
                        errorDiv.classList.add('info');
                    }
                }
                return;
            }

            // User is logged in, show save modal
            // Pre-fill name from current loaded patch if available
            const presetNameInput = document.getElementById('input-preset-name');
            if (this.currentPatch.name) {
                presetNameInput.value = this.currentPatch.name;
            } else {
                presetNameInput.value = '';
            }
            savePresetModal.classList.remove('hidden');
        });

        // Confirm Save
        document.getElementById('btn-confirm-save').addEventListener('click', async () => {
            const name = document.getElementById('input-preset-name').value.trim();

            // Get author from logged-in user (nickname preferred)
            const user = authManager.getUser();
            const author = user?.nickname || user?.username || 'Anonymous';

            if (!name) {
                alert('Please enter a preset name');
                return;
            }

            // Get current state
            const state = this.persistenceManager.exportState();

            // Determine if this is an update (same name, has existing id) or new save
            const isUpdate = this.currentPatch.id && this.currentPatch.name === name;
            const action = isUpdate ? 'update' : 'save';
            const body = { name, author, data: state };

            if (isUpdate) {
                body.id = this.currentPatch.id;
            }

            try {
                const response = await fetch(`${presetApiUrl}?action=${action}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include session cookies for authentication
                    body: JSON.stringify(body)
                });
                const result = await response.json();

                if (result.success) {
                    // Update current patch info
                    const newId = result.id || this.currentPatch.id;
                    this.setCurrentPatch(newId, name, author, user.id);

                    // Show success message
                    const toast = document.createElement('div');
                    toast.classList.add('toast', 'success');
                    toast.textContent = isUpdate ? 'Patch updated!' : 'Patch saved!';
                    document.getElementById('toast-container').appendChild(toast);
                    setTimeout(() => {
                        toast.classList.add('fade-out');
                        setTimeout(() => toast.remove(), 300);
                    }, 3000);

                    savePresetModal.classList.add('hidden');
                } else {
                    alert('Error: ' + (result.error || 'Failed to save'));
                }
            } catch (e) {
                alert('Network error: ' + e.message);
            }
        });

        // === Patch Title Click - Edit or Save ===
        const editPatchModal = document.getElementById('edit-patch-modal');
        const editPatchNameInput = document.getElementById('input-edit-patch-name');

        document.getElementById('patch-title').addEventListener('click', () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                this.showLoginPrompt('Please login to save or edit patches');
                return;
            }

            if (this.currentPatch.id) {
                // Check ownership
                const user = authManager.getUser();
                // We use relaxed check (==) in case types differ (string vs int), though strict is better if types known.
                // this.currentPatch.user_id should be number. user.id should be number.
                const isOwner = user && (user.id === this.currentPatch.user_id);

                if (isOwner) {
                    // Patch is saved and user is owner - show Edit modal (Update)
                    editPatchNameInput.value = this.currentPatch.name || '';
                    editPatchModal.classList.remove('hidden');
                } else {
                    // Patch is saved but NOT owned - show Save modal (Fork/Copy)
                    const presetNameInput = document.getElementById('input-preset-name');
                    // Pre-fill name but maybe user wants to change it
                    presetNameInput.value = this.currentPatch.name || '';
                    savePresetModal.classList.remove('hidden');
                }
            } else {
                // New patch - show Save modal
                const presetNameInput = document.getElementById('input-preset-name');
                presetNameInput.value = '';
                savePresetModal.classList.remove('hidden');
            }
        });

        // Close Edit modal
        editPatchModal.querySelector('.btn-close-modal').addEventListener('click', () => {
            editPatchModal.classList.add('hidden');
        });

        // Update Patch button
        document.getElementById('btn-update-patch').addEventListener('click', async () => {
            const name = editPatchNameInput.value.trim();

            if (!name) {
                alert('Please enter a patch name');
                return;
            }

            // Get author from logged-in user
            const user = authManager.getUser();
            const author = user?.nickname || user?.username || 'Anonymous';

            // Get current state
            const state = this.persistenceManager.exportState();

            const body = {
                id: this.currentPatch.id,
                name,
                author,
                data: state
            };

            try {
                const response = await fetch(`${presetApiUrl}?action=update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(body)
                });
                const result = await response.json();

                if (result.success) {
                    // Update current patch info
                    // If backend created a new ID (forked), result.id will be present.
                    // If updated, result.id might be missing, so use existing.
                    const finalId = result.id || this.currentPatch.id;
                    this.setCurrentPatch(finalId, name, author, user.id);

                    const msg = result.message || 'Patch updated!';
                    this.showToast(msg, 'success');
                    editPatchModal.classList.add('hidden');
                } else {
                    alert('Error: ' + (result.error || 'Failed to update'));
                }
            } catch (e) {
                alert('Network error: ' + e.message);
            }
        });

        // Open Load Modal - Requires Authentication
        document.getElementById('btn-load-preset').addEventListener('click', async () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                this.showLoginPrompt('Please login to load presets');
                return;
            }

            loadPresetModal.classList.remove('hidden');

            // Ensure close button stops sketch
            const closeBtn = loadPresetModal.querySelector('.btn-close-modal');
            if (closeBtn) closeBtn.onclick = () => {
                loadPresetModal.classList.add('hidden');
                this.stopSketch('preset-preview-canvas');
            };

            const listContainer = document.getElementById('preset-list');
            listContainer.innerHTML = '<p style="color: #888;">Loading presets...</p>';

            // Helper: Update Preview Pane
            const updatePreviewPane = async (presetInfo, ownerLabel) => {
                const container = document.getElementById('preset-preview');



                const previewCanvas = document.getElementById('preset-preview-canvas');

                const placeholder = container.querySelector('.preview-placeholder');

                if (placeholder) placeholder.classList.add('hidden');
                if (previewCanvas) previewCanvas.classList.remove('hidden');



                // Stop previous
                this.stopSketch('preset-preview-canvas');



                try {
                    const res = await fetch(`${presetApiUrl}?action=load&id=${presetInfo.id}`);
                    const data = await res.json();



                    if (data.success && data.preset) {
                        let content = data.preset.data;
                        let code = "";

                        // Determine if Code (String) or State (JSON Object)
                        if (typeof content === 'string') {
                            const trimmed = content.trim();
                            if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && !trimmed.startsWith('s0.init')) {
                                try {
                                    const state = JSON.parse(content);
                                    const parsed = HydraCompiler.parseState(state);
                                    code = this.compiler.compile(parsed);
                                } catch (e) {
                                    console.error("Preview Parse Error:", e);
                                    this.showToast("Corrupt preset data", 'error');
                                    code = "solid(1,0,0).out()";
                                }
                            } else {
                                code = content;
                            }
                        } else if (typeof content === 'object') {
                            const parsed = HydraCompiler.parseState(content);
                            code = this.compiler.compile(parsed);
                        }

                        if (!code || code.trim() === "") {
                            console.warn("Empty code generated for preset " + presetInfo.id);
                            this.showToast("Warning: Preset code is empty", 'warning');
                        } else {
                            if (code.includes('file://')) {
                                console.warn("Code uses local files.");
                                this.showToast("Warning: This patch uses local files which may be missing.", 'warning', 3000);
                            }
                        }

                        await this.runSketch(code, 'preset-preview-canvas');
                    } else {
                        console.error("[PreviewDebug] Failed to load preset data:", data);
                        this.showToast(`Preview Load Failed: ${data.error || 'Unknown error'}`, 'error');
                    }
                } catch (e) {
                    console.error("Preview error:", e);
                    this.showToast("Preview Network Error: " + e.message, 'error');
                }
            };


            // --- PROGRESSIVE LOADING (NEW) ---
            let currentOffset = 0;
            const limit = 20;
            let isLoading = false;
            let hasMore = true;
            let filterMode = 'all';

            const currentUser = authManager.getUser();
            const currentUserId = currentUser?.id || null;

            const filterCheckbox = document.getElementById('filter-my-presets');
            const filterContainer = document.getElementById('filter-my-presets-container');

            if (filterContainer) {
                if (currentUserId) {
                    filterContainer.classList.remove('hidden');
                    filterCheckbox.checked = false;
                } else {
                    filterContainer.classList.add('hidden');
                }
            }

            const appendPresetsToUI = (presets) => {
                presets.forEach(preset => {
                    const item = document.createElement('div');
                    item.classList.add('preset-item');
                    item.dataset.id = preset.id;

                    const isOwner = currentUserId && preset.user_id && preset.user_id == currentUserId;
                    const displayName = preset.owner_name || preset.author || 'Anonymous';
                    const ownerLabel = isOwner ? 'You' : displayName;

                    item.innerHTML = `
                        <div class="preset-item-header">
                            <div>
                                <div class="preset-name">${preset.name}</div>
                                <div class="preset-author">by ${ownerLabel} • ${new Date(preset.created_at).toLocaleDateString()}</div>
                            </div>
                            <div class="preset-item-actions">
                                <button class="btn-load-item" data-id="${preset.id}" title="Load preset">Load</button>
                                ${isOwner ? `<button class="btn-delete-item btn-delete" data-id="${preset.id}" title="Delete your preset">🗑️</button>` : ''}
                            </div>
                        </div>
                    `;

                    item.addEventListener('click', (e) => {
                        if (e.target.closest('.btn-delete-item')) return;
                        listContainer.querySelectorAll('.preset-item').forEach(el => el.classList.remove('selected'));
                        item.classList.add('selected');
                        updatePreviewPane(preset, ownerLabel);
                    });

                    item.addEventListener('dblclick', async (e) => {
                        if (e.target.closest('.btn-delete-item')) return;
                        await this.persistenceManager.loadPresetById(preset.id, presetApiUrl, preset);
                        loadPresetModal.classList.add('hidden');
                        this.stopSketch('preset-preview-canvas');
                    });

                    const loadBtn = item.querySelector('.btn-load-item');
                    loadBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await this.persistenceManager.loadPresetById(preset.id, presetApiUrl, preset);
                        loadPresetModal.classList.add('hidden');
                        this.stopSketch('preset-preview-canvas');
                    });

                    const delBtn = item.querySelector('.btn-delete-item');
                    if (delBtn) {
                        delBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this preset?')) {
                                try {
                                    const res = await fetch(`${presetApiUrl}?action=delete&id=${preset.id}`, { credentials: 'include' });
                                    const data = await res.json();
                                    if (data.success) {
                                        this.showToast('Deleted preset', 'success');
                                        loadPresets(true);
                                    } else {
                                        alert('Failed to delete: ' + data.error);
                                    }
                                } catch (err) { alert('Network Error: ' + err.message); }
                            }
                        });
                    }
                    listContainer.appendChild(item);
                });
            };

            const loadPresets = async (reset = false) => {
                if (isLoading) return;

                // If reset, clear everything
                if (reset) {
                    listContainer.innerHTML = '';
                    currentOffset = 0;
                    hasMore = true;
                    // Clear Preview
                    const previewContainer = document.getElementById('preset-preview');
                    const placeholder = previewContainer.querySelector('.preview-placeholder');
                    const cvs = document.getElementById('preset-preview-canvas');
                    const meta = document.getElementById('preview-metadata');
                    if (placeholder) placeholder.classList.remove('hidden');
                    if (cvs) cvs.classList.add('hidden');
                    if (meta) meta.remove();
                    this.stopSketch('preset-preview-canvas');
                }

                if (!hasMore) return;

                isLoading = true;

                const loader = document.createElement('div');
                loader.innerText = 'Loading...';
                loader.style.cssText = 'padding: 10px; text-align: center; color: #888; font-size: 0.9rem;';
                listContainer.appendChild(loader);

                const action = (filterMode === 'mine' && currentUserId) ? 'my_presets' : 'list';

                try {
                    const url = `${presetApiUrl}?action=${action}&limit=${limit}&offset=${currentOffset}`;
                    const response = await fetch(url, { credentials: 'include' });
                    const result = await response.json();

                    loader.remove();

                    if (result.success) {
                        if (result.presets.length < limit) {
                            hasMore = false;
                        }

                        if (result.presets.length > 0) {
                            appendPresetsToUI(result.presets);
                            currentOffset += limit;
                        } else if (reset) {
                            listContainer.innerHTML = '<p style="padding: 20px; color: #888;">No presets found.</p>';
                        }
                    } else {
                        listContainer.innerHTML += `<p class="error">Error: ${result.error}</p>`;
                    }
                } catch (e) {
                    loader.remove();
                    console.error(e);
                    listContainer.innerHTML += `<p class="error">Network error</p>`;
                } finally {
                    isLoading = false;
                }
            };

            listContainer.onscroll = () => {
                if (listContainer.scrollTop + listContainer.clientHeight >= listContainer.scrollHeight - 50) {
                    loadPresets();
                }
            };

            if (filterCheckbox) {
                filterCheckbox.onchange = () => {
                    filterMode = filterCheckbox.checked ? 'mine' : 'all';
                    loadPresets(true);
                };
            }

            loadPresets(true);

            /*
            try {
                const response = await fetch(`${presetApiUrl}?action=list`, {
                    credentials: 'include'
                });
                const result = await response.json();

                if (result.success && result.presets.length > 0) {
                    const allPresets = result.presets;

                    // Get current user to check ownership
                    const currentUser = authManager.getUser();
                    const currentUserId = currentUser?.id || null;

                    // --- FILTER LOGIC ---
                    const filterCheckbox = document.getElementById('filter-my-presets');
                    const filterContainer = document.getElementById('filter-my-presets-container');

                    // Manage Filter Visibility
                    if (filterContainer) {
                        if (currentUserId) {
                            filterContainer.classList.remove('hidden');
                            // Reset filter to unchecked by default when opening modal
                            filterCheckbox.checked = false;
                        } else {
                            filterContainer.classList.add('hidden');
                        }
                    }

                    // Render Function
                    const renderPresets = () => {
                        listContainer.innerHTML = '';

                        // Clear Preview Context
                        const previewContainer = document.getElementById('preset-preview');
                        const placeholder = previewContainer.querySelector('.preview-placeholder');
                        const cvs = document.getElementById('preset-preview-canvas');
                        const meta = document.getElementById('preview-metadata');

                        if (placeholder) placeholder.classList.remove('hidden');
                        if (cvs) cvs.classList.add('hidden');
                        if (meta) meta.remove();
                        this.stopSketch('preset-preview-canvas');

                        // Filter
                        let displayList = allPresets;
                        if (currentUserId && filterCheckbox && filterCheckbox.checked) {
                            displayList = allPresets.filter(p => p.user_id === currentUserId);
                        }

                        if (displayList.length === 0) {
                            listContainer.innerHTML = '<p style="padding:15px; color:var(--text-secondary);">No presets found.</p>';
                            return;
                        }

                        displayList.forEach(preset => {
                            const item = document.createElement('div');
                            item.classList.add('preset-item');
                            item.dataset.id = preset.id;

                            // Show delete button if user owns this preset
                            const isOwner = currentUserId && preset.user_id && preset.user_id === currentUserId;

                            // Display name: use owner_name (nickname) if available, fallback to author field
                            const displayName = preset.owner_name || preset.author || 'Anonymous';
                            const ownerLabel = isOwner ? 'You' : displayName;

                            item.innerHTML = `
                                <div class="preset-item-header">
                                    <div>
                                        <div class="preset-name">${preset.name}</div>
                                        <div class="preset-author">by ${ownerLabel} • ${new Date(preset.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div class="preset-item-actions">
                                        <button class="btn-load-item" data-id="${preset.id}" title="Load preset">Load</button>
                                        ${isOwner ? `<button class="btn-delete-item btn-delete" data-id="${preset.id}" title="Delete your preset">🗑️</button>` : ''}
                                    </div>
                                </div>
                            `;

                            // Click -> Select & Preview
                            item.addEventListener('click', (e) => {
                                if (e.target.closest('.btn-delete-item')) return;

                                // Update UI Selection
                                listContainer.querySelectorAll('.preset-item').forEach(el => el.classList.remove('selected'));
                                item.classList.add('selected');

                                updatePreviewPane(preset, ownerLabel);
                            });

                            // Double Click -> Load immediately
                            item.addEventListener('dblclick', async (e) => {
                                if (e.target.closest('.btn-delete-item')) return;
                                await this.persistenceManager.loadPresetById(preset.id, presetApiUrl, preset);
                                loadPresetModal.classList.add('hidden');
                                this.stopSketch('preset-preview-canvas');
                            });

                            listContainer.appendChild(item);
                        });

                        // Re-attach handlers for buttons (Load/Delete)
                        listContainer.querySelectorAll('.btn-load-item').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const id = e.target.dataset.id;
                                const preset = allPresets.find(p => p.id == id);
                                if (preset) {
                                    await this.persistenceManager.loadPresetById(preset.id, presetApiUrl, preset);
                                    loadPresetModal.classList.add('hidden');
                                    this.stopSketch('preset-preview-canvas');
                                }
                            });
                        });

                        listContainer.querySelectorAll('.btn-delete-item').forEach(btn => {
                            btn.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const id = e.target.dataset.id;
                                if (confirm('Are you sure you want to delete this preset? This cannot be undone.')) {
                                    try {
                                        const deleteResponse = await fetch(`${presetApiUrl}?action=delete&id=${id}`, {
                                            credentials: 'include'
                                        });
                                        const deleteResult = await deleteResponse.json();

                                        if (deleteResult.success) {
                                            this.showToast('Preset deleted successfully', 'success');
                                            // Refresh list by clicking load button again
                                            document.getElementById('btn-load-preset').click();
                                        } else {
                                            alert('Error: ' + (deleteResult.error || 'Failed to delete'));
                                        }
                                    } catch (err) {
                                        alert('Network error: ' + err.message);
                                    }
                                }
                            });
                        });
                    };

                    // Attach Filter Event
                    if (filterCheckbox) {
                        filterCheckbox.onchange = () => {
                            renderPresets();
                        };
                    }

                    // Initial Render
                    renderPresets();
                } else if (result.success) {
                    listContainer.innerHTML = '<p style="color: #888;">No presets found. Save one first!</p>';
                } else {
                    listContainer.innerHTML = '<p style="color: #c44;">Error loading presets</p>';
                }
            } catch (e) {
                listContainer.innerHTML = `<p style="color: #c44;">Network error: ${e.message}</p>`;
            }
            */

        });



        // === Export/Import JSON Files === (Requires Authentication)
        document.getElementById('btn-export').addEventListener('click', () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                this.showLoginPrompt('Please login to export patches');
                return;
            }

            const state = this.persistenceManager.exportState();
            const json = JSON.stringify(state, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `hydra - patch - ${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('btn-import').addEventListener('click', () => {
            // Check if user is logged in
            if (!authManager.isLoggedIn()) {
                this.showLoginPrompt('Please login to import patches');
                return;
            }

            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (this.persistenceManager.loadFromData(data)) {
                        alert('Patch imported successfully!');
                    } else {
                        alert('Invalid patch file');
                    }
                } catch (err) {
                    alert('Error parsing file: ' + err.message);
                }
            };
            reader.readAsText(file);
            e.target.value = ''; // Reset for same file re-import
        });
    }



    showToast(message, type = 'info') {
        if (this.authUI) {
            this.authUI.showToast(message, type);
        } else {
            console.warn('AuthUI not initialized, toast:', message);
            alert(message);
        }
    }

    initMidiAccess() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(access => {
                this._onMidiSuccess(access);
            }, () => {
                console.warn('MIDI Access Failed');
            });
        }
    }

    _onMidiSuccess(midiAccess) {
        // Handle existing inputs
        for (const input of midiAccess.inputs.values()) {
            this.midiInputs.set(input.id, input);
            input.onmidimessage = this.handleMidiMessage.bind(this);
            //console.log(`[MIDI] Input added: ${input.name} (${input.id})`);
        }

        // Handle connection changes
        midiAccess.onstatechange = (e) => {
            const port = e.port;
            if (port.type === 'input') {
                if (port.state === 'connected') {
                    this.midiInputs.set(port.id, port);
                    port.onmidimessage = this.handleMidiMessage.bind(this);
                    //console.log(`[MIDI] Input connected: ${port.name} `);
                } else if (port.state === 'disconnected') {
                    this.midiInputs.delete(port.id);
                    //console.log(`[MIDI] Input disconnected: ${port.name} `);
                }
            }
        };
    }

    handleMidiMessage(message) {
        if (!this.sceneManager.scenePlaybackActive) return;

        const currentScene = this.sceneManager.scenes[this.sceneManager.playbackSceneIndex];
        if (!currentScene || currentScene.durationType !== 'midi') return;

        const trigger = currentScene.midiTrigger;
        if (!trigger || !trigger.portId) return;

        // Message structure: [status, data1, data2]
        const status = message.data[0];
        const data1 = message.data[1];
        const data2 = message.data[2];

        // Filter by Port ID (if specified)
        if (trigger.portId && message.target.id !== trigger.portId) return;

        // Filter by Channel
        // MIDI Channels are 0-15 in status byte lower nibble (0x90 = Note On Ch1)
        const channel = status & 0x0F;
        // User interface 1-16 -> code 0-15
        if (trigger.channel > 0 && channel !== (trigger.channel - 1)) return;

        // Check Trigger Type (CC vs Note) - currently UI only supports CC based trigger implicitly via "CC Number"
        // But let's assume standard CC check
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
                console.log(`[MIDI Trigger]Matched! CC${data1} Val:${data2} ${trigger.comparison} ${val} `);

                // Advance scene logic
                this.sceneManager.playbackRepeatCount++;
                if (this.sceneManager.playbackRepeatCount < currentScene.repetitions) {
                    console.log(`[Scene Playback] Repeating scene "${currentScene.name}"(MIDI Triggered)`);
                    this.scheduleNextScene(currentScene);
                } else {
                    this.sceneManager.playbackRepeatCount = 0;
                    const nextIndex = this.getNextSceneIndex(currentScene);
                    if (nextIndex !== null && nextIndex !== this.sceneManager.playbackSceneIndex) {
                        this.playScene(nextIndex);
                    } else if (nextIndex !== null && nextIndex === this.sceneManager.playbackSceneIndex) {
                        // Random picked same
                        console.log(`[Scene Playback] Random picked same scene, continuing "${currentScene.name}"`);
                        this.scheduleNextScene(currentScene); // Wait for next trigger
                    }
                }
            }
        }
    }

    stopSketch(canvasId) {
        if (!this.previewHydras) this.previewHydras = new Map();
        if (this.previewHydras.has(canvasId)) {
            const hydra = this.previewHydras.get(canvasId);
            if (hydra && hydra.solid) {
                try {
                    hydra.solid(0, 0, 0, 0).out(); // Clear
                } catch (e) { console.warn("Error clearing preview:", e); }
            }
        }
    }

    async runSketch(code, canvasId) {
        if (!this.previewHydras) this.previewHydras = new Map();

        let hydra = this.previewHydras.get(canvasId);
        const canvas = document.getElementById(canvasId);

        if (!canvas) return;

        if (!hydra) {
            // Try to find Hydra constructor
            let HydraClass = typeof Hydra !== 'undefined' ? Hydra : (window.Hydra || null);

            if (!HydraClass) {
                // Try to get from main editor instance if available (best effort)
                if (this.hydraInstance && this.hydraInstance.constructor) {
                    HydraClass = this.hydraInstance.constructor;
                }
            }

            if (!HydraClass) {
                try {
                    const module = await import('hydra-synth');
                    HydraClass = module.default;
                    // Expose globally for extensions (HydraFCS, etc) to attach to prototype
                    if (!window.Hydra) window.Hydra = HydraClass;
                } catch (e) {
                    console.error("Failed to dynamically import hydra-synth:", e);
                    // Fallback to error
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = 'red';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = 'white';
                        ctx.font = '12px monospace';
                        ctx.fillText("Error: Hydra engine not found", 10, 20);
                    }
                    return;
                }
            }

            if (HydraClass) {
                console.log("[HydraPreview] init with canvas:", canvas);
                hydra = new HydraClass({
                    canvas: canvas,
                    detectAudio: false,
                    makeGlobal: true, // Match main editor behavior (fixes extension context)
                    width: canvas.clientWidth || 540,
                    height: canvas.clientHeight || 304,
                    enableStreamCapture: false
                });
                this.previewHydras.set(canvasId, hydra);
            }
        } else {
            // Check for canvas mismatch (e.g. DOM refresh)
            if (hydra.canvas !== canvas) {
                console.warn("[HydraPreview] Canvas mismatch! Recreating instance.");
                if (hydra.regl) try { hydra.regl.destroy(); } catch (e) { }
                this.previewHydras.delete(canvasId);
                // Re-enter function to create new
                return this.runSketch(code, canvasId);
            }
        }

        if (!hydra) return;

        // Force resolution update
        const w = canvas.clientWidth || 540;
        const h = canvas.clientHeight || 304;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            if (hydra.setResolution) hydra.setResolution(w, h);
        }

        console.log("[HydraPreview] Running Sketch (Global Mode). Res:", w, h);

        try {
            // Execute code
            const func = new Function('hydra', `
                return (async () => {
                    with(hydra) {
                        try {
                            ${code}
                        } catch(e) {
                            console.error("Preview Runtime Error:", e);
                            this.showToast("Preview Error: " + e.message, 'error');
                            if(solid) solid(1, 0, 0).out();
                        }
                    }
                })();
            `);
            await func(hydra);

            // Ensure loop is running
            if (hydra.loop && hydra.loop.start) hydra.loop.start();


        } catch (e) {
            console.error("Preview Execution Error:", e);
            this.showToast("Preview Error: " + e.message, 'error');
        }
    }

    _makeDraggable(element) {
        if (!element) return;
        const header = element.querySelector('.panel-header') || element;
        header.style.cursor = 'move';

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const onMouseDown = (e) => {
            // Prevent dragging if clicking on interactive elements
            if (['BUTTON', 'INPUT', 'SELECT', 'A', 'TEXTAREA'].includes(e.target.tagName)) return;
            // Only Left Mouse Button
            if (e.button !== 0) return;

            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Lock current position into absolute pixels
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            element.style.position = 'fixed'; // Ensure it stays fixed relative to viewport
            element.style.left = `${initialLeft}px`;
            element.style.top = `${initialTop}px`;
            element.style.right = 'auto'; // Release CSS constraints
            element.style.bottom = 'auto';
            element.style.margin = '0'; // Prevent margin interference

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        header.addEventListener('mousedown', onMouseDown);
    }
}

