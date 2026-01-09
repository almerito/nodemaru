/**
 * RecordingManager.js
 * Handles video recording of the Hydra canvas with internal audio mixing
 */

import fixWebmDuration from 'fix-webm-duration';

export class RecordingManager {
    constructor() {
        // Recording State
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        this.playbackStartTime = null; // When actual content starts (for pre-roll trimming)

        this._recordingFileExtension = 'webm';
        this._recordingAudioContext = null;
        this._internalAudioSources = [];
    }

    /**
     * Get recording settings from graph
     */
    getSettings() {
        return window.graph?.recordingSettings || {
            fps: 60,
            format: 'webm',
            qualityMbps: 50,
            audioEnabled: true,
            audioDeviceId: '',
            audioGain: 100
        };
    }

    /**
     * Start recording the canvas
     */
    async startRecording(canvas) {
        if (this.isRecording) return;

        if (!canvas) {
            this.showToast('Canvas not found. Start playback first.', 'error');
            return;
        }

        try {
            const settings = this.getSettings();
            const fps = settings.fps || 60;
            const format = settings.format || 'webm';
            const qualityMbps = settings.qualityMbps || 50;

            // Bitrate (100 = lossless)
            const videoBitsPerSecond = qualityMbps >= 100 ? undefined : qualityMbps * 1000000;

            // Determine MIME type
            let mimeType = 'video/webm;codecs=vp9';
            let fileExtension = 'webm';

            if (format === 'webm-vp8') {
                mimeType = 'video/webm;codecs=vp8';
            } else if (format === 'mp4-h264') {
                mimeType = 'video/mp4;codecs=avc1.42E01E';
                fileExtension = 'mp4';
            } else if (format === 'mp4-h265') {
                mimeType = 'video/mp4;codecs=hvc1';
                fileExtension = 'mp4';
            }

            this._recordingFileExtension = fileExtension;

            // Fallback chain if MIME not supported
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.warn(`${mimeType} not supported, trying fallbacks...`);

                const fallbacks = [
                    { mime: 'video/webm;codecs=vp9', ext: 'webm' },
                    { mime: 'video/webm;codecs=vp8', ext: 'webm' },
                    { mime: 'video/webm', ext: 'webm' }
                ];

                let found = false;
                for (const fb of fallbacks) {
                    if (MediaRecorder.isTypeSupported(fb.mime)) {
                        mimeType = fb.mime;
                        this._recordingFileExtension = fb.ext;
                        this.showToast(`Format not supported, using ${fb.ext.toUpperCase()}`, 'warning');
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.showToast('Recording not supported in this browser', 'error');
                    return;
                }
            }

            // Capture video stream from canvas
            const videoStream = canvas.captureStream(fps);

            // Combine with audio
            let combinedStream = videoStream;
            if (settings.audioEnabled) {
                const audioStream = await this.captureAudio(settings);
                if (audioStream) {
                    combinedStream = new MediaStream([
                        ...videoStream.getVideoTracks(),
                        ...audioStream.getAudioTracks()
                    ]);
                }
            }

            // Create MediaRecorder
            this.recordedChunks = [];
            const recorderOptions = { mimeType };
            if (videoBitsPerSecond !== undefined) {
                recorderOptions.videoBitsPerSecond = videoBitsPerSecond;
            }
            this.mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.finishRecording();
            };

            // Start recording
            this.mediaRecorder.start(1000); // 1 second chunks
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            console.log('[RecordingManager] Recording started');
        } catch (err) {
            console.error('[RecordingManager] Error:', err);
            this.showToast('Failed to start recording: ' + err.message, 'error');
        }
    }

    /**
     * Capture audio based on audioSource setting
     * @param {Object} settings - Recording settings
     * @returns {MediaStream|null} - Audio stream or null if no audio
     */
    async captureAudio(settings) {
        const audioSource = settings.audioSource || 'internal';

        try {
            const audioContext = new AudioContext();
            this._recordingAudioContext = audioContext;
            const destination = audioContext.createMediaStreamDestination();
            const gainNode = audioContext.createGain();

            // Gain value (0-200% -> 0.0-2.0)
            const gainValue = (settings.audioGain || 100) / 100;
            gainNode.gain.value = gainValue;
            gainNode.connect(destination);

            let hasAnySource = false;

            // Capture internal audio if 'internal' or 'both'
            if (audioSource === 'internal' || audioSource === 'both') {
                if (window._audioAnalyzers) {
                    const analyzers = Object.entries(window._audioAnalyzers);

                    for (const [nodeId, entry] of analyzers) {
                        if (entry.audio && !entry.audio.paused && entry.source && entry.audioContext) {
                            try {
                                // Reuse the existing source and context
                                // Create a destination on the analyzer's context and connect the source to it
                                const recDestination = entry.audioContext.createMediaStreamDestination();
                                const recGain = entry.audioContext.createGain();
                                recGain.gain.value = (settings.audioGain || 100) / 100;

                                // Connect: existing source -> recGain -> recDestination
                                entry.source.connect(recGain);
                                recGain.connect(recDestination);

                                // Add audio track from this destination to our combined stream
                                const audioTrack = recDestination.stream.getAudioTracks()[0];
                                if (audioTrack) {
                                    // Store for later mixing (include audio element for seeking)
                                    this._internalAudioSources.push({
                                        context: entry.audioContext,
                                        destination: recDestination,
                                        gain: recGain,
                                        track: audioTrack,
                                        audio: entry.audio
                                    });
                                    hasAnySource = true;
                                    console.log(`[RecordingManager] Connected internal audio source: ${nodeId}`);
                                }
                            } catch (e) {
                                console.warn('[RecordingManager] Could not connect internal audio:', e);
                            }
                        }
                    }
                }

                if (!hasAnySource && audioSource === 'internal') {
                    console.log('[RecordingManager] No internal audio sources playing');
                    this.showToast('No internal audio sources playing', 'info');
                }
            }

            // Capture external device if 'external' or 'both'
            if ((audioSource === 'external' || audioSource === 'both') && settings.audioDeviceId) {
                try {
                    const micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: { exact: settings.audioDeviceId },
                            autoGainControl: false,
                            noiseSuppression: false,
                            echoCancellation: false
                        }
                    });

                    const micSource = audioContext.createMediaStreamSource(micStream);
                    micSource.connect(gainNode);
                    hasAnySource = true;
                    console.log('[RecordingManager] Connected external microphone');
                } catch (micErr) {
                    console.warn('[RecordingManager] Microphone access denied:', micErr);
                    if (audioSource === 'external') {
                        this.showToast('Recording without audio (access denied)', 'warning');
                    }
                }
            } else if (audioSource === 'external' && !settings.audioDeviceId) {
                console.warn('[RecordingManager] External audio selected but no device configured');
                this.showToast('No external audio device selected in settings', 'warning');
            }

            if (!hasAnySource) {
                console.log('[RecordingManager] No audio sources available');
                return null;
            }

            // Combine all audio tracks into a single stream
            const audioTracks = [];

            // Add internal audio tracks
            for (const internalSource of this._internalAudioSources) {
                if (internalSource.track) {
                    audioTracks.push(internalSource.track);
                }
            }

            // Add external mic tracks from destination (if any were connected)
            for (const track of destination.stream.getAudioTracks()) {
                audioTracks.push(track);
            }

            if (audioTracks.length === 0) {
                console.log('[RecordingManager] No audio tracks captured');
                return null;
            }

            // Create combined stream
            const combinedAudioStream = new MediaStream(audioTracks);
            console.log(`[RecordingManager] Combined ${audioTracks.length} audio track(s)`);

            return combinedAudioStream;
        } catch (err) {
            console.error('[RecordingManager] Audio capture failed:', err);
            return null;
        }
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;

        this.mediaRecorder.stop();
        this.isRecording = false;

        // Cleanup audio context
        if (this._recordingAudioContext) {
            this._recordingAudioContext.close();
            this._recordingAudioContext = null;
        }
        this._internalAudioSources = [];

        console.log('[RecordingManager] Recording stopped');
    }

    /**
     * Pause recording
     */
    pauseRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
            console.log('[RecordingManager] Recording paused');
        }
    }

    /**
     * Resume recording
     */
    resumeRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
            console.log('[RecordingManager] Recording resumed');
        }
    }

    /**
     * Mark when actual playback (content) starts
     * (Kept for compatibility, but timing is now handled via pause/resume)
     */
    markPlaybackStart() {
        this.playbackStartTime = Date.now();
        console.log('[RecordingManager] Playback started');
    }

    /**
     * Finish recording and save file
     */
    finishRecording() {
        if (this.recordedChunks.length === 0) {
            this.showToast('No recording data captured', 'warning');
            return;
        }

        // Note: We removed chunk trimming because it strips the WebM header
        // making the file unplayable. We now use pause/resume for pre-roll.

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

        // Calculate duration based on start time (approximate)
        // or just use Date.now() - startTime if we tracked pauses?
        // For simplicity, just use wall clock time from first resume? 
        // With pause/resume, the duration logic is a bit tricky but fix-webm-duration needs total duration.
        // Let's assume recordingStartTime is still valid start of the *file*.

        const duration = this.recordingStartTime ? Date.now() - this.recordingStartTime : 0;

        // Fix WebM duration metadata for proper playback
        if (duration > 0 && this._recordingFileExtension === 'webm') {
            fixWebmDuration(blob, duration, (fixedBlob) => {
                const sizeMB = (fixedBlob.size / (1024 * 1024)).toFixed(2);
                this.saveRecording(fixedBlob);
                this.showToast(`Recording complete (${sizeMB} MB)`, 'success');
            });
        } else {
            const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
            this.saveRecording(blob);
            this.showToast(`Recording complete (${sizeMB} MB)`, 'success');
        }

        this.recordedChunks = [];
        this.playbackStartTime = null;
    }

    /**
     * Save recording to file
     */
    saveRecording(blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const ext = this._recordingFileExtension || 'webm';
        const filename = `nodemaru_recording_${timestamp}.${ext}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`[RecordingManager] Saved: ${filename}`);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        if (window.toastr) {
            window.toastr[type](message);
        } else {
            console.log(`[RecordingManager] ${type}: ${message}`);
        }
    }
}

// Export singleton
export const recordingManager = new RecordingManager();
