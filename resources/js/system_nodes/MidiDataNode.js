import BaseNode from './BaseNode.js';

export default class MidiDataNode extends BaseNode {
    renderInspector(container, renderParamFn) {
        const saveState = () => {
            if (window.persistenceManager) {
                window.persistenceManager.saveToLocalStorage();
            }
        };

        const wrapper = document.createElement('div');
        wrapper.className = 'p-2';

        // 1. Source Selection (Select a MIDI Node from the graph)
        const sourceGroup = document.createElement('div');
        sourceGroup.className = 'mb-3';

        const sourceLabel = document.createElement('label');
        sourceLabel.className = 'form-label small text-muted mb-1';
        sourceLabel.innerHTML = 'source <span class="param-hint" title="Select a MIDI source node">ℹ️</span>';
        sourceGroup.appendChild(sourceLabel);

        const sourceSelect = document.createElement('select');
        sourceSelect.className = 'form-select form-select-sm bg-dark text-white border-secondary mb-2';

        // Find all MIDI nodes in the graph
        const midiNodes = [];
        if (window.graph && window.graph.nodes) {
            window.graph.nodes.forEach(n => {
                if (n.data?.shaderData?.name === 'midi' && n.id !== this.node.id) {
                    midiNodes.push(n);
                }
            });
        }

        if (midiNodes.length === 0) {
            sourceSelect.innerHTML = '<option value="">No MIDI nodes found</option>';
            sourceSelect.disabled = true;
        } else {
            sourceSelect.innerHTML = '<option value="">Select MIDI Node...</option>';
            const currentSource = this.node.data.paramState['source']?.value ||
                this.node.data.currentValue?.source;

            midiNodes.forEach(midiNode => {
                const opt = document.createElement('option');
                opt.value = midiNode.id;
                const label = midiNode.data?.shaderData?.label || 'MIDI';
                const index = midiNode.nodeIndex || midiNode.data?.nodeIndex || midiNode.id.slice(0, 8);
                opt.innerText = `#${index} - ${label}`;
                if (currentSource === midiNode.id) opt.selected = true;
                sourceSelect.appendChild(opt);
            });
        }

        sourceSelect.addEventListener('change', () => {
            const selectedId = sourceSelect.value;
            if (!this.node.data.paramState['source']) this.node.data.paramState['source'] = {};
            this.node.data.paramState['source'].value = selectedId;
            if (!this.node.data.currentValue) this.node.data.currentValue = {};
            this.node.data.currentValue.source = selectedId;
            saveState();
        });

        sourceGroup.appendChild(sourceSelect);
        wrapper.appendChild(sourceGroup);

        // 2. Standard Parameters with conditional visibility
        const params = this.node.data.shaderData?.params || {};
        const paramsContainer = document.createElement('div');

        let trackSelect = null;
        let ccContainer = null;
        let programContainer = null;

        if (renderParamFn) {
            const sortedKeys = Object.keys(params).sort((a, b) => {
                const orderA = params[a].order !== undefined ? params[a].order : 999;
                const orderB = params[b].order !== undefined ? params[b].order : 999;
                return orderA - orderB;
            });

            for (const key of sortedKeys) {
                if (key === 'source' || key === 'port') continue;
                const param = params[key];
                const paramHtml = renderParamFn(key, param, this.node);
                const div = document.createElement('div');
                div.innerHTML = paramHtml;

                if (key === 'track') {
                    trackSelect = div.querySelector('select');
                } else if (key === 'ccNumber') {
                    ccContainer = div;
                } else if (key === 'programNumber') {
                    programContainer = div;
                }

                paramsContainer.appendChild(div);
            }
        }
        wrapper.appendChild(paramsContainer);

        // 3. Conditional visibility logic
        const updateVisibility = () => {
            if (!trackSelect) return;
            const val = trackSelect.value;
            if (ccContainer) ccContainer.style.display = (val === 'control change') ? 'block' : 'none';
            if (programContainer) programContainer.style.display = (val === 'program change') ? 'block' : 'none';
        };

        if (trackSelect) {
            trackSelect.addEventListener('change', updateVisibility);
            updateVisibility();
        }

        container.appendChild(wrapper);
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
        valueDisplay.className = 'midi-data-value small text-center';
        valueDisplay.textContent = '0.000';
        wrapper.appendChild(valueDisplay);

        // Track min/max over time (using object for closure reference)
        const rangeState = { min: 0, max: 0 };

        // Range display with reset button
        const rangeRow = document.createElement('div');
        rangeRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 4px;';

        const rangeDisplay = document.createElement('span');
        rangeDisplay.className = 'midi-data-range small';
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
                // We do this inside the loop to ensure we get the correct nodeIndex if it's set after render
                const shaderName = (this.node.data?.shaderData?.name || 'midi_data').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '');
                const nodeIndex = this.node.data?.nodeIndex;
                const varName = nodeIndex !== undefined ? `${shaderName}_${nodeIndex}` : `var_${this.node.id.replace(/-/g, '_')}`;

                const getter = window[varName];
                if (typeof getter === 'function') {
                    const val = getter();
                    if (typeof val === 'number' && !isNaN(val)) {
                        valueDisplay.textContent = val.toFixed(3);
                        // Color based on value (0-1 range assumed)
                        const hue = Math.max(0, Math.min(120, val * 120));
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

            if (wrapper.isConnected) {
                requestAnimationFrame(updateValue);
            }
        };

        updateValue();
    }

    compile(compiler, connections, nodes, globalSettings) {
        let portId = '';
        const sourceNodeId = this.getParamVal('source');
        if (sourceNodeId && nodes.has(sourceNodeId)) {
            const sourceNode = nodes.get(sourceNodeId);
            portId = sourceNode.data?.portId || sourceNode.data?.paramState?.['port']?.value || '';
        }

        const channel = this.getParamVal('channel', 'all');
        const channelKey = channel === 'all' ? 'all' : parseInt(channel) - 1;
        const track = this.getParamVal('track', 'note number');
        const ccNumber = this.getParamVal('ccNumber', 1);
        const transposeArr = this.getParamVal('transpose', [0, 1]);
        const minOut = Array.isArray(transposeArr) ? transposeArr[0] : 0;
        const maxOut = Array.isArray(transposeArr) ? transposeArr[1] : 1;

        let rawValueCode = 'state.noteNumber';
        let minRaw = 0, maxRaw = 127;

        if (track === 'note number') rawValueCode = 'state.noteNumber';
        else if (track === 'note velocity') rawValueCode = 'state.velocity';
        else if (track === 'aftertouch') rawValueCode = 'state.aftertouch';
        else if (track === 'pitch bend') { rawValueCode = 'state.pitchBend'; minRaw = 0; maxRaw = 16383; }
        else if (track === 'control change') rawValueCode = `state.cc[${ccNumber}]`;
        else if (track === 'program change') rawValueCode = 'state.program';

        const funcBody = `
            const portState = window._midiState?.['${portId}'];
            const state = portState?.['${channelKey}'] || { noteNumber: 0, velocity: 0, aftertouch: 0, pitchBend: 8192, cc: [], program: 0 };
            const raw = ${rawValueCode} ?? 0;
            const normalized = (raw - ${minRaw}) / (${maxRaw} - ${minRaw});
            let val = ${minOut} + normalized * (${maxOut} - ${minOut});
        `;

        const mathChain = compiler._getMathChain(this.node.id, connections, nodes);
        let stateVars = '';
        let chainCode = '';

        mathChain.forEach((filterNode, idx) => {
            if (filterNode.type === 'smooth') {
                stateVars += `var _state_${this.getVarName(compiler)}_${idx} = { history: [] };\n`;
            }
            chainCode += compiler._getMathChainCode(filterNode, this.node.id, idx, nodes);
        });

        return `${stateVars}window.${this.getVarName(compiler)} = () => { ${funcBody}\n${chainCode}\nreturn val; }\n`;
    }
}
