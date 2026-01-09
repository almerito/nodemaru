import BaseNode from './BaseNode.js';
import { DEFAULT_ASSETS } from '../hydra_utils.js';

export default class InitNode extends BaseNode {
    constructor(node) {
        super(node);
        this.node = node;
        this.node.data = this.node.data || {};
        this.node.data.currentValue = this.node.data.currentValue || {};
    }

    compile(compiler, connections, nodes, globalSettings) {
        const data = this.node.data || {};
        const vals = data.currentValue || {};

        // Fallback for target if not in currentValue
        // We prefer currentValue > paramState > direct data
        const target = vals.target ?? data.paramState?.target?.value ?? 0;
        const type = vals.type || 'local image'; // Default to first option
        const params = vals.params || '';

        // Param handling is a bit loose in legacy.
        // If "params" is a property, it's a string.

        let line = '';
        const pArg = params ? `, ${params}` : '';

        if (type === 'local image') {
            const defaultUrl = DEFAULT_ASSETS.image;
            const url = vals.image?.blobUrl || defaultUrl;
            // Use string URL directly to avoid [object HTMLImageElement] 404s
            line = `s${target}.initImage("${url}"${pArg})`;
        } else if (type === 'remote image') {
            // Check multiple locations for URL value
            const url = vals.url || data.paramState?.url?.value || '';
            line = `s${target}.initImage("${url}"${pArg})`;
        } else if (type === 'local video') {
            const defaultUrl = DEFAULT_ASSETS.video;
            const url = vals.video?.blobUrl || defaultUrl;
            // Use string URL directly
            line = `s${target}.initVideo("${url}"${pArg})`;
        } else if (type === 'webcam') {
            const idx = vals.camIndex ?? 0;
            line = `s${target}.initCam(${idx}${pArg})`;
        } else if (type === 'screen capture' || type === 'screen') {
            line = `s${target}.initScreen(${params})`;
        }

        // Context Check: Are we in proper compilation phase (Phase 6) or Init Phase (Phase 2)?
        // HydraCompiler passes 'null' for connections during _compileInitNodes.
        const isInitPhase = !connections;

        if (isInitPhase) {
            // Return ONLY initialization code
            if (line) {
                let output = line + ';'; // Add semicolon to prevent ASI issues
                if (vals.options) {
                    output += '\n' + vals.options;
                }
                return output + '\n';
            }
            return `// InitNode ${this.node.id} no-op\n`;
        } else {
            // Return ONLY usage code (src wrapper)
            return `src(s${target})`;
        }
    }

    renderNodeBody(container) {
        // Hook to verify file state on load/render
        // Use setTimeout to ensure DOM is ready after initial render
        setTimeout(() => this.verifyFileState(), 100);
    }

    // Helper Checks
    checkImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = url;
        });
    }

    checkVideo(url) {
        return new Promise((resolve, reject) => {
            const vid = document.createElement('video');
            vid.onloadedmetadata = () => resolve(true);
            vid.onerror = () => reject(false);
            vid.src = url;
        });
    }

    async verifyFileState() {
        // Check local image/video blobs
        const type = this.node.data.currentValue?.type || 'local image';
        let blobUrl = null;
        let hasFileName = false;
        let fileName = 'Unknown file';

        if (type === 'local image') {
            blobUrl = this.node.data.currentValue?.image?.blobUrl;
            hasFileName = !!this.node.data.currentValue?.image?.fileName;
            fileName = this.node.data.currentValue?.image?.fileName || fileName;
        } else if (type === 'local video') {
            blobUrl = this.node.data.currentValue?.video?.blobUrl;
            hasFileName = !!this.node.data.currentValue?.video?.fileName;
            fileName = this.node.data.currentValue?.video?.fileName || fileName;
        }

        if ((type === 'local image' || type === 'local video')) {
            const fileType = type === 'local image' ? 'Image' : 'Video';
            if (blobUrl) {
                try {
                    if (type === 'local image') {
                        await this.checkImage(blobUrl);
                    } else {
                        await this.checkVideo(blobUrl);
                    }
                    // Success
                    this.setNodeErrorState(false);
                } catch (e) {
                    this.clearBlobUrl(type);
                    this.showMissingFileWarning(fileName, fileType);
                    setTimeout(() => this.setNodeErrorState(true), 50);
                }
            } else if (hasFileName) {
                this.showMissingFileWarning(fileName, fileType);
                setTimeout(() => this.setNodeErrorState(true), 50);
            } else {
                // No file loaded - User wants alert here too
                this.setNodeErrorState(true);
            }
        } else {
            this.setNodeErrorState(false);
        }
    }

    showMissingFileWarning(fileName, fileType) {
        const msg = `${fileType} file missing: ${fileName}. Please re-select the file.`;
        console.warn(`[InitNode] ${msg}`);
        if (window.toastr) {
            window.toastr.warning(msg, 'Missing File', { timeOut: 5000, preventDuplicates: true });
        }
    }

    clearBlobUrl(type) {
        if (type === 'local image' && this.node.data.currentValue?.image) {
            this.node.data.currentValue.image.blobUrl = null;
        }
        if (type === 'local video' && this.node.data.currentValue?.video) {
            this.node.data.currentValue.video.blobUrl = null;
        }
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
            header.title = "Source file missing or not loaded";
        } else {
            if (titleEl.dataset.originalContent) {
                titleEl.innerHTML = titleEl.dataset.originalContent;
                delete titleEl.dataset.originalContent;
            }
            header.classList.remove('node-error');
            header.removeAttribute('title');
        }
    }
    // =========================================================================================
    // UI INSPECTOR RENDERER
    // =========================================================================================
    renderInspector(container, renderParamFn) {
        // We can reuse the same pattern as AudioNode or construct the specific UI for Init here.
        // Needs: Type Selector, Parameter inputs based on Type

        const data = this.node.data || {};
        const state = data.currentValue || {};
        const params = this.node.data.shaderData.params || {};

        // 1. Target Selector (target 0-3)
        // Usually handled by 'params' iteration if type is generic, but we can make it explicit or use renderParamFn

        let html = '';

        // Render 'target' first if it exists in params
        if (params.target) {
            html += renderParamFn('target', params.target, this.node);
        }

        // 2. Type Selector (Custom)
        // Values: 'local image', 'local video', 'remote image', 'webcam', 'screen'
        const currentType = state.type || 'local image';
        const types = [
            { value: 'local image', label: 'Local Image File' },
            { value: 'local video', label: 'Local Video File' },
            { value: 'remote image', label: 'Remote Image (URL)' },
            { value: 'webcam', label: 'Webcam Source' },
            { value: 'screen', label: 'Screen Capture' }
        ];

        const optionsHtml = types.map(t =>
            `<option value="${t.value}" ${t.value === currentType ? 'selected' : ''}>${t.label}</option>`
        ).join('');

        html += `
            <div class="mb-3">
                <label class="form-label small text-muted mb-1">Source Type</label>
                <select class="form-select form-select-sm bg-dark text-white border-secondary"
                        onchange="window._onInitTypeChange('${this.node.id}', this.value)">
                    ${optionsHtml}
                </select>
            </div>
        `;

        // 3. Dynamic Content based on Type
        html += `<div id="init-node-content-${this.node.id}" class="mt-3">`;

        if (currentType === 'local image') {
            const hasBlob = !!state.image?.blobUrl;
            const hasFileName = !!state.image?.fileName;
            const fileName = state.image?.fileName || 'No file selected';

            // Determine status: has blob = current (info), has name but no blob = missing (warning), nothing = no file (muted)
            let statusText = fileName;
            let statusClass = 'text-muted';
            if (hasBlob && hasFileName) {
                statusText = `Current: ${fileName}`;
                statusClass = 'text-info';
            } else if (hasFileName && !hasBlob) {
                statusText = `Missing: ${fileName}`;
                statusClass = 'text-warning';
            }

            html += `
                <div class="mb-3">
                    <label class="form-label small text-muted">Upload Image</label>
                    <div class="input-group input-group-sm">
                        <input type="file" accept="image/*" class="form-control bg-dark text-white border-secondary" 
                               onchange="window._onInitFileChange('${this.node.id}', 'image', this)">
                    </div>
                    <div class="form-text small mt-1"><span class="${statusClass}">${statusText}</span></div>
                </div>
            `;
        } else if (currentType === 'local video') {
            const hasBlob = !!state.video?.blobUrl;
            const hasFileName = !!state.video?.fileName;
            const fileName = state.video?.fileName || 'No file selected';

            // Determine status
            let statusText = fileName;
            let statusClass = 'text-muted';
            if (hasBlob && hasFileName) {
                statusText = `Current: ${fileName}`;
                statusClass = 'text-info';
            } else if (hasFileName && !hasBlob) {
                statusText = `Missing: ${fileName}`;
                statusClass = 'text-warning';
            }

            html += `
                <div class="mb-3">
                    <label class="form-label small text-muted">Upload Video</label>
                    <div class="input-group input-group-sm">
                        <input type="file" accept="video/*" class="form-control bg-dark text-white border-secondary" 
                               onchange="window._onInitFileChange('${this.node.id}', 'video', this)">
                    </div>
                    <div class="form-text small mt-1"><span class="${statusClass}">${statusText}</span></div>
                </div>
            `;
        } else if (currentType === 'webcam') {
            const cams = window._availableCameras || [];
            const currentCam = state.camIndex ?? 0;
            const camOptions = cams.length > 0
                ? cams.map((c, i) => `<option value="${i}" ${i == currentCam ? 'selected' : ''}>${c.label || 'Camera ' + i}</option>`).join('')
                : `<option value="0">Default Camera</option>`;

            html += `
                <div class="mb-3">
                    <label class="form-label small text-muted">Select Camera</label>
                    <div class="d-flex gap-2">
                        <select class="form-select form-select-sm bg-dark text-white border-secondary"
                                onchange="window._onInitCamChange('${this.node.id}', this.value)">
                            ${camOptions}
                        </select>
                        <button class="btn btn-sm btn-outline-secondary" title="Refresh Cameras" 
                                onclick="window._refreshCameras()">↻</button>
                    </div>
                </div>
            `;
        } else if (currentType === 'remote image') {
            // Remote URL input
            const currentUrl = state.url || this.node.data?.paramState?.url?.value || '';
            html += `
                <div class="mb-3">
                    <label class="form-label small text-muted">Image URL</label>
                    <input type="text" class="form-control form-control-sm bg-dark text-white border-secondary" 
                           placeholder="https://example.com/image.png"
                           value="${currentUrl}"
                           onchange="window._onInitUrlChange('${this.node.id}', this.value)">
                </div>
            `;
        } else if (currentType === 'screen' || currentType === 'screen capture') {
            // Screen capture note
            html += `
                <div class="alert alert-info small py-2 px-3">
                    <i class="bi bi-info-circle me-1"></i>
                    The screen share request will be prompted when you start preview or playback.
                </div>
            `;
        }

        html += `</div>`;

        // Render other params that are NOT target/url/type
        // Actually, we should just let the user see other params if any??
        // For now, let's keep it simple.

        container.innerHTML = html;

        // Register Global Handlers if not already exists (Idempotent)
        this.registerGlobalHandlers();
    }

    registerGlobalHandlers() {
        if (window._onInitTypeChange) return;

        window._onInitTypeChange = (nodeId, newType) => {
            const node = window.graph.getNode(nodeId);
            if (!node) return;
            if (!node.data.currentValue) node.data.currentValue = {};

            node.data.currentValue.type = newType;
            // Trigger refresh of drawer
            // We can call openNodeParamsDrawer(node) again?
            // Or assume change triggers update?
            // Simplest: Re-open drawer or update data

            // Push history
            if (window.historyManager) window.historyManager.pushState('init_type_change');

            // Force Re-render of drawer if open
            const drawerContent = document.getElementById('drawerContent');
            if (drawerContent && node._baseNodeInstance) {
                // Hacky redraw
                node._baseNodeInstance.renderInspector(drawerContent, window.renderParam);
            }
        };

        window._onInitFileChange = (nodeId, fileType, input) => {
            const node = window.graph.getNode(nodeId);
            if (!node || !input.files || input.files.length === 0) return;

            const file = input.files[0];
            const blobUrl = URL.createObjectURL(file);

            if (!node.data.currentValue) node.data.currentValue = {};
            if (!node.data.currentValue[fileType]) node.data.currentValue[fileType] = {};

            node.data.currentValue[fileType].blobUrl = blobUrl;
            node.data.currentValue[fileType].fileName = file.name;

            // Push history (maybe heavy?)
            if (window.historyManager) window.historyManager.pushState('init_file_change');

            // Update UI Label
            // Redraw
            const drawerContent = document.getElementById('drawerContent');
            if (drawerContent && node._baseNodeInstance) {
                node._baseNodeInstance.renderInspector(drawerContent, window.renderParam);
            }
        };

        window._onInitCamChange = (nodeId, index) => {
            const node = window.graph.getNode(nodeId);
            if (!node) return;
            if (!node.data.currentValue) node.data.currentValue = {};
            node.data.currentValue.camIndex = parseInt(index);
        };

        window._onInitUrlChange = (nodeId, url) => {
            const node = window.graph.getNode(nodeId);
            if (!node) return;
            if (!node.data.currentValue) node.data.currentValue = {};
            node.data.currentValue.url = url;
            if (window.historyManager) window.historyManager.pushState('init_url_change');
        };

        window._refreshCameras = async () => {
            try {
                // Request permission to list labels
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                window._availableCameras = devices.filter(d => d.kind === 'videoinput');
                // Redraw current drawer
                const drawerContent = document.getElementById('drawerContent');
                // Can't easily find current node here without tracking it globally
                // usages in editor.js track currentSelectedNode
                if (window.currentSelectedNode && window.currentSelectedNode._baseNodeInstance) {
                    window.currentSelectedNode._baseNodeInstance.renderInspector(drawerContent, window.renderParam);
                }
            } catch (e) {
                console.error("Camera access denied", e);
            }
        };

        // Auto-enumerate cameras on page load (silent, no permission prompt)
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                window._availableCameras = devices.filter(d => d.kind === 'videoinput');
            }).catch(() => { });
        }
    }
}
