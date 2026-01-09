import * as bootstrap from 'bootstrap';
import { createShaderNode, getGraph, SlotShape } from './editor.js';

let graph = null;

export function setupNodeSelector(graphInstance) {
    graph = graphInstance;

    const modalElement = document.getElementById('nodeSelectorModal');
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);

    const categoriesContainer = document.getElementById('node-categories');
    const subcategoriesContainer = document.getElementById('node-subcategories');
    const gridContainer = document.getElementById('node-grid');

    let nodesData = [];
    let currentCategory = null;

    // Event Listeners to Open Modal
    const containerEl = document.getElementById('node_graph');
    if (containerEl) {
        containerEl.addEventListener('dblclick', (e) => {
            // Only open if clicking on graph background (not on a node)
            if (e.target.classList.contains('ng-grid') || e.target.id === 'node_graph') {
                modal.show();
            }
        });
    }

    const menuAddNode = document.getElementById('menu-add-node');
    if (menuAddNode) {
        menuAddNode.addEventListener('click', (e) => {
            e.preventDefault();
            modal.show();
        });
    }

    const addNodeBtn = document.getElementById('btn-add-node');
    if (addNodeBtn) {
        addNodeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.show();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === '+' && !modalElement.classList.contains('show')) {
            e.preventDefault();
            modal.show();
        }
    });

    // Fetch Data on Modal Show
    modalElement.addEventListener('show.bs.modal', async () => {
        if (nodesData.length === 0) {
            await fetchNodes();
        }
    });

    // Fix aria-hidden warning - blur focus before modal closes
    modalElement.addEventListener('hide.bs.modal', () => {
        // Remove focus from any element inside modal
        if (document.activeElement && modalElement.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    });

    async function fetchNodes() {
        try {
            const response = await fetch('/nodes');
            nodesData = await response.json();
            renderCategories();
        } catch (error) {
            console.error('Failed to fetch nodes:', error);
            gridContainer.innerHTML = '<p class="text-danger">Failed to load nodes.</p>';
        }
    }

    function renderCategories() {
        categoriesContainer.innerHTML = '';
        if (!nodesData || nodesData.length === 0) return;

        nodesData.forEach((category, index) => {
            const btn = document.createElement('button');
            const color = category.color || '#444';
            btn.className = 'btn me-2 mb-1 fw-bold text-white border-0 text-shadow';
            btn.style = index === 0 ? `background-color: ${color};` : `background-color: ${color + '30'}; border: solid 1px ${color} !important`;
            btn.dataset.color = color;
            btn.textContent = category.label;

            btn.onclick = () => selectCategory(category, btn);
            categoriesContainer.appendChild(btn);

            if (index === 0) selectCategory(category, btn);
        });
    }

    function selectCategory(category, btnElement) {
        currentCategory = category;
        Array.from(categoriesContainer.children).forEach(b => { b.style = `background-color: ${b.dataset.color + '30'}; border: solid 1px ${b.dataset.color} !important` });
        btnElement.style = `background-color: ${btnElement.dataset.color};`;
        renderSubcategories(category);
    }

    function renderSubcategories(category) {
        subcategoriesContainer.innerHTML = '';
        const subs = category.subcategories || [];
        const color = category.color || '#444';

        let subcategoriesToRender = [...subs];
        if (category.orphan_shaders && category.orphan_shaders.length > 0) {
            subcategoriesToRender.unshift({ id: 'orphan', label: 'General', shaders: category.orphan_shaders });
        }
        //console.log('category.orphan_shaders', category.orphan_shaders, category)
        if (subcategoriesToRender.length === 0) {
            gridContainer.innerHTML = '<p class="text-white text-opacity-50 text-center w-100 mt-4">No nodes available in this category.</p>';
            return;
        }

        subcategoriesToRender.forEach((sub, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm me-2 text-white border-0 text-shadow';
            btn.style = index === 0 ? `background-color: ${color + 'AA'};` : `background-color: ${color + '30'}; border: solid 1px ${color} !important`;
            btn.textContent = sub.label;

            btn.onclick = () => {
                Array.from(subcategoriesContainer.children).forEach(b => {
                    b.style = `background-color: ${color + '30'}; border: solid 1px ${color} !important`;
                });
                btn.style = `background-color: ${color + 'AA'};`;
                renderNodes(sub.shaders, category.color);
            };

            subcategoriesContainer.appendChild(btn);
            if (index === 0) renderNodes(sub.shaders, category.color);
        });
    }

    function renderNodes(shaders, categoryColor) {
        gridContainer.innerHTML = '';
        if (!shaders || shaders.length === 0) {
            gridContainer.innerHTML = '<p class="text-white text-opacity-50 text-center w-100 mt-4">No nodes here.</p>';
            return;
        }

        shaders.forEach(shader => {
            const col = document.createElement('div');
            col.className = 'col-6 col-sm-4 col-md-3 col-lg-2';

            const card = document.createElement('div');
            card.className = 'card h-100 node-card';
            card.style = `background-color: ${categoryColor + '30'}; border: solid 1px ${categoryColor} !important`;
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="card-body d-flex flex-column align-items-center justify-content-center text-center p-3">
                    <h6 class="card-title text-white mb-0 text-shadow">${shader.label}</h6>
                </div>
            `;

            card.onclick = async () => {
                modal.hide();
                hidePreviewPopup(); // Hide preview when clicking
                await new Promise(resolve => setTimeout(resolve, 150));
                addNodeToCanvas(shader, categoryColor);
            };

            // Add hover handlers for preview
            card.addEventListener('mouseenter', (e) => showPreviewPopup(shader, e));
            card.addEventListener('mousemove', (e) => movePreviewPopup(e));
            card.addEventListener('mouseleave', () => hidePreviewPopup());

            col.appendChild(card);
            gridContainer.appendChild(col);
        });
    }

    function addNodeToCanvas(shaderData, nodeColor) {
        // Create NodeGraph node using the editor API
        const node = createShaderNode(graph, shaderData, nodeColor);

        if (node) {
            // Use stored mouse position if available, otherwise center in viewport
            let x, y;

            if (window._nodeAddPosition) {
                // Use the position where user triggered "Add Node"
                x = window._nodeAddPosition.x;
                y = window._nodeAddPosition.y;
                window._nodeAddPosition = null; // Clear after use
            } else if (window._lastMousePosition) {
                // Use last tracked mouse position (for keyboard +)
                x = window._lastMousePosition.x;
                y = window._lastMousePosition.y;
            } else {
                // Fallback: center in viewport
                const viewportState = graph.viewport.getState();
                const containerRect = graph.container.getBoundingClientRect();
                x = (containerRect.width / 2 - viewportState.panX) / viewportState.scale;
                y = (containerRect.height / 2 - viewportState.panY) / viewportState.scale;
            }

            node.moveTo(x, y);

            // Select the new node
            graph.selection.selectNode(node);
        }
    }

    // ==========================================
    // Preview Popup Functions
    // ==========================================
    const previewPopup = document.getElementById('node-preview-popup');
    const previewCanvas = document.getElementById('node-preview-canvas');
    const previewLabel = document.getElementById('node-preview-label');
    let previewHydra = null;
    let previewTimeout = null;

    async function showPreviewPopup(shader, event) {
        // Clear any pending timeout
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }

        // Wait a short delay before showing preview (avoid flickering)
        previewTimeout = setTimeout(async () => {
            // Get preview code from shader options
            const options = shader.options || {};
            const previewCode = options.preview; // No default fallback

            if (!previewCode) return; // Exit if no preview defined

            // Replace {node} with actual shader call (name + default params)
            const shaderCall = shader.name;
            const code = previewCode.replace(/\{node\}/g, shaderCall);

            // Position popup
            movePreviewPopup(event);

            // Set label
            previewLabel.textContent = code;

            // Show popup
            previewPopup.style.display = 'block';

            // Initialize Hydra if needed
            try {
                if (!previewHydra) {
                    const Hydra = (await import('./lib/hydra-synth.es.js')).default;
                    previewCanvas.width = 200;
                    previewCanvas.height = 150;
                    previewHydra = new Hydra({
                        canvas: previewCanvas,
                        detectAudio: false,
                        makeGlobal: true,
                        width: previewCanvas.width,
                        height: previewCanvas.height
                    });
                }

                // Execute using shared utility
                // Dynamically import utility to ensure it's loaded
                const { executeHydraCode } = await import('./hydra_utils.js');

                await executeHydraCode(previewHydra, code, [shader.name]);

            } catch (err) {
                console.warn('[Preview] Error:', err.message);
            }
        }, 300); // 300ms delay
    }

    // MovePreviewPopup and HidePreviewPopup remain unchanged...
    function movePreviewPopup(e) {
        if (!previewPopup) return;
        // Position to the right of cursor, or left if near edge
        const popupWidth = 200;
        const popupHeight = 180;
        const offset = 15;

        let x = e.clientX + offset;
        let y = e.clientY - popupHeight / 2;

        // Keep within viewport
        if (x + popupWidth > window.innerWidth) {
            x = e.clientX - popupWidth - offset;
        }
        if (y < 10) y = 10;
        if (y + popupHeight > window.innerHeight - 10) {
            y = window.innerHeight - popupHeight - 10;
        }

        previewPopup.style.left = x + 'px';
        previewPopup.style.top = y + 'px';
    }

    function hidePreviewPopup() {
        if (previewTimeout) {
            clearTimeout(previewTimeout);
            previewTimeout = null;
        }

        if (previewPopup) {
            previewPopup.style.display = 'none';
        }

        // Stop Hydra rendering
        if (previewHydra && previewHydra.synth && previewHydra.synth.hush) {
            try { previewHydra.synth.hush(); } catch (e) { }
        }
    }

    // Hide preview when modal closes
    modalElement.addEventListener('hidden.bs.modal', hidePreviewPopup);
}
