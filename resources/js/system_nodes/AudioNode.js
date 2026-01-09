import BaseNode from './BaseNode.js';

export default class AudioNode extends BaseNode {
    compile(compiler, connections, nodes, globalSettings) {
        // Audio Setup Logic
        // This logic is usually run in a setup phase, not inline with the chain.
        // HydraCompiler._compileAudioSetup is the source.

        // We need to return code that initializes the audio source.
        // E.g. _setupMicrophoneAnalyzer(...) or _setupFileAnalyzer(...)

        // However, HydraCompiler gathers ALL audio nodes and generates a block at the top.
        // If we move to individual compile(), we assume the compiler iterates these nodes in a "Phase".

        // Porting logic:
        const data = this.node.data || {};
        const source = data.source || 'microphone';
        const type = data.type || (source === 'microphone' ? 'device' : 'file');

        if (type === 'device' || source === 'microphone') {
            const deviceId = data.deviceId || data.currentValue?.deviceId || 'default';
            return `await window._setupMicrophoneAnalyzer("${deviceId}");\n`;
        } else if (type === 'file' || source === 'file') {
            // Check multiple locations for src URL (data.src, currentValue.src, paramState.src)
            const srcUrl = data.src || data.currentValue?.src || data.paramState?.src?.value || '';
            return `await window._setupFileAnalyzer("${this.node.id}", "${srcUrl}");\n`;
        }
        return '';
    }

    renderInspector(container, renderParamFn) {
        const saveState = () => {
            if (window.persistenceManager) {
                window.persistenceManager.saveToLocalStorage();
            }
        };

        const wrapper = document.createElement('div');
        wrapper.className = 'p-2';

        // 1. Source Type Selection
        const typeGroup = document.createElement('div');
        typeGroup.className = 'mb-3';

        const typeLabel = document.createElement('label');
        typeLabel.className = 'form-label small text-muted mb-1';
        typeLabel.innerText = 'Audio Source';
        typeGroup.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        typeSelect.className = 'form-select form-select-sm bg-dark text-white border-secondary';

        ['microphone', 'file'].forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerText = t.charAt(0).toUpperCase() + t.slice(1);
            if ((this.node.data.source || 'microphone') === t) opt.selected = true;
            typeSelect.appendChild(opt);
        });

        typeGroup.appendChild(typeSelect);
        wrapper.appendChild(typeGroup);

        // Ensure validation runs on inspector open (handles page reload state)
        setTimeout(() => this.validateNode(), 0);

        // 2. Config Container
        const configContainer = document.createElement('div');
        wrapper.appendChild(configContainer);

        const renderConfig = () => {
            configContainer.innerHTML = '';
            const source = this.node.data.source || 'microphone';

            if (source === 'file') {
                this.renderFileUI(configContainer, saveState);
            } else {
                this.renderDeviceUI(configContainer, saveState);
            }

            this.validateNode();
        };

        // Run validation and re-render to reflect liveness
        // This ensures "Missing" status appears if blob expired
        this.verifyFileState().then(() => renderConfig());

        typeSelect.onchange = () => {
            this.node.data.source = typeSelect.value;
            // Reset type specific data to avoid stale state? 
            // Better keep it.
            if (this.node.data.source === 'file') {
                this.node.data.type = 'file';
            } else {
                this.node.data.type = 'device';
            }
            saveState();
            renderConfig();
        };

        renderConfig();
        container.appendChild(wrapper);

        // Render standard params (smoothing, bins etc) but filtering out source/type/deviceId which we handle manually
        const ignoredParams = ['source', 'type', 'deviceId', 'src', 'port'];

        // Wrap the renderParamFn to filter
        const filteredRenderParamFn = (paramName, paramDef, container) => {
            if (ignoredParams.includes(paramName)) return '';
            return renderParamFn(paramName, paramDef, container);
        };

        super.renderInspector(container, filteredRenderParamFn);
    }

    renderNodeBody(container) {
        // Hook to verify file state on load/render
        // Use setTimeout to ensure DOM is ready after initial render
        setTimeout(() => this.verifyFileState(), 100);
    }

    async verifyFileState() {
        const source = this.node.data.source || 'microphone';
        const fileName = this.node.data.fileState?.fileName || 'Unknown file';

        if (source === 'file' && this.node.data.src) {
            try {
                // Check if blob is accessible using Audio element (more reliable than fetch for blob URLs)
                const testAudio = new Audio();
                testAudio.src = this.node.data.src;

                await new Promise((resolve, reject) => {
                    testAudio.addEventListener('canplaythrough', resolve, { once: true });
                    testAudio.addEventListener('error', reject, { once: true });
                    testAudio.load();
                    // Timeout after 3 seconds
                    setTimeout(() => reject(new Error('Timeout')), 3000);
                });
                // Blob is valid, clear any error state
                this.setNodeErrorState(false);
            } catch (e) {
                // Blob invalid
                this.node.data.src = null; // Clear invalid source
                this.showMissingFileWarning(fileName, 'Audio');
                setTimeout(() => this.setNodeErrorState(true), 50);
            }
        } else if (source === 'file' && !this.node.data.src && this.node.data.fileState?.fileName) {
            // Missing src but has filename (e.g. from previous session)
            this.showMissingFileWarning(fileName, 'Audio');
            setTimeout(() => this.setNodeErrorState(true), 50);
        } else {
            // Not file source or no issues - clear error state
            this.setNodeErrorState(false);
        }
    }

    showMissingFileWarning(fileName, fileType) {
        const msg = `${fileType} file missing: ${fileName}. Please re-select the file.`;
        console.warn(`[AudioNode] ${msg}`);
        if (window.toastr) {
            window.toastr.warning(msg, 'Missing File', { timeOut: 5000, preventDuplicates: true });
        }
    }

    renderFileUI(container, saveCallback) {
        // Init data structure
        if (!this.node.data.fileState) this.node.data.fileState = {};

        const label = document.createElement('label');
        label.className = 'form-label small text-muted mb-1';
        label.innerText = 'Select Audio File';
        container.appendChild(label);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.className = 'form-control form-control-sm bg-dark text-white border-secondary mb-2';
        fileInput.accept = 'audio/*';

        const statusObj = document.createElement('div');
        statusObj.className = 'small text-muted mb-2';

        const updateStatus = () => {
            const { fileName } = this.node.data.fileState;
            const hasSrc = !!this.node.data.src;

            if (fileName && hasSrc) {
                statusObj.innerHTML = `Loaded: <span class="text-success">${fileName}</span>`;
            } else if (fileName) {
                statusObj.innerHTML = `Missing: <span class="text-danger">${fileName}</span>`;
            } else {
                statusObj.innerHTML = '<span class="text-warning">No audio file loaded</span>';
            }
            this.validateNode();
        };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Revoke old if exists
                if (this.node.data.src && this.node.data.src.startsWith('blob:')) {
                    URL.revokeObjectURL(this.node.data.src);
                }

                this.node.data.src = URL.createObjectURL(file);
                this.node.data.fileState.fileName = file.name;
                updateStatus();
                updatePlayerVisibility();
                saveCallback();
            }
        };

        container.appendChild(fileInput);
        container.appendChild(statusObj);

        // Player Controls Container
        const playerContainer = document.createElement('div');
        playerContainer.className = 'audio-player-controls d-flex gap-2 mb-2';
        playerContainer.style.display = 'none'; // Hidden by default

        const btnPlay = document.createElement('button');
        btnPlay.className = 'btn btn-sm btn-outline-success';
        btnPlay.innerHTML = '▶️ Play';

        const btnPause = document.createElement('button');
        btnPause.className = 'btn btn-sm btn-outline-warning';
        btnPause.innerHTML = '⏸️ Pause';

        const btnStop = document.createElement('button');
        btnStop.className = 'btn btn-sm btn-outline-danger';
        btnStop.innerHTML = '⏹️ Stop';

        playerContainer.appendChild(btnPlay);
        playerContainer.appendChild(btnPause);
        playerContainer.appendChild(btnStop);
        container.appendChild(playerContainer);

        const updatePlayerVisibility = () => {
            const hasSrc = !!this.node.data.src;
            playerContainer.style.display = hasSrc ? 'flex' : 'none';
        };

        btnPlay.onclick = () => {
            // Check if analyzer exists, if not, may need to set it up first
            const entry = window._audioAnalyzers?.[this.node.id];
            if (entry && entry.audio) {
                entry.audio.play();
            } else if (this.node.data.src) {
                // Setup analyzer if not exists (manual preview)
                window._setupFileAnalyzer?.(this.node.id, this.node.data.src);
            }
        };

        btnPause.onclick = () => {
            window._toggleAudioPlayback?.(this.node.id, 'pause');
        };

        btnStop.onclick = () => {
            window._toggleAudioPlayback?.(this.node.id, 'stop');
        };

        updateStatus();
        updatePlayerVisibility();
    }

    renderDeviceUI(container, saveCallback) {
        const label = document.createElement('label');
        label.className = 'form-label small text-muted mb-1';
        label.innerText = 'Input Device';
        container.appendChild(label);

        const select = document.createElement('select');
        select.className = 'form-select form-select-sm bg-dark text-white border-secondary mb-2';
        select.innerHTML = '<option>Loading...</option>';

        const loadDevices = async () => {
            try {
                // Request permission first to get labels
                await navigator.mediaDevices.getUserMedia({ audio: true });

                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices.filter(d => d.kind === 'audioinput');

                select.innerHTML = '';
                audioInputs.forEach((d) => {
                    const opt = document.createElement('option');
                    opt.value = d.deviceId;
                    opt.innerText = d.label || `Microphone ${d.deviceId.slice(0, 5)}...`;
                    if (this.node.data.deviceId === d.deviceId) opt.selected = true;
                    select.appendChild(opt);
                });

                if (audioInputs.length === 0) {
                    select.innerHTML = '<option value="">No microphones found</option>';
                }
            } catch (e) {
                console.error(e);
                select.innerHTML = '<option>Permission denied / Error</option>';
            }
        };

        select.onchange = () => {
            this.node.data.deviceId = select.value;
            saveCallback();
        };

        container.appendChild(select);
        loadDevices();
    }

    validateNode() {
        const source = this.node.data.source || 'microphone';
        let isError = false;

        if (source === 'file') {
            if (!this.node.data.src || !this.node.data.fileState?.fileName) {
                isError = true;
            }
        }

        this.setNodeErrorState(isError);
    }

    setNodeErrorState(isError) {
        let nodeEl = this.node.element || document.getElementById(this.node.id);
        if (!nodeEl) {
            const allNodes = document.querySelectorAll('.ng-node');
            for (let i = 0; i < allNodes.length; i++) {
                if (allNodes[i].dataset.id === this.node.id || allNodes[i].id === this.node.id) {
                    nodeEl = allNodes[i];
                    break;
                }
            }
        }
        if (!nodeEl) return;

        const header = nodeEl.querySelector('.ng-node-header');
        if (!header) return;

        const titleEl = header.querySelector('.ng-node-header-content') || header.querySelector('strong');
        if (!titleEl) return;

        if (isError) {
            if (!titleEl.dataset.originalContent) titleEl.dataset.originalContent = titleEl.innerHTML;
            if (!titleEl.querySelector('.error-icon')) {
                titleEl.innerHTML = `<span class="error-icon">⚠️</span> ${titleEl.innerText}`;
            }
            header.classList.add('node-error');
            header.title = "Audio file missing";
        } else {
            if (titleEl.dataset.originalContent) {
                titleEl.innerHTML = titleEl.dataset.originalContent;
                delete titleEl.dataset.originalContent;
            }
            header.classList.remove('node-error');
            header.removeAttribute('title');
        }
    }
}
