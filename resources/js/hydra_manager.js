
/**
 * HydraManager.js
 * Manages the Hydra Synth engine instances (Forked GLSL3 version).
 * Handles dynamic loading of the local libraries.
 */

export class HydraManager {
    constructor(graph) {
        this.graph = graph;
        this.HydraClass = null;

        // Instances
        this.previewInstance = null;
        this.hydraA = null;
        this.hydraB = null;
        this.synth = null; // Current active synth
    }

    /**
     * Load the Hydra Synth library from local resources
     */
    async loadLibrary() {
        if (this.HydraClass) return this.HydraClass;

        console.log('[HydraManager] Loading Local GLSL3 Hydra Fork...');
        try {
            // Import from local lib
            // Note: Adjust path if needed based on Vite structure
            const module = await import('./lib/hydra-synth.es.js');
            this.HydraClass = module.default || module;
            window.HydraClass = this.HydraClass; // Expose for UI previews
            console.log('[HydraManager] Hydra Fork Loaded.');
        } catch (e) {
            console.error('[HydraManager] Failed to load Hydra lib:', e);
            throw e;
        }

        return this.HydraClass;
    }

    /**
     * Initialize the library preview instance (always running in background for thumbnails)
     */
    async initPreview(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        await this.loadLibrary();

        const numOutputs = this.graph.globalSettings.numOutputs || 4;
        const numSources = this.graph.globalSettings.numSources || 4;

        if (this.previewInstance) {
            // Already inited
            return;
        }

        canvas.width = 400;
        canvas.height = 300;

        console.log('[HydraManager] Initializing Preview Instance', { numOutputs });

        this.previewInstance = new this.HydraClass({
            canvas: canvas,
            detectAudio: false,
            numOutputs: numOutputs,
            numSources: numSources,
            makeGlobal: false // Preview shouldn't pollute global scope potentially
        });
    }

    /**
     * Initialize execution instances (A/B) for mixing and the Compositor
     * @param {HTMLCanvasElement} outputCanvas - The visible canvas on screen
     */
    async initExecution(outputCanvas) {
        if (this.compositor) return; // Already initialized

        await this.loadLibrary();
        const numOutputs = this.graph.globalSettings.numOutputs || 4;
        const numSources = this.graph.globalSettings.numSources || 4;

        console.log('[HydraManager] Initializing Execution Instances & Compositor');

        // Create Offscreen Canvases for A/B
        this.canvasA = document.createElement('canvas');
        this.canvasB = document.createElement('canvas');
        this.canvasA.width = outputCanvas.width;
        this.canvasA.height = outputCanvas.height;
        this.canvasB.width = outputCanvas.width;
        this.canvasB.height = outputCanvas.height;

        // Initialize Hydra A
        this.hydraA = new this.HydraClass({
            canvas: this.canvasA,
            detectAudio: false,
            numOutputs,
            numSources,
            makeGlobal: false,
            width: this.canvasA.width,
            height: this.canvasA.height,
            alpha: false,
            preserveDrawingBuffer: true
        });

        // Initialize Hydra B
        this.hydraB = new this.HydraClass({
            canvas: this.canvasB,
            detectAudio: false,
            numOutputs,
            numSources,
            makeGlobal: false,
            width: this.canvasB.width,
            height: this.canvasB.height,
            alpha: false,
            preserveDrawingBuffer: true
        });

        // Initialize Compositor
        const { WebGLCompositor } = await import('./webgl_compositor.js');
        this.compositor = new WebGLCompositor(outputCanvas);

        // State
        this.activeHydra = 'A'; // 'A' or 'B'
        this.synth = this.hydraA.synth; // Main active synth exposed to window
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionMode = 'none';
        this.transitionStartTime = 0;
        this.transitionDuration = 0;
    }

    /**
     * Resize all canvases
     */
    resize(width, height) {
        if (this.canvasA) {
            this.canvasA.width = width;
            this.canvasA.height = height;
            if (this.hydraA && this.hydraA.setResolution) this.hydraA.setResolution(width, height);
        }
        if (this.canvasB) {
            this.canvasB.width = width;
            this.canvasB.height = height;
            if (this.hydraB && this.hydraB.setResolution) this.hydraB.setResolution(width, height);
        }
        if (this.compositor) {
            this.compositor.resize(width, height);
        }
    }

    /**
     * Compile and execute the current graph patch
     * @param {Object} options - { target: 'A' | 'B' | 'Active' | 'Inactive', code: string, customShaders: [] }
     */
    async execute(options = {}) {
        let targetKey = options.target || 'Active';

        if (targetKey === 'Active') targetKey = this.activeHydra;
        else if (targetKey === 'Inactive') targetKey = this.activeHydra === 'A' ? 'B' : 'A';

        const hydraInstance = targetKey === 'B' ? this.hydraB : this.hydraA;
        if (!hydraInstance) return;

        // Code might be passed directly or we might need to compile
        let script = options.code;
        let shaderTypes = options.customShaders || [];

        if (!script) {
            // Compile from graph if no code provided
            const { HydraCompiler } = await import('./hydra_compiler.js');
            const compiler = new HydraCompiler(this.graph);
            script = compiler.compile();
            shaderTypes = this._extractShaderTypes();

            // Store for Persistence/Preview
            window.lastCompiledHydraCode = script;
            window.lastShaderTypes = shaderTypes;
        }

        const { executeHydraCode } = await import('./hydra_utils.js');

        try {
            await executeHydraCode(hydraInstance, script, shaderTypes);
            console.log(`[HydraManager] Patch executed on ${targetKey}`);

            // If we are just previewing (no transition), ensure loop is running and we see this instance
            if (!this.isTransitioning && targetKey === this.activeHydra) {
                this.synth = hydraInstance.synth;
                this.startLoop();
            }
        } catch (e) {
            console.error('[HydraManager] Execution failed:', e);
        }
    }

    /**
     * Start the Render Loop (Hydra Ticks + Compositor Blend)
     */
    startLoop() {
        if (this._rafId) cancelAnimationFrame(this._rafId);

        const loop = () => {
            // Tick Hydras
            if (this.hydraA) this.hydraA.tick(16);
            if (this.hydraB) this.hydraB.tick(16);

            // Update LFO/Data Node Value Labels
            this._updateDataNodeLabels();

            // Composite
            if (this.compositor) {
                if (this.isTransitioning) {
                    const now = performance.now();
                    const elapsed = now - this.transitionStartTime;
                    let progress = elapsed / this.transitionDuration;
                    if (progress > 1) progress = 1;

                    this.transitionProgress = progress;

                    // Compute blend factor based on direction
                    // If moving A -> B, blend goes 0 -> 1
                    // If moving B -> A, blend goes 1 -> 0 (or we swap inputs to blend?)
                    // Let's standard: blend(A, B, val). 
                    // detailed: active was A, target B. We want A->B. Blend 0->1.
                    // detailed: active was B, target A. We want B->A. Blend 0->1 (if we swap args) or 1->0.

                    // Compositor blend(A, B, t) mixes A and B. t=0 is A, t=1 is B.
                    // If we are transitioning A -> B: t goes 0 -> 1.
                    // If we are transitioning B -> A: t goes 0 -> 1 (but we must swap args or logic).
                    // Actually, simpler: Always pass (CurrentActive, NextActive, progress).
                    // But textures are bound to A and B.

                    if (this.activeHydra === 'A') {
                        // Transitioning A -> B
                        this.compositor.blend(this.canvasA, this.canvasB, progress, this.transitionMode);
                    } else {
                        // Transitioning B -> A
                        // We want start(B) -> end(A).
                        // Blend(B, A, progress).
                        // Compositor expects (TexA, TexB, blend).
                        // We can just pass the canvases in specific order.
                        this.compositor.blend(this.canvasB, this.canvasA, progress, this.transitionMode);
                    }

                    if (progress >= 1) {
                        this.finishTransition();
                    }

                } else {
                    // Just copy the active one
                    const activeCanvas = this.activeHydra === 'A' ? this.canvasA : this.canvasB;
                    this.compositor.copy(activeCanvas);
                }
            }

            this._rafId = requestAnimationFrame(loop);
        };
        this._rafId = requestAnimationFrame(loop);
    }

    /**
     * Update data node value labels (LFO, Array, etc.)
     */
    _updateDataNodeLabels() {
        if (!this.graph || !this.graph.nodes) return;

        let foundCount = 0;
        this.graph.nodes.forEach(node => {
            // Check if this node has a valueLabel (set by LfoNode.renderNodeBody)
            const valueLabel = node.data?.valueLabel;
            if (valueLabel) {
                foundCount++;
                try {
                    // Construct varName based on node type and nodeIndex
                    const nodeType = node.data?.shaderData?.name?.toLowerCase() || 'lfo';
                    const nodeIndex = node.data?.nodeIndex || 1;
                    const varName = `${nodeType}_${nodeIndex}`;

                    const fn = window[varName];
                    if (typeof fn === 'function') {
                        const value = fn();
                        if (typeof value === 'number') {
                            valueLabel.innerText = value.toFixed(3);
                        } else {
                            valueLabel.innerText = String(value);
                        }
                    } else {
                        // Debug: function not found
                        valueLabel.innerText = `?${varName}`;
                    }
                } catch (e) {
                    valueLabel.innerText = 'ERR';
                }
            }
        });
    }


    stopLoop() {
        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._rafId = null;
    }

    /**
     * Trigger a transition to the inactive instance
     */
    transitionTo(mode, durationMs) {
        const nextHydra = this.activeHydra === 'A' ? 'B' : 'A';
        console.log(`[HydraManager] Transitioning ${this.activeHydra} -> ${nextHydra} (${mode}, ${durationMs}ms)`);

        if (durationMs <= 0) {
            // Cut directly
            this.activeHydra = nextHydra;
            this.synth = (nextHydra === 'A' ? this.hydraA : this.hydraB).synth;
            return;
        }

        this.isTransitioning = true;
        this.transitionMode = mode;
        this.transitionDuration = durationMs;
        this.transitionStartTime = performance.now();
        this.transitionProgress = 0;
    }

    finishTransition() {
        this.isTransitioning = false;
        // Swap active
        this.activeHydra = this.activeHydra === 'A' ? 'B' : 'A';
        this.synth = (this.activeHydra === 'A' ? this.hydraA : this.hydraB).synth;
        console.log(`[HydraManager] Transition Complete. Now Active: ${this.activeHydra}`);
    }

    _extractShaderTypes() {
        const types = new Set();
        if (!this.graph || !this.graph.nodes) return [];

        this.graph.nodes.forEach(node => {
            // Strict logic: If set_function is present/truthy, it is a custom shader.
            // This distinguishes base Hydra nodes (set_function: null) from database-defined custom ones.
            if (node.data?.shaderData?.set_function) {
                const name = node.data.shaderData.name;
                if (name) types.add(name);
            }
        });

        const arr = [...types];
        console.log('[HydraManager] Custom shaders to load (has set_function):', arr);
        return arr;
    }
}
