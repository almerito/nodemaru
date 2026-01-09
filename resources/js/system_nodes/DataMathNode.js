import BaseNode from './BaseNode.js';

export default class DataMathNode extends BaseNode {
    /**
     * Render live value display in node body
     * Shows the value flowing through this math node from connected input
     */
    renderNodeBody(container) {
        // Create a wrapper for both displays
        const wrapper = document.createElement('div');
        wrapper.className = 'node-body-text';

        // Value display (current value)
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'data-math-value small text-center';
        valueDisplay.textContent = '0.000';
        wrapper.appendChild(valueDisplay);

        // Track min/max over time (using object for closure reference)
        const rangeState = { min: 0, max: 0 };

        // Range display with reset button
        const rangeRow = document.createElement('div');
        rangeRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 4px;';

        const rangeDisplay = document.createElement('span');
        rangeDisplay.className = 'data-math-range small';
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

        // Start update loop
        const updateValue = () => {
            try {
                // Get the variable name dynamically (matches compiler pattern)
                const shaderName = (this.node.data?.shaderData?.name || 'data_math').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
                const nodeIndex = this.node.data?.nodeIndex;
                const varName = nodeIndex !== undefined ? `${shaderName}_${nodeIndex}` : `var_${this.node.id.replace(/-/g, '_')}`;

                const getter = window[varName];
                if (typeof getter === 'function') {
                    const val = getter();
                    if (typeof val === 'number' && !isNaN(val)) {
                        valueDisplay.textContent = val.toFixed(3);
                        const hue = Math.max(0, Math.min(120, val * 120));
                        valueDisplay.style.color = `hsl(${hue}, 70%, 60%)`;

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

            if (wrapper.isConnected) {
                requestAnimationFrame(updateValue);
            }
        };

        updateValue();
    }

    compile(compiler, connections, nodes, globalSettings) {
        // Data Math nodes apply transformations to input data
        // Find the input connection to get the source value

        // connections might be a Map or Set - convert to array
        const connectionsArray = Array.isArray(connections) ? connections : Array.from(connections?.values?.() || connections || []);

        const myInputs = connectionsArray.filter(c => c.inputSlot?.node?.id === this.node.id);
        if (!myInputs || myInputs.length === 0) {
            // No input connection - return constant 0
            return `window.${this.getVarName(compiler)} = () => 0;\n`;
        }

        const sourceNode = myInputs[0].outputSlot?.node;
        if (!sourceNode) {
            return `window.${this.getVarName(compiler)} = () => 0;\n`;
        }

        // Get source variable name
        const sourceIndex = sourceNode.nodeIndex || sourceNode.data?.nodeIndex || sourceNode.id.slice(0, 8);
        const sourceType = sourceNode.data?.shaderData?.name || sourceNode.type;

        // Build source getter reference
        let sourceGetter = '0';
        const sourcePatterns = ['lfo', 'audio_data', 'midi_data', 'array'];
        for (const pattern of sourcePatterns) {
            if (sourceType === pattern || sourceNode.data?.shaderData?.classname?.toLowerCase().includes(pattern.replace('_', ''))) {
                sourceGetter = `(typeof window.${pattern}_${sourceIndex} === 'function' ? window.${pattern}_${sourceIndex}() : 0)`;
                break;
            }
        }

        // If not found, check if it's another data_math node
        if (sourceGetter === '0') {
            const isDataMath = sourceNode.data?.shaderData?.category === 'data_math' ||
                sourceNode.data?.shaderData?.classname === 'DataMathNode' ||
                sourceType === 'data_math';

            if (isDataMath) {
                // Use the shader name (e.g. multiply, add) as the variable prefix
                const shaderName = (sourceNode.data?.shaderData?.name || 'data_math').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
                sourceGetter = `(typeof window.${shaderName}_${sourceIndex} === 'function' ? window.${shaderName}_${sourceIndex}() : 0)`;
            }
        }


        // Get this node's math operation type and parameters
        const mathType = this.node.data?.shaderData?.name || 'passthrough';

        // Helper to get parameter by index (sorted by order field)
        const getParamByIndex = (index, defaultVal = 0) => {
            const params = this.node.data.shaderData?.params || this.node.params || {};
            // Sort by order
            const sortedKeys = Object.keys(params).sort((a, b) => {
                const orderA = params[a].order !== undefined ? params[a].order : 999;
                const orderB = params[b].order !== undefined ? params[b].order : 999;
                return orderA - orderB;
            });

            const key = sortedKeys[index];
            if (!key) return defaultVal;
            return this.getParamVal(key, defaultVal);
        };

        // Get params by index
        const p0 = getParamByIndex(0, 1); // multiply/pow/smooth amount/if_true/min
        const p1 = getParamByIndex(1, 0); // if_false/max

        // Generate the transformation code
        // We use an IIFE to allow state (closure) for nodes like smooth
        let bodyCode = '';

        switch (mathType) {
            case 'multiply':
                bodyCode = `const val = ${sourceGetter}; return val * ${p0};`;
                break;
            case 'add':
                bodyCode = `const val = ${sourceGetter}; return val + ${getParamByIndex(0, 0)};`;
                break;
            case 'subtract':
                bodyCode = `const val = ${sourceGetter}; return val - ${getParamByIndex(0, 0)};`;
                break;
            case 'divide':
                bodyCode = `const val = ${sourceGetter}; return val / (${p0} || 1);`;
                break;
            case 'abs':
                bodyCode = `const val = ${sourceGetter}; return Math.abs(val);`;
                break;
            case 'invert':
                bodyCode = `const val = ${sourceGetter}; return 1 - val;`;
                break;
            case 'clamp':
                // p0 = min, p1 = max
                bodyCode = `const val = ${sourceGetter}; return Math.max(${getParamByIndex(0, 0)}, Math.min(${getParamByIndex(1, 1)}, val));`;
                break;
            case 'pow':
            case 'exp':
            case 'exponential':
                bodyCode = `const val = ${sourceGetter}; return Math.pow(val, ${p0});`;
                break;
            case 'root':
            case 'sqrt':
                // Signed root: sign(v) * |v|^(1/amount)
                bodyCode = `
                    const val = ${sourceGetter}; 
                    const amt = ${p0} || 2; 
                    return Math.sign(val) * Math.pow(Math.abs(val), 1 / amt);
                `;
                break;
            case 'round':
                // Round to N decimals
                bodyCode = `
                    const val = ${sourceGetter}; 
                    const dec = Math.max(0, Math.floor(${p0}));
                    const factor = Math.pow(10, dec);
                    return Math.round(val * factor) / factor;
                `;
                break;
            case 'ceil':
                bodyCode = `const val = ${sourceGetter}; return Math.ceil(val);`;
                break;
            case 'floor':
                bodyCode = `const val = ${sourceGetter}; return Math.floor(val);`;
                break;
            case 'smooth':
                // Rolling Average (Legacy Logic)
                // Param 0 is 'size' (window size)
                bodyCode = `
                    if (!node._history) node._history = [];
                    const val = ${sourceGetter};
                    const size = Math.max(1, Math.round(${p0}));
                    
                    node._history.push(val);
                    while (node._history.length > size) node._history.shift();
                    
                    if (node._history.length === 0) return 0;
                    
                    const sum = node._history.reduce((a, b) => a + b, 0);
                    return sum / node._history.length;
                `;
                break;
            case 'if_then_else':
                // Param order: 0=threshold, 1=operator, 2=if_true, 3=if_false
                const th = getParamByIndex(0, 0);
                const op = getParamByIndex(1, '>');
                const tv = getParamByIndex(2, 1);
                const fv = getParamByIndex(3, 0);

                // Construct condition based on operator string provided at compile time
                let condition = `val > ${th}`; // Default
                if (op === '>' || op === '<' || op === '>=' || op === '<=' || op === '==' || op === '===') {
                    condition = `val ${op} ${th}`;
                }

                bodyCode = `const val = ${sourceGetter}; return (${condition}) ? ${tv} : ${fv};`;
                break;
            default:
                bodyCode = `const val = ${sourceGetter}; return val;`;
        }

        return `window.${this.getVarName(compiler)} = (() => {
            const node = { _prev: 0 }; // Context for stateful nodes
            return () => {
                ${sourceGetter.includes('typeof') ? '' : `const val = ${sourceGetter};`} // Safety if needed
                ${bodyCode.replace(/this\._prev/g, 'node._prev')} 
            };
        })();\n`;
    }
}
