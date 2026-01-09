import BaseNode from './BaseNode.js';

export default class LfoNode extends BaseNode {

    /**
     * Render the node body with a live value display
     */
    renderNodeBody(container) {
        // Create value display label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'lfo-value-label text-center text-white small py-1';
        valueLabel.style.fontFamily = 'monospace';
        valueLabel.style.fontSize = '11px';
        valueLabel.innerText = '—';
        container.appendChild(valueLabel);

        // Store reference for live updates
        // Store in node.data for persistence across references
        if (!this.node.data) this.node.data = {};
        this.node.data.valueLabel = valueLabel;
    }

    // LFO relies on standard inspector, no custom UI body needed usually

    compile(compiler, connections, nodes, globalSettings) {
        const freq = this.getParamVal('frequency', 1);
        const measure = this.getParamVal('measure', 'hz');
        const rangeArr = this.getParamVal('range', [-1, 1]);
        const min = Array.isArray(rangeArr) ? rangeArr[0] : -1;
        const max = Array.isArray(rangeArr) ? rangeArr[1] : 1;
        const curve = this.getParamVal('curve', 'sine');
        const width = this.getParamVal('pulse_width', 0.5);

        // Phase calculation
        let phaseCalc = '';
        if (measure === 'hz') phaseCalc = `time * ${freq}`;
        else if (measure === 'seconds') phaseCalc = `time / ${freq}`;
        else if (measure === 'frames') phaseCalc = `time * (bpm / 60) * ${freq}`;
        else if (measure === 'beats') phaseCalc = `time * (bpm / 60) / ${freq}`;

        // Waveform
        let waveFunc = '';
        if (curve === 'sine') waveFunc = `Math.sin(${phaseCalc} * Math.PI * 2)`;
        else if (curve === 'square') waveFunc = `(Math.sin(${phaseCalc} * Math.PI * 2) > 0 ? 1 : -1)`;
        else if (curve === 'sawtooth') waveFunc = `(2 * ((${phaseCalc}) - Math.floor(${phaseCalc} + 0.5)))`;
        else if (curve === 'triangle') waveFunc = `(2 * Math.abs(2 * ((${phaseCalc}) - Math.floor(${phaseCalc} + 0.5))) - 1)`;
        else if (curve === 'pulse') waveFunc = `((Math.sin(${phaseCalc} * Math.PI * 2) > Math.cos(${width} * Math.PI)) ? 1 : -1)`;
        else if (curve === 's&h') waveFunc = `(function(t) { const i = Math.floor(t); const h = Math.sin(i) * 43758.5453; return (h - Math.floor(h)) * 2 - 1; })(${phaseCalc})`;
        else if (curve === 'random') waveFunc = `(function(t) { const i = Math.floor(t); const f = t - i; let h = Math.sin(i) * 43758.5453; let r1 = h - Math.floor(h); h = Math.sin(i + 1) * 43758.5453; let r2 = h - Math.floor(h); const u = f * f * (3 - 2 * f); return (r1 + (r2 - r1) * u) * 2 - 1; })(${phaseCalc})`;
        else if (curve === 'sync') waveFunc = `(function(t) { const beatPos = t - Math.floor(t); return beatPos * 2 - 1; })(${phaseCalc})`;

        const funcBody = `
            const wave = ${waveFunc};
            const norm = (wave + 1) / 2;
            let val = ${min} + norm * (${max} - ${min});
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
