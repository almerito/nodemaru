<!-- Execution Modal (Full Screen) -->
<div id="execution-modal" class="modal hidden full-screen">
  <button id="btn-stop-execution" class="floating-action">&times;</button>
  <div id="recording-indicator" class="hidden">
    <span class="rec-dot"></span>
    <span id="rec-timer">00:00</span>
  </div>
  <!-- Dual Canvas for Scene Transitions -->
  <canvas id="hydra-canvas-a" class="hydra-layer"></canvas>
  <canvas id="hydra-canvas-b" class="hydra-layer"></canvas>
  <canvas id="hydra-canvas" class="hydra-output"></canvas>
  <!-- Hidden canvas for library node previews (separate from compositor output) -->
  <canvas id="library-preview-canvas" style="display:none; position:absolute;"></canvas>
</div>
