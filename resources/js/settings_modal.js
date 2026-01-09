
import * as bootstrap from 'bootstrap';
import toastr from 'toastr';

export function setupSettingsModal(graph) {
    const modalEl = document.getElementById('settingsModal');
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    const menuBtn = document.getElementById('menu-settings');
    const saveBtn = document.getElementById('btn-save-settings');

    // Open Modal
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            populateSettings(graph);
            modal.show();
        });
    }

    // Save Settings
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveSettings(graph);
            modal.hide();
            toastr.success('Settings saved successfully');
        });
    }

    // UI Interactivity
    setupUIHandlers(graph);
}

function populateSettings(graph) {
    // General Settings
    document.getElementById('setting-bpm').value = graph.globalSettings.bpm;
    document.getElementById('setting-speed').value = graph.globalSettings.speed;
    document.getElementById('setting-render-engine').value = graph.globalSettings.renderEngine;
    document.getElementById('setting-num-outputs').value = graph.globalSettings.numOutputs || 4;
    document.getElementById('setting-num-sources').value = graph.globalSettings.numSources || 4;

    // Recording Settings
    const rec = graph.recordingSettings;
    document.getElementById('rec-fps').value = rec.fps;
    document.getElementById('rec-format').value = rec.format;

    const qualitySlider = document.getElementById('rec-quality');
    qualitySlider.value = rec.qualityMbps;
    document.getElementById('rec-quality-val').textContent = `${rec.qualityMbps} Mbps`;

    const audioCheck = document.getElementById('rec-audio-enabled');
    audioCheck.checked = rec.audioEnabled;
    toggleAudioSettings(rec.audioEnabled);

    // Audio source type
    const audioSourceSelect = document.getElementById('rec-audio-source');
    if (audioSourceSelect) {
        audioSourceSelect.value = rec.audioSource || 'internal';
        toggleExternalDeviceRow(rec.audioSource || 'internal');
    }

    const gainSlider = document.getElementById('rec-audio-gain');
    gainSlider.value = rec.audioGain;
    document.getElementById('rec-audio-gain-val').textContent = `${rec.audioGain}%`;

    // Populate Audio Devices
    populateAudioDevices(graph.recordingSettings.audioDeviceId);
}

function setupUIHandlers(graph) {
    // Quality Slider
    document.getElementById('rec-quality').addEventListener('input', (e) => {
        document.getElementById('rec-quality-val').textContent = `${e.target.value} Mbps`;
    });

    // Audio Toggle
    document.getElementById('rec-audio-enabled').addEventListener('change', (e) => {
        toggleAudioSettings(e.target.checked);
    });

    // Audio Source Toggle (show/hide external device row)
    const audioSourceSelect = document.getElementById('rec-audio-source');
    if (audioSourceSelect) {
        audioSourceSelect.addEventListener('change', (e) => {
            toggleExternalDeviceRow(e.target.value);
        });
    }

    // Gain Slider
    document.getElementById('rec-audio-gain').addEventListener('input', (e) => {
        document.getElementById('rec-audio-gain-val').textContent = `${e.target.value}%`;
    });
}

function toggleExternalDeviceRow(audioSource) {
    const row = document.getElementById('external-device-row');
    if (row) {
        // Show device row only if external or both
        row.classList.toggle('d-none', audioSource === 'internal');
    }
}

function toggleAudioSettings(enabled) {
    const container = document.getElementById('audio-settings-container');
    if (enabled) {
        container.classList.remove('d-none');
        // Trigger device enumeration if enabling
        const deviceSelect = document.getElementById('rec-audio-device');
        if (deviceSelect.options.length <= 1) {
            populateAudioDevices('');
        }
    } else {
        container.classList.add('d-none');
    }
}

async function populateAudioDevices(selectedId) {
    const selectElement = document.getElementById('rec-audio-device');

    try {
        // Just enumerate, don't force getUserMedia immediately to avoid permission prompt just for opening modal?
        // Actually, for labels we surely need permission. But maybe user already granted it.
        // Let's try enumerate first.
        let devices = await navigator.mediaDevices.enumerateDevices();

        // If labels are empty, we might need to request permission (optional behavior)
        // For now, let's assume we proceed with what we have
        let audioInputs = devices.filter(d => d.kind === 'audioinput');

        // If list is empty or labels empty, user might not have granted permission.
        // We won't force it here to be unintrusive.

        selectElement.innerHTML = '<option value="">Select device...</option>';
        audioInputs.forEach(device => {
            const opt = document.createElement('option');
            opt.value = device.deviceId;
            opt.innerText = device.label || `Microphone (${device.deviceId.slice(0, 8)}...)`;
            if (device.deviceId === selectedId) {
                opt.selected = true;
            }
            selectElement.appendChild(opt);
        });

    } catch (err) {
        console.warn('Failed to enumerate audio devices:', err);
        selectElement.innerHTML = '<option value="">Access denied / No devices</option>';
    }
}

function saveSettings(graph) {
    // General
    graph.globalSettings.bpm = parseInt(document.getElementById('setting-bpm').value);
    graph.globalSettings.speed = parseFloat(document.getElementById('setting-speed').value);
    graph.globalSettings.numOutputs = parseInt(document.getElementById('setting-num-outputs').value);
    graph.globalSettings.numSources = parseInt(document.getElementById('setting-num-sources').value);
    // renderEngine is disabled/readonly for now

    // Recording
    graph.recordingSettings.fps = parseInt(document.getElementById('rec-fps').value);
    graph.recordingSettings.format = document.getElementById('rec-format').value;
    graph.recordingSettings.qualityMbps = parseInt(document.getElementById('rec-quality').value);
    graph.recordingSettings.audioEnabled = document.getElementById('rec-audio-enabled').checked;
    graph.recordingSettings.audioSource = document.getElementById('rec-audio-source')?.value || 'internal';
    graph.recordingSettings.audioDeviceId = document.getElementById('rec-audio-device').value;
    graph.recordingSettings.audioGain = parseInt(document.getElementById('rec-audio-gain').value);

    // Persist Recording Settings
    try {
        localStorage.setItem('Nodemaru-recording-settings', JSON.stringify(graph.recordingSettings));
    } catch (e) {
        console.warn('Failed to save settings to localStorage', e);
    }
}
