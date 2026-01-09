import BaseNode from './BaseNode.js';

export default class ArrayNode extends BaseNode {
    constructor(node) {
        super(node);
        // Ensure values array exists
        if (!this.node.data.currentValue) this.node.data.currentValue = {};
        if (!Array.isArray(this.node.data.currentValue.values)) {
            this.node.data.currentValue.values = [0.1, 0.2]; // Default
        }
    }

    renderInspector(container, renderParamFn) {
        const saveState = () => {
            if (window.persistenceManager) {
                window.persistenceManager.saveToLocalStorage();
            }
        };

        // 1. Array Values List UI
        const listWrapper = document.createElement('div');
        listWrapper.className = 'mb-3';

        const valuesLabel = document.createElement('label');
        valuesLabel.className = 'text-center w-100 d-block fw-bold text-muted small mb-2';
        valuesLabel.innerText = 'ARRAY VALUES';
        listWrapper.appendChild(valuesLabel);

        const listContainer = document.createElement('div');
        listContainer.className = 'd-flex flex-column gap-2 mb-2';

        const renderItems = () => {
            listContainer.innerHTML = '';
            this.node.data.currentValue.values.forEach((val, index) => {
                const itemRow = document.createElement('div');
                itemRow.className = 'd-flex gap-2 align-items-center';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control form-control-sm bg-dark text-white border-secondary';
                input.value = val;
                input.onchange = (e) => {
                    this.node.data.currentValue.values[index] = e.target.value;
                    saveState();
                };

                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn btn-danger btn-sm p-0 px-2 fw-bold btn-remove';
                removeBtn.innerText = 'X';
                removeBtn.onclick = () => {
                    this.node.data.currentValue.values.splice(index, 1);
                    renderItems();
                    saveState();
                };

                itemRow.appendChild(input);
                itemRow.appendChild(removeBtn);
                listContainer.appendChild(itemRow);
            });
        };

        renderItems();
        listWrapper.appendChild(listContainer);

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-success btn-sm w-100 fw-bold';
        addBtn.innerText = '+ Add Value';
        addBtn.onclick = () => {
            this.node.data.currentValue.values.push('0.5');
            renderItems();
            saveState();
        };
        listWrapper.appendChild(addBtn);
        container.appendChild(listWrapper);

        // 2. Render Standard Params (Fit, Offset, etc.)
        super.renderInspector(container, renderParamFn);
    }

    compile(compiler, connections, nodes, globalSettings) {
        const vals = this.node.data?.currentValue?.values || [0];
        let valString = `[${vals.join(', ')}]`;

        // Add array methods params
        const params = this.node.data?.shaderData?.params || {};

        Object.keys(params).forEach(key => {
            const val = this.getParamVal(key);

            if (val !== undefined && val !== null && val !== '') {
                if (params[key].type === 'select') {
                    valString += `.${key}('${val}')`;
                } else {
                    let v = val;
                    if (typeof v === 'object' && v.value !== undefined) v = v.value;
                    valString += `.${key}(${v})`;
                }
            }
        });

        // Math Chain Logic
        const mathChain = compiler._getMathChain(this.node.id, connections, nodes);

        let stateVars = '';
        let chainCode = `
            const idx = Math.floor(time * speed * 4) % arr.length;
            let val = arr[idx >= 0 ? idx : 0];
        `;

        mathChain.forEach((filterNode, idx) => {
            if (filterNode.type === 'smooth') {
                stateVars += `var _state_${this.getVarName(compiler)}_${idx} = { history: [] };\n`;
            }
            chainCode += compiler._getMathChainCode(filterNode, this.node.id, idx, nodes);
        });

        // Return direct assignment for Hydra to handle (e.g. window.arr = [1,2].ease())
        return `window.${this.getVarName(compiler)} = ${valString};\n`;
    }
}
