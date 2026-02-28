<!-- Save As Modal -->
<div class="modal fade" id="saveAsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Save Patch As...</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="saveAsForm">
                    <div class="mb-3">
                        <label for="patchLabel" class="form-label">Patch Name</label>
                        <input type="text" class="form-control bg-secondary text-white border-0" id="patchLabel"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="patchDescription" class="form-label">Description</label>
                        <textarea class="form-control bg-secondary text-white border-0" id="patchDescription"
                            rows="3"></textarea>
                    </div>
                    <!-- <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="patchPublic" checked>
                        <label class="form-check-label" for="patchPublic">Public Patch</label>
                    </div> -->
                </form>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btnConfirmSaveAs">Save</button>
            </div>
        </div>
    </div>
</div>

<!-- Load Modal (Split View) -->
<div class="modal fade" id="loadModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark text-white border-secondary d-flex flex-column" style="height: 80vh;">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Load Patch</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body p-0 d-flex overflow-hidden" style="flex: 1; min-height: 0;">
                <!-- Left Column: List -->
                <div class="col-4 border-end border-secondary d-flex flex-column h-100">
                    <div class="p-3 border-bottom border-secondary">
                        <input type="text" id="loadSearch" class="form-control bg-secondary text-white border-0"
                            placeholder="Search patches...">
                    </div>
                    <div id="loadPatchesContainer" class="list-group list-group-flush overflow-auto flex-grow-1">
                        <!-- Items injected here -->
                    </div>
                    <div id="loadLoader" class="text-center p-2 text-muted" style="display: none;">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </div>
                </div>

                <!-- Right Column: Preview & Details -->
                <div class="col-8 d-flex flex-column h-100 p-3 bg-black position-relative">
                    <!-- Preview Canvas -->
                    <div class="flex-grow-1 bg-black rounded border border-secondary mb-3 d-flex align-items-center justify-content-center overflow-hidden position-relative"
                        style="min-height: 0;">
                        <canvas id="previewCanvas" class="w-100 h-100" style="object-fit: contain;"></canvas>
                        <div id="previewPlaceholder" class="position-absolute text-muted">Select a patch to preview
                        </div>
                    </div>

                    <!-- Details Panel -->
                    <div id="previewDetails" class="d-none w-100">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h4 class="mb-0" id="previewTitle">Patch Name</h4>
                                <small class="text-info" id="previewAuthor">Author: Name</small> <small
                                    class="text-muted" id="previewDate">• Date</small>
                            </div>
                            <div class="d-flex gap-2">
                                <!-- Buttons also in details for convenience -->
                                <button class="btn btn-outline-danger btn-sm d-none"
                                    id="btnPreviewDelete">Delete</button>
                                <button class="btn btn-primary btn-sm" id="btnPreviewLoad">Load</button>
                            </div>
                        </div>
                        <p class="text-muted small mb-0" id="previewDescription"
                            style="max-height: 60px; overflow-y: auto;">Description here...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    // NOTE: 'setupInfiniteScroll' and 'HydraClass' are exposed globally in app.js and HydraManager.js respectively.

    // --- Save As Logic ---
    const btnConfirmSaveAs = document.getElementById('btnConfirmSaveAs');
    const saveAsModalEl = document.getElementById('saveAsModal');
    let saveAsModal;
    if (window.bootstrap) {
        saveAsModal = new window.bootstrap.Modal(saveAsModalEl);
    }

    btnConfirmSaveAs.addEventListener('click', () => {
        const label = document.getElementById('patchLabel').value;
        const description = document.getElementById('patchDescription').value;
        const isPublic = document.getElementById('patchPublic')?.checked ?? true;

        if (!label) {
            toastr.warning('Please enter a patch name');
            return;
        }

        if (window.persistenceManager) {
            window.persistenceManager.savePatch(true, {
                label,
                description,
                is_public: isPublic
            }).then((success) => {
                if (success) {
                    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(saveAsModalEl);
                    modalInstance.hide();
                    document.getElementById('patch-name').textContent = label;
                }
            });
        }
    });

    // --- Load Modal Logic (Infinite Scroll & Preview) ---
    const loadModalEl = document.getElementById('loadModal');
    let loadModal;
    // Delay initialization until bootstrap is surely ready, or check window.bootstrap
    const initLoadModal = () => {
        if (!loadModal && window.bootstrap) {
            loadModal = new window.bootstrap.Modal(loadModalEl);
        }
    };

    const listContainer = document.getElementById('loadPatchesContainer');
    const loadingElement = document.getElementById('loadLoader');
    const searchInput = document.getElementById('loadSearch');

    const previewCanvas = document.getElementById('previewCanvas');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const previewDetails = document.getElementById('previewDetails');
    const previewTitle = document.getElementById('previewTitle');
    const previewAuthor = document.getElementById('previewAuthor');
    const previewDate = document.getElementById('previewDate');
    const previewDescription = document.getElementById('previewDescription');
    const btnPreviewLoad = document.getElementById('btnPreviewLoad');
    const btnPreviewDelete = document.getElementById('btnPreviewDelete');

    let previewHydra = null;
    let cleanupScroll = null;
    let currentSelectedPatchId = null;

    // Initialize Preview Hydra
    async function initPreviewHydra() {
        if (previewHydra) return;

        // Ensure Library is Loaded
        if (!window.HydraClass) {
            if (window.hydraManager && window.hydraManager.loadLibrary) {
                try {
                    console.log("Loading Hydra Library for Preview...");
                    await window.hydraManager.loadLibrary();
                } catch (e) {
                    console.error("Failed to load Hydra lib via Manager", e);
                }
            }
        }

        if (window.HydraClass) {
            try {
                // console.log("Initializing Preview Hydra instance...");
                const rect = previewCanvas.getBoundingClientRect();
                // Explicitly set canvas size if zero
                if (previewCanvas.width === 0) previewCanvas.width = rect.width || 480;
                if (previewCanvas.height === 0) previewCanvas.height = rect.height || 270;

                previewHydra = new window.HydraClass({
                    canvas: previewCanvas,
                    makeGlobal: false,
                    detectAudio: false,
                    width: previewCanvas.width,
                    height: previewCanvas.height,
                    numOutputs: 4
                });

                // console.log("Preview Hydra Success", previewHydra);

                // Initial kick
                if (previewHydra.synth) {
                    const s = previewHydra.synth;
                    s.solid(0, 0, 0, 0).out(); // Clear
                }

                // Start Loop
                startPreviewLoop();

            } catch (e) {
                console.error("Failed to init preview hydra", e);
            }
        } else {
            console.warn("HydraClass still not available. Preview disabled.");
        }
    }

    // Open Modal Listener
    window.addEventListener('open-load-modal', () => {
        initLoadModal();
        if (loadModal) loadModal.show();

        // Stop MAIN Hydra audio if running
        if (window.hydraManager && window.hydraManager.synth && window.hydraManager.synth.hush) {
            window.hydraManager.synth.hush();
        }

        // Reset UI
        listContainer.innerHTML = '';
        previewPlaceholder.style.display = 'block';
        previewDetails.classList.add('d-none');

        // Clear canvas if Hydra is already active
        if (previewHydra && previewHydra.regl) {
            previewHydra.regl.clear({
                color: [0, 0, 0, 1]
            });
        }

        // Start Scroll
        if (cleanupScroll) cleanupScroll(); // clear previous
        if (window.setupInfiniteScroll) {
            cleanupScroll = window.setupInfiniteScroll(
                listContainer,
                listContainer, // Correct scroll container
                loadingElement,
                '/patches',
                renderItem
            );
        } else {
            console.error("setupInfiniteScroll not found");
        }
    });

    // Initialize Hydra only when modal is fully shown to ensure Canvas has dimensions
    loadModalEl.addEventListener('shown.bs.modal', () => {
        // Ensure canvas has explicit size
        const rect = previewCanvas.parentElement.getBoundingClientRect();
        // Use a fixed aspect or the container size
        // previewCanvas.width = rect.width || 480;
        // previewCanvas.height = rect.height || 270;

        initPreviewHydra();

        // Force resize if already inited (for subsequent opens)
        if (previewHydra && previewHydra.setResolution) {
            previewHydra.setResolution(480, 270);
            startPreviewLoop();
        }
    });

    let previewRaf;

    function startPreviewLoop() {
        if (previewRaf) cancelAnimationFrame(previewRaf);
        const loop = () => {
            if (previewHydra && loadModalEl.classList.contains('show')) {
                previewHydra.tick(16);
                previewRaf = requestAnimationFrame(loop);
            }
        };
        loop();
    }

    // Aggressive Audio Stopper
    function stopPreviewAudio() {
        // 1. Stop Meyda/AudioNode Audio (Global Helpers)
        if (window._stopAllAudioAnalyzers) {
            try {
                window._stopAllAudioAnalyzers();
            } catch (e) {
                console.warn("[LoadModal] Failed to stop audio analyzers", e);
            }
        }

        if (!previewHydra || !previewHydra.synth) return;

        const synth = previewHydra.synth;

        // 2. Pause all media sources BEFORE hush (because hush removes the reference)
        if (synth.s) {
            synth.s.forEach(source => {
                if (source && source.src) {
                    // Check if it looks like a media element (Video or Audio)
                    // Note: HTMLVideoElement inherits from HTMLMediaElement
                    if (source.src instanceof HTMLMediaElement || (source.src.tagName && ['VIDEO', 'AUDIO'].includes(source.src.tagName))) {
                        try {
                            source.src.pause();
                            // source.src.currentTime = 0; // Optional
                        } catch (e) {
                            console.warn("[LoadModal] Could not pause source", e);
                        }
                    }
                }
            });
        }

        // 3. Hush (Hydra Logic - resets sources to canvas)
        if (synth.hush) synth.hush();

        // 4. Clear canvas
        if (previewHydra.regl) {
            previewHydra.regl.clear({
                color: [0, 0, 0, 1]
            });
        }
    }

    // Check cleanup (e.g. pause hydra)
    loadModalEl.addEventListener('hidden.bs.modal', () => {
        if (previewRaf) cancelAnimationFrame(previewRaf);

        stopPreviewAudio();

        // Restore Main Audio (Un-hush?)
        // If we hushed main audio on open, we might want to let it resume only if we DIDN'T load a new patch.
        // But if we just closed the modal without loading, maybe we should resume?
        // For now, let's just make sure Preview is dead.

        currentSelectedPatchId = null;
    });

    // Render List Item (WITH BUTTONS RESTORED)
    function renderItem(p) {
        const isOwner = p.user_id === {{ Auth::id() ?? 'null' }};
        const badgeHtml = isOwner ? `<span class="badge bg-primary ms-1" style="font-size: 0.6em">MY Patch</span>` : '';

        const dataJson = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

        return `
            <div class="list-group-item list-group-item-action bg-dark text-white border-secondary patch-item d-flex justify-content-between align-items-center"
                style="cursor: pointer;"
                data-id="${p.id}"
                data-json='${dataJson}'
            >
                <div class="flex-grow-1" style="min-width: 0;">
                    <h6 class="mb-1 text-truncate">${p.label} ${badgeHtml}</h6>
                    <small class="text-muted d-block text-truncate">Author: ${p.user?.name}</small>
                </div>
                <!-- Action Buttons in List -->
                <div class="d-flex gap-1 ms-2">
                    <!--${isOwner ? `<button class="btn btn-sm btn-outline-danger btn-list-delete" title="Delete">Delete</button>` : ''}-->
                    <button class="btn btn-sm btn-outline-success btn-list-load" title="Quick Load">Load</button>
                </div>
            </div>
        `;
    }

    // Event Delegation
    listContainer.addEventListener('click', (e) => {
        // Handle Button Clicks first
        const loadBtn = e.target.closest('.btn-list-load');
        const deleteBtn = e.target.closest('.btn-list-delete');
        const item = e.target.closest('.patch-item');

        if (loadBtn && item) {
            // Quick Load
            e.stopPropagation();
            const id = item.dataset.id;
            const name = JSON.parse(item.dataset.json).label;
            if (window.persistenceManager) {
                // Hush immediately
                stopPreviewAudio();

                window.persistenceManager.loadPatch(id).then(() => {
                    if (loadModal) loadModal.hide();
                    document.getElementById('patch-name').textContent = name;
                });
            }
            return;
        }

        if (deleteBtn && item) {
            // Quick Delete
            e.stopPropagation();
            const id = item.dataset.id;
            if (window.persistenceManager) {
                window.persistenceManager.deletePatch(id).then((success) => {
                    if (success) {
                        refreshList();
                        // Reset preview if deleted item was selected
                        if (currentSelectedPatchId == id) {
                            previewPlaceholder.style.display = 'block';
                            previewDetails.classList.add('d-none');
                            currentSelectedPatchId = null;
                        }
                    }
                });
            }
            return;
        }

        // Handle Item Selection (Preview)
        if (item) {
            e.preventDefault();
            listContainer.querySelectorAll('.patch-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            try {
                const patchData = JSON.parse(item.dataset.json);
                selectPatch(patchData);
            } catch (err) {
                console.error("Error parsing patch data", err);
            }
        }
    });

    async function selectPatch(p) {
        if (!p) return;
        currentSelectedPatchId = p.id;

        // Highlight
        document.querySelectorAll('.patch-item').forEach(el => el.classList.remove('active', 'border-primary'));
        const activeItem = document.querySelector(`.patch-item[data-id="${p.id}"]`);
        if (activeItem) activeItem.classList.add('active', 'border-primary');

        // Show/Hide Placeholder
        previewPlaceholder.style.display = 'none';
        previewDetails.classList.remove('d-none');

        // Populate Details
        previewTitle.textContent = p.label;
        previewAuthor.textContent = p.user ? `By ${p.user.name}` : 'Unknown Author';
        if (p.is_public) {
            previewAuthor.innerHTML += ' <span class="badge bg-success ms-1">Public</span>';
        } else {
            previewAuthor.innerHTML += ' <span class="badge bg-secondary ms-1">Private</span>';
        }

        previewDate.textContent = new Date(p.updated_at).toLocaleString();
        previewDescription.textContent = p.description || 'No description.';

        // Show/Hide Delete based on ownership
        const isOwner = p.user_id === {{ Auth::id() ?? 'null' }};
        if (isOwner) {
            btnPreviewDelete.classList.remove('d-none');
            btnPreviewDelete.setAttribute('data-id', p.id);
            btnPreviewDelete.onclick = (e) => {
                e.stopPropagation();
                window.persistenceManager.deletePatch(p.id).then((ok) => {
                    if (ok) refreshList();
                });
            };
        } else {
            btnPreviewDelete.classList.add('d-none');
        }

        // Hydra Preview Logic
        if (previewHydra) {
            const synth = previewHydra.synth;

            // Stop previous audio
            stopPreviewAudio();

            // Check for compiled code
            if (p.data && p.data.previewCode) {
                try {
                    let codeToRun = p.data.previewCode;

                    // Sanitize broken object references from old saves
                    codeToRun = codeToRun.replace(/\[object HTMLImageElement\]/g, '""');
                    codeToRun = codeToRun.replace(/\[object HTMLVideoElement\]/g, '""');

                    // Load Custom Shaders if needed
                    if (p.data.previewShaders && p.data.previewShaders.length > 0) {
                        try {
                            if (window.loadCustomShaders) {
                                await window.loadCustomShaders(p.data.previewShaders, previewHydra);
                            } else {
                                console.warn("window.loadCustomShaders not available");
                            }
                        } catch (err) {
                            console.error("Failed to load custom shaders for preview", err);
                        }
                    }

                    // Execute code within the context of the preview synth
                    // This avoids polluting the global window object.
                    // Note: Complex patches using window.variables (Data Nodes) might fail here.
                    const runPreview = new Function('code', `
                        with (this) {
                            try {
                                eval(code);
                            } catch (e) {
                                console.warn("Preview Code Partial Error", e);
                            }
                        }
                      `);

                    runPreview.call(synth, codeToRun);

                } catch (e) {
                    console.error("Preview Eval Error", e);
                    // Fallback visual?
                    if (synth.solid) synth.solid(0.2, 0, 0).out();
                }
            } else {
                // No code available (old patch)
                // Show noise or simple pattern to indicate "active" but unknown
                if (synth.osc) synth.osc().color(0.5, 0.7, 0.2).out();
            }
        }
    }

    function refreshList() {
        if (cleanupScroll) cleanupScroll();
        listContainer.innerHTML = '';
        if (window.setupInfiniteScroll) {
            cleanupScroll = window.setupInfiniteScroll(
                listContainer,
                listContainer,
                loadingElement,
                '/patches',
                renderItem, {
                    params: {
                        search: searchInput.value
                    }
                }
            );
        }
    }

    // Detail Pane Button Listeners
    btnPreviewLoad.addEventListener('click', () => {
        if (currentSelectedPatchId && window.persistenceManager) {
            // Hush immediately
            stopPreviewAudio();

            window.persistenceManager.loadPatch(currentSelectedPatchId).then(() => {
                if (loadModal) loadModal.hide();
            });
        }
    });

    btnPreviewDelete.addEventListener('click', () => {
        if (currentSelectedPatchId && window.persistenceManager) {
            window.persistenceManager.deletePatch(currentSelectedPatchId).then((success) => {
                if (success) {
                    refreshList();
                    previewPlaceholder.style.display = 'block';
                    previewDetails.classList.add('d-none');
                    currentSelectedPatchId = null;
                }
            });
        }
    });

    // Search Listener
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            refreshList();
        }, 300);
    });
</script>