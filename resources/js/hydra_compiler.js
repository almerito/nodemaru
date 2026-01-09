/**
 * HydraCompiler.js
 * Compiles the node graph into executable Hydra Synth code.
 */

// Audio feature ranges for Meyda
const MEYDA_AUDIO_RANGES = {
    time: { min: 0, max: 10, adaptive: false },
    rms: { min: 0, max: 0.1, adaptive: true },
    energy: { min: 0, max: 512, adaptive: true },
    zcr: { min: 0, max: 255, adaptive: false },
    spectralCentroid: { min: 0, max: 256, adaptive: false },
    spectralFlatness: { min: 0, max: 1, adaptive: false },
    spectralFlux: { min: 0, max: 1, adaptive: true },
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

import { createNodeInstance } from './system_nodes/BaseNodeFactory.js';

export class HydraCompiler {
    constructor(graph) {
        this.graph = graph;
    }

    /**
     * Main compilation entry point
     * @returns {string} Hydra script
     */
    compile() {
        const nodes = this.graph.nodes;
        const connections = this.graph.connections;
        const globalSettings = this.graph.globalSettings;

        // Generate friendly variable names (e.g. array_1, lfo_1)
        this._generateVarNames(nodes);

        // Find output and render nodes
        const outputs = [];
        const renders = [];

        nodes.forEach(node => {
            const nodeType = this._getNodeType(node);
            if (nodeType === 'out') {
                outputs.push(node);
            } else if (nodeType === 'render') {
                renders.push(node);
            }
        });

        if (outputs.length === 0 && renders.length === 0) {
            console.warn('[HydraCompiler] No output or render nodes found.');
            return 'solid(0,0,0).out()';
        }

        let script = '';

        // Clear previous state
        script += 'hush();\n';

        // Phase 1: Global Settings
        script += this._compileGlobalSettings(globalSettings);

        // Phase 2: Init Nodes (sources)
        script += this._compileInitNodes(nodes);

        // Phase 3: MIDI Setup
        script += this._compileMidiSetup(nodes);

        // Phase 4: Audio Setup
        script += this._compileAudioSetup(nodes);

        // Phase 5: Data Nodes (array, lfo, midi_data, audio_data)
        script += this._compileDataNodes(nodes, connections, globalSettings);

        // Phase 6: Node Chains (from out nodes)
        outputs.forEach(outNode => {
            const source = this._findInputSource(outNode.id, 'main', connections, nodes);
            if (source) {
                const chain = this._compileNode(source, new Set(), nodes, connections);
                const val = outNode.data?.currentValue?.output;
                const target = val !== undefined ? val : (outNode.data?.target ?? 0);
                script += `${chain}.out(o${target})\n`;
            }
        });

        // Phase 7: Render Calls
        renders.forEach(renderNode => {
            // Check 'main' input first (standard connection), then 'param' (legacy/specific)
            let outSource = this._findInputSource(renderNode.id, 'main', connections, nodes);

            if (!outSource) {
                outSource = this._findInputSource(renderNode.id, 'param', connections, nodes);
            }

            if (outSource && this._getNodeType(outSource) === 'out') {
                const val = outSource.data?.currentValue?.output;
                const target = val !== undefined ? val : (outSource.data?.target ?? 0);
                script += `render(o${target})\n`;
            } else {
                script += `render()\n`;
            }
        });

        return script;
    }

    // ========================================
    // Phase Compilers
    // ========================================

    _compileGlobalSettings(globalSettings) {
        if (!globalSettings) return '';

        let script = '';
        script += `// Global Settings\n`;
        script += `Object.defineProperty(window, '_baseBpm', { value: ${globalSettings.bpm || 30}, writable: true, configurable: true });\n`;
        script += `Object.defineProperty(window, 'bpm', {\n`;
        script += `  get: function() {\n`;
        script += `    const clock = window._midiClockState;\n`;
        script += `    if (clock && clock.activePortId && clock.bpm > 0) return clock.bpm;\n`;
        script += `    return window._baseBpm;\n`;
        script += `  },\n`;
        script += `  set: function(v) { window._baseBpm = v; },\n`;
        script += `  configurable: true\n`;
        script += `});\n`;
        script += `speed = ${globalSettings.speed || 1};\n\n`;

        return script;
    }

    _compileInitNodes(nodes) {
        let script = '';
        nodes.forEach(node => {
            if (this._getNodeType(node) !== 'init') return;
            // BaseNode Architecture
            if (node.data?.shaderData?.classname) {
                const instance = createNodeInstance(node.data.shaderData.classname, node);
                if (instance) {
                    script += instance.compile(this, null, nodes, null);
                }
            } else {
                // Fallback legacy (should be removed once migration confirmed)
            }
        });
        return script ? `// Init Sources\n${script}\n` : '';
    }

    _compileMidiSetup(nodes) {
        let script = '';
        nodes.forEach(node => {
            if (this._getNodeType(node) !== 'midi') return;
            // BaseNode Architecture
            if (node.data?.shaderData?.classname) {
                const instance = createNodeInstance(node.data.shaderData.classname, node);
                if (instance) {
                    script += instance.compile(this, null, nodes, null);
                }
            }
        });

        // Wrap if needed, but MidiNode generates specific listener calls.
        // Legacy: _setupMidiListeners(['all'])
        // New: multiple calls to _setupMidiListeners(['one']) -> Needs to be supported by runtime helper

        if (script) {
            return `// MIDI Setup\n${script}`;
        }
        return '';
    }

    _compileAudioSetup(nodes) {
        let innerScript = '';

        nodes.forEach(node => {
            if (this._getNodeType(node) !== 'audio') return;
            // BaseNode Architecture
            if (node.data?.shaderData?.classname) {
                const instance = createNodeInstance(node.data.shaderData.classname, node);
                if (instance) {
                    innerScript += instance.compile(this, null, nodes, null);
                }
            }
        });

        // Only wrap in async IIFE if there's actual content
        if (innerScript.trim()) {
            return `(async () => {\n${innerScript}})();\n`;
        }
        return '';
    }

    _compileDataNodes(nodes, connections, globalSettings) {
        let script = '';

        nodes.forEach(node => {
            // BaseNode Architecture for Data Nodes
            // Only compile strictly "Data" nodes here. Init, Audio, Midi, Out, Src are handled in their own phases.
            const DATA_CLASSES = ['ArrayNode', 'LfoNode', 'MidiDataNode', 'AudioDataNode', 'DataMathNode'];

            if (node.data?.shaderData?.classname && DATA_CLASSES.includes(node.data.shaderData.classname)) {
                const instance = createNodeInstance(node.data.shaderData.classname, node);
                if (instance) {
                    try {
                        script += instance.compile(this, connections, nodes, globalSettings);
                    } catch (err) {
                        console.error(`[HydraCompiler] Error compiling node ${node.id} (${node.data.shaderData.classname}):`, err);
                    }
                    return; // Handled
                }
            }


        });

        return script ? `// Data Nodes\n${script}\n` : '';
    }

    // ========================================
    // Node Type Compilers
    // ========================================



    _compileNode(node, path, nodes, connections) {
        // BaseNode Architecture Delegation
        // Skip Data Classes here because they are defined in _compileDataNodes, and here we just want the reference call.
        const DATA_CLASSES = ['ArrayNode', 'LfoNode', 'MidiDataNode', 'AudioDataNode', 'DataMathNode'];

        if (node.data?.shaderData?.classname && !DATA_CLASSES.includes(node.data.shaderData.classname)) {
            const instance = createNodeInstance(node.data.shaderData.classname, node);
            if (instance) {
                // Pass 'path' via settings to maintain recursion state
                // Assuming globalSettings can be augmented
                const settings = { path: path };
                try {
                    return instance.compile(this, connections, nodes, settings);
                } catch (err) {
                    console.error(`[HydraCompiler] Error compiling node ${node.id}:`, err);
                    return 'solid(1,0,1)'; // Error color
                }
            }
        }

        // Legacy fallback (if classname missing or factory fails)
        const nodeType = this._getNodeType(node);
        const shaderData = node.data?.shaderData || {};

        // Terminal nodes
        if (nodeType === 'array' || nodeType === 'lfo' || nodeType === 'midi_data' || nodeType === 'audio_data') {
            return `window.${this._getVarName(node.id)}()`;
        }
        if (nodeType === 'out') {
            const target = node.data?.target ?? shaderData.params?.target?.default ?? 0;
            return `o${target}`;
        }
        if (nodeType === 'init') {
            const target = node.data?.currentValue?.target ?? node.data?.target ?? 0;
            // Implicitly wrap init nodes with src() so they can be used directly
            return `src(s${target})`;
        }
        if (nodeType === 'src') {
            const source = this._findInputSource(node.id, 'param', connections, nodes);
            let target = 'o0';
            if (source) {
                const sourceType = this._getNodeType(source);
                if (sourceType === 'out') target = `o${source.data?.target ?? 0}`;
                else if (sourceType === 'init') target = `s${source.data?.target ?? 0}`;
            }
            return `src(${target})`;
        }

        // Cycle detection
        if (path.has(node.id)) {
            console.warn(`[HydraCompiler] Cycle detected at node ${node.id}`);
            return 'solid(1,0,0)';
        }
        path.add(node.id);

        let code = '';

        try {
            const args = this._compileParams(node, path, nodes, connections);
            // Get hasInput/hasParamInput from shaderData
            const hasInput = shaderData.has_input ?? false;
            const hasParamInput = shaderData.has_param_input ?? false;

            if (hasInput) {
                const inputSource = this._findInputSource(node.id, 'main', connections, nodes);

                if (inputSource) {
                    const prevCode = this._compileNode(inputSource, path, nodes, connections);

                    if (hasParamInput) {
                        const secondarySource = this._findInputSource(node.id, 'param', connections, nodes);
                        let secondaryCode = 'solid(0,0,0,0)';
                        if (secondarySource) {
                            const endOfChain = this._findEndOfChain(secondarySource.id, node.id, path, connections, nodes);
                            secondaryCode = this._compileNode(endOfChain, path, nodes, connections);
                        }

                        // If shader is type 'src' (like offworld), use functional syntax: offworld(prev, args)
                        // Otherwise use chain syntax: prev.modulate(args)
                        if (shaderData.type === 'src') {
                            code = `${nodeType}(${[prevCode, secondaryCode, ...args].join(', ')})`;
                        } else {
                            code = `${prevCode}.${nodeType}(${[secondaryCode, ...args].join(', ')})`;
                        }

                    } else {
                        if (shaderData.type === 'src') {
                            code = `${nodeType}(${[prevCode, ...args].join(', ')})`;
                        } else {
                            code = `${prevCode}.${nodeType}(${args.join(', ')})`;
                        }
                    }
                } else {
                    code = `solid(0,0,0).${nodeType}(${args.join(', ')})`;
                }
            } else {
                // Source node (no input) - like osc, noise, solid, etc.
                if (hasParamInput) {
                    const paramSource = this._findInputSource(node.id, 'param', connections, nodes);
                    if (paramSource) {
                        const endOfChain = this._findEndOfChain(paramSource.id, node.id, path, connections, nodes);
                        const paramCode = this._compileNode(endOfChain, path, nodes, connections);
                        code = `${nodeType}(${[paramCode, ...args].join(', ')})`;
                    } else {
                        code = `${nodeType}(o0, ${args.join(', ')})`;
                    }
                } else {
                    code = `${nodeType}(${args.join(', ')})`;
                }
            }
        } finally {
            path.delete(node.id);
        }

        return code;
    }

    _compileParams(node, path, nodes, connections) {
        const results = [];
        const shaderData = node.data?.shaderData || {};
        const params = shaderData.params || {};
        // Editor stores full state (type, selectedNode) in paramState.
        // currentValue often only holds the scalar value.
        const currentValues = node.data?.paramState || node.data?.currentValue || node.data || {};
        const nodeType = this._getNodeType(node);

        // If no params defined, return empty array
        if (Object.keys(params).length === 0) return results;

        const hasParamInput = shaderData.has_param_input ?? false;

        // Sort keys based on 'order' property in params definition
        const keysToIterate = Object.keys(params).sort((a, b) => {
            const orderA = params[a]?.order ?? 999;
            const orderB = params[b]?.order ?? 999;
            return orderA - orderB;
        });

        keysToIterate.forEach((key, index) => {
            const paramConf = params[key];
            // Get current value from node.data, fallback to default from shader params
            let val = currentValues[key];

            if (val === undefined) {
                if (paramConf.type === 'multiple') {
                    val = { activeIndex: 0, value: paramConf.items?.[0]?.default ?? 0 };
                } else {
                    val = paramConf.default;
                }
            }

            // Handle 'multiple' type (UI uses type + selectedNode pattern now)
            if (paramConf.type === 'multiple') {
                const currentType = val?.type || 'constant';

                if (currentType === 'constant') {
                    // Use scalar value
                    val = val?.value ?? paramConf.items?.find(i => i.item === 'constant')?.default ?? 0;
                } else if (['array', 'lfo', 'midi_data', 'audio_data', 'data_math'].includes(currentType)) {
                    // It's a node reference
                    const targetNodeId = val?.selectedNode;
                    if (targetNodeId) {
                        const varName = this._getVarName(targetNodeId);
                        // Pass reference directly to Hydra (it handles functions and Easers)
                        val = `window.${varName}`;
                    } else {
                        // No node selected, fallback to compatible default (0)
                        val = '0';
                    }
                } else {
                    // Fallback or legacy activeIndex?
                    if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                        const activeItem = paramConf.items?.[val.activeIndex];
                        if (activeItem?.item === 'nodeList') {
                            const varName = this._getVarName(val.value);
                            val = val.value ? `window.${varName}` : '0';
                        } else {
                            val = val.value;
                        }
                    } else {
                        val = val?.value || 0;
                    }
                }
            }

            // Modulate first param if no param input injection
            if (index === 0 && !hasParamInput) {
                const modSource = this._findInputSource(node.id, 'param', connections, nodes);
                if (modSource) {
                    val = this._compileNode(modSource, path, nodes, connections);
                }
            }

            if (Array.isArray(val)) {
                results.push(`[${val.join(', ')}]`);
            } else {
                results.push(val);
            }
        });

        return results;
    }

    // ========================================
    // Helper Methods
    // ========================================

    /**
     * Get node type from nested structure
     * In nodegraph-js, the type is stored in node.data.shaderData.name
     */
    _getNodeType(node) {
        let type = node.data?.shaderData?.name || node.type || node.data?.type;
        // Normalize 'Output' to 'out' if it comes from label/name confusion
        if (type === 'Output') type = 'out';
        if (type === 'Render') type = 'render';
        // Check for specific classnames if type is generic 'system'
        if (node.data?.shaderData?.classname === 'OutputNode') type = 'out';
        return type;
    }






    _findInputSource(nodeId, inputType, connections, nodes) {
        // In nodegraph-js, connections have outputSlot and inputSlot objects
        // inputSlot.node.id = target node ID
        // inputSlot.id = port ID (e.g., 'in', 'param_in')
        // outputSlot.node.id = source node ID
        const targetPort = inputType === 'main' ? 'in' : 'param_in';

        for (const conn of connections.values()) {

            // Check if this connection targets the node we're looking for
            const inputNode = conn.inputSlot?.node;
            const inputPortId = conn.inputSlot?.id;

            if (inputNode?.id === nodeId && inputPortId === targetPort) {
                const sourceNodeId = conn.outputSlot?.node?.id;
                return nodes.get(sourceNodeId);
            }
        }
        return null;
    }

    _findEndOfChain(startNodeId, blockNodeId, compilePath, connections, nodes) {
        let currentId = startNodeId;
        let visited = new Set();
        if (blockNodeId) visited.add(blockNodeId);

        while (true) {
            if (visited.has(currentId)) break;
            visited.add(currentId);

            let nextId = null;

            for (const conn of connections.values()) {
                // Check if this connection originates from the current node's output
                const sourceNodeId = conn.outputSlot?.node?.id;
                const sourcePortId = conn.outputSlot?.id;

                if (sourceNodeId === currentId && sourcePortId === 'out') {
                    const targetNodeId = conn.inputSlot?.node?.id;
                    const targetNode = nodes.get(targetNodeId);
                    if (!targetNode) continue;
                    if (this._getNodeType(targetNode) === 'out') continue;
                    if (targetNode.id === blockNodeId) continue;
                    if (compilePath && compilePath.has(targetNode.id)) continue;

                    nextId = targetNode.id;
                    break;
                }
            }

            if (nextId) {
                currentId = nextId;
            } else {
                break;
            }
        }

        return nodes.get(currentId);
    }

    _getMathChain(startNodeId, connections, nodes) {
        const chain = [];
        let currentId = startNodeId;

        for (let i = 0; i < 20; i++) {
            // Find connection from current node's param_out to another node's param_in
            const conn = Array.from(connections.values()).find(c => {
                const sourceNodeId = c.outputSlot?.node?.id;
                const sourcePortId = c.outputSlot?.id;
                return sourceNodeId === currentId && sourcePortId === 'param_out';
            });

            if (!conn) break;

            const targetNodeId = conn.inputSlot?.node?.id;
            const targetNode = nodes.get(targetNodeId);
            if (!targetNode) break;

            // Check if target is a data_math node
            const targetData = targetNode.data?.shaderData;
            if (targetData?.category === 'data_math' || targetData?.options?.category === 'data_math') {
                chain.push(targetNode);
                currentId = targetNode.id;
            } else {
                break;
            }
        }
        return chain;
    }

    _getMathChainCode(filterNode, nodeId, idx, nodes) {
        const type = filterNode.type;

        const getP = (key, defaultVal) => {
            const val = filterNode.data?.[key];
            if (val === undefined) return defaultVal;
            if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                const configParam = filterNode.params?.[key];
                if (!configParam) return defaultVal;
                const activeItem = configParam.items[val.activeIndex];
                if (activeItem.item === 'nodeList') {
                    if (val.value && nodes.has(val.value)) return `window.${this._getVarName(val.value)}()`;
                    return defaultVal;
                }
                return val.value ?? defaultVal;
            }
            return val;
        };

        let paramsObjCode = '{}';
        if (type === 'smooth') paramsObjCode = `{ size: ${getP('size', 1)} }`;
        else if (type === 'round') paramsObjCode = `{ decimals: ${getP('decimals', 0)} }`;
        else if (type === 'if_then_else') {
            const op = filterNode.data?.operator || '>';
            paramsObjCode = `{ threshold: ${getP('threshold', 0)}, operator: "${op}", if_true: ${getP('if_true', 1)}, if_false: ${getP('if_false', 0)} }`;
        } else {
            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
        }

        let stateArg = 'null';
        if (type === 'smooth') stateArg = `_state_${this._getVarName(nodeId)}_${idx}`;

        return `val = window._applyDataMath(val, '${type}', ${paramsObjCode}, ${stateArg});\n`;
    }

    _getParamVal(node, key, defaultVal = undefined) {
        const paramState = node.data?.paramState || {};
        const currentValue = node.data?.currentValue || {};
        const params = node.data?.shaderData?.params || node.params || {};

        let val = paramState[key]?.value ?? currentValue[key];

        if (val === undefined || val === null || val === '') {
            // Check for direct default
            val = params[key]?.default;

            // Check for nested default in items (standard node definition structure)
            if (val === undefined && params[key]?.items && Array.isArray(params[key].items) && params[key].items.length > 0) {
                val = params[key].items[0].default;
            }

            // Fallback to provided defaultVal
            if (val === undefined) {
                val = defaultVal;
            }
        }
        return val;
    }

    _generateVarNames(nodes) {
        this.varNames = new Map();

        nodes.forEach(node => {
            let type = this._getNodeType(node).toLowerCase();
            // Sanitize type name (e.g. midi_data -> midi_data, but ensures no weird chars)
            type = type.replace(/[^a-zA-Z0-9_]/g, '');

            // Use nodeIndex as requested by user
            const idx = node.data?.nodeIndex;

            if (idx !== undefined && idx !== null) {
                this.varNames.set(node.id, `${type}_${idx}`);
            } else {
                // Fallback to sanitized ID if nodeIndex is missing
                this.varNames.set(node.id, 'var_' + node.id.replace(/-/g, '_'));
            }
        });
    }

    _getVarName(id) {
        if (this.varNames && this.varNames.has(id)) {
            return this.varNames.get(id);
        }
        // Fallback if not found (shouldn't happen for valid graph nodes)
        if (!id) return '';
        return 'var_' + id.replace(/-/g, '_');
    }
}
