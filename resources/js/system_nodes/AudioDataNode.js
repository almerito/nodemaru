import BaseNode from './BaseNode.js';

// MEYDA Ranges configuration (Ported)
const MEYDA_AUDIO_RANGES = {
    time: { min: 0, max: 10, adaptive: false },
    rms: { min: 0, max: 0.1, adaptive: true },
    energy: { min: 0, max: 512, adaptive: true },
    zcr: { min: 0, max: 255, adaptive: false },
    spectralCentroid: { min: 0, max: 256, adaptive: false },
    spectralFlatness: { min: 0, max: 1, adaptive: false },
    // spectralFlux: { min: 0, max: 1, adaptive: true }, // Disabled due to crashes
    spectralSlope: { min: 0, max: 1, adaptive: false },
    spectralRolloff: { min: 0, max: 22050, adaptive: false },
    spectralSpread: { min: 0, max: 256, adaptive: false },
    spectralKurtosis: { min: 0, max: 1, adaptive: false },
    perceptualSpread: { min: 0, max: 1, adaptive: false },
    perceptualSharpness: { min: 0, max: 1, adaptive: false },
    loudness: { min: 0, max: 100, adaptive: true },
    dynamic: { min: -0.5, max: 0.5, adaptive: true },
    rhythm: { min: 0, max: 0.01, adaptive: true },
    bands: {
        sub: { min: 0, max: 0.1, adaptive: true },
        bass: { min: 0, max: 0.1, adaptive: true },
        lowMid: { min: 0, max: 0.1, adaptive: true },
        mid: { min: 0, max: 0.1, adaptive: true },
        high: { min: 0, max: 0.1, adaptive: true },
        air: { min: 0, max: 0.05, adaptive: true }
    },
    transients: {
        kick: { min: 0, max: 1, adaptive: false },
        snare: { min: 0, max: 1, adaptive: false }
    }
};

export default class AudioDataNode extends BaseNode {
    /**
     * Render inspectors with Source Dropdown and Conditional Visibility logic
     */
    renderInspector(container, renderParamFn) {
        // Create a dedicated container for our params to allow easy re-rendering
        const root = document.createElement('div');
        container.appendChild(root);

        const render = () => {
            root.innerHTML = '';

            // Collect available AudioNodes
            let audioNodes = [];
            if (window.graph && window.graph.nodes) {
                const allNodes = Array.from(window.graph.nodes.values());
                audioNodes = allNodes.filter(n => n.data?.shaderData?.name === 'audio');
            }

            // Prepare source param options dynamically
            const params = this.node.data.shaderData?.params || {};

            // Ensure 'source' param exists (provided by DB as object, OR stale string from old nodes)
            let sourceParamRaw = params['source'];
            let sourceParam = sourceParamRaw;

            // COMPATIBILITY FIX: Existing nodes in graph might have old 'string' param definition saved.
            if (typeof sourceParamRaw === 'string') {
                sourceParam = { label: 'source', hint: sourceParamRaw, type: 'select', default: '' };
            } else if (!sourceParamRaw) {
                sourceParam = { label: 'source', type: 'select', default: '' };
            }

            // Reset values to dynamic list
            sourceParam.type = 'select';
            sourceParam.values = [
                { value: '', label: 'Select Audio Node...' }
            ];

            // Populate options
            audioNodes.forEach(n => {
                // Logic matching Editor.js openNodeParamsDrawer for consistent Numbering
                const nodeIndex = n.nodeIndex ?? n.data?.nodeIndex ?? n.id.replace('node-', '');
                const nodeLabel = n.data?.shaderData?.label || 'Audio Input';
                // Format: "#Index - Label"
                const label = `#${nodeIndex} - ${nodeLabel}`;
                sourceParam.values.push({ value: n.id, label: label });
            });

            // We want source to be first.
            const sortedKeys = Object.keys(params).sort((a, b) => {
                if (a === 'source') return -1;
                if (b === 'source') return 1;
                const orderA = params[a].order !== undefined ? params[a].order : 999;
                const orderB = params[b].order !== undefined ? params[b].order : 999;
                return orderA - orderB;
            });

            // Get current values for conditional logic
            const currentTrack = this.getParamVal('track');
            const useAdaptive = this.getParamVal('useAdaptiveRange'); // Ensure this matches DB key

            const paramsContainer = document.createElement('div');
            //paramsContainer.className = 'mt-3 pt-2 border-top border-secondary';
            paramsContainer.className = 'mt-3 pt-2';

            for (const key of sortedKeys) {
                // Conditional Visibility Rules
                if (key === 'bandType' && currentTrack !== 'bands') continue;
                if (key === 'transientType' && currentTrack !== 'transients') continue;
                if (key === 'numBands' && currentTrack !== 'spectrum') continue;
                if (key === 'inputRange' && !useAdaptive) continue;

                // Use the modifyable param object if it's source, otherwise original
                const paramDef = (key === 'source') ? sourceParam : params[key];

                const paramHtml = renderParamFn(key, paramDef, this.node);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = paramHtml;
                paramsContainer.appendChild(wrapper);
            }

            root.appendChild(paramsContainer);
        };

        // Initial Render
        render();

        // Listen for changes to trigger re-layout
        root.addEventListener('change', (e) => {
            const target = e.target;
            const paramName = target.dataset.param;

            // Only re-render if a controlling parameter changes
            if (paramName === 'track' || paramName === 'useAdaptiveRange') {
                // FORCE UPDATE: Ensure state is updated before re-render to avoid UI reverting
                // This handles the "toggle won't deactivate" issue
                const newValue = target.type === 'checkbox' ? target.checked : target.value;
                if (!this.node.data.paramState) this.node.data.paramState = {};
                if (!this.node.data.paramState[paramName]) this.node.data.paramState[paramName] = {};
                this.node.data.paramState[paramName].value = newValue;

                // Small delay to ensure any side effects settle
                setTimeout(() => {
                    render();
                }, 10);
            }
        });
    }
    /**
     * Render live value display in node body
     */
    renderNodeBody(container) {
        // Create a wrapper for both displays
        const wrapper = document.createElement('div');
        wrapper.className = 'node-body-text';

        // Value display (current value)
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'audio-data-value small text-center';
        valueDisplay.textContent = '0.000';
        wrapper.appendChild(valueDisplay);

        // Track min/max over time (using object for closure reference)
        const rangeState = { min: 0, max: 0 };

        // Range display with reset button
        const rangeRow = document.createElement('div');
        rangeRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 4px;';

        const rangeDisplay = document.createElement('span');
        rangeDisplay.className = 'audio-data-range small';
        rangeDisplay.style.cssText = 'color: #888; font-size: 0.7em;';
        rangeDisplay.textContent = 'range: 0.000 - 0.000';

        const resetBtn = document.createElement('span');
        resetBtn.textContent = '🔄';
        resetBtn.style.cssText = 'cursor: pointer; font-size: 0.7em; opacity: 0.6;';
        resetBtn.title = 'Reset range';
        resetBtn.onclick = (e) => { e.stopPropagation(); rangeState.min = 0; rangeState.max = 0; };

        rangeRow.appendChild(rangeDisplay);
        rangeRow.appendChild(resetBtn);
        wrapper.appendChild(rangeRow);

        container.appendChild(wrapper);

        // Store reference for cleanup
        this._valueDisplay = valueDisplay;
        this._rangeDisplay = rangeDisplay;
        this._animationFrame = null;

        // Start update loop
        const updateValue = () => {
            try {
                // Get the variable name dynamically (matches compiler pattern)
                const shaderName = (this.node.data?.shaderData?.name || 'audio_data').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
                const nodeIndex = this.node.data?.nodeIndex;
                const varName = nodeIndex !== undefined ? `${shaderName}_${nodeIndex}` : `var_${this.node.id.replace(/-/g, '_')}`;

                // Try to get the getter function
                const getter = window[varName];
                if (typeof getter === 'function') {
                    const val = getter();
                    if (typeof val === 'number' && !isNaN(val)) {
                        valueDisplay.textContent = val.toFixed(3);
                        // Color based on value (0-1 range assumed)
                        const hue = Math.max(0, Math.min(120, val * 120)); // 0 = red, 120 = green
                        valueDisplay.style.color = `hsl(${hue}, 70%, 60%)`;

                        // Update min/max tracking
                        if (val < rangeState.min) rangeState.min = val;
                        if (val > rangeState.max) rangeState.max = val;
                        rangeDisplay.textContent = `range: ${rangeState.min.toFixed(3)} - ${rangeState.max.toFixed(3)}`;
                    }
                } else {
                    valueDisplay.textContent = '--.---';
                    valueDisplay.style.color = '#666';
                    rangeDisplay.textContent = 'range: -- - --';
                }
            } catch (e) {
                // Show 0 instead of ERR
                valueDisplay.textContent = '0.000';
                valueDisplay.style.color = '#666';
            }

            // Continue loop only if element is still in DOM
            if (wrapper.isConnected) {
                this._animationFrame = requestAnimationFrame(updateValue);
            }
        };

        // Start the loop
        updateValue();
    }

    compile(compiler, connections, nodes, globalSettings) {
        // Resolve source
        let sourceNodeId = this.getParamVal('source');
        if (!sourceNodeId || !nodes.has(sourceNodeId)) {
            const audioNodes = Array.from(nodes.values()).filter(n => n.type === 'audio');
            if (audioNodes.length > 0) sourceNodeId = audioNodes[0].id;
        }

        let stateKey = '';
        if (sourceNodeId && nodes.has(sourceNodeId)) {
            const src = nodes.get(sourceNodeId);
            const srcType = src.data?.type || 'device';
            stateKey = srcType === 'device' ? (src.data?.deviceId || '') : src.id;
        }

        const track = this.getParamVal('track', 'energy');
        const bandType = this.getParamVal('bandType', 'bass');
        const transientType = this.getParamVal('transientType', 'kick');
        const transposeArr = this.getParamVal('transpose', [0, 1]);
        const useAdaptiveRange = this.getParamVal('useAdaptiveRange', false);
        const inputRangeArr = this.getParamVal('inputRange', [0, 1]);
        const numBands = this.getParamVal('numBands', 64); // For spectrum track

        const minOut = Array.isArray(transposeArr) ? transposeArr[0] : 0;
        const maxOut = Array.isArray(transposeArr) ? transposeArr[1] : 1;

        // Get range config
        let rangeConfig;
        if (track === 'bands') rangeConfig = MEYDA_AUDIO_RANGES.bands[bandType] || { min: 0, max: 0.1, adaptive: true };
        else if (track === 'transients') rangeConfig = MEYDA_AUDIO_RANGES.transients[transientType] || { min: 0, max: 1, adaptive: false };
        else if (track === 'spectrum') rangeConfig = { min: 0, max: 1, adaptive: false }; // Spectrum is already normalized
        else rangeConfig = MEYDA_AUDIO_RANGES[track] || { min: 0, max: 1, adaptive: true };

        const minRaw = Array.isArray(inputRangeArr) ? inputRangeArr[0] : rangeConfig.min;
        const maxRaw = Array.isArray(inputRangeArr) ? inputRangeArr[1] : rangeConfig.max;

        const getterConfig = {
            sourceId: stateKey,
            track: track,
            subtrack: track === 'bands' ? bandType : (track === 'transients' ? transientType : null),
            nodeId: this.node.id,
            defaultMin: minRaw,
            defaultMax: maxRaw,
            outMin: minOut,
            outMax: maxOut,
            useAdaptive: useAdaptiveRange && rangeConfig.adaptive,
            numBands: track === 'spectrum' ? numBands : undefined // Only for spectrum
        };

        const mathChain = compiler._getMathChain(this.node.id, connections, nodes);
        const varName = this.getVarName(compiler);

        if (mathChain.length > 0) {
            let stateVars = '';
            let chainCode = '';
            mathChain.forEach((filterNode, idx) => {
                if (filterNode.type === 'smooth') {
                    stateVars += `var _state_${varName}_${idx} = { history: [] };\n`;
                }
                chainCode += compiler._getMathChainCode(filterNode, this.node.id, idx, nodes);
            });
            return `${stateVars}window.${varName} = (() => { const _g = window._createAudioDataGetter(${JSON.stringify(getterConfig)}); return () => { let val = _g(); ${chainCode} return val; }; })();\n`;
        } else {
            return `window.${varName} = window._createAudioDataGetter(${JSON.stringify(getterConfig)});\n`;
        }
    }
}
