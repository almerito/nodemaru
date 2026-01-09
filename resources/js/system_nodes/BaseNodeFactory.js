import ArrayNode from './ArrayNode.js';
import LfoNode from './LfoNode.js';
import InitNode from './InitNode.js';
import ShaderNode from './ShaderNode.js';
import OutNode from './OutNode.js';
import RenderNode from './RenderNode.js';
import AudioNode from './AudioNode.js';
import MidiNode from './MidiNode.js';
import AudioDataNode from './AudioDataNode.js';
import MidiDataNode from './MidiDataNode.js';
import DataMathNode from './DataMathNode.js';

const registry = {
    'ArrayNode': ArrayNode,
    'LfoNode': LfoNode,
    'InitNode': InitNode,
    'ShaderNode': ShaderNode,
    'OutNode': OutNode,
    'RenderNode': RenderNode,
    'AudioNode': AudioNode,
    'MidiNode': MidiNode,
    'AudioDataNode': AudioDataNode,
    'MidiDataNode': MidiDataNode,
    'DataMathNode': DataMathNode,
};

export function createNodeInstance(classname, node) {
    const ClassRef = registry[classname];
    if (ClassRef) {
        return new ClassRef(node);
    }
    console.warn(`BaseNode class ${classname} not found.`);
    return null;
}
