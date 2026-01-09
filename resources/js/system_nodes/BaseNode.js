/**
 * BaseNode.js
 * Abstract base class for all nodes (System, Shader, IO, etc.)
 */
export default class BaseNode {
    constructor(node) {
        this.node = node;

        // Ensure data structure
        if (!this.node.data) this.node.data = {};
        if (!this.node.data.paramState) this.node.data.paramState = {};
    }

    /**
     * Renders the UI inspector for this node (sidebar).
     * @param {HTMLElement} container - The container element (sidebar)
     * @param {Function} renderParamFn - Helper from editor.js to render standard params
     */
    renderInspector(container, renderParamFn) {
        // Default implementation: render standard params found in shaderData
        const params = this.node.data.shaderData?.params || {};

        if (Object.keys(params).length > 0) {
            // Sort by order
            const sortedKeys = Object.keys(params).sort((a, b) => {
                const orderA = params[a].order !== undefined ? params[a].order : 999;
                const orderB = params[b].order !== undefined ? params[b].order : 999;
                return orderA - orderB;
            });

            const paramsContainer = document.createElement('div');
            //paramsContainer.className = 'mt-3 pt-2 border-top border-secondary';
            paramsContainer.className = 'mt-3 pt-2';

            for (const key of sortedKeys) {
                const param = params[key];
                const paramHtml = renderParamFn(key, param, this.node);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = paramHtml;
                paramsContainer.appendChild(wrapper);
            }
            container.appendChild(paramsContainer);
        }
    }

    /**
     * Optional: Render custom UI inside the node body in the graph
     * @param {HTMLElement} container - The node body container
     */
    renderNodeBody(container) {
        // Default: do nothing
    }

    /**
     * Compile this node into Hydra JS code.
     * @param {HydraCompiler} compiler - Instance of the compiler
     * @param {ArrayMap} connections - Graph connections
     * @param {Map} nodes - All nodes
     * @param {Object} globalSettings - Global settings
     * @returns {String} The generated code (e.g. window.var_X = ...)
     */
    compile(compiler, connections, nodes, globalSettings) {
        throw new Error(`BaseNode subclass ${this.constructor.name} must implement compile()`);
    }

    /**
     * Helper to get parameter value effectively
     */
    getParamVal(key, defaultVal = undefined) {
        const paramState = this.node.data.paramState || {};
        const currentValue = this.node.data.currentValue || {};
        const params = this.node.data.shaderData?.params || this.node.params || {};

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

    /**
     * Helper to get variable name from compiler
     */
    getVarName(compiler) {
        return compiler._getVarName(this.node.id);
    }
}
