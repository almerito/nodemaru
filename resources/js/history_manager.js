export class HistoryManager {
    constructor(graph, sceneManager = null, limit = 50) {
        this.graph = graph;
        this._sceneManager = sceneManager;
        this.limit = limit;

        this.undoStack = [];
        this.redoStack = [];

        this.isLocked = false; // To preventing recursive history pushes during undo/redo
        this.debounceTimer = null;

        // Buffer system - groups rapid changes into single state
        this.bufferMs = 500; // Time window in ms to group changes
        this.pendingPush = null; // Pending debounced push
        this.lastPushTime = 0; // Timestamp of last actual push

        // Load persistency
        this.loadFromStorage();

        // Initial State
        // setTimeout(() => this.pushState('init'), 100);
    }

    get sceneManager() {
        return this._sceneManager || window.sceneManager;
    }

    /**
     * Push a state with time-based buffering
     * Multiple calls within bufferMs will be grouped into one state
     */
    pushState(actionType = 'generic') {
        if (this.isLocked) return;
        if (!this.sceneManager) {
            console.warn('HistoryManager: SceneManager not ready');
            return;
        }

        const now = Date.now();
        const timeSinceLastPush = now - this.lastPushTime;

        // If we're within the buffer window, extend the debounce
        if (timeSinceLastPush < this.bufferMs && this.pendingPush) {
            // Clear existing timer and set new one
            clearTimeout(this.pendingPush);
            this.pendingPush = setTimeout(() => {
                this._commitState(actionType);
            }, this.bufferMs);
            return;
        }

        // If no pending push, start a new buffer window
        if (this.pendingPush) {
            clearTimeout(this.pendingPush);
        }

        this.pendingPush = setTimeout(() => {
            this._commitState(actionType);
        }, this.bufferMs);
    }

    /**
     * Actually commit the state to history (internal)
     */
    _commitState(actionType) {
        this.pendingPush = null;
        this.lastPushTime = Date.now();

        // Clear Redo on new action
        this.redoStack = [];

        // Snapshot
        const state = this.sceneManager.serializeCurrentPatch();
        const stateStr = JSON.stringify(state);

        // Check against last state to avoid duplicates (if any)
        // We look at the top of undoStack
        if (this.undoStack.length > 0) {
            const lastEntry = this.undoStack[this.undoStack.length - 1];
            const lastStr = JSON.stringify(lastEntry.data);
            if (stateStr === lastStr) {
                // console.log('State identical, skipping push');
                return;
            }
        }

        // Push
        this.undoStack.push({
            timestamp: Date.now(),
            action: actionType,
            data: state
        });

        // Limit
        if (this.undoStack.length > this.limit) {
            this.undoStack.shift(); // Drop oldest
        }

        this.saveToStorage();
        //console.log(`History Push: ${actionType} (Stack: ${this.undoStack.length})`);
    }

    /**
     * Force immediate push (bypasses buffer) - use for explicit user actions
     */
    pushStateImmediate(actionType = 'generic') {
        if (this.pendingPush) {
            clearTimeout(this.pendingPush);
            this.pendingPush = null;
        }
        this._commitState(actionType);
    }

    // Helpers - kept for backward compatibility
    startDebouncedPush(actionType, delay = 300) {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.pushState(actionType);
        }, delay);
    }

    // Explicit check method
    pushIfChanged(actionType = 'interaction') {
        this.startDebouncedPush(actionType, 200);
    }

    undo() {
        if (!this.sceneManager) return;

        if (this.undoStack.length <= 1) { // Keep at least one state (current/initial) or handle empty
            console.warn('Nothing to Undo');
            return;
        }

        this.isLocked = true;

        try {
            // Push current state to Redo
            const currentState = this.sceneManager.serializeCurrentPatch();
            this.redoStack.push({
                timestamp: Date.now(),
                action: 'undo_restore',
                data: currentState
            });

            // Pop latest from Undo (which is effectively "current")
            const currentHead = this.undoStack.pop();

            // Restore previous
            const previousState = this.undoStack[this.undoStack.length - 1];

            if (previousState) {
                this.sceneManager.restorePatch(previousState.data);
                console.log('Undid to:', previousState.action);
            } else {
                // Recover if we popped too far
                if (currentHead) this.undoStack.push(currentHead);
                this.redoStack.pop();
                console.warn('Reached end of Undo history');
            }

            this.saveToStorage();

        } catch (e) {
            console.error('Undo Failed', e);
        } finally {
            this.isLocked = false;
        }
    }

    redo() {
        if (!this.sceneManager) return;

        if (this.redoStack.length === 0) {
            console.warn('Nothing to Redo');
            return;
        }

        this.isLocked = true;

        try {
            const nextState = this.redoStack.pop();
            this.undoStack.push(nextState);

            this.sceneManager.restorePatch(nextState.data);
            console.log('Redid to:', nextState.action);

            this.saveToStorage();

        } catch (e) {
            console.error('Redo Failed', e);
        } finally {
            this.isLocked = false;
        }
    }

    // Persistence
    saveToStorage() {
        try {
            const data = {
                undo: this.undoStack,
                redo: this.redoStack
            };
            localStorage.setItem('Nodemaru-history', JSON.stringify(data));
        } catch (e) {
            console.warn('History Storage Limit Reached', e);
            // If quota exceeded, try trimming
            if (this.undoStack.length > 10) {
                this.undoStack = this.undoStack.slice(-10); // Keep last 10
                this.saveToStorage(); // Retry once
            }
        }
    }

    loadFromStorage() {
        try {
            const raw = localStorage.getItem('Nodemaru-history');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.undo) this.undoStack = data.undo;
                if (data.redo) this.redoStack = data.redo;
                //console.log(`History Loaded: ${this.undoStack.length} undo states`);
            }
        } catch (e) {
            console.error('Failed to load history', e);
        }
    }
}
