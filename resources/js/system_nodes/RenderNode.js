import BaseNode from './BaseNode.js';

export default class RenderNode extends BaseNode {
    compile(compiler, connections, nodes, globalSettings) {
        // Logic ported from HydraCompiler._compileRenderSetup? Or similar.
        // Actually renders are processed at the very end.
        // "Phase 7: Render Calls"

        let outSource = compiler._findInputSource(this.node.id, 'main', connections, nodes);
        if (!outSource) {
            outSource = compiler._findInputSource(this.node.id, 'param', connections, nodes);
        }

        if (outSource && compiler._getNodeType(outSource) === 'out') {
            const val = outSource.data?.currentValue?.output;
            const target = val !== undefined ? val : (outSource.data?.target ?? 0);
            return `render(o${target})\n`;
        } else {
            return `render()\n`;
        }
    }
}
