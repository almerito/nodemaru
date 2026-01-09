import BaseNode from './BaseNode.js';

export default class MidiNode extends BaseNode {
    async renderInspector(container, renderParamFn) {
        const saveState = () => {
            if (window.persistenceManager) {
                window.persistenceManager.saveToLocalStorage();
            }
        };

        const wrapper = document.createElement('div');
        wrapper.className = 'p-2';

        // 1. MIDI Input Port Selection
        const portGroup = document.createElement('div');
        portGroup.className = 'mb-3';

        const portLabel = document.createElement('label');
        portLabel.className = 'form-label small text-muted mb-1';
        portLabel.innerHTML = 'Port <span class="param-hint" title="MIDI Input Device">ℹ️</span>';
        portGroup.appendChild(portLabel);

        const portSelect = document.createElement('select');
        portSelect.className = 'form-select form-select-sm bg-dark text-white border-secondary mb-2';
        portSelect.disabled = true;
        portSelect.innerHTML = '<option>Loading devices...</option>';

        const btnRefresh = document.createElement('button');
        btnRefresh.className = 'btn btn-sm btn-outline-secondary w-100 mb-2';
        btnRefresh.innerText = 'Refresh Devices';

        const loadMidiDevices = async () => {
            try {
                if (!navigator.requestMIDIAccess) {
                    portSelect.innerHTML = '<option>MIDI not supported</option>';
                    return;
                }

                const midiAccess = await navigator.requestMIDIAccess();
                const inputs = Array.from(midiAccess.inputs.values());

                portSelect.innerHTML = '';
                if (inputs.length === 0) {
                    const opt = document.createElement('option');
                    opt.innerText = 'No MIDI devices found';
                    portSelect.appendChild(opt);
                    return;
                }

                const currentSource = this.node.data.paramState['port']?.value ||
                    this.node.data.currentValue?.portId ||
                    this.node.data.portId;

                inputs.forEach(input => {
                    const opt = document.createElement('option');
                    opt.value = input.id;
                    opt.innerText = input.name || `Device ${input.id}`;
                    if (currentSource === input.id) opt.selected = true;
                    portSelect.appendChild(opt);
                });
                portSelect.disabled = false;

                // Default to first if not set
                if (!currentSource && inputs.length > 0) {
                    updateSource(inputs[0].id);
                }

            } catch (e) {
                console.error('MIDI Access Error:', e);
                portSelect.innerHTML = '<option>Access Denied/Error</option>';
            }
        };

        const updateSource = (id) => {
            if (!this.node.data.paramState['port']) this.node.data.paramState['port'] = {};
            this.node.data.paramState['port'].value = id;
            this.node.data.portId = id;
            if (!this.node.data.currentValue) this.node.data.currentValue = {};
            this.node.data.currentValue.portId = id;

            // Sync Clock
            if (this.node.data.currentValue?.syncClock && window._midiClockState) {
                window._midiClockState.activePortId = id;
            }
            saveState();
        };

        btnRefresh.onclick = async () => await loadMidiDevices();
        portSelect.addEventListener('change', () => updateSource(portSelect.value));

        portGroup.appendChild(portSelect);
        portGroup.appendChild(btnRefresh);
        wrapper.appendChild(portGroup);

        // 2. MIDI Clock Sync
        const clockGroup = document.createElement('div');
        clockGroup.className = 'form-check form-switch mb-3';
        const clockInput = document.createElement('input');
        clockInput.className = 'form-check-input';
        clockInput.type = 'checkbox';
        clockInput.id = `midi_clock_${this.node.id}`;
        clockInput.checked = this.node.data.currentValue?.syncClock || false;
        const clockLabel = document.createElement('label');
        clockLabel.className = 'form-check-label small text-white';
        clockLabel.htmlFor = `midi_clock_${this.node.id}`;
        clockLabel.innerText = 'Sync MIDI Clock';
        clockInput.addEventListener('change', () => {
            if (!this.node.data.currentValue) this.node.data.currentValue = {};
            this.node.data.currentValue.syncClock = clockInput.checked;
            if (clockInput.checked) {
                if (!window._midiClockState) window._midiClockState = { activePortId: null, bpm: 0 };
                window._midiClockState.activePortId = this.node.data.paramState['port']?.value || this.node.data.portId;
            } else if (window._midiClockState) {
                window._midiClockState.activePortId = null;
            }
            saveState();
        });
        clockGroup.appendChild(clockInput);
        clockGroup.appendChild(clockLabel);
        wrapper.appendChild(clockGroup);

        // 3. Standard Parameters (skip 'port' and 'source')
        const params = this.node.data.shaderData?.params || {};
        const paramsContainer = document.createElement('div');

        if (renderParamFn) {
            for (const [key, param] of Object.entries(params)) {
                if (key === 'source' || key === 'port') continue;
                const paramHtml = renderParamFn(key, param, this.node);
                const div = document.createElement('div');
                div.innerHTML = paramHtml;
                paramsContainer.appendChild(div);
            }
        }
        wrapper.appendChild(paramsContainer);

        // Initial Load
        await loadMidiDevices();

        container.appendChild(wrapper);
    }

    compile(compiler, connections, nodes, globalSettings) {
        // Midi Input Setup
        const portId = this.node.data?.portId || this.node.data?.paramState?.['port']?.value;
        if (portId) {
            return `window._setupMidiListeners(["${portId}"]);\n`;
        }
        return '';
    }
}
