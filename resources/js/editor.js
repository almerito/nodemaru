import { createNodeInstance } from './system_nodes/BaseNodeFactory.js';
import AudioNode from './system_nodes/AudioNode.js';
import { NodeGraph } from 'nodegraph-js';
import 'nodegraph-js/style.css';
import * as bootstrap from 'bootstrap';
import toastr from 'toastr';
import {
    createShaderNode,
    matchesAcceptRule,
    findMatchingNodes,
    PARAM_TYPE_OPTIONS,
    SlotShape,
    getNextNodeIndex
} from './node_manager.js';
import { HydraManager } from './hydra_manager'; // Init Hydra Engine (Fork)
import { HistoryManager } from './history_manager.js';
import { loadCustomShaders, resolveAsset, fetchAudioWithFallback } from './hydra_utils.js';

let graph = null;

export function createEditor(container) {
    // Initialize NodeGraph
    graph = new NodeGraph(container, {
        grid: {
            enabled: true,
            step: 20
        },
        zoom: {
            min: 0.25,
            max: 4
        },
        snapToGrid: true,
        bidirectional: true,
        enforceDirection: true,
        enforceSlotGroups: true,
    });
    window.graph = graph;

    // Initialize Hydra Manager properly
    window.hydraManager = new HydraManager(graph);

    // Expose Utils for Modals & Runtime Fallbacks
    window.loadCustomShaders = loadCustomShaders;
    window.resolveAsset = resolveAsset;
    window.fetchAudioWithFallback = fetchAudioWithFallback;
    // Shim for legacy validateInitNode calls
    window.validateInitNode = function () { console.debug('Legacy validateInitNode called'); };

    // Initialize Global Settings
    graph.globalSettings = {
        bpm: 30,
        speed: 1,
        renderEngine: 'glsl3',
        numOutputs: 4,
        numSources: 4
    };

    // Initialize Recording Settings
    graph.recordingSettings = {
        fps: 60,
        format: 'webm',
        qualityMbps: 50,
        audioEnabled: false,
        audioSource: 'internal', // 'internal' (Nodemaru), 'external' (device), 'both'
        audioDeviceId: '',
        audioGain: 100
    };

    // Load saved settings if any
    try {
        const savedRec = localStorage.getItem('Nodemaru-recording-settings');
        if (savedRec) {
            graph.recordingSettings = { ...graph.recordingSettings, ...JSON.parse(savedRec) };
        }
        // Global settings usually saved with patch, but we can check for local overrides if implemented later
    } catch (e) {
        console.warn('Failed to load settings', e);
    }

    // Event listeners
    graph.on('node:select', (node) => {
        if (!node) return;
        //console.log('Node selected:', node.id);
        if (node.data?.shaderData) {
            openNodeParamsDrawer(node);
        }
    });

    graph.on('connection:create', (conn) => {
        //console.log('Connection created:', conn.id);
    });

    graph.on('connection:remove', (id) => {
        //console.log('Connection removed:', id);
    });

    graph.on('node:remove', (nodeOrId) => {
        if (!nodeOrId) return;
        const id = nodeOrId.id || nodeOrId;
        //console.log('Node removed:', id);
        if (currentSelectedNode && currentSelectedNode.id === id) {
            closeNodeParamsDrawer();
        }
    });

    // Global MIDI Clock State
    window._midiClockState = {
        activePortId: null,
        bpm: 0,
        beatStartTime: 0,
        pulseInBeat: 0,
        beatDurations: [],
        isRunning: false
    };

    // Close drawer when clicking on empty canvas (deselect)
    graph.container.addEventListener('click', (e) => {
        if (e.target === graph.container ||
            e.target.classList.contains('ng-viewport') ||
            e.target.classList.contains('ng-grid')) {
            closeNodeParamsDrawer();
        }
    });

    // Connection validation
    graph.on('connection:validate', (context) => {
        const { source, target } = context;

        // Check if accept_nodes or accept_params
        if (source.group == target.group) {
            // Find in and out nodes
            let inNode, outNode
            if (source.type == 'input') {
                inNode = source.node
                outNode = target.node
            } else {
                inNode = target.node
                outNode = source.node
            }

            if (source.group == 'nodes') {
                // Check accept_nodes (whitelist)
                if (inNode.data?.shaderData?.accept_nodes) {
                    if (!matchesAcceptRule(outNode.data?.shaderData, inNode.data.shaderData.accept_nodes)) {
                        context.valid = false;
                        return;
                    }
                }
                // Check refuse_nodes (blacklist)
                if (inNode.data?.shaderData?.refuse_nodes) {
                    if (matchesAcceptRule(outNode.data?.shaderData, inNode.data.shaderData.refuse_nodes)) {
                        context.valid = false;
                        return;
                    }
                }
            } else {
                // Check accept_params (whitelist)
                if (inNode.data?.shaderData?.accept_params) {
                    if (!matchesAcceptRule(outNode.data?.shaderData, inNode.data.shaderData.accept_params)) {
                        context.valid = false;
                        return;
                    }
                }
                // Check refuse_params (blacklist)
                if (inNode.data?.shaderData?.refuse_params) {
                    if (matchesAcceptRule(outNode.data?.shaderData, inNode.data.shaderData.refuse_params)) {
                        context.valid = false;
                        return;
                    }
                }
            }
        }
    });

    graph.contextMenu.addItem('canvas', {
        id: 'add-node',
        label: 'Add Node',
        icon: '➕',
        action: (context) => {
            // Store the click position for later use
            window._nodeAddPosition = context.position;
            // Open the node selector modal
            openNodeSelectorModal();
        }
    });

    // Double-click on canvas to add node
    graph.container.addEventListener('dblclick', (e) => {
        // Only trigger if clicking on container or grid, not on nodes
        if (e.target === graph.container ||
            e.target.classList.contains('ng-grid') ||
            e.target.classList.contains('ng-viewport') ||
            e.target.classList.contains('ng-container')) {
            // Calculate position in graph coordinates
            const rect = graph.container.getBoundingClientRect();
            const viewportState = graph.viewport.getState();
            const x = (e.clientX - rect.left - viewportState.panX) / viewportState.scale;
            const y = (e.clientY - rect.top - viewportState.panY) / viewportState.scale;
            window._nodeAddPosition = { x, y };
            openNodeSelectorModal();
        }
    });

    // Track mouse position globally for keyboard shortcuts
    graph.container.addEventListener('mousemove', (e) => {
        const rect = graph.container.getBoundingClientRect();
        const viewportState = graph.viewport.getState();
        window._lastMousePosition = {
            x: (e.clientX - rect.left - viewportState.panX) / viewportState.scale,
            y: (e.clientY - rect.top - viewportState.panY) / viewportState.scale
        };
    });

    // Handle Node Creation for Out/Init (Limit & Auto-Target)
    graph.on('node:create', (context) => {
        const nodeType = context.config.data?.shaderData?.name;
        if (!nodeType) return;

        if (nodeType === 'out' || nodeType === 'init') {
            const isOut = nodeType === 'out';
            const max = isOut ? (graph.globalSettings.numOutputs || 4) : (graph.globalSettings.numSources || 4);

            // Count existing nodes of this type
            // graph.nodes is a Map in nodegraph-js, so we convert to array
            const allNodes = Array.from(graph.nodes.values());
            const existing = allNodes.filter(n => n.data?.shaderData?.name === nodeType);

            if (existing.length >= max) {
                context.cancel = true;
                toastr.warning(`Cannot add more ${nodeType} nodes. Limit is ${max}. Increase in Settings.`);
                return;
            }

            // Find used targets
            const usedTargets = new Set();
            existing.forEach(n => {
                // Check both paramState and currentValue for safety
                // 'out' uses 'target' param (default 0). 'init' uses 'target' param (default 0).
                let val = n.data?.paramState?.target?.value;
                if (val === undefined) val = n.data?.currentValue?.target;
                if (val !== undefined) usedTargets.add(parseInt(val));
            });

            // Assign to new node config
            if (!context.config.data) context.config.data = {};
            if (!context.config.data.paramState) context.config.data.paramState = {};

            // CHECK IF ALREADY DEFINED (Deserialization / Load)
            // If we are loading, these values might already be set. We respect them if present.
            const existingParam = context.config.data.paramState.target?.value;
            const existingCurrent = context.config.data.currentValue?.target;

            if (existingParam !== undefined || existingCurrent !== undefined) {
                // Already has a value, do NOT overwrite logic
                //console.log(`[Editor] Skipping auto-assign for ${nodeType}, found existing target:`, existingParam ?? existingCurrent);
                return;
            }

            // Find first free slot
            let freeSlot = 0;
            for (let i = 0; i < max; i++) {
                if (!usedTargets.has(i)) {
                    freeSlot = i;
                    break;
                }
            }

            // Set in paramState (UI)
            context.config.data.paramState.target = { value: freeSlot };

            // Set in currentValue (Runtime/Compiler)
            if (!context.config.data.currentValue) context.config.data.currentValue = {};
            context.config.data.currentValue.target = freeSlot;

            //console.log(`[Editor] Auto-assigned target ${freeSlot} to new ${nodeType} node.`);
        }
    });

    // Initialize Hydra Manager (Engine)
    graph.hydraManager = new HydraManager(graph);

    // Defer initialization to allow DOM to settle
    setTimeout(() => {
        graph.hydraManager.initPreview('library-preview-canvas').catch(console.error);
    }, 100);

    // Initialize MIDI Access
    graph.midiInputs = new Map();

    // Initialize History
    const history = new HistoryManager(graph, window.sceneManager);
    window.historyManager = history;

    // Node Added (Includes Paste/Duplicate)
    graph.on('node:add', (n) => {
        // Initialize BaseNode instance if needed (for deserialized nodes)
        // Initialize BaseNode instance if needed (for deserialized nodes)
        if (n && n.data?.shaderData?.classname && !n._baseNodeInstance) {
            // Static usage
            const instance = createNodeInstance(n.data.shaderData.classname, n);
            if (instance) {
                n._baseNodeInstance = instance;
                // Render body content if container exists
                const bodyContainer = n.element?.querySelector('.ng-node-body');
                if (bodyContainer) {
                    // Clear previous content just in case
                    bodyContainer.innerHTML = '';
                    instance.renderNodeBody(bodyContainer);
                }
            }
        }

        history.startDebouncedPush('node:add');
    });

    graph.on('node:remove', () => history.pushState('node:remove'));
    graph.on('connection:create', () => history.pushState('connection:create'));
    graph.on('connection:remove', () => history.pushState('connection:remove'));

    // Generic History Hook: "Any Change"
    // We listen for mouseup on the graph container to capture end of interactions (Move, Connect, Resize, etc)
    // And keyup for deletions or shortcuts
    graph.container.addEventListener('mouseup', () => {
        // Use a slight delay to allow graph to update internal state
        if (window.historyManager) {
            window.historyManager.pushIfChanged('canvas_interaction');
        }
    });

    graph.container.addEventListener('keyup', (e) => {
        // Ignroe navigation keys if needed, but safe to check
        if (window.historyManager && !e.ctrlKey && !e.metaKey) {
            window.historyManager.pushIfChanged('keyboard_interaction');
        }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                history.redo();
            } else {
                history.undo();
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            history.redo();
        }
    });

    // Verify and fix ID/Index on standard paste using usage provided events
    graph.on('clipboard:pasting', (e) => {
        // Safety check
        if (!e || !e.data) return;

        // e.data is the NodeConfig that will be passed to addNode
        // e.originalId is the ID of the source node
        //console.log('Clipboard Pasting Intercept:', e);

        // 1. Assign New Visual Index
        const newIndex = getNextNodeIndex();

        // Ensure data object exists
        if (!e.data.data) e.data.data = {};

        // Update Index in Data
        e.data.data.nodeIndex = newIndex;
        e.data.nodeIndex = newIndex;

        // 2. Recover Data (ShaderData, Color, Params)
        // Try to recover full data from original node
        let sourceData = e.data.data; // Default to what's in clipboard

        // If critical data missing, fallback to retrieval
        if (!sourceData.shaderData || !sourceData.nodeColor) {
            if (e.originalId) {
                const originalNode = graph.getNode(e.originalId);
                if (originalNode && originalNode.data) {
                    //console.log('Recovering full data from original node:', originalNode);
                    // Deep clone logic
                    try {
                        const clone = JSON.parse(JSON.stringify(originalNode.data));
                        // Merge, prioritizing source but filling gaps
                        sourceData = { ...clone, ...sourceData };
                        // Ensure index is NEW
                        sourceData.nodeIndex = newIndex;
                    } catch (err) { console.error('Data clone error', err); }
                }
            }
        }

        // Apply merged data back
        e.data.data = sourceData;

        // 2.5 Fix Output Slot for 'out' nodes during paste
        // Pasted node retains original output target (e.g. 0), causing clash
        const shaderData = sourceData.shaderData;
        if (shaderData && shaderData.name === 'out') {
            // Find used slots (graph.nodes is Map)
            const usedSlots = new Set();
            if (graph.nodes && graph.nodes.forEach) {
                graph.nodes.forEach(n => {
                    if (n && n.data?.shaderData?.name === 'out') {
                        // Check target property (consistent with OutNode.js)
                        let val = n.data.currentValue?.target;
                        if (val !== undefined) usedSlots.add(parseInt(val));
                        else usedSlots.add(0);
                    }
                });
            } else if (graph.nodes instanceof Map) {
                graph.nodes.forEach(n => {
                    if (n && n.data?.shaderData?.name === 'out') {
                        let val = n.data.currentValue?.target;
                        if (val !== undefined) usedSlots.add(parseInt(val));
                        else usedSlots.add(0);
                    }
                });
            }

            // Find first free slot (0-3)
            let freeSlot = 0;
            for (let i = 0; i < 4; i++) {
                if (!usedSlots.has(i)) {
                    freeSlot = i;
                    break;
                }
            }

            // Update currentValue in the pasted data
            if (!e.data.data.currentValue) e.data.data.currentValue = {};
            e.data.data.currentValue.target = freeSlot;
            // Also update paramState for UI consistency
            if (!e.data.data.paramState) e.data.data.paramState = {};
            e.data.data.paramState.target = { value: freeSlot };

            //console.log(`[Paste] Re-assigned Output Node target to ${freeSlot}`);
        }

        if (shaderData) {
            const label = shaderData.label || 'Node';
            const nodeColor = sourceData.nodeColor || e.data.header?.style?.background || '#4caf50';

            e.data.header = {
                content: `<strong>#${newIndex} - ${label}</strong>`,
                style: {
                    background: nodeColor,
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '14px'
                }
            };
        }
    });

    // Ensure state sync on paste completion (optional, for safety)
    graph.on('clipboard:paste', (e) => {
        if (!e || !e.nodes) return;
        //console.log('Paste completed:', e.nodes);
        e.nodes.forEach(node => {
            if (!node) return; // Safety check
            // Ensure runtime properties are synced from data for legacy access
            if (node.data) {
                // ... sync logic ...
                if (node.data.nodeIndex !== undefined) node.nodeIndex = node.data.nodeIndex;
                if (node.data.nodeColor) node._nodeColor = node.data.nodeColor;
                if (node.data.paramState) node._paramState = node.data.paramState;
                if (node.data.currentValue) node.currentValue = node.data.currentValue;

                // Validate state
                if (node.data.shaderData) {
                    if (node.data.shaderData.name === 'init') validateInitNode(node);
                    if (node.data.shaderData.name === 'audio') {
                        // import dynamically if not available? It's imported at top.
                        // But ensure function exists
                        if (typeof validateAudioNode !== 'undefined') validateAudioNode(node);
                    }
                    if (node.data.shaderData.name === 'midi') {
                        if (typeof validateMidiNode !== 'undefined') validateMidiNode(node);
                    }
                }
            }
        });
    });

    //console.log('NodeGraph Editor initialized');

    return graph;
}

// Helper to open node selector modal
function openNodeSelectorModal() {
    //console.log('openNodeSelectorModal called'); // DEBUG
    const modalElement = document.getElementById('nodeSelectorModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
}

// Node parameters drawer
let currentSelectedNode = null;

function openNodeParamsDrawer(node) {
    currentSelectedNode = node;
    const drawer = document.getElementById('nodeParamsDrawer');
    const title = document.getElementById('drawerNodeTitle');
    const content = document.getElementById('drawerContent');

    if (!drawer || !title || !content) return;

    // Ensure we have data
    const shaderData = node.data?.shaderData;
    if (!shaderData) {
        console.error('Node missing shaderData', node);
        return;
    }
    // node.shaderData = shaderData; // REMOVED sync

    // Get node number from index if available
    const nodeIndex = node.nodeIndex !== undefined ? node.nodeIndex : node.data?.nodeIndex;
    const nodeNumber = nodeIndex !== undefined ? nodeIndex : node.id.replace('node-', '');
    title.textContent = `#${nodeNumber} - ${shaderData.label}`;

    // Parse params if it's a JSON string
    let params = shaderData.params;
    if (typeof params === 'string') {
        try {
            params = JSON.parse(params);
        } catch (e) {
            params = null;
        }
    }

    // Check for custom UI handlers via BaseNode architecture
    if (node.data.shaderData.classname) {
        let instance = node._baseNodeInstance;
        if (!instance) {
            instance = createNodeInstance(node.data.shaderData.classname, node);
            node._baseNodeInstance = instance;
        }

        if (instance) {
            content.innerHTML = '';
            instance.renderInspector(content, renderParam);
            bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
            return;
        }
    }

    // Audio Node (use BaseNode architecture with caching)
    if (node.data.shaderData.name === 'audio') {
        content.innerHTML = '';
        let instance = node._baseNodeInstance;
        if (!instance) {
            // Use static AudioNode
            instance = new AudioNode(node);
            node._baseNodeInstance = instance;
            instance.renderInspector(content, renderParam);
        } else {
            instance.renderInspector(content, renderParam);
        }
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    if (node.data.shaderData.name === 'audio_data') {
        content.innerHTML = '';
        renderAudioDataNodeUI(node, content, renderParam);
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    if (node.data.shaderData.name === 'midi') {
        content.innerHTML = '';
        renderMidiNodeUI(node, content, renderParam);
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    if (node.data.shaderData.name === 'midi_data') {
        content.innerHTML = '';
        renderMidiDataNodeUI(node, content, renderParam);
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    if (node.data.shaderData.name === 'init') {
        content.innerHTML = '';
        renderInitNodeUI(node, content);
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    if (node.data.shaderData.name === 'array') {
        content.innerHTML = '';
        renderArrayNodeUI(node, content, renderParam);
        bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
        return;
    }

    content.innerHTML = renderParams(params, node);

    // Show Author
    if (shaderData.author) {
        const authorName = shaderData.author.name || 'Unknown';
        const authorUrl = shaderData.author.url;

        let authorHtml = `<div class="mt-3 pt-3 border-top border-secondary text-muted small">`;
        authorHtml += `<div class="fw-bold">Author</div>`;
        if (authorUrl) {
            authorHtml += `<a href="${authorUrl}" target="_blank" class="text-info text-decoration-none">${authorName} ↗</a>`;
        } else {
            authorHtml += `<span>${authorName}</span>`;
        }
        authorHtml += `</div>`;

        content.innerHTML += authorHtml;
    }

    bootstrap.Offcanvas.getOrCreateInstance(drawer).show();
}

function renderParams(params, node) {
    if (!params || Object.keys(params).length === 0) {
        return '<p class="text-muted small">No parameters</p>';
    }

    // Sort params by order property if available
    const sortedKeys = Object.keys(params).sort((a, b) => {
        const orderA = params[a].order !== undefined ? params[a].order : 999;
        const orderB = params[b].order !== undefined ? params[b].order : 999;
        return orderA - orderB;
    });

    let html = '';
    for (const key of sortedKeys) {
        const param = params[key];
        html += renderParam(key, param, node);
    }
    return html;
}

window.renderParam = renderParam;

function renderParam(key, param, node) {
    if (param.type === 'multiple') {
        return renderMultipleParam(key, param, node);
    }
    // Fallback for other types
    const hint = param.hint || '';
    const hintHtml = hint ? `<span title="${hint}" class="param-hint">ℹ️</span>` : '';

    // Handle Checkbox Type
    if (param.type === 'checkbox') {
        const isChecked = node.data?.paramState?.[key]?.value ?? param.default ?? false;
        return `
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="param-${node.id}-${key}"
                       ${isChecked ? 'checked' : ''}
                       data-param="${key}" data-node="${node.id}"
                       onchange="window._onSimpleParamChange(this)">
                <label class="form-check-label small text-muted" for="param-${node.id}-${key}">
                    ${key} ${hintHtml}
                </label>
            </div>
        `;
    }

    // Handle Range Type (From, To)
    if (param.type === 'range') {
        // Range default is usually [0, 1] or empty
        let currentVal = node.data?.paramState?.[key]?.value ?? param.default ?? [0, 1];
        if (!Array.isArray(currentVal)) currentVal = [0, 1];

        return `
            <div class="mb-3">
                <label class="form-label small text-muted mb-1">${key} ${hintHtml}</label>
                <div class="input-group input-group-sm">
                    <input type="number" step="0.01" class="form-control bg-dark text-white border-secondary" placeholder="From"
                           value="${currentVal[0]}" 
                           data-param="${key}" data-node="${node.id}" data-index="0"
                           onchange="window._onRangeChange(this)">
                    <input type="number" step="0.01" class="form-control bg-dark text-white border-secondary" placeholder="To"
                           value="${currentVal[1]}" 
                           data-param="${key}" data-node="${node.id}" data-index="1"
                           onchange="window._onRangeChange(this)">
                </div>
            </div>
        `;
    }

    // Handle Select Type
    if (param.type === 'select') {
        const currentVal = node.data?.paramState?.[key]?.value ?? param.default ?? '';
        const options = (param.values || []).map(val => {
            // Handle simple string or object {value, label}
            const v = typeof val === 'object' ? val.value : val;
            const l = typeof val === 'object' ? val.label : val;

            // Check for comment/disabled prefix via label
            const strLabel = String(l);
            const isDisabled = strLabel.trim().startsWith('//');

            return `<option value="${v}" ${v === currentVal ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}>${l}</option>`;
        }).join('');

        return `
            <div class="mb-3">
                <label class="form-label small text-muted mb-1">${key} ${hintHtml}</label>
                <select class="form-select form-select-sm bg-dark text-white border-secondary"
                        data-param="${key}" data-node="${node.id}"
                        onchange="window._onSimpleParamChange(this)">
                    ${options}
                </select>
            </div>
        `;
    }

    // Handle textarea
    if (param.type === 'textarea') {
        const currentVal = node.data?.paramState?.[key]?.value ?? param.default ?? '';
        return `
            <div class="mb-3">
                <label class="form-label small text-muted mb-1">${key} ${hintHtml}</label>
                <textarea class="form-control form-control-sm bg-dark text-white border-secondary" rows="3"
                          data-param="${key}" data-node="${node.id}"
                          onchange="window._onSimpleParamChange(this)">${currentVal}</textarea>
            </div>
         `;
    }

    // Default (Text/Number)
    // SPECIAL HANDLING for 'target' param on 'out'/'init' nodes
    if (key === 'target' && (node.data?.shaderData?.name === 'out' || node.data?.shaderData?.name === 'init')) {
        const currentVal = parseInt(node.data?.paramState?.[key]?.value ?? param.default ?? 0);
        const max = node.data.shaderData.name === 'out' ?
            (graph.globalSettings.numOutputs || 4) :
            (graph.globalSettings.numSources || 4);

        let options = '';
        for (let i = 0; i < max; i++) {
            options += `<option value="${i}" ${i === currentVal ? 'selected' : ''}>Target ${i}</option>`;
        }

        return `
            <div class="mb-3">
                 <label class="form-label small text-muted mb-1">${key} ${hintHtml}</label>
                 <select class="form-select form-select-sm bg-dark text-white border-secondary"
                        data-param="${key}" data-node="${node.id}"
                        onchange="window._onTargetChange(this)">
                    ${options}
                </select>
            </div>
        `;
    }

    const currentVal = node.data?.paramState?.[key]?.value ?? param.default ?? '';
    const inputType = (param.type === 'float' || param.type === 'int') ? 'number' : 'text';
    const step = param.type === 'float' ? '0.01' : '1';

    return `
        <div class="mb-3">
            <label class="form-label small text-muted mb-1">
                ${key} ${hintHtml}
            </label>
            <input type="${inputType}" step="${step}" class="form-control form-control-sm bg-secondary text-white border-0" 
                   value="${currentVal}" data-param="${key}" data-node="${node.id}"
                   onchange="window._onSimpleParamChange(this)">
        </div>
    `;
}

window._onTargetChange = function (select) {
    const key = select.dataset.param; // 'target'
    const nodeId = select.dataset.node;
    const newValue = parseInt(select.value);

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        const nodeType = currentSelectedNode.data?.shaderData?.name;

        // Find if any other node has this target
        // graph.nodes is a Map
        const allNodes = Array.from(graph.nodes.values());
        const otherNode = allNodes.find(n =>
            n.id !== nodeId &&
            n.data?.shaderData?.name === nodeType &&
            (parseInt(n.data?.paramState?.target?.value ?? n.data?.currentValue?.target ?? 0) === newValue)
        );

        if (otherNode) {
            // SWAP!
            const oldValue = parseInt(currentSelectedNode.data?.paramState?.target?.value ?? 0);

            //console.log(`[Editor] Swapping targets: Node ${nodeId} (${oldValue}->${newValue}) <-> Node ${otherNode.id} (${newValue}->${oldValue})`);

            // Update Other Node
            if (!otherNode.data.paramState) otherNode.data.paramState = {};
            if (!otherNode.data.paramState.target) otherNode.data.paramState.target = {};
            otherNode.data.paramState.target.value = oldValue;
            // Sync runtime
            if (!otherNode.currentValue) otherNode.currentValue = {};
            otherNode.currentValue.target = oldValue;
            if (otherNode.data.currentValue) otherNode.data.currentValue.target = oldValue;
        }

        // Update Current Node
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};
        currentSelectedNode.data.paramState[key].value = newValue;

        // Sync runtime
        if (!currentSelectedNode.currentValue) currentSelectedNode.currentValue = {};
        currentSelectedNode.currentValue[key] = newValue;
        if (currentSelectedNode.data.currentValue) currentSelectedNode.data.currentValue[key] = newValue;

        // Push History
        if (window.historyManager) window.historyManager.pushState('target:swap');

        // Force Auto-Save
        if (window.persistenceManager) window.persistenceManager.debouncedSave();
    }
};



// Close node parameters drawer
function closeNodeParamsDrawer() {
    currentSelectedNode = null;
    const drawer = document.getElementById('nodeParamsDrawer');
    if (drawer) {
        const instance = bootstrap.Offcanvas.getInstance(drawer);
        if (instance) {
            instance.hide();
        }
    }
}

function renderMultipleParam(key, param, node) {
    // Find constant item to get default value
    const items = param.items || [];
    const constantItem = items.find(i => i.item === 'constant');
    const defaultValue = constantItem?.default ?? '';
    const min = constantItem?.min ?? '';
    const max = constantItem?.max ?? '';

    // Get current param state from node (prefer data)
    const nodeParams = node.data?.paramState || node._paramState || {};
    const currentType = nodeParams[key]?.type || 'constant';
    const currentValue = nodeParams[key]?.value ?? defaultValue;
    const currentSelectedNodeVal = nodeParams[key]?.selectedNode || '';

    const optionsHtml = PARAM_TYPE_OPTIONS.map(o =>
        `<option value="${o.value}" ${o.value === currentType ? 'selected' : ''}>${o.label}</option>`
    ).join('');

    let inputControlHtml = '';

    if (currentType === 'constant') {
        inputControlHtml = `
            <input type="text" class="form-control form-control-sm bg-dark text-white border-secondary" 
                   value="${currentValue}" 
                   data-param="${key}" data-node="${node.id}" data-field="value"
                   placeholder="${min !== '' && max !== '' ? `${min} - ${max}` : ''}"
                   onchange="window._onParamValueChange(this)">
        `;
    } else {
        // Find matching nodes for the current type
        const matchingNodes = findMatchingNodes(graph, currentType);

        const nodeOptions = matchingNodes.map(n => {
            const nodeNumber = n.data?.nodeIndex !== undefined ? n.data.nodeIndex : (n.nodeIndex !== undefined ? n.nodeIndex : n.id.replace('node-', ''));
            const isSelected = n.id === currentSelectedNodeVal ? 'selected' : '';
            return `<option value="${n.id}" ${isSelected}>#${nodeNumber} - ${n.data?.shaderData?.label}</option>`;
        }).join('');

        inputControlHtml = `
            <select class="form-select form-select-sm bg-dark text-white border-secondary"
                    data-param="${key}" data-node="${node.id}" data-field="nodeSelect"
                    onchange="window._onNodeSelectChange(this)">
                <option value="">-- Select Node --</option>
                ${nodeOptions}
            </select>
            <input type="text" class="form-control form-control-sm bg-dark text-white border-secondary" 
                   value="${currentValue}" 
                   data-param="${key}" data-node="${node.id}" data-field="value"
                   style="display: none;"
                   onchange="window._onParamValueChange(this)">
        `;
    }

    const hint = param.hint;
    const hintHtml = hint ? `<span title="${hint}" class="param-hint">ℹ️</span>` : '';

    return `
        <div class="mb-3">
            <label class="form-label small text-muted mb-1">${key} ${hintHtml}</label>
            <div class="input-group input-group-sm">
                <select class="form-select form-select-sm bg-secondary text-white border-0" 
                        style="max-width: 120px;"
                        data-param="${key}" data-node="${node.id}" data-field="type"
                        onchange="window._onParamTypeChange(this)">
                    ${optionsHtml}
                </select>
                ${inputControlHtml}
            </div>
        </div>
    `;
}

// Global handlers for parameter changes
window._onParamTypeChange = function (select) {
    const key = select.dataset.param;
    const nodeId = select.dataset.node;
    const value = select.value;

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        // Ensure data structure exists
        if (!currentSelectedNode.data) currentSelectedNode.data = {};
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};

        // Update data (Persistent)
        currentSelectedNode.data.paramState[key].type = value;
        // Sync root (Legacy)
        if (!currentSelectedNode._paramState) currentSelectedNode._paramState = {};
        currentSelectedNode._paramState = currentSelectedNode.data.paramState;

        // Find the input-group container
        updateParamUI(select.parentElement, key, nodeId, value);

        // History
        if (window.historyManager) window.historyManager.pushState('param:type');
    }
};

window._onParamValueChange = function (input) {
    const key = input.dataset.param;
    const nodeId = input.dataset.node;
    const value = input.value;

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        // Ensure data structure
        if (!currentSelectedNode.data) currentSelectedNode.data = {};
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};

        // Update
        currentSelectedNode.data.paramState[key].value = value;
        // Sync
        if (!currentSelectedNode._paramState) currentSelectedNode._paramState = {};
        currentSelectedNode._paramState = currentSelectedNode.data.paramState;

        // History (Debounce logic implied? Values change fast on type)
        // Usually on 'change' event (ENTER or Blur) it's fine. 'input' would spam.
        // The event listener in renderParam uses 'onchange' which fires on commit.
        if (window.historyManager) window.historyManager.pushState('param:value');
    }
};

window._onNodeSelectChange = function (select) {
    const key = select.dataset.param;
    const nodeId = select.dataset.node;
    const value = select.value;

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        // Ensure data structure
        if (!currentSelectedNode.data) currentSelectedNode.data = {};
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};

        // Update
        currentSelectedNode.data.paramState[key].selectedNode = value;
        // Sync
        if (!currentSelectedNode._paramState) currentSelectedNode._paramState = {};
        currentSelectedNode._paramState = currentSelectedNode.data.paramState;

        // History
        if (window.historyManager) window.historyManager.pushState('param:node');

        // Update implicit connections
        if (window.updateImplicitConnections) {
            window.updateImplicitConnections(currentSelectedNode);
        }
    }
};



window._onSimpleParamChange = function (input) {
    const key = input.dataset.param;
    const nodeId = input.dataset.node;
    const value = input.value;

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        if (!currentSelectedNode.data) currentSelectedNode.data = {};
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};

        currentSelectedNode.data.paramState[key].value = value;

        // Sync legacy paramState
        if (!currentSelectedNode._paramState) currentSelectedNode._paramState = {};
        currentSelectedNode._paramState = currentSelectedNode.data.paramState;

        // Sync legacy currentValue (for compiler)
        if (!currentSelectedNode.currentValue) currentSelectedNode.currentValue = {};
        currentSelectedNode.currentValue[key] = value;

        if (window.historyManager) window.historyManager.pushState('param:val');
    }
};

window._onRangeChange = function (input) {
    const key = input.dataset.param;
    const nodeId = input.dataset.node;
    const index = parseInt(input.dataset.index); // 0 or 1
    const value = parseFloat(input.value) || 0;

    if (currentSelectedNode && currentSelectedNode.id === nodeId) {
        if (!currentSelectedNode.data) currentSelectedNode.data = {};
        if (!currentSelectedNode.data.paramState) currentSelectedNode.data.paramState = {};
        if (!currentSelectedNode.data.paramState[key]) currentSelectedNode.data.paramState[key] = {};

        // Init array if needed
        let arr = currentSelectedNode.data.paramState[key].value;
        if (!Array.isArray(arr)) arr = [0, 1];

        arr[index] = value;
        currentSelectedNode.data.paramState[key].value = arr;

        // Sync legacy paramState
        if (!currentSelectedNode._paramState) currentSelectedNode._paramState = {};
        currentSelectedNode._paramState = currentSelectedNode.data.paramState;

        // Sync legacy currentValue (for compiler)
        if (!currentSelectedNode.currentValue) currentSelectedNode.currentValue = {};
        currentSelectedNode.currentValue[key] = arr;

        if (window.historyManager) window.historyManager.pushState('param:range');
    }
};


// Helper to update UI based on type
function updateParamUI(inputGroup, key, nodeId, value) {
    const existingInput = inputGroup.querySelector('input[data-field="value"]');
    const existingNodeSelect = inputGroup.querySelector('select[data-field="nodeSelect"]');

    if (value === 'constant') {
        if (existingInput) existingInput.style.display = '';
        if (existingNodeSelect) existingNodeSelect.remove();
    } else {
        if (existingInput) existingInput.style.display = 'none';
        if (existingNodeSelect) existingNodeSelect.remove();

        const matchingNodes = findMatchingNodes(graph, value);
        const nodeSelect = document.createElement('select');
        nodeSelect.className = 'form-select form-select-sm bg-dark text-white border-secondary';
        nodeSelect.dataset.param = key;
        nodeSelect.dataset.node = nodeId;
        nodeSelect.dataset.field = 'nodeSelect';
        nodeSelect.onchange = function () { window._onNodeSelectChange(this); };

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Node --';
        nodeSelect.appendChild(emptyOption);

        matchingNodes.forEach(node => {
            const option = document.createElement('option');
            // Use data.nodeIndex if available
            const nodeNumber = node.data?.nodeIndex !== undefined ? node.data.nodeIndex : (node.nodeIndex !== undefined ? node.nodeIndex : node.id.replace('node-', ''));
            // Use data.shaderData.label if available
            const label = node.data?.shaderData?.label || 'Node';

            option.value = node.id;
            option.textContent = `#${nodeNumber} - ${label} `;
            nodeSelect.appendChild(option);
        });

        inputGroup.appendChild(nodeSelect);

        // Restore value
        const state = currentSelectedNode.data?.paramState?.[key] || {};
        if (state.selectedNode) {
            nodeSelect.value = state.selectedNode;
        }
    }
}

export function getGraph() {
    return graph;
}

// Re-export imported helpers for compatibility
export { createShaderNode, SlotShape };

// --- Implicit Connection Logic ---

export function updateImplicitConnections(node) {
    if (!graph || !node) return;

    // 1. Clear existing implicit connections for this node
    // Strategy: Store previous targets in node.data._implicitTargets
    const prevTargets = node.data._implicitTargets || [];
    prevTargets.forEach(targetId => {
        const target = graph.getNode(targetId);
        if (target) {
            try {
                graph.disconnectSymbolic(node, target);
            } catch (e) {
                console.warn('Failed to disconnect symbolic:', e);
            }
        }
    });

    // Reset targets
    const newTargets = new Set();

    // 2. Identify new targets
    const params = node.data.shaderData?.params || {};
    const paramState = node.data.paramState || {};

    // A. Check for "source" param (midi_data, audio_data)
    if (params.source && paramState.source?.selectedNode) {
        newTargets.add(paramState.source.selectedNode);
    }

    // B. Check for "multiple" params
    Object.entries(params).forEach(([key, param]) => {
        if (param.type === 'multiple') {
            const currentType = paramState[key]?.type;
            const selectedNodeId = paramState[key]?.selectedNode;
            // Only if type implies a node reference (like lfo, array, midi_data etc) 
            // AND a node is selected.
            if (currentType !== 'constant' && selectedNodeId) {
                newTargets.add(selectedNodeId);
            }
        }
    });

    // 3. Connect new targets
    newTargets.forEach(targetId => {
        const target = graph.getNode(targetId);
        if (target && target.id !== node.id) {
            try {
                graph.connectSymbolic(node, target, {
                    color: '#888888', // Dashed/Grey
                    width: 2,
                    dash: [5, 5] // Creating dashed line if supported by styles or custom draw
                });
            } catch (e) {
                console.warn('Failed to connect symbolic:', e);
            }
        }
    });

    // Update state
    node.data._implicitTargets = Array.from(newTargets);
}

// Global expose for UI callbacks
window.updateImplicitConnections = updateImplicitConnections;
