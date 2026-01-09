<!-- Settings Modal -->
<div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title" id="settingsModalLabel">Settings</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                
                <ul class="nav nav-tabs border-secondary mb-3" id="settingsTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active text-white" id="general-tab" data-bs-toggle="tab" data-bs-target="#general-settings" type="button" role="tab">General</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="recording-tab" data-bs-toggle="tab" data-bs-target="#recording-settings" type="button" role="tab">Recording</button>
                    </li>
                </ul>

                <div class="tab-content" id="settingsTabContent">
                    <!-- General Settings -->
                    <div class="tab-pane fade show active" id="general-settings" role="tabpanel">
                        <h6 class="text-info mb-3">Global Configuration</h6>
                        <form id="generalSettingsForm">
                            <div class="mb-3 row">
                                <label for="setting-bpm" class="col-sm-4 col-form-label">BPM (Beats Per Minute)</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control bg-dark text-white border-secondary" id="setting-bpm" value="30">
                                    <div class="form-text text-muted">Sets the global tempo for BPM-synced nodes.</div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="setting-speed" class="col-sm-4 col-form-label">Global Speed</label>
                                <div class="col-sm-8">
                                    <input type="number" step="0.1" class="form-control bg-dark text-white border-secondary" id="setting-speed" value="1.0">
                                    <div class="form-text text-muted">Multiplier for the 'time' variable.</div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="setting-num-outputs" class="col-sm-4 col-form-label">Number of Outputs</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control bg-dark text-white border-secondary" id="setting-num-outputs" value="4" min="4" max="16" step="1">
                                    <div class="form-text text-muted">Default is 4. Requires page reload to take effect.</div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="setting-num-sources" class="col-sm-4 col-form-label">Number of Sources</label>
                                <div class="col-sm-8">
                                    <input type="number" class="form-control bg-dark text-white border-secondary" id="setting-num-sources" value="4" min="4" max="16" step="1">
                                    <div class="form-text text-muted">Default is 4. Requires page reload to take effect.</div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="setting-render-engine" class="col-sm-4 col-form-label">Render Engine</label>
                                <div class="col-sm-8">
                                    <select class="form-select bg-dark text-white border-secondary" id="setting-render-engine" disabled>
                                        <option value="glsl3" selected>GLSL 3 (WebGL 2)</option>
                                    </select>
                                    <div class="form-text text-muted">Currently only GLSL 3 is supported.</div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Recording Settings -->
                    <div class="tab-pane fade" id="recording-settings" role="tabpanel">
                        <h6 class="text-info mb-3">Video Recording</h6>
                        <form id="recordingSettingsForm">
                            <div class="mb-3 row">
                                <label for="rec-fps" class="col-sm-4 col-form-label">Frame Rate (FPS)</label>
                                <div class="col-sm-8">
                                    <select class="form-select bg-dark text-white border-secondary" id="rec-fps">
                                        <option value="30">30 FPS</option>
                                        <option value="60" selected>60 FPS</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="rec-format" class="col-sm-4 col-form-label">Video Format</label>
                                <div class="col-sm-8">
                                    <select class="form-select bg-dark text-white border-secondary" id="rec-format">
                                        <option value="webm" selected>WebM (VP9) - Recommended</option>
                                        <option value="webm-vp8">WebM (VP8) - Legacy</option>
                                        <option value="mp4-h264">MP4 (H.264) - Wide Compatibility</option>
                                        <option value="mp4-h265">MP4 (H.265) - High Efficiency</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="rec-quality" class="col-sm-4 col-form-label">Bitrate (Quality)</label>
                                <div class="col-sm-8">
                                    <div class="d-flex align-items-center">
                                        <input type="range" class="form-range flex-grow-1 me-2" id="rec-quality" min="2" max="100" value="50">
                                        <span id="rec-quality-val" class="text-nowrap" style="min-width: 75px;">50 Mbps</span>
                                    </div>
                                    <div class="form-text text-muted">Higher bitrate means better quality but larger file size. 100 Mbps is near lossless.</div>
                                </div>
                            </div>

                            <hr class="border-secondary my-4">
                            <h6 class="text-info mb-3">Audio Recording</h6>
                            
                            <div class="mb-3 row">
                                <label class="col-sm-4 col-form-label">Enable Audio</label>
                                <div class="col-sm-8">
                                    <div class="form-check form-switch mt-2">
                                        <input class="form-check-input" type="checkbox" id="rec-audio-enabled">
                                        <label class="form-check-label" for="rec-audio-enabled">Record Microphone / Audio Input</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="audio-settings-container" class="d-none">
                                <div class="mb-3 row">
                                    <label for="rec-audio-source" class="col-sm-4 col-form-label">Audio Source Type</label>
                                    <div class="col-sm-8">
                                        <select class="form-select bg-dark text-white border-secondary" id="rec-audio-source">
                                            <option value="internal">Internal (Nodemaru Audio Nodes)</option>
                                            <option value="external">External (Device below)</option>
                                            <option value="both">Both (Mixed)</option>
                                        </select>
                                        <div class="form-text text-muted">Internal uses audio from AudioNode file playback. External uses the device selected below.</div>
                                    </div>
                                </div>
                                <div class="mb-3 row" id="external-device-row">
                                    <label for="rec-audio-device" class="col-sm-4 col-form-label">External Device</label>
                                    <div class="col-sm-8">
                                        <select class="form-select bg-dark text-white border-secondary" id="rec-audio-device">
                                            <option value="">Select device...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="rec-audio-gain" class="col-sm-4 col-form-label">Audio Gain (Volume)</label>
                                    <div class="col-sm-8">
                                        <div class="d-flex align-items-center">
                                            <input type="range" class="form-range flex-grow-1 me-2" id="rec-audio-gain" min="0" max="200" value="100">
                                            <span id="rec-audio-gain-val" style="min-width: 45px;">100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btn-save-settings">Save Changes</button>
            </div>
        </div>
    </div>
</div>
