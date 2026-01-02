/**
 * NodeUIRenderers.js
 * Handles UI rendering for nodes in the properties drawer
 */

import { NODES_CONFIG } from '../ui/LibraryCallbacks.js';
import { getParamHint } from '../ui/ParamHints.js';

export class NodeUIRenderers {
    constructor(editor) {
        this.editor = editor;
    }

    renderNodeParams(node, container) {
        if (!node.config.params) return;

        Object.keys(node.config.params).forEach(key => {
            const p = node.config.params[key];
            const wrapper = document.createElement('div');
            wrapper.classList.add('param-wrapper');

            // Label container with hint icon support
            const labelContainer = document.createElement('div');
            labelContainer.classList.add('param-label-container');

            const label = document.createElement('label');
            label.innerText = key;
            label.classList.add('param-label');
            labelContainer.appendChild(label);

            // Add hint icon if hint property exists or from external hints file
            const hint = p.hint || getParamHint(node.type, key);
            if (hint) {
                const hintIcon = document.createElement('span');
                hintIcon.innerText = 'ℹ️';
                hintIcon.title = hint;
                hintIcon.classList.add('param-hint');
                labelContainer.appendChild(hintIcon);
            }

            wrapper.appendChild(labelContainer);

            if (p.type === 'range') {
                // Range
                const rangeContainer = document.createElement('div');
                rangeContainer.classList.add('range-container');

                const val = node.currentValue?.[key] || (Array.isArray(p.default) ? p.default : [p.default, p.default]);
                const valFrom = Array.isArray(val) ? val[0] : val;
                const valTo = Array.isArray(val) ? val[1] : val;

                const inputFrom = document.createElement('input');
                inputFrom.type = 'number';
                inputFrom.value = valFrom;
                inputFrom.step = 0.01;
                inputFrom.placeholder = 'From';
                inputFrom.classList.add('param-input');

                const inputTo = document.createElement('input');
                inputTo.type = 'number';
                inputTo.value = valTo;
                inputTo.step = 0.01;
                inputTo.placeholder = 'To';
                inputTo.classList.add('param-input');

                const updateRange = () => {
                    if (!node.currentValue) node.currentValue = {};
                    node.currentValue[key] = [parseFloat(inputFrom.value) || 0, parseFloat(inputTo.value) || 0];
                    this.editor.saveState();
                    this.editor.refreshExecution(); // Trigger update
                };

                inputFrom.addEventListener('input', updateRange);
                inputTo.addEventListener('input', updateRange);

                rangeContainer.appendChild(inputFrom);
                rangeContainer.appendChild(inputTo);
                wrapper.appendChild(rangeContainer);

            } else if (p.type === 'select') {
                // Select
                const select = document.createElement('select');
                select.classList.add('param-input');

                (p.values || []).forEach(optVal => {
                    const option = document.createElement('option');
                    // Support both simple strings and {value, label} objects
                    const val = typeof optVal === 'object' ? optVal.value : optVal;
                    const lbl = typeof optVal === 'object' ? optVal.label : optVal;
                    option.value = val;
                    option.innerText = lbl;
                    if (val === (node.currentValue?.[key] ?? p.default)) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });

                select.addEventListener('change', (e) => {
                    if (!node.currentValue) node.currentValue = {};
                    node.currentValue[key] = select.value;
                    this.editor.saveState();
                    this.editor.refreshExecution(); // Trigger update
                });

                wrapper.appendChild(select);

            } else if (p.type === 'multiple') {
                // Multiple: Mode Select + Dynamic Input
                // Value structure: { activeIndex: 0, value: ... }

                // Init value if needed
                let current = node.currentValue?.[key];
                // Safety check: must be object with activeIndex
                if (!current || typeof current !== 'object' || current.activeIndex === undefined) {
                    // Default to first item
                    const defaultIdx = 0;
                    const defaultItem = p.items[defaultIdx];
                    current = { activeIndex: defaultIdx, value: defaultItem.default };

                    // Helper: if defaultItem is nodeList, value might need to be empty or null
                    if (defaultItem.item === 'nodeList') current.value = '';

                    if (!node.currentValue) node.currentValue = {};
                    node.currentValue[key] = current;
                }

                // 1. Mode Select
                const modeSelect = document.createElement('select');
                modeSelect.classList.add('param-input', 'mode-select');

                p.items.forEach((item, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx;
                    // Label: "Constant" or "Array Node" (derived from item.item and item.type)
                    let label = item.item === 'constant' ? 'Constant' : `Node: ${item.type}`;
                    opt.innerText = label;
                    if (idx === parseInt(current.activeIndex)) opt.selected = true;
                    modeSelect.appendChild(opt);
                });

                modeSelect.addEventListener('change', () => {
                    const newIndex = parseInt(modeSelect.value);
                    const newItem = p.items[newIndex];

                    // Reset value for new mode
                    let newValue = newItem.default;
                    if (newItem.item === 'nodeList') newValue = ''; // Reset to empty for node selection

                    node.currentValue[key] = { activeIndex: newIndex, value: newValue };
                    this.editor.saveState();
                    this.editor.refreshExecution(); // Trigger update

                    // Re-render drawer to show new inputs
                    this.editor.openDrawer(node);
                });

                wrapper.appendChild(modeSelect);

                // 2. Render Input based on active mode
                const activeItem = p.items[current.activeIndex];

                if (activeItem.item === 'constant') {
                    // Constant Input
                    const input = document.createElement('input');
                    input.classList.add('param-input');
                    input.type = (activeItem.type === 'int' || activeItem.type === 'float') ? 'number' : 'text';
                    if (activeItem.type === 'float') input.step = 0.01;
                    input.value = current.value !== undefined ? current.value : (activeItem.default || 0);

                    input.addEventListener('input', (e) => {
                        current.value = input.value;
                        if (activeItem.type === 'float' || activeItem.type === 'int') {
                            current.value = parseFloat(input.value) || 0;
                        }
                        node.currentValue[key] = current;
                        this.editor.saveState();
                        this.editor.refreshExecution(); // Trigger update
                    });
                    wrapper.appendChild(input);

                } else if (activeItem.item === 'nodeList') {
                    // Node Selector
                    const nodeSelect = document.createElement('select');
                    nodeSelect.classList.add('param-input');

                    // Find compatible nodes
                    let found = false;
                    // Add default "Select..." option
                    const defaultOpt = document.createElement('option');
                    defaultOpt.value = '';
                    defaultOpt.innerText = '-- Select Node --';
                    nodeSelect.appendChild(defaultOpt);

                    this.editor.nodes.forEach(n => {
                        if (n.type === activeItem.type) {
                            const opt = document.createElement('option');
                            opt.value = n.id;
                            // Friendly name: "Array #5" instead of "Array (node_5)"
                            const nodeNumber = n.id.split('_')[1] || '';
                            opt.innerText = nodeNumber ? `${n.name} #${nodeNumber}` : n.name;
                            if (current.value === n.id) opt.selected = true;
                            nodeSelect.appendChild(opt);
                            found = true;
                        }
                    });

                    if (!found) {
                        defaultOpt.innerText = `No ${activeItem.type} nodes found`;
                    }

                    nodeSelect.addEventListener('change', () => {
                        current.value = nodeSelect.value;
                        node.currentValue[key] = current;
                        this.editor.saveState();
                        this.editor.refreshExecution(); // Trigger update
                    });
                    wrapper.appendChild(nodeSelect);
                }

            } else {
                // Standard Input
                const input = document.createElement('input');
                input.classList.add('param-input');

                if (p.type === 'float' || p.type === 'int') {
                    input.type = 'number';
                    input.value = node.currentValue?.[key] ?? p.default;
                    input.step = p.type === 'float' ? 0.01 : 1;
                } else if (p.type === 'textarea') {
                    // Textarea Input
                    const textarea = document.createElement('textarea');
                    textarea.classList.add('param-input');
                    textarea.style.resize = 'vertical';
                    textarea.style.minHeight = '60px';
                    textarea.value = node.currentValue?.[key] ?? p.default;

                    textarea.addEventListener('input', () => {
                        if (!node.currentValue) node.currentValue = {};
                        node.currentValue[key] = textarea.value;
                        this.editor.saveState();
                        this.editor.refreshExecution(); // Trigger update
                    });

                    wrapper.appendChild(textarea);
                    container.appendChild(wrapper);
                    return; // Skip standard input append
                } else {
                    input.type = 'text';
                    input.value = node.currentValue?.[key] ?? p.default;
                }

                input.addEventListener('input', (e) => {
                    if (!node.currentValue) node.currentValue = {};
                    node.currentValue[key] = input.value;
                    this.editor.saveState();
                });

                wrapper.appendChild(input);
            }
            container.appendChild(wrapper);
        });
    }

    /* --- Custom UI Handlers --- */
    renderCustomUI(node, container) {
        if (node.type === 'array') {
            this.renderArrayNodeUI(node, container);
            return true;
        }
        if (node.type === 'init') {
            this.renderInitNodeUI(node, container);
            return true;
        }
        if (node.type === 'midi') {
            this.renderMidiNodeUI(node, container);
            return true;
        }
        if (node.type === 'audio') {
            this.renderAudioNodeUI(node, container); // New Source UI
            return true;
        }
        if (node.type === 'audio_data') {
            this.renderAudioDataNodeUI(node, container);
            return true;
        }
        if (node.type === 'midi_data') {
            this.renderMidiDataNodeUI(node, container);
            return true;
        }

        return false;
    }

    renderAudioDataNodeUI(node, container) {
        // Tracks that support adaptive range
        const ADAPTIVE_TRACKS = ['rms', 'energy', 'spectralFlux', 'loudness', 'dynamic', 'rhythm',
            'bands', 'sub', 'bass', 'lowMid', 'mid', 'high', 'air'];

        // Pre-populate sources
        this.updateDataSourceOptions(node);

        // Render Source Select
        this.renderSingleParam(node, container, 'source');

        // Render Track Select with logic
        const trackWrapper = this.renderSingleParam(node, container, 'track');
        const trackSelect = trackWrapper.querySelector('select');

        // Container for conditional params (band/transient type)
        const conditionalContainer = document.createElement('div');
        conditionalContainer.classList.add('conditional-container');
        container.appendChild(conditionalContainer);

        // Container for adaptive range options
        const adaptiveContainer = document.createElement('div');
        adaptiveContainer.classList.add('adaptive-range-container');
        container.appendChild(adaptiveContainer);

        const updateVisibility = () => {
            const track = node.currentValue.track || 'energy';
            conditionalContainer.innerHTML = '';
            adaptiveContainer.innerHTML = '';

            // Show band/transient type selectors
            if (track === 'bands') {
                this.renderSingleParam(node, conditionalContainer, 'bandType');
            } else if (track === 'transients') {
                this.renderSingleParam(node, conditionalContainer, 'transientType');
            }

            // Show adaptive range options only for tracks that support it
            const isAdaptive = ADAPTIVE_TRACKS.includes(track);
            if (isAdaptive) {
                // Checkbox for adaptive range
                this.renderSingleParam(node, adaptiveContainer, 'useAdaptiveRange');

                // Input range for initial min/max
                const inputRangeWrapper = this.renderSingleParam(node, adaptiveContainer, 'inputRange');

                // Add helper label
                const helperText = document.createElement('div');
                helperText.classList.add('helper-text');
                helperText.innerText = 'Initial input range (auto-adjusts if adaptive is on)';
                adaptiveContainer.appendChild(helperText);
            }
        };

        if (trackSelect) {
            trackSelect.addEventListener('change', () => {
                node.currentValue.track = trackSelect.value;
                updateVisibility();
                this.editor.saveState();
            });
        }

        updateVisibility();

        // Render Transpose (output range)
        this.renderSingleParam(node, container, 'transpose');

        // Standard Delete Button
        this.renderDeleteButton(node, container);
    }

    renderMidiDataNodeUI(node, container) {
        // Pre-populate sources
        this.updateDataSourceOptions(node);

        this.renderSingleParam(node, container, 'source');
        this.renderSingleParam(node, container, 'channel');

        const trackWrapper = this.renderSingleParam(node, container, 'track');
        const trackSelect = trackWrapper.querySelector('select');

        const conditionalContainer = document.createElement('div');
        conditionalContainer.classList.add('conditional-container');
        container.appendChild(conditionalContainer);

        const updateVisibility = () => {
            const track = node.currentValue.track || 'note number';
            conditionalContainer.innerHTML = '';

            if (track === 'control change' || track === 'program change') {
                this.renderSingleParam(node, conditionalContainer, 'ccNumber');
            }
        };

        if (trackSelect) {
            trackSelect.addEventListener('change', () => {
                node.currentValue.track = trackSelect.value;
                updateVisibility();
                this.editor.saveState();
            });
        }
        updateVisibility();

        this.renderSingleParam(node, container, 'transpose');
        this.renderDeleteButton(node, container);
    }

    // Helper for delete button to avoid duplication
    renderDeleteButton(node, container) {
        const deleteContainer = document.createElement('div');
        deleteContainer.classList.add('delete-container');
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Node';
        deleteBtn.classList.add('btn-delete-node');
        deleteBtn.onclick = () => {
            this.editor.removeNode(node.id);
            this.selectedNode = null;
            this.editor.closeDrawer();
        };
        deleteContainer.appendChild(deleteBtn);
        container.appendChild(deleteContainer);
    }

    // New Helper to populate source dropdowns
    updateDataSourceOptions(node) {
        const sourceType = node.type === 'audio_data' ? 'audio' : 'midi';
        const sources = [];

        this.editor.nodes.forEach(n => {
            if (n.type === sourceType) {
                // Extract node number for friendly label
                const nodeNumber = n.id.split('_')[1] || '';
                const friendlyName = nodeNumber ? `${n.name} #${nodeNumber}` : n.name;

                // Use {value, label} object - value for compiler, label for display
                sources.push({
                    value: n.id,
                    label: friendlyName
                });
            }
        });

        // Add 'values' to the node's config param
        const p = node.config.params['source'];
        if (p) {
            p.values = sources.length > 0 ? sources : [{ value: '', label: 'No Sources Found' }];
        }
    }

    renderInitNodeUI(node, container) {
        if (!node.currentValue) node.currentValue = {};

        // Target
        this.renderSingleParam(node, container, 'target');

        // Type
        const typeWrapper = this.renderSingleParam(node, container, 'type');

        // Dynamic Source Container
        const sourceContainer = document.createElement('div');
        sourceContainer.classList.add('source-config-container');
        container.appendChild(sourceContainer);

        // Params & Options
        this.renderSingleParam(node, container, 'params');
        this.renderSingleParam(node, container, 'options');

        // Logic to update Source Container (reused from Init Node logic)
        const updateSourceUI = async () => {
            sourceContainer.innerHTML = '';
            const type = node.currentValue.type || 'local image';

            if (type === 'local image' || type === 'local video') {
                const label = document.createElement('label');
                label.innerText = type === 'local image' ? 'Select Image' : 'Select Video';
                label.classList.add('form-label');

                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.classList.add('param-input');
                fileInput.accept = type === 'local image' ? '.jpg,.jpeg,.png,.webp' : '.mp4,.webm,.ogg';

                const hint = document.createElement('small');
                hint.classList.add('form-hint');

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (node.currentValue.blobUrl) URL.revokeObjectURL(node.currentValue.blobUrl);
                        node.currentValue.blobUrl = URL.createObjectURL(file);
                        node.currentValue.filePath = file.name;
                        pathInput.value = file.name;
                        hint.innerText = "Loaded via Blob. Ready.";
                        hint.classList.add('success');
                        node.clearError(); // Clear any missing file error
                        document.getElementById('properties-error').innerHTML = "";
                        this.editor.saveState();
                    }
                });

                const pathInput = document.createElement('input');
                pathInput.type = 'text';
                pathInput.placeholder = 'Or paste path...';
                pathInput.classList.add('param-input', 'path-input');
                pathInput.value = node.currentValue.filePath || '';
                pathInput.addEventListener('input', () => {
                    node.currentValue.filePath = pathInput.value;
                    delete node.currentValue.blobUrl;
                    hint.innerText = "Using path.";
                    this.editor.saveState();
                });

                sourceContainer.appendChild(label);
                sourceContainer.appendChild(fileInput);
                sourceContainer.appendChild(pathInput);
                sourceContainer.appendChild(hint);

                if (node.currentValue.blobUrl) {
                    hint.innerText = "Loaded via Blob.";
                    hint.style.color = '#4caf50';
                }

            } else if (type === 'remote image') {
                const label = document.createElement('label');
                label.innerText = 'Image URL';
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('param-input');
                input.value = node.currentValue.url || '';

                const statusHint = document.createElement('span');
                statusHint.classList.add('param-hint');
                statusHint.style.display = 'block';
                statusHint.style.marginTop = '4px';

                // Show current status
                if (node.currentValue.blobUrl) {
                    statusHint.innerText = '✅ Image loaded successfully';
                    statusHint.style.color = '#4caf50';
                }

                // Fetch and convert to blob when URL changes
                const fetchImageAsBlob = async (url) => {
                    if (!url) {
                        statusHint.innerText = '';
                        return;
                    }

                    statusHint.innerText = '⏳ Loading image...';
                    statusHint.style.color = '#ffc107';

                    // Try multiple proxy services in order
                    const proxyServices = [
                        (u) => u, // Try direct first (works if server has CORS enabled)
                        (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
                        (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`
                    ];

                    let lastError = null;

                    for (let i = 0; i < proxyServices.length; i++) {
                        try {
                            const proxyUrl = proxyServices[i](url);
                            const response = await fetch(proxyUrl);

                            if (!response.ok) {
                                throw new Error(`HTTP ${response.status}`);
                            }

                            const blob = await response.blob();

                            if (blob.size === 0) {
                                throw new Error('Empty response');
                            }

                            const blobUrl = URL.createObjectURL(blob);

                            // Store blob URL
                            node.currentValue.blobUrl = blobUrl;
                            node.currentValue.url = url;
                            this.editor.saveState();

                            // Clear any previous error
                            node.clearError();

                            const proxyName = i === 0 ? 'direct' : i === 1 ? 'proxy1' : 'proxy2';
                            statusHint.innerText = `✅ Loaded (${Math.round(blob.size / 1024)}KB via ${proxyName})`;
                            statusHint.style.color = '#4caf50';
                            return; // Success, exit

                        } catch (e) {
                            lastError = e;
                            // Try next proxy
                        }
                    }

                    // All proxies failed
                    console.error('Failed to load remote image:', lastError);
                    node.currentValue.blobUrl = null;
                    node.setError(`Failed to load image from all sources`);

                    statusHint.innerText = `❌ Could not load image (all proxies failed)`;
                    statusHint.style.color = '#ff4444';
                };

                // Debounce input to avoid too many requests
                let debounceTimer;
                input.addEventListener('input', () => {
                    node.currentValue.url = input.value;
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        fetchImageAsBlob(input.value);
                    }, 800); // Wait 800ms after user stops typing
                });

                // Add a "Load" button for manual trigger
                const loadBtn = document.createElement('button');
                loadBtn.innerText = 'Load';
                loadBtn.classList.add('btn-action');
                loadBtn.style.marginLeft = '8px';
                loadBtn.onclick = () => fetchImageAsBlob(input.value);

                const inputRow = document.createElement('div');
                inputRow.style.display = 'flex';
                inputRow.style.alignItems = 'center';
                inputRow.appendChild(input);
                inputRow.appendChild(loadBtn);

                sourceContainer.appendChild(label);
                sourceContainer.appendChild(inputRow);
                sourceContainer.appendChild(statusHint);
            } else if (type === 'webcam') {
                // ... Webcam logic ...
                const btn = document.createElement('button');
                btn.innerText = "Select Webcam";
                btn.classList.add('btn-action');

                const select = document.createElement('select');
                select.classList.add('param-input');

                const loadDevs = async () => {
                    select.innerHTML = '';
                    try {
                        const devs = await navigator.mediaDevices.enumerateDevices();
                        devs.filter(d => d.kind === 'videoinput').forEach((d, i) => {
                            const opt = document.createElement('option');
                            opt.value = i;
                            opt.innerText = d.label || `Camera ${i}`;
                            if (node.currentValue.camIndex == i) opt.selected = true;
                            select.appendChild(opt);
                        });
                    } catch (e) { }
                };

                select.addEventListener('change', () => {
                    node.currentValue.camIndex = select.value;
                    this.editor.saveState();
                });

                btn.onclick = async () => {
                    try {
                        const s = await navigator.mediaDevices.getUserMedia({ video: true });
                        s.getTracks().forEach(t => t.stop());
                        loadDevs();
                    } catch (e) { alert(e.message); }
                };

                loadDevs();
                sourceContainer.appendChild(btn);
                sourceContainer.appendChild(select);
            }
        };

        // Trigger on type change
        typeWrapper.querySelector('select')?.addEventListener('change', updateSourceUI);
        updateSourceUI();
    }

    renderAudioNodeUI(node, container) {
        if (!node.currentValue) node.currentValue = {};

        // 1. Type (Device vs File)
        const typeWrapper = this.renderSingleParam(node, container, 'type');
        const typeSelect = typeWrapper.querySelector('select');

        // 2. Source Config Container
        const configContainer = document.createElement('div');
        configContainer.classList.add('source-config-container');
        container.appendChild(configContainer);

        const updateUI = async () => {
            configContainer.innerHTML = '';
            const type = node.currentValue.type || 'device';

            if (type === 'device') {
                const label = document.createElement('label');
                label.innerText = 'Audio Device';
                configContainer.appendChild(label);

                const select = document.createElement('select');
                select.classList.add('param-input');

                const loadDevs = async () => {
                    select.innerHTML = '';
                    try {
                        const devs = await navigator.mediaDevices.enumerateDevices();
                        const audioDevs = devs.filter(d => d.kind === 'audioinput');
                        if (audioDevs.length === 0) {
                            select.innerHTML = '<option>No devices found</option>';
                            return;
                        }
                        audioDevs.forEach(d => {
                            const opt = document.createElement('option');
                            opt.value = d.deviceId;
                            opt.innerText = d.label || `Device ${d.deviceId.slice(0, 5)}...`;
                            if (node.currentValue.deviceId === d.deviceId) opt.selected = true;
                            select.appendChild(opt);
                        });
                    } catch (e) { console.error(e); }
                };

                // Unlock/Refresh Button
                const btnContainer = document.createElement('div');
                btnContainer.classList.add('btn-container');
                const btn = document.createElement('button');
                btn.innerText = "Refresh Browser Permission";
                btn.classList.add('btn-small');
                btnContainer.appendChild(btn);
                btn.onclick = async () => {
                    try {
                        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
                        s.getTracks().forEach(t => t.stop());
                        loadDevs();
                    } catch (e) { alert("Mic error: " + e.message); }
                };

                select.addEventListener('change', () => {
                    node.currentValue.deviceId = select.value;
                    // Also save the device name for rematch capability
                    const selectedOption = select.options[select.selectedIndex];
                    if (selectedOption) {
                        node.currentValue.deviceName = selectedOption.text;
                    }
                    this.editor.saveState();
                });

                configContainer.appendChild(btnContainer);
                configContainer.appendChild(select);
                loadDevs();

            } else { // File
                const label = document.createElement('label');
                label.innerText = 'Audio File';
                configContainer.appendChild(label);

                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.mp3,.wav,.ogg,.m4a';
                fileInput.classList.add('param-input');

                const hint = document.createElement('div');
                hint.classList.add('input-hint');

                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (node.currentValue.blobUrl) URL.revokeObjectURL(node.currentValue.blobUrl);
                        node.currentValue.blobUrl = URL.createObjectURL(file);
                        node.currentValue.fileName = file.name;

                        hint.innerText = `Loaded: ${file.name}`;
                        hint.classList.add('success');
                        node.clearError();
                        this.editor.saveState();
                        document.getElementById('properties-error').innerHTML = "";
                        updateUI();
                    }
                });

                configContainer.appendChild(fileInput);
                configContainer.appendChild(hint);

                let isBlobValid = false;
                if (node.currentValue.blobUrl) {
                    try {
                        const res = await fetch(node.currentValue.blobUrl);
                        if (res.ok) isBlobValid = true;
                    } catch (e) { }
                }

                if (node.currentValue.fileName) {
                    if (isBlobValid) {
                        hint.innerText = `Loaded: ${node.currentValue.fileName}`;
                        hint.classList.add('success');
                        node.clearError();
                    } else {
                        hint.innerText = `Missing: ${node.currentValue.fileName}`;
                        hint.style.color = 'red';
                        node.setError("Audio file missing"); // Alert user
                    }
                } else {
                    hint.innerText = 'Select audio file...';
                }

                // Playback Controls (Only if valid)
                if (isBlobValid) {
                    const controls = document.createElement('div');
                    controls.style.marginTop = '5px';
                    controls.style.display = 'flex';
                    controls.style.gap = '5px';

                    const btnPlay = document.createElement('button');
                    btnPlay.innerText = '▶ Preview';
                    btnPlay.onclick = () => {
                        if (this.previewAudio) this.previewAudio.pause();
                        if (node.currentValue.blobUrl) {
                            this.previewAudio = new Audio(node.currentValue.blobUrl);
                            this.previewAudio.play().catch(e => console.error(e));
                        }
                    };

                    const btnStop = document.createElement('button');
                    btnStop.innerText = '⏹';
                    btnStop.onclick = () => {
                        if (this.previewAudio) this.previewAudio.pause();
                    };

                    controls.appendChild(btnPlay);
                    controls.appendChild(btnStop);
                    configContainer.appendChild(controls);
                }
            }
        };

        typeSelect.addEventListener('change', () => {
            // Force update value
            node.currentValue.type = typeSelect.value;
            this.editor.saveState();
            updateUI();
            this.editor.refreshExecution(); // Re-compile script to switch from Device -> File logic
        });
        updateUI();
    }

    renderMidiNodeUI(node, container) {
        if (!node.currentValue) node.currentValue = {};
        container.innerHTML = '';

        // Title Label
        const titleLabel = document.createElement('div');
        titleLabel.innerText = node.name;
        titleLabel.classList.add('node-title-label');
        container.appendChild(titleLabel);

        // MIDI Port Container
        const portContainer = document.createElement('div');
        portContainer.classList.add('source-config-container');

        const portLabel = document.createElement('label');
        portLabel.innerText = 'MIDI Input Port';
        portLabel.classList.add('param-label');
        portContainer.appendChild(portLabel);

        // Request MIDI Access Button
        const btnRequestMidi = document.createElement('button');
        btnRequestMidi.innerText = 'Request MIDI Access';
        btnRequestMidi.classList.add('btn-request-midi');

        const portSelect = document.createElement('select');
        portSelect.classList.add('param-input');

        const populateMidiPorts = async () => {
            portSelect.innerHTML = '';
            try {
                if (!navigator.requestMIDIAccess) {
                    const opt = document.createElement('option');
                    opt.innerText = 'MIDI not supported in this browser';
                    portSelect.appendChild(opt);
                    return;
                }

                const midiAccess = await navigator.requestMIDIAccess();
                const inputs = Array.from(midiAccess.inputs.values());

                if (inputs.length === 0) {
                    const opt = document.createElement('option');
                    opt.innerText = 'No MIDI devices found';
                    opt.value = '';
                    portSelect.appendChild(opt);
                } else {
                    inputs.forEach((input) => {
                        const opt = document.createElement('option');
                        opt.value = input.id;
                        opt.innerText = input.name || `MIDI Device (${input.id})`;
                        if (node.currentValue.portId === input.id) opt.selected = true;
                        portSelect.appendChild(opt);
                    });

                    // Default to first if no selection
                    if (!node.currentValue.portId && inputs.length > 0) {
                        node.currentValue.portId = inputs[0].id;
                    }
                }
            } catch (e) {
                console.error('MIDI Access Error:', e);
                const opt = document.createElement('option');
                opt.innerText = 'MIDI Access Denied';
                opt.value = '';
                portSelect.appendChild(opt);
            }
        };

        btnRequestMidi.onclick = async () => {
            await populateMidiPorts();
            this.editor.saveState();
            this.editor.refreshExecution(); // Re-compile to setup MIDI listeners
        };

        portSelect.addEventListener('change', () => {
            node.currentValue.portId = portSelect.value;
            if (node.currentValue.portId) {
                node.clearError();
                this.editor.openDrawer(node); // Refresh drawer to remove error
            }
            // Update clock sync if this node has it enabled
            if (node.currentValue.syncClock) {
                window._midiClockState.activePortId = node.currentValue.portId;
            }
            this.editor.saveState();
            this.editor.refreshExecution(); // Re-compile to setup MIDI listeners
        });

        portContainer.appendChild(btnRequestMidi);
        portContainer.appendChild(portSelect);
        container.appendChild(portContainer);

        // Initial populate
        populateMidiPorts().then(() => {
            this.editor.saveState();
            this.editor.refreshExecution(); // Ensure MIDI listeners are setup on initial load
        });

        // ================================
        // MIDI Clock Sync Checkbox
        // ================================
        const clockContainer = document.createElement('div');
        clockContainer.classList.add('source-config-container');
        clockContainer.style.marginTop = '15px';

        const clockLabel = document.createElement('label');
        clockLabel.classList.add('param-label');
        clockLabel.style.display = 'flex';
        clockLabel.style.alignItems = 'center';
        clockLabel.style.gap = '8px';
        clockLabel.style.cursor = 'pointer';

        const clockCheckbox = document.createElement('input');
        clockCheckbox.type = 'checkbox';
        clockCheckbox.checked = node.currentValue.syncClock || false;
        clockCheckbox.style.width = '18px';
        clockCheckbox.style.height = '18px';
        clockCheckbox.style.cursor = 'pointer';

        const clockText = document.createElement('span');
        clockText.innerText = 'Sync MIDI Clock';

        clockLabel.appendChild(clockCheckbox);
        clockLabel.appendChild(clockText);
        clockContainer.appendChild(clockLabel);

        // Clock sync description
        const clockDesc = document.createElement('div');
        clockDesc.style.fontSize = '11px';
        clockDesc.style.color = '#888';
        clockDesc.style.marginTop = '5px';
        clockDesc.innerText = 'Override global BPM with external MIDI clock from this device';
        clockContainer.appendChild(clockDesc);

        clockCheckbox.addEventListener('change', () => {
            const isEnabled = clockCheckbox.checked;

            if (isEnabled) {
                // Mutex: Disable sync on all other MIDI nodes
                this.editor.nodes.forEach(otherNode => {
                    if (otherNode.type === 'midi' && otherNode.id !== node.id) {
                        if (otherNode.currentValue?.syncClock) {
                            otherNode.currentValue.syncClock = false;
                            // Update node body if visible
                            this.updateMidiNodeClockDisplay(otherNode);
                        }
                    }
                });

                // Enable on this node
                node.currentValue.syncClock = true;
                window._midiClockState.activePortId = node.currentValue.portId;
                window._midiClockState.beatDurations = [];
                window._midiClockState.beatStartTime = 0;
                window._midiClockState.pulseInBeat = 0;
                window._midiClockState.bpm = 0;
                console.log('[MIDI Clock] Sync enabled for port:', node.currentValue.portId);
            } else {
                // Disable on this node
                node.currentValue.syncClock = false;
                window._midiClockState.activePortId = null;
                window._midiClockState.bpm = 0;
                console.log('[MIDI Clock] Sync disabled');
            }

            // Update node body display
            this.updateMidiNodeClockDisplay(node);

            this.editor.saveState();
            this.editor.refreshExecution();
        });

        container.appendChild(clockContainer);

        // Delete Button
        const deleteContainer = document.createElement('div');
        deleteContainer.classList.add('delete-container');
        deleteContainer.style.marginTop = '20px';
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Node';
        deleteBtn.classList.add('btn-delete-node');
        deleteBtn.onclick = () => {
            // If this node had clock sync, clear it
            if (node.currentValue.syncClock) {
                window._midiClockState.activePortId = null;
            }
            this.editor.removeNode(node.id);
            this.selectedNode = null;
            this.editor.closeDrawer();
        };
        deleteContainer.appendChild(deleteBtn);
        container.appendChild(deleteContainer);
    }

    // Helper to update MIDI node body clock display
    updateMidiNodeClockDisplay(node) {
        if (node.type !== 'midi') return;

        const body = node.element?.querySelector('.node-body');
        if (!body) return;

        // Find or create clock label
        let clockLabel = body.querySelector('.node-clock-label');

        if (node.currentValue?.syncClock) {
            if (!clockLabel) {
                clockLabel = document.createElement('div');
                clockLabel.classList.add('node-clock-label');
                clockLabel.style.fontSize = '10px';
                clockLabel.style.color = '#4fc3f7';
                clockLabel.style.marginTop = '5px';
                clockLabel.style.fontWeight = 'bold';
                body.appendChild(clockLabel);
            }
            const bpm = window._midiClockState?.bpm || '--';
            clockLabel.innerText = `CLOCK: ${bpm} BPM`;
        } else {
            if (clockLabel) {
                clockLabel.remove();
            }
        }
    }

    // Restore MIDI clock sync state after loading a patch
    restoreMidiClockSync() {
        // Initialize clock state if not exists
        if (!window._midiClockState) {
            window._midiClockState = {
                activePortId: null,
                bpm: 0,
                rawBpm: 0,
                beatStartTime: 0,
                pulseInBeat: 0,
                beatDurations: [],
                isRunning: false,
                pulseCount: 0
            };
        }

        // Find MIDI node with syncClock enabled
        let syncNode = null;
        this.editor.nodes.forEach(node => {
            if (node.type === 'midi' && node.currentValue?.syncClock) {
                syncNode = node;
            }
        });

        if (syncNode) {
            // Set active port for clock sync
            window._midiClockState.activePortId = syncNode.currentValue.portId;
            window._midiClockState.beatDurations = [];
            window._midiClockState.beatStartTime = 0;
            window._midiClockState.pulseInBeat = 0;
            window._midiClockState.bpm = 0;

            // Update node display
            this.updateMidiNodeClockDisplay(syncNode);

            console.log('[MIDI Clock] Restored sync for port:', syncNode.currentValue.portId);
        } else {
            // No sync enabled, clear state
            window._midiClockState.activePortId = null;
        }
    }

    // Helper to render one param (reusing renderNodeParams logic partially)
    renderSingleParam(node, container, key) {
        const p = node.config.params[key];
        if (!p) {
            console.warn(`Parameter '${key}' not found in config for node '${node.type}'`);
            return document.createElement('div'); // Return empty div to prevent errors
        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('param-wrapper');

        // Label container with hint icon support
        const labelContainer = document.createElement('div');
        labelContainer.classList.add('param-label-container');

        const label = document.createElement('label');
        label.innerText = key;
        label.classList.add('param-label');
        labelContainer.appendChild(label);

        // Add hint icon if hint property exists or from external hints file
        const hint = p.hint || getParamHint(node.type, key);
        if (hint) {
            const hintIcon = document.createElement('span');
            hintIcon.innerText = 'ℹ️';
            hintIcon.title = hint;
            hintIcon.classList.add('param-hint');
            labelContainer.appendChild(hintIcon);
        }

        wrapper.appendChild(labelContainer);

        // Simplified rendering logic for single types used in 'init'
        if (p.type === 'select') {
            const select = document.createElement('select');
            select.classList.add('param-input');
            (p.values || []).forEach(optVal => {
                const option = document.createElement('option');
                // Support both simple strings and {value, label} objects
                const val = typeof optVal === 'object' ? optVal.value : optVal;
                const lbl = typeof optVal === 'object' ? optVal.label : optVal;
                option.value = val;
                option.innerText = lbl;
                if (val === (node.currentValue?.[key] ?? p.default)) option.selected = true;
                select.appendChild(option);
            });
            select.addEventListener('change', () => {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue[key] = select.value;
                this.editor.saveState();
            });
            wrapper.appendChild(select);
        } else if (p.type === 'int' || p.type === 'float') {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('param-input');
            input.value = node.currentValue?.[key] ?? p.default;
            input.step = p.type === 'float' ? 0.01 : 1;
            input.addEventListener('input', () => {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue[key] = input.value;
                this.editor.saveState();
            });
            wrapper.appendChild(input);
        } else if (p.type === 'textarea') {
            const area = document.createElement('textarea');
            area.classList.add('param-input', 'param-textarea');
            area.value = node.currentValue?.[key] ?? p.default;
            area.addEventListener('input', () => {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue[key] = area.value;
                this.editor.saveState();
            });
            wrapper.appendChild(area);
        } else if (p.type === 'range') {
            // Range type: two number inputs for from/to
            const rangeContainer = document.createElement('div');
            rangeContainer.classList.add('range-container');

            const val = node.currentValue?.[key] || (Array.isArray(p.default) ? p.default : [0, 1]);
            const valFrom = Array.isArray(val) ? val[0] : val;
            const valTo = Array.isArray(val) ? val[1] : val;

            const inputFrom = document.createElement('input');
            inputFrom.type = 'number';
            inputFrom.value = valFrom;
            inputFrom.step = 0.01;
            inputFrom.placeholder = 'From';
            inputFrom.classList.add('param-input');

            const inputTo = document.createElement('input');
            inputTo.type = 'number';
            inputTo.value = valTo;
            inputTo.step = 0.01;
            inputTo.placeholder = 'To';
            inputTo.classList.add('param-input');

            const updateRange = () => {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue[key] = [parseFloat(inputFrom.value) || 0, parseFloat(inputTo.value) || 1];
                this.editor.saveState();
            };

            inputFrom.addEventListener('input', updateRange);
            inputTo.addEventListener('input', updateRange);

            rangeContainer.appendChild(inputFrom);
            rangeContainer.appendChild(inputTo);
            wrapper.appendChild(rangeContainer);
        } else if (p.type === 'checkbox') {
            // Checkbox type: toggle switch
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.gap = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${node.id}_${key}_checkbox`;
            checkbox.checked = node.currentValue?.[key] ?? p.default ?? false;
            checkbox.style.width = '18px';
            checkbox.style.height = '18px';
            checkbox.style.cursor = 'pointer';

            const checkLabel = document.createElement('label');
            checkLabel.htmlFor = checkbox.id;
            checkLabel.innerText = checkbox.checked ? 'Enabled' : 'Disabled';
            checkLabel.style.cursor = 'pointer';
            checkLabel.style.color = checkbox.checked ? '#4caf50' : '#888';

            checkbox.addEventListener('change', () => {
                if (!node.currentValue) node.currentValue = {};
                node.currentValue[key] = checkbox.checked;
                checkLabel.innerText = checkbox.checked ? 'Enabled' : 'Disabled';
                checkLabel.style.color = checkbox.checked ? '#4caf50' : '#888';
                this.editor.saveState();
            });

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkLabel);
            wrapper.appendChild(checkboxContainer);
        }

        container.appendChild(wrapper);
        return wrapper;
    }

    renderArrayNodeUI(node, container) {
        // Initialize values if empty
        if (!node.currentValue) node.currentValue = {};
        if (!node.currentValue.values) node.currentValue.values = [0.1, 0.2]; // Default

        container.innerHTML = ''; // Clear previous

        // Add Name Label inside Body (User Request)
        const nameLabel = document.createElement('div');
        nameLabel.innerText = node.name;
        nameLabel.classList.add('node-title-label');
        container.appendChild(nameLabel);

        const updateState = () => this.editor.saveState();

        const listContainer = document.createElement('div');
        listContainer.classList.add('array-list-container');

        const renderItems = () => {
            listContainer.innerHTML = '';
            node.currentValue.values.forEach((val, index) => {
                const itemRow = document.createElement('div');
                itemRow.classList.add('array-item-row');

                const input = document.createElement('input');
                input.type = 'number';
                input.value = val;
                input.step = 0.01;
                input.classList.add('param-input');

                input.addEventListener('input', (e) => {
                    node.currentValue.values[index] = parseFloat(e.target.value) || 0;
                    updateState();
                });

                const removeBtn = document.createElement('button');
                removeBtn.innerText = 'X';
                removeBtn.classList.add('btn-remove');

                removeBtn.onclick = () => {
                    node.currentValue.values.splice(index, 1);
                    renderItems();
                    updateState();
                };

                itemRow.appendChild(input);
                itemRow.appendChild(removeBtn);
                listContainer.appendChild(itemRow);
            });
        };

        const addBtn = document.createElement('button');
        addBtn.innerText = '+ Add Value';
        addBtn.classList.add('btn-add');

        addBtn.onclick = () => {
            node.currentValue.values.push(0.5); // Default new value
            renderItems();
            updateState();
        };

        renderItems();

        container.appendChild(listContainer);
        container.appendChild(addBtn);

        // Render Standard Params (e.g. fast, ease) below the list
        this.renderNodeParams(node, container);

        // Add Delete Button
        const deleteContainer = document.createElement('div');
        deleteContainer.classList.add('delete-container');
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Node';
        deleteBtn.classList.add('btn-delete-node');
        deleteBtn.onclick = () => {
            this.editor.removeNode(node.id);
            this.selectedNode = null;
            this.editor.closeDrawer();
        };
        deleteContainer.appendChild(deleteBtn);
        container.appendChild(deleteContainer);
    }
    updateImplicitConnections() {
        // 1. Identify all implicit connections
        // Map<string, {sourceId, targetId}>
        const requiredLinks = new Map();

        this.editor.nodes.forEach(node => {
            if (!node.config.params) return;

            Object.keys(node.config.params).forEach(key => {
                const param = node.config.params[key];
                const val = node.currentValue?.[key];

                // Check for 'multiple' type with 'nodeList' active
                if (param.type === 'multiple' && val && typeof val === 'object' && val.activeIndex !== undefined) {
                    const activeItem = param.items[val.activeIndex];
                    if (activeItem.item === 'nodeList' && val.value) {
                        const sourceId = val.value;

                        // Verify source node still exists
                        if (this.editor.nodes.has(sourceId)) {
                            const targetId = node.id;
                            const linkId = `implicit_${sourceId}_${targetId}`;
                            requiredLinks.set(linkId, { sourceId, targetId });
                        }
                    }
                }
            });
        });

        // 2. Remove obsolete lines
        for (const [id, el] of this.editor.implicitConnections) {
            if (!requiredLinks.has(id)) {
                el.remove();
                this.editor.implicitConnections.delete(id);
            }
        }

        // 3. Create or Update lines
        requiredLinks.forEach((link, id) => {
            let el = this.editor.implicitConnections.get(id);
            if (!el) {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                el.classList.add('connection-line', 'dashed');
                el.style.strokeDasharray = '5, 5'; // Ensure dash
                el.style.pointerEvents = 'none';
                this.editor.svgLayer.appendChild(el);
                this.editor.implicitConnections.set(id, el);
            }

            // Ensure element is attached to SVG layer (in case it was cleared externally)
            if (!this.editor.svgLayer.contains(el)) {
                this.editor.svgLayer.appendChild(el);
            }

            const sourceNode = this.editor.nodes.get(link.sourceId);
            const targetNode = this.editor.nodes.get(link.targetId);

            if (sourceNode && targetNode) {
                // Calculate positions using canvas coordinates
                // Since this uses standard connection-line class, it needs to be updated with node position

                // Source: Right Center
                const p1 = {
                    x: sourceNode.position.x + sourceNode.element.offsetWidth,
                    y: sourceNode.position.y + sourceNode.element.offsetHeight / 2
                };

                // Target: Center Top (Standard param input)
                const p2 = {
                    x: targetNode.position.x + targetNode.element.offsetWidth / 2,
                    y: targetNode.position.y
                };

                // Bezier Control Points
                // C1 (Source Out) -> Right
                const c1 = { x: p1.x + 50, y: p1.y };
                // C2 (Target In) -> Up (since p2 is top)
                const c2 = { x: p2.x, y: p2.y - 50 };

                const d = `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
                el.setAttribute('d', d);
            }
        });
    }


}
