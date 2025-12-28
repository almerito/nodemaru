import '../style.css';
import { Editor } from './core/Editor.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Nodemaru Visual Composer initializing...');

    const editor = new Editor();
    window.editor = editor; // For debugging

    // Global Event Listeners (e.g., Toolbar)
    document.getElementById('btn-add-node').addEventListener('click', () => {
        editor.openAddNodeModal();
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    // Close modals when clicking outside (on the backdrop)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            // Only close if clicked directly on the modal backdrop, not its content
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    document.getElementById('btn-close-drawer').addEventListener('click', () => {
        document.getElementById('property-drawer').classList.add('hidden');
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const ctrl = e.ctrlKey || e.metaKey; // metaKey for Mac
        const alt = e.altKey;
        const key = e.key.toLowerCase();

        // CTRL+ALT+N → New (uses ALT to avoid browser's new window)
        if (ctrl && alt && key === 'n') {
            e.preventDefault();
            document.getElementById('btn-new').click();
        }
        // CTRL+S → Save
        else if (ctrl && !alt && key === 's') {
            e.preventDefault();
            document.getElementById('btn-save-preset').click();
        }
        // CTRL+O → Load
        else if (ctrl && !alt && key === 'o') {
            e.preventDefault();
            document.getElementById('btn-load-preset').click();
        }
    });
});
