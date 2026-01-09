import BaseNode from './BaseNode.js';

export default class OutNode extends BaseNode {
    compile(compiler, connections, nodes, globalSettings) {
        // Output node logic
        // Usually .out(o0)
        const target = this.node.data.currentValue?.target ?? 0;
        return `.out(o${target})`;
    }
}
