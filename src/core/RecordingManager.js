/**
 * RecordingManager.js
 * Handles video recording of the Hydra canvas
 */

import fixWebmDuration from 'fix-webm-duration';

export class RecordingManager {
    constructor(editor) {
        this.editor = editor;

        // Recording State
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        this.recordingTimerInterval = null;

        this.recordingSettings = {
            fps: 60,
            format: 'webm',
            qualityMbps: 50, // 2-100, 100 = lossless
            audioEnabled: false,
            audioDeviceId: '',
            audioGain: 100 // Volume percentage (0-200)
        };

        this._recordingFileExtension = 'webm';
        this._recordingAudioContext = null;

        // Load settings immediately
        this.loadRecordingSettings();
    }

    async startRecording() {
        if (this.isRecording) return;

        const canvas = document.getElementById('hydra-canvas');
        if (!canvas) {
            this.editor.showToast('Canvas not found. Start playback first.', 'error');
            return;
        }

        try {
            // Get recording settings
            const fps = this.recordingSettings.fps;
            const format = this.recordingSettings.format;
            const qualityMbps = this.recordingSettings.qualityMbps;

            // Bitrate based on slider value (in bits per second)
            // 100 = lossless (undefined lets browser use max quality)
            const videoBitsPerSecond = qualityMbps >= 100 ? undefined : qualityMbps * 1000000;

            // MIME type based on format
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

            // Store extension for later use
            this._recordingFileExtension = fileExtension;

            // Check if MIME type is supported, with fallback chain
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                console.warn(`${mimeType} not supported, trying fallbacks...`);

                // Try fallbacks in order of preference
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
                        this.editor.showToast(`Format not supported, using ${fb.ext.toUpperCase()} instead`, 'warning');
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.editor.showToast('Recording not supported in this browser', 'error');
                    return;
                }
            }

            // Capture video stream from canvas
            // Use Editor's canvas variable if available, or fallback to DOM element
            const videoStream = canvas.captureStream(fps);

            // Combine with audio if enabled
            let combinedStream = videoStream;
            if (this.recordingSettings.audioEnabled && this.recordingSettings.audioDeviceId) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: { exact: this.recordingSettings.audioDeviceId },
                            // Disable browser audio processing for clean recording
                            autoGainControl: false,
                            noiseSuppression: false,
                            echoCancellation: false
                        }
                    });

                    // Apply gain using Web Audio API
                    const audioContext = new AudioContext();
                    const source = audioContext.createMediaStreamSource(audioStream);
                    const gainNode = audioContext.createGain();
                    const destination = audioContext.createMediaStreamDestination();

                    // Set gain value (0-200% -> 0.0-2.0)
                    const gainValue = (this.recordingSettings.audioGain || 100) / 100;
                    gainNode.gain.value = gainValue;

                    // Connect audio nodes: source -> gain -> destination
                    source.connect(gainNode);
                    gainNode.connect(destination);

                    // Store audioContext for cleanup
                    this._recordingAudioContext = audioContext;

                    combinedStream = new MediaStream([
                        ...videoStream.getVideoTracks(),
                        ...destination.stream.getAudioTracks()
                    ]);
                } catch (audioErr) {
                    console.warn('Could not capture audio:', audioErr);
                    this.editor.showToast('Recording without audio (access denied)', 'warning');
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
            this.mediaRecorder.start(1000); // Capture in 1 second chunks
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            const btnRecord = document.getElementById('btn-record');
            if (btnRecord) btnRecord.classList.add('recording');

            const indicator = document.getElementById('recording-indicator');
            if (indicator) indicator.classList.remove('hidden');

            // Start timer update
            this.updateRecordingTimer();
            this.recordingTimerInterval = setInterval(() => this.updateRecordingTimer(), 1000);

            console.log('Recording started');
        } catch (err) {
            console.error('Recording Error:', err);
            this.editor.showToast('Failed to start recording: ' + err.message, 'error');
        }
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;

        this.mediaRecorder.stop();
        this.isRecording = false;

        // Clear timer
        if (this.recordingTimerInterval) {
            clearInterval(this.recordingTimerInterval);
            this.recordingTimerInterval = null;
        }

        // Cleanup audio context
        if (this._recordingAudioContext) {
            this._recordingAudioContext.close();
            this._recordingAudioContext = null;
        }

        // Update UI
        const btnRecord = document.getElementById('btn-record');
        if (btnRecord) btnRecord.classList.remove('recording');

        const indicator = document.getElementById('recording-indicator');
        if (indicator) indicator.classList.add('hidden');

        const recTimer = document.getElementById('rec-timer');
        if (recTimer) recTimer.innerText = '00:00';
    }

    updateRecordingTimer() {
        if (!this.recordingStartTime) return;

        const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');

        const recTimer = document.getElementById('rec-timer');
        if (recTimer) recTimer.innerText = `${minutes}:${seconds}`;
    }

    finishRecording() {
        if (this.recordedChunks.length === 0) {
            this.editor.showToast('No recording data captured', 'warning');
            return;
        }

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

        // Calculate recording duration in milliseconds
        const duration = this.recordingStartTime ? Date.now() - this.recordingStartTime : 0;

        // Fix WebM duration metadata for proper playback compatibility
        if (duration > 0 && this._recordingFileExtension === 'webm') {
            fixWebmDuration(blob, duration, (fixedBlob) => {
                const sizeMB = (fixedBlob.size / (1024 * 1024)).toFixed(2);
                this.saveRecording(fixedBlob);
                this.editor.showToast(`Recording complete (${sizeMB} MB)`, 'success');
            });
        } else {
            // For non-WebM formats or if duration unknown, save as-is
            const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
            this.saveRecording(blob);
            this.editor.showToast(`Recording complete (${sizeMB} MB)`, 'success');
        }

        this.recordedChunks = [];
    }

    saveRecording(blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const ext = this._recordingFileExtension || 'webm';
        const filename = `synthflow_recording_${timestamp}.${ext}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.editor.showToast(`Saved: ${filename}`, 'success');
    }

    async populateAudioDevices(selectElement) {
        try {
            // Request permission first to get device labels
            await navigator.mediaDevices.getUserMedia({ audio: true });

            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter(d => d.kind === 'audioinput');

            selectElement.innerHTML = '<option value="">Select device...</option>';
            audioInputs.forEach(device => {
                const opt = document.createElement('option');
                opt.value = device.deviceId;
                opt.innerText = device.label || `Microphone (${device.deviceId.slice(0, 8)}...)`;
                selectElement.appendChild(opt);
            });

            // Restore previously selected device if still available
            if (this.recordingSettings.audioDeviceId) {
                selectElement.value = this.recordingSettings.audioDeviceId;
            }
        } catch (err) {
            console.error('Failed to enumerate audio devices:', err);
            selectElement.innerHTML = '<option value="">Access denied</option>';
        }
    }

    saveRecordingSettings() {
        try {
            localStorage.setItem('Nodemaru-recording-settings', JSON.stringify(this.recordingSettings));
        } catch (e) {
            console.warn('Could not save recording settings:', e);
        }
    }

    loadRecordingSettings() {
        try {
            const saved = localStorage.getItem('Nodemaru-recording-settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to handle new properties
                this.recordingSettings = { ...this.recordingSettings, ...parsed };
            }
        } catch (e) {
            console.warn('Could not load recording settings:', e);
        }
    }
}
