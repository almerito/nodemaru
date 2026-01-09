import { SlotShape } from 'nodegraph-js';
import { createNodeInstance } from './system_nodes/BaseNodeFactory.js';

// Parameter type options
export const PARAM_TYPE_OPTIONS = [
    { value: 'constant', label: 'Constant' },
    { value: 'array', label: 'Array' },
    { value: 'lfo', label: 'LFO' },
    { value: 'midi_data', label: 'MIDI Data' },
    { value: 'audio_data', label: 'Audio Data' },
    { value: 'data_math', label: 'Data Math' }
];

// Export SlotShape for use in other modules
export { SlotShape };

// Helper to map string shape to SlotShape constant
function getSlotShape(shapeName) {
    if (!shapeName) return null;
    switch (shapeName.toLowerCase()) {
        case 'circle': return SlotShape.CIRCLE;
        case 'square': return SlotShape.SQUARE;
        case 'diamond': return SlotShape.DIAMOND; // Assuming DIAMOND exists, if not fallback or check library
        case 'arrow': return SlotShape.ARROW;
        default: return null;
    }
}

// Helper to resolve CSS variable to hex/rgb
function resolveThemeColor(colorString) {
    if (!colorString) return colorString;
    if (colorString.startsWith('var(--')) {
        const varName = colorString.match(/var\(([^)]+)\)/)[1];
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue(varName).trim();
    }
    return colorString;
}

// Node counter for progressive numbering
let nodeCounter = 0;

/**
 * Sets the global node counter to a specific value.
 * Useful for initialization from saved states.
 * @param {Number} count 
 */
export function setNodeCounter(count) {
    nodeCounter = count;
}

export function getNextNodeIndex() {
    nodeCounter++;
    return nodeCounter;
}

/**
 * createShaderNode
 * Creates a shader node using the NodeGraph API
 * @param {NodeGraph} graph - The NodeGraph instance
 * @param {Object} shaderData - The shader data object
 * @param {String} nodeColor - Background color for the node header
 * @param {Object} initialPosition - Initial x,y position
 * @param {Number} existingIndex - Optional existing visual index (for reload)
 * @returns {Node|null} The created node object or null on error
 */
export function createShaderNode(graph, shaderData, nodeColor, initialPosition, existingId = null, existingIndex = null) {
    if (!graph) {
        console.error('Graph not provided');
        return null;
    }

    let nodeId = existingId;
    let visualIndex = existingIndex;

    // Generate new Index if not provided
    if (visualIndex === null) {
        nodeCounter++;
        visualIndex = nodeCounter;
    } else {
        // Ensure counter catches up if loading a higher index
        if (visualIndex > nodeCounter) {
            nodeCounter = visualIndex;
        }
    }

    let initialCurrentValue = {};

    // Generate ID if not provided (UUID-like)
    if (!nodeId) {
        nodeId = crypto.randomUUID();
    }

    // Build inputs array
    const inputs = [];

    // Parse options if string (should be object from API but just in case)
    let options = shaderData.options || {};
    if (typeof options === 'string') {
        try { options = JSON.parse(options); } catch (e) { }
    }

    // Determine shapes
    const nodeShape = getSlotShape(options.nodeShape) || SlotShape.CIRCLE;
    const paramShape = getSlotShape(options.paramShape) || SlotShape.SQUARE;
    // console.log(nodeShape, paramShape)

    // Main shader input (left side)
    if (shaderData.has_input) {
        inputs.push({
            id: 'in',
            label: null,
            side: 'left',
            shape: nodeShape,
            size: 16,
            color: resolveThemeColor(options.nodeColor) || resolveThemeColor('var(--ng-slot-color)') || '#667eea',
            edge: true,
            group: options.nodeGroup ?? 'nodes' // Horizontal slot group for main node connections
        });
    }

    // Parameter input (top side)
    if (shaderData.has_param_input) {
        inputs.push({
            id: 'param_in',
            label: null,
            side: 'top',
            shape: paramShape,
            size: 14,
            color: resolveThemeColor(options.paramColor) || resolveThemeColor('var(--ng-slot-param-color)') || '#ffd900',
            edge: true,
            group: options.paramGroup ?? 'params' // Vertical slot group for parameter connections
        });
    }

    // Build outputs array
    const outputs = [];

    // Main shader output (right side)
    if (shaderData.has_output) {
        outputs.push({
            id: 'out',
            label: null,
            side: 'right',
            shape: nodeShape,
            size: 16,
            color: resolveThemeColor(options.nodeColor) || resolveThemeColor('var(--ng-slot-color)') || '#667eea',
            edge: true,
            group: options.nodeGroup ?? 'nodes' // Horizontal slot group for main node connections
        });
    }

    // Parameter output (bottom side)
    if (shaderData.has_param_output) {
        outputs.push({
            id: 'param_out',
            label: null,
            side: 'bottom',
            shape: paramShape,
            size: 14,
            color: resolveThemeColor(options.paramColor) || resolveThemeColor('var(--ng-slot-param-color)') || '#ffd900',
            edge: true,
            group: options.paramGroup ?? 'params' // Vertical slot group for parameter connections
        });
    }

    // Use provided color or find one in options, or fallback
    const finalNodeColor = nodeColor || resolveThemeColor(options.nodeColor) || '#4caf50';

    try {
        // Create the node
        const node = graph.addNode({
            id: nodeId,
            position: initialPosition || { x: 200, y: 200 },
            resizable: false,
            header: {
                content: `<strong>#${visualIndex} - ${shaderData.label}</strong>`,
                style: {
                    background: finalNodeColor,
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '14px'
                }
            },
            body: {
                content: '',
                style: {
                    minWidth: '200px',
                    minHeight: '80px',
                }
            },
            data: {
                shaderData: shaderData,
                nodeIndex: visualIndex,
                nodeColor: finalNodeColor,
                paramState: {}, // Stores parameter values/types
                currentValue: initialCurrentValue, // Stores runtime values
            },
            inputs,
            outputs
        });

        node.nodeIndex = visualIndex;
        node._nodeColor = finalNodeColor;
        node._paramState = {};
        node.currentValue = initialCurrentValue;

        return node;
    } catch (e) {
        console.error("Error creating node with ID", nodeId, e);
        return null;
    }
}

/**
 * matchesAcceptRule
 * Helper to check if source shader matches accept rules
 * @param {Object} sourceShader - Source shader data
 * @param {String|Array|Object} acceptRule - Acceptance rule
 * @returns {Boolean}
 */
export function matchesAcceptRule(sourceShader, acceptRule) {
    if (!sourceShader) return false;

    // If acceptRule is a string, match by name, subcategory, or category
    if (typeof acceptRule === 'string') {
        return sourceShader.name === acceptRule ||
            sourceShader.subcategory_name === acceptRule ||
            sourceShader.category_name === acceptRule;
    }

    // If acceptRule is an array, check if any rule matches
    if (Array.isArray(acceptRule)) {
        return acceptRule.some(rule => matchesAcceptRule(sourceShader, rule));
    }

    // If acceptRule is an object with specific fields
    if (typeof acceptRule === 'object' && acceptRule !== null) {
        if (acceptRule.name && sourceShader.name !== acceptRule.name) return false;
        if (acceptRule.category && sourceShader.category_name !== acceptRule.category) return false;
        if (acceptRule.subcategory && sourceShader.subcategory_name !== acceptRule.subcategory) return false;
        return true;
    }

    // No rule or invalid rule = accept all
    return true;
}

/**
 * findMatchingNodes
 * Find nodes in canvas matching a type/category
 * @param {NodeGraph} graph - The graph instance
 * @param {String} type - The type or category to match
 * @returns {Array} Array of matching nodes
 */
export function findMatchingNodes(graph, type) {
    if (!graph) return [];

    const matchingNodes = [];

    // Iterate over all nodes in the graph
    graph.nodes.forEach(node => {
        const shaderData = node.data?.shaderData;
        if (!shaderData) return;
        const categoryName = shaderData.category_name || '';
        const subcategoryName = shaderData.subcategory_name || '';
        const shaderName = shaderData.name || '';

        // Match by category, subcategory, or name
        if (categoryName.toLowerCase() === type.toLowerCase() ||
            subcategoryName.toLowerCase() === type.toLowerCase() ||
            shaderName.toLowerCase() === type.toLowerCase() ||
            (type === 'array' && (categoryName.toLowerCase().includes('array') || subcategoryName.toLowerCase().includes('array'))) ||
            (type === 'lfo' && categoryName.toLowerCase().includes('lfo')) ||
            (type === 'midi_data' && categoryName.toLowerCase().includes('midi')) ||
            (type === 'audio_data' && categoryName.toLowerCase().includes('audio')) ||
            (type === 'data_math' && shaderData.classname === 'DataMathNode')) {
            matchingNodes.push(node);
        }
    });

    return matchingNodes;
}
