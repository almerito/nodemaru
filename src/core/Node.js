export class BaseNode {
    constructor(id, type, config, editor) {
        this.id = id;
        this.type = type;
        this.name = config.name || type;
        this.editor = editor;
        this.inputs = [];
        this.outputs = [];
        this.position = { x: 100, y: 100 };
        this.params = config.params || {};
        this.currentValue = null; // Stored value for parameters

        // Config can specify ports
        this.config = config;

        this.element = this.createDOM();
        this.updatePosition();
    }

    createDOM() {
        const el = document.createElement('div');
        el.classList.add('node');
        el.dataset.id = this.id;
        el.style.position = 'absolute';

        // Apply Category Color
        const CATEGORY_COLORS = {
            'source': '#00151dff',
            'ext_source': '#003447ff',
            'geometry': '#004211ff',
            'color': '#6e2562ff',
            'blend': '#3f285eff',
            'modulate': '#382127ff',
            'data': '#4e0707ff',
            'data_math': '#691e0cff',
            'output': '#15164bff'
        };

        const bgColor = CATEGORY_COLORS[this.config.category] || '#2a2a2a';
        el.style.backgroundColor = bgColor;
        el.style.borderColor = '#555';

        // Extract node number from id (e.g., "node_4" -> "4")
        const nodeNumber = this.id.split('_')[1] || '';

        const header = document.createElement('div');
        header.classList.add('node-header');
        // Show friendly name with number (e.g., "MIDI Data #4")
        header.innerText = nodeNumber ? `${this.name} #${nodeNumber}` : this.name;
        el.appendChild(header);

        // Error Icon
        this.errorIcon = document.createElement('div');
        this.errorIcon.classList.add('node-error-icon');
        this.errorIcon.innerText = 'X';
        el.appendChild(this.errorIcon);

        const body = document.createElement('div');
        body.classList.add('node-body');
        el.appendChild(body);

        // Custom Node Visualization (Array, LFO, MIDI, Audio) - for live value display only
        if (this.type === 'array' || this.type === 'lfo' || this.type === 'midi' || this.type === 'audio' || this.type === 'audio_data' || this.type === 'midi_data') {
            // Create empty label for live value updates (no initial text)
            const label = document.createElement('div');
            label.classList.add('node-data-label');
            body.appendChild(label);

            // Store reference for live value updates
            this.valueLabel = label;
        }

        // Setup Ports
        this.setupPorts(el);

        // Events
        this.setupEvents(el, header);

        return el;
    }

    setupPorts(el) {
        // Left - Input (SourceMain)
        if (this.config.hasInput) {
            const p = this.createPort('input', 'input');
            el.appendChild(p);
            this.inputs.push({ name: 'main', type: 'source', el: p });
        }

        // Right - Output (SourceMain)
        if (this.config.hasOutput) {
            const p = this.createPort('output', 'output');
            el.appendChild(p);
            this.outputs.push({ name: 'main', type: 'source', el: p });
        }

        // Top Port: Parameter Input (only for Blend/Modulate nodes)
        if (this.config.hasParamInput) {
            const top = this.createPort('param-in', 'param-in');
            el.appendChild(top);
            this.inputs.push({ name: 'param', type: 'param', el: top });
        }

        // Bottom Port: Parameter Output (for Source nodes, as modulation source)
        if (this.config.hasParamOutput) {
            const bottom = this.createPort('param-out', 'param-out');
            el.appendChild(bottom);
            this.outputs.push({ name: 'param', type: 'param', el: bottom });
        }
    }

    createPort(className, type) {
        const p = document.createElement('div');
        p.classList.add('port', `port-${className}`);
        p.dataset.type = type;
        p.dataset.nodeId = this.id;

        // Drag start listener for connections
        p.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            // Tell editor to start connecting
            this.editor.startConnection(this.id, type, p, e);
        });

        return p;
    }

    setupEvents(el, header) {
        // Dragging Node - now works from entire node area
        el.addEventListener('mousedown', (e) => {
            // Don't start drag if clicking on a port
            if (e.target.classList.contains('port')) return;

            e.stopPropagation();
            this.editor.startDraggingNode(this, e);
        });

        // Click to Select (handled by mousedown above, but keep for double-click etc.)
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editor.selectNode(this);
        });
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.editor.updateConnectionsForNode(this.id);
    }

    getPortElement(type) {
        // Helper to find specific port element by type
        // type: 'input', 'output', 'param-in', 'param-out'
        if (type === 'input') return this.element.querySelector('.port-input');
        if (type === 'output') return this.element.querySelector('.port-output');
        if (type === 'param-in') return this.element.querySelector('.port-param-in');
        if (type === 'param-out') return this.element.querySelector('.port-param-out');
        return null;
    }

    setError(message) {
        this.errorMessage = message; // Store for drawer
        if (this.errorIcon) {
            this.errorIcon.style.display = 'block';
            this.errorIcon.title = message;
        }
    }

    clearError() {
        this.errorMessage = null;
        if (this.errorIcon) {
            this.errorIcon.style.display = 'none';
            this.errorIcon.title = '';
        }
    }
}
