import toastr from 'toastr';
import { recordingManager } from './recording_manager.js';

/**
 * Setup the Hydra Canvas Layer (overlay, preview, play, record)
 * @param {Object} graph - The NodeGraph instance
 */
export function setupHydraLayer(graph) {
    // DOM Elements
    const hydraLayer = document.getElementById('hydra-layer');
    const hydraCanvas = document.getElementById('hydra-canvas');
    const btnClose = document.getElementById('btn-close-hydra');
    const recordingIndicator = document.getElementById('hydra-recording-indicator');
    const recTimer = document.getElementById('hydra-rec-timer');

    const btnPreview = document.getElementById('btn-preview');
    const btnPlay = document.getElementById('btn-play');
    const btnRecord = document.getElementById('btn-record');

    // State
    let currentMode = null; // 'preview' | 'play' | 'record'
    let recordingInterval = null;
    let recordingSeconds = 0;

    // Initialize Hydra via Manager
    async function initHydraManager() {
        const hm = window.hydraManager;
        if (!hm) {
            console.error('[HydraLayer] HydraManager not found');
            return;
        }

        // Initialize execution instances (A/B + Compositor)
        await hm.initExecution(hydraCanvas);
        console.log('[HydraLayer] Manager initialized');
    }

    // Open layer in specified mode
    async function openHydraLayer(mode) {
        currentMode = mode;
        const hm = window.hydraManager;

        // Clear any previous timer first
        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }

        // Reset inline styles
        hydraLayer.style.removeProperty('top');
        hydraLayer.style.removeProperty('left');
        hydraLayer.style.removeProperty('right');
        hydraLayer.style.removeProperty('bottom');
        hydraLayer.style.removeProperty('width');
        hydraLayer.style.removeProperty('height');

        // Set mode class
        hydraLayer.classList.remove('hydra-preview', 'hydra-fullscreen');
        hydraLayer.classList.add(mode === 'preview' ? 'hydra-preview' : 'hydra-fullscreen');

        // Size canvas
        if (mode === 'preview') {
            hydraCanvas.width = 400;
            hydraCanvas.height = 300;
        } else {
            hydraCanvas.width = window.innerWidth;
            hydraCanvas.height = window.innerHeight;
        }

        // Show layer
        hydraLayer.style.display = 'block';

        // Show recording indicator for record mode
        if (mode === 'record') {
            recordingSeconds = 0;
            recTimer.textContent = '00:00';
            recordingIndicator.style.display = 'flex';
            recordingInterval = setInterval(() => {
                recordingSeconds++;
                const mins = Math.floor(recordingSeconds / 60).toString().padStart(2, '0');
                const secs = (recordingSeconds % 60).toString().padStart(2, '0');
                recTimer.textContent = `${mins}:${secs}`;
            }, 1000);
        } else {
            recordingIndicator.style.display = 'none';
        }

        // Ensure Manager is ready
        await initHydraManager();

        // Resize manager buffers
        hm.resize(hydraCanvas.width, hydraCanvas.height);

        // Logic based on mode
        if (mode === 'play' || mode === 'record' || mode === 'preview') {
            // For record mode with internal audio: silent pre-roll approach
            let useInternalAudioPreRoll = false;
            if (mode === 'record') {
                const settings = window.graph?.recordingSettings || {};
                const audioSource = settings.audioSource || 'internal';

                if (audioSource === 'internal' || audioSource === 'both') {
                    useInternalAudioPreRoll = true;
                    console.log('[HydraLayer] Record mode: using silent pre-roll for internal audio');

                    // Step 1: Set flag to mute audio when it starts
                    // runtime_helpers.js will check this before calling audio.play()
                    window._muteAudioOnStart = true;
                }

                if (audioSource === 'external' && settings.audioDeviceId) {
                    // External audio: start recording first (mic is always available)
                    console.log('[HydraLayer] Record mode: using pre-roll (external audio)');
                    await recordingManager.startRecording(hydraCanvas);
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // Start Scene Playback (Sequence)
            // For internal audio pre-roll: this creates audio sources
            if (window.sceneManager) {
                window.sceneManager.startPlayback();

                if (mode === 'preview') {
                    window.hydraManager.startLoop();
                }
            } else {
                // Fallback
                hm.execute({ target: 'Active' });
                hm.startLoop();
            }

            // For record mode: finish setup
            if (mode === 'record') {
                const settings = window.graph?.recordingSettings || {};
                const audioSource = settings.audioSource || 'internal';

                if (useInternalAudioPreRoll) {
                    // Step 2: Create Countdown Overlay
                    const overlay = document.createElement('div');
                    Object.assign(overlay.style, {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '15rem',
                        fontFamily: 'monospace',
                        zIndex: '99999',
                        pointerEvents: 'none' // Click through just in case
                    });
                    document.body.appendChild(overlay);

                    console.log('[HydraLayer] Starting countdown...');

                    // Countdown 3
                    overlay.innerText = '3';
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Start recording logic in background during countdown
                    // This ensures we are ready to resume exactly at 0
                    if (!recordingManager.isRecording) {
                        await recordingManager.startRecording(hydraCanvas);
                        recordingManager.pauseRecording();
                    }

                    // Countdown 2
                    overlay.innerText = '2';
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Countdown 1
                    overlay.innerText = '1';
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Allow recording to stabilize (paused)
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Step 4: STRICT SYNC - Reset everything to 0
                    console.log('[HydraLayer] Syncing Audio & Video...');

                    // Reset Hydra time to 0 so visuals start from beginning
                    if (window.hydra) {
                        // Reset time reference
                        window.hydra.time = 0;
                    }
                    if (window.hydraManager) {
                        // Ensure manager knows we are at 0 (if applicable)
                        // This depends on implementation but hydra.time is usually the uniform
                    }

                    // Reset all audio to 0 and unmute
                    if (window._audioAnalyzers) {
                        for (const entry of Object.values(window._audioAnalyzers)) {
                            if (entry.audio) {
                                entry.audio.currentTime = 0;
                                entry.audio.volume = 1; // Restore volume
                            }
                        }
                    }

                    // Turn off mute flag
                    window._muteAudioOnStart = false;

                    // RESUME RECORDING AT SYNC POINT
                    recordingManager.resumeRecording();

                    // Step 5: Mark playback start for pre-roll trimming
                    recordingManager.markPlaybackStart();
                    console.log('[HydraLayer] Recording synced!');

                    // Remove overlay immediately after start
                    overlay.remove();

                } else if (audioSource === 'external') {
                    // External audio: just mark playback start
                    recordingManager.markPlaybackStart();
                }
            }
        }
    }

    // Close layer
    function closeHydraLayer() {
        // Stop recording first (triggers save if recording)
        if (currentMode === 'record' && recordingManager.isRecording) {
            recordingManager.stopRecording();
        }

        hydraLayer.style.display = 'none';
        currentMode = null;

        // Stop recording timer
        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }
        recordingIndicator.style.display = 'none';

        // Stop Scene Playback
        if (window.sceneManager) {
            window.sceneManager.stopPlayback();
        }

        // Stop all audio analyzers (file audio playback)
        if (window._stopAllAudioAnalyzers) {
            window._stopAllAudioAnalyzers();
        }

        // Stop Hydra Loop, pause to save GPU.
        if (window.hydraManager) {
            window.hydraManager.stopLoop();
        }

        console.log('[HydraLayer] Layer closed');
    }

    // Button handlers
    btnPreview?.addEventListener('click', () => {
        if (currentMode === 'preview' && hydraLayer.style.display !== 'none') {
            closeHydraLayer();
        } else {
            openHydraLayer('preview');
        }
    });

    btnPlay?.addEventListener('click', () => {
        if (currentMode === 'play' && hydraLayer.style.display !== 'none') {
            closeHydraLayer();
        } else {
            openHydraLayer('play');
        }
    });

    btnRecord?.addEventListener('click', () => {
        if (currentMode === 'record' && hydraLayer.style.display !== 'none') {
            closeHydraLayer();
        } else {
            openHydraLayer('record');
        }
    });

    btnClose?.addEventListener('click', closeHydraLayer);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hydraLayer.style.display !== 'none') {
            closeHydraLayer();
        }
    });

    // Resize handler for fullscreen modes
    window.addEventListener('resize', () => {
        if (currentMode && currentMode !== 'preview' && hydraLayer.style.display !== 'none') {
            hydraCanvas.width = window.innerWidth;
            hydraCanvas.height = window.innerHeight;
            if (window.hydraManager) {
                window.hydraManager.resize(hydraCanvas.width, hydraCanvas.height);
            }
        }
    });

    // Drag functionality for preview mode
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    hydraLayer.addEventListener('mousedown', (e) => {
        if (currentMode === 'preview') {
            const rect = hydraLayer.getBoundingClientRect();
            const isInResizeCorner = (e.clientX > rect.right - 30) && (e.clientY > rect.bottom - 30);
            const isCloseBtn = e.target.closest('.hydra-close-btn');

            if (!isInResizeCorner && !isCloseBtn) {
                isDragging = true;
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                e.preventDefault();
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            hydraLayer.style.right = 'auto';
            hydraLayer.style.bottom = 'auto';
            hydraLayer.style.left = (e.clientX - dragOffset.x) + 'px';
            hydraLayer.style.top = (e.clientY - dragOffset.y) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
