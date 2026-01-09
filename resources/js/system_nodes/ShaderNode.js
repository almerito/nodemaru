import BaseNode from './BaseNode.js';

export default class ShaderNode extends BaseNode {
    compile(compiler, connections, nodes, globalSettings) {
        const nodeType = this.node.data.shaderData.name;
        const shaderData = this.node.data.shaderData || {};
        const path = globalSettings?.path || new Set();

        // 1. Resolve Parameters
        const args = compiler._compileParams(this.node, path, nodes, connections);

        // 2. Check for Inputs
        const hasInput = shaderData.has_input ?? false;
        const hasParamInput = shaderData.has_param_input ?? false;

        // 3. Handle Chain Logic
        if (hasInput) {
            const inputSource = compiler._findInputSource(this.node.id, 'main', connections, nodes);

            if (inputSource) {
                // Recursively compile upstream node
                const prevCode = compiler._compileNode(inputSource, path, nodes, connections);

                if (hasParamInput) {
                    // Check for secondary parameters (e.g. modulation source)
                    const secondarySource = compiler._findInputSource(this.node.id, 'param', connections, nodes);
                    let secondaryCode = 'solid(0,0,0,0)';

                    if (secondarySource) {
                        const endOfChain = compiler._findEndOfChain(secondarySource.id, this.node.id, path, connections, nodes);
                        secondaryCode = compiler._compileNode(endOfChain, path, nodes, connections);
                    }

                    // Modulate syntax: prev.modulate(modulator, args)
                    if (shaderData.type === 'src') {
                        return `${nodeType}(${[prevCode, secondaryCode, ...args].join(', ')})`;
                    } else {
                        return `${prevCode}.${nodeType}(${[secondaryCode, ...args].join(', ')})`;
                    }

                } else {
                    // Standard chain: prev.effect(args)
                    if (shaderData.type === 'src') {
                        return `${nodeType}(${[prevCode, ...args].join(', ')})`;
                    } else {
                        return `${prevCode}.${nodeType}(${args.join(', ')})`;
                    }
                }
            } else {
                // Has "input" slot but no connection -> solid().effect() default
                return `solid(0,0,0).${nodeType}(${args.join(', ')})`;
            }
        }

        // 4. Source Node (no main input)
        // Check for param input (modulation on source itself)
        if (hasParamInput) {
            const paramSource = compiler._findInputSource(this.node.id, 'param', connections, nodes);
            if (paramSource) {
                const endOfChain = compiler._findEndOfChain(paramSource.id, this.node.id, path, connections, nodes);
                const paramCode = compiler._compileNode(endOfChain, path, nodes, connections);
                return `${nodeType}(${[paramCode, ...args].join(', ')})`;
            }
        }

        // Simple Source: osc(args)
        return `${nodeType}(${args.join(', ')})`;
    }
}
