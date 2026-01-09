<div class="modal fade" id="nodeSelectorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary" style="min-height: 80vh;">
            <div class="modal-header border-secondary p-2">
                <h5 class="modal-title fs-6">Select Node</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
                <div class="d-flex flex-column h-100">
                    <!-- Categories -->
                    <div id="node-categories" class="d-flex overflow-auto border-bottom border-secondary p-2 bg-black bg-opacity-25" style="white-space: nowrap;">
                        <!-- Categories injected here -->
                    </div>
                    
                    <!-- Subcategories -->
                    <div id="node-subcategories" class="d-flex overflow-auto border-bottom border-secondary p-2 bg-black bg-opacity-10" style="white-space: nowrap; min-height: 50px;">
                        <!-- Subcategories injected here -->
                    </div>

                    <!-- Nodes Grid -->
                    <div class="p-3 flex-grow-1 overflow-auto">
                        <div id="node-grid" class="row g-2">
                            <!-- Nodes injected here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Node Preview Popup (Hydra live preview on hover) -->
<div id="node-preview-popup" class="node-preview-popup">
    <canvas id="node-preview-canvas"></canvas>
    <div id="node-preview-label"></div>
</div>
