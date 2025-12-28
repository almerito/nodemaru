export class Connection {
    constructor(id, sourceNodeId, sourcePortType, targetNodeId, targetPortType, editor) {
        this.id = id;
        this.sourceNodeId = sourceNodeId;
        this.sourcePortType = sourcePortType;
        this.targetNodeId = targetNodeId;
        this.targetPortType = targetPortType;
        this.editor = editor;

        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.element.classList.add('connection-line');
        this.element.dataset.id = id;

        // Click to delete/select
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            // Maybe select? For now simple delete on right click or select then delete
            this.editor.selectConnection(this);
        });
    }

    update() {
        const sourceNode = this.editor.nodes.get(this.sourceNodeId);
        const targetNode = this.editor.nodes.get(this.targetNodeId);

        if (!sourceNode || !targetNode) return;

        const sourceEl = sourceNode.getPortElement(this.sourcePortType);
        const targetEl = targetNode.getPortElement(this.targetPortType);

        if (!sourceEl || !targetEl) return;

        const p1 = this.getPortCenter(sourceEl);
        const p2 = this.getPortCenter(targetEl);

        // Bezier Curve Logic
        // Depending on port direction, we adjust control points
        // Input/Output are Left/Right. Param are Top/Bottom.

        let c1 = { ...p1 };
        let c2 = { ...p2 };
        const curvature = 50;

        // Source Output (Reference: node.js createPort classes)
        // output: Right, param-out: Bottom
        if (this.sourcePortType === 'output') {
            c1.x += curvature;
        } else if (this.sourcePortType === 'param-out') {
            c1.y += curvature;
        }

        // Target Input
        // input: Left, param-in: Top
        if (this.targetPortType === 'input') {
            c2.x -= curvature;
        } else if (this.targetPortType === 'param-in') {
            c2.y -= curvature;
        }

        const d = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
        this.element.setAttribute('d', d);
    }

    getPortCenter(el) {
        // Get Screen bounds
        const rect = el.getBoundingClientRect();
        const containerRect = this.editor.canvas.getBoundingClientRect();

        let x = rect.left - containerRect.left + rect.width / 2;
        let y = rect.top - containerRect.top + rect.height / 2;

        const scale = this.editor.transform.k;

        return {
            x: x / scale,
            y: y / scale
        };
    }
}
