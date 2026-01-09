<!-- Help Modal -->
<div class="modal fade" id="helpModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title"><i class="bi bi-question-circle me-2"></i>Nodemaru Visual Composer - Help</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
                <!-- Tabs Navigation -->
                <ul class="nav nav-tabs nav-fill bg-dark border-bottom border-secondary" id="helpTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active text-white" id="tab-overview" data-bs-toggle="tab" data-bs-target="#help-overview" type="button" role="tab">
                            <i class="bi bi-house-door me-1"></i>Overview
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="tab-canvas" data-bs-toggle="tab" data-bs-target="#help-canvas" type="button" role="tab">
                            <i class="bi bi-grid-3x3 me-1"></i>Canvas
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="tab-nodes" data-bs-toggle="tab" data-bs-target="#help-nodes" type="button" role="tab">
                            <i class="bi bi-diagram-3 me-1"></i>Nodes
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="tab-data" data-bs-toggle="tab" data-bs-target="#help-data" type="button" role="tab">
                            <i class="bi bi-activity me-1"></i>Data & Animation
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="tab-scenes" data-bs-toggle="tab" data-bs-target="#help-scenes" type="button" role="tab">
                            <i class="bi bi-collection-play me-1"></i>Scenes
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-white" id="tab-shortcuts" data-bs-toggle="tab" data-bs-target="#help-shortcuts" type="button" role="tab">
                            <i class="bi bi-keyboard me-1"></i>Shortcuts
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content p-4" id="helpTabContent">
                    
                    <!-- OVERVIEW TAB -->
                    <div class="tab-pane fade show active" id="help-overview" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Welcome to Nodemaru</h2>
                        <p class="lead">A visual patcher for <a href="https://hydra.ojack.xyz/" target="_blank" class="link-info">Hydra Live Coding</a>. Create animated visuals using a node-based interface.</p>
                        
                        <div class="row g-3 mt-3">
                            <div class="col-md-6">
                                <div class="card bg-secondary bg-opacity-25 border-secondary h-100">
                                    <div class="card-body">
                                        <h5 class="card-title text-info"><i class="bi bi-lightning-charge me-2"></i>What can you create?</h5>
                                        <ul class="mb-0">
                                            <li>Animated patterns & textures</li>
                                            <li>Audio-reactive visuals</li>
                                            <li>MIDI-controlled effects</li>
                                            <li>Webcam & video manipulations</li>
                                            <li>Multi-scene VJ performances</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-secondary bg-opacity-25 border-secondary h-100">
                                    <div class="card-body">
                                        <h5 class="card-title text-info"><i class="bi bi-play-circle me-2"></i>Quick Start</h5>
                                        <ol class="mb-0">
                                            <li>Double-click canvas to add a node</li>
                                            <li>Start with a <strong>Source</strong> node (osc, noise, shape...)</li>
                                            <li>Connect to an <strong>Output</strong> node</li>
                                            <li>Click <strong>Preview</strong> to see your creation!</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Toolbar Overview</h3>
                        <div class="table-responsive">
                            <table class="table table-dark table-bordered table-sm">
                                <thead class="table-secondary">
                                    <tr><th>Button</th><th>Description</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td><strong>New</strong></td><td>Reset canvas and start fresh project</td></tr>
                                    <tr><td><strong>Save</strong></td><td>Save patch to cloud (requires login)</td></tr>
                                    <tr><td><strong>Load</strong></td><td>Load saved patches from cloud</td></tr>
                                    <tr><td><strong>Export</strong></td><td>Download patch as <code>.json</code> file</td></tr>
                                    <tr><td><strong>Import</strong></td><td>Load patch from <code>.json</code> file</td></tr>
                                    <tr><td><strong>Settings</strong></td><td>Configure BPM, speed, recording options</td></tr>
                                    <tr><td><strong>Add Node (+)</strong></td><td>Open node library</td></tr>
                                    <tr><td><strong>Scenes</strong></td><td>Manage multi-scene performances</td></tr>
                                    <tr><td><strong>Preview</strong></td><td>Small draggable preview window</td></tr>
                                    <tr><td><strong>PLAY</strong></td><td>Full-screen visual playback</td></tr>
                                    <tr><td><strong>RECORD</strong></td><td>Record visual as video file</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Recording Settings</h3>
                        <p>Access from <strong>Settings → Recording Settings</strong>:</p>
                        <ul>
                            <li><strong>FPS:</strong> 30 or 60 frames per second</li>
                            <li><strong>Format:</strong> WebM (VP9/VP8) or MP4 (H.264/H.265)</li>
                            <li><strong>Quality:</strong> Bitrate from 2 Mbps to 100 Mbps</li>
                            <li><strong>Audio:</strong> Option to include audio track</li>
                        </ul>
                    </div>

                    <!-- CANVAS TAB -->
                    <div class="tab-pane fade" id="help-canvas" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Canvas & NodeGraph Controls</h2>
                        <p>The canvas is an infinite workspace powered by <a href="https://github.com/almerito/NodeGraph" target="_blank" class="link-info">NodeGraph.js</a>.</p>

                        <h3 class="h4 mt-4 mb-3 text-warning">Navigation</h3>
                        <div class="table-responsive">
                            <table class="table table-dark table-bordered">
                                <thead class="table-secondary">
                                    <tr><th width="40%">Action</th><th>How to perform</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Pan (move canvas)</strong></td>
                                        <td>
                                            <kbd>Middle Mouse Button</kbd> + Drag<br>
                                            <em>or</em> <kbd>Space</kbd> + <kbd>Left Mouse</kbd> + Drag
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Zoom</strong></td>
                                        <td><kbd>Mouse Scroll Wheel</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Reset View</strong></td>
                                        <td><kbd>Home</kbd> key (centers and resets zoom)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Selection</h3>
                        <div class="table-responsive">
                            <table class="table table-dark table-bordered">
                                <thead class="table-secondary">
                                    <tr><th width="40%">Action</th><th>How to perform</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Select single node</strong></td>
                                        <td><kbd>Left Click</kbd> on node</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Add to selection</strong></td>
                                        <td><kbd>Shift</kbd> + <kbd>Left Click</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Box selection</strong></td>
                                        <td><kbd>Right Mouse Button</kbd> + Drag rectangle</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Select all</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>A</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Deselect all</strong></td>
                                        <td><kbd>Escape</kbd> or click empty canvas</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Node Operations</h3>
                        <div class="table-responsive">
                            <table class="table table-dark table-bordered">
                                <thead class="table-secondary">
                                    <tr><th width="40%">Action</th><th>How to perform</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Add new node</strong></td>
                                        <td><kbd>Double Click</kbd> on empty canvas<br><em>or</em> use <strong>Add Node (+)</strong> button</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Delete selected</strong></td>
                                        <td><kbd>Delete</kbd> or <kbd>Backspace</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Copy</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>C</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Paste</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>V</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Duplicate</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>D</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Undo</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>Z</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Redo</strong></td>
                                        <td><kbd>Ctrl</kbd> + <kbd>Y</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Move node</strong></td>
                                        <td><kbd>Left Click</kbd> + Drag node header</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Edit parameters</strong></td>
                                        <td><kbd>Left Click</kbd> on node to open side panel</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Connections</h3>
                        <div class="alert alert-info border-0 bg-info bg-opacity-10">
                            <i class="bi bi-info-circle-fill me-2"></i>
                            There are two types of connectors:
                            <ul class="mb-0 mt-2">
                                <li><span class="badge bg-warning text-dark">Orange</span> / <span class="badge bg-success">Green</span> = <strong>Node connectors</strong> (texture flow)</li>
                                <li><span class="badge bg-primary">Blue</span> = <strong>Parameter connectors</strong> (data values)</li>
                            </ul>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-dark table-bordered">
                                <thead class="table-secondary">
                                    <tr><th width="40%">Action</th><th>How to perform</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Create connection</strong></td>
                                        <td>Drag from output slot to input slot<br><em>or</em> drag from input to output (bidirectional)</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Delete connection</strong></td>
                                        <td><kbd>Right Click</kbd> on connection line → Delete</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Smart snap</strong></td>
                                        <td>Drop connection on node body to auto-connect to compatible slot</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning">Context Menu</h3>
                        <p><kbd>Right Click</kbd> on node or canvas to access:</p>
                        <ul>
                            <li><strong>On Node:</strong> Delete, Copy, Duplicate, Disconnect All</li>
                            <li><strong>On Canvas:</strong> Paste, Add Node, Arrange All</li>
                            <li><strong>On Connection:</strong> Delete connection</li>
                        </ul>
                    </div>

                    <!-- NODES TAB -->
                    <div class="tab-pane fade" id="help-nodes" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Node Types Reference</h2>
                        <p>Nodes are organized into categories. Connect them to build your visual pipeline.</p>

                        <div class="accordion accordion-flush" id="nodeAccordion">
                            <!-- Sources -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-sources">
                                        <span class="badge bg-success me-2">SRC</span> Sources (Pattern Generators)
                                    </button>
                                </h2>
                                <div id="collapse-sources" class="accordion-collapse collapse show" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Generators that start your visual chain. They produce textures from nothing.</p>
                                        <div class="row g-2">
                                            <div class="col-6 col-md-3"><code>osc</code> - Oscillator pattern</div>
                                            <div class="col-6 col-md-3"><code>noise</code> - Perlin noise</div>
                                            <div class="col-6 col-md-3"><code>voronoi</code> - Cell pattern</div>
                                            <div class="col-6 col-md-3"><code>shape</code> - Polygon shape</div>
                                            <div class="col-6 col-md-3"><code>gradient</code> - Color gradient</div>
                                            <div class="col-6 col-md-3"><code>solid</code> - Solid color</div>
                                        </div>
                                        <div class="alert alert-secondary mt-3 mb-0 small">
                                            <strong>Example chain:</strong> <code>osc(60, 0.1, 0.5).out(o0)</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- External Sources -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-external">
                                        <span class="badge bg-info me-2">EXT</span> External Sources (Init)
                                    </button>
                                </h2>
                                <div id="collapse-external" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Load external media into source buffers (s0-s3).</p>
                                        <ul>
                                            <li><strong>Local Image:</strong> Load image from your computer</li>
                                            <li><strong>Local Video:</strong> Load video file (MP4, WebM)</li>
                                            <li><strong>Remote URL:</strong> Load image from internet</li>
                                            <li><strong>Webcam:</strong> Use camera as source</li>
                                            <li><strong>Screen Capture:</strong> Capture window/screen</li>
                                        </ul>
                                        <div class="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning">
                                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                            <strong>Important:</strong> External Source nodes MUST be connected to a <strong>Source Input (src)</strong> node to display!
                                        </div>
                                        <p class="mb-0"><strong>Example:</strong> <code>Init(s0, webcam) → src(s0) → out(o0)</code></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Geometry -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-geometry">
                                        <span class="badge bg-warning text-dark me-2">GEO</span> Geometry (Coordinate Transforms)
                                    </button>
                                </h2>
                                <div id="collapse-geometry" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Transform the coordinate space (distort, tile, rotate).</p>
                                        <div class="row g-2">
                                            <div class="col-6 col-md-3"><code>rotate</code> - Rotation</div>
                                            <div class="col-6 col-md-3"><code>scale</code> - Scaling</div>
                                            <div class="col-6 col-md-3"><code>pixelate</code> - Pixelation</div>
                                            <div class="col-6 col-md-3"><code>kaleid</code> - Kaleidoscope</div>
                                            <div class="col-6 col-md-3"><code>repeat</code> - Tile/Repeat</div>
                                            <div class="col-6 col-md-3"><code>scroll</code> - Scroll offset</div>
                                        </div>
                                        <div class="alert alert-secondary mt-3 mb-0 small">
                                            <strong>Example:</strong> <code>osc().rotate(0.1).kaleid(4).out()</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Color -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-color">
                                        <span class="badge bg-danger me-2">COL</span> Color (Pixel Modifiers)
                                    </button>
                                </h2>
                                <div id="collapse-color" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Modify pixel colors (hue, saturation, brightness, effects).</p>
                                        <div class="row g-2">
                                            <div class="col-6 col-md-3"><code>invert</code> - Invert colors</div>
                                            <div class="col-6 col-md-3"><code>contrast</code> - Adjust contrast</div>
                                            <div class="col-6 col-md-3"><code>brightness</code> - Adjust brightness</div>
                                            <div class="col-6 col-md-3"><code>saturate</code> - Saturation</div>
                                            <div class="col-6 col-md-3"><code>hue</code> - Hue rotation</div>
                                            <div class="col-6 col-md-3"><code>posterize</code> - Reduce colors</div>
                                            <div class="col-6 col-md-3"><code>colorama</code> - Rainbow shift</div>
                                            <div class="col-6 col-md-3"><code>luma</code> - Brightness mask</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Blend -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-blend">
                                        <span class="badge bg-purple me-2" style="background:#9c27b0">BLD</span> Blend (Combine Textures)
                                    </button>
                                </h2>
                                <div id="collapse-blend" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Combine two textures together. Requires a second input!</p>
                                        <div class="row g-2">
                                            <div class="col-6 col-md-3"><code>blend</code> - Opacity mix</div>
                                            <div class="col-6 col-md-3"><code>add</code> - Additive blend</div>
                                            <div class="col-6 col-md-3"><code>mult</code> - Multiply</div>
                                            <div class="col-6 col-md-3"><code>diff</code> - Difference</div>
                                            <div class="col-6 col-md-3"><code>mask</code> - Alpha mask</div>
                                            <div class="col-6 col-md-3"><code>layer</code> - Layer over</div>
                                        </div>
                                        <div class="alert alert-secondary mt-3 mb-0 small">
                                            <strong>Example:</strong> <code>osc().blend(noise(), 0.5).out()</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Modulate -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-modulate">
                                        <span class="badge bg-secondary me-2">MOD</span> Modulate (Deformation)
                                    </button>
                                </h2>
                                <div id="collapse-modulate" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Use a texture's brightness to deform the coordinates of another texture.</p>
                                        <div class="row g-2">
                                            <div class="col-6 col-md-3"><code>modulate</code> - Basic distortion</div>
                                            <div class="col-6 col-md-3"><code>modulateRotate</code> - Rotation distort</div>
                                            <div class="col-6 col-md-3"><code>modulateScale</code> - Scale distort</div>
                                            <div class="col-6 col-md-3"><code>modulateKaleid</code> - Kaleid distort</div>
                                            <div class="col-6 col-md-3"><code>modulateHue</code> - Hue distort</div>
                                            <div class="col-6 col-md-3"><code>modulatePixelate</code> - Pixel distort</div>
                                        </div>
                                        <div class="alert alert-info border-0 bg-info bg-opacity-10 mt-3 mb-0 small">
                                            <i class="bi bi-lightbulb me-2"></i>
                                            <strong>Tip:</strong> Modulation is the secret to organic, flowing visuals. Try <code>osc().modulate(noise(), 0.1).out()</code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Output -->
                            <div class="accordion-item bg-dark border-secondary">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-output">
                                        <span class="badge bg-dark border me-2">OUT</span> Output & Render
                                    </button>
                                </h2>
                                <div id="collapse-output" class="accordion-collapse collapse" data-bs-parent="#nodeAccordion">
                                    <div class="accordion-body">
                                        <p>Send your visual chain to the screen.</p>
                                        <ul>
                                            <li><strong>Output (out):</strong> Send to buffer o0, o1, o2, or o3</li>
                                            <li><strong>Render:</strong> Display buffer(s) on screen</li>
                                        </ul>
                                        <p>You can chain multiple outputs and use <code>render()</code> to show all 4 in a grid, or <code>render(o1)</code> to show one specific buffer.</p>
                                        <div class="alert alert-secondary mt-3 mb-0 small">
                                            <strong>Multi-buffer example:</strong><br>
                                            <code>osc().out(o0)<br>noise().out(o1)<br>src(o0).blend(src(o1)).out(o2)<br>render(o2)</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DATA TAB -->
                    <div class="tab-pane fade" id="help-data" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Data & Animation Nodes</h2>
                        <p>Control parameters dynamically with data sources.</p>

                        <h3 class="h4 mt-4 mb-3 text-warning"><i class="bi bi-list-ol me-2"></i>Array Node</h3>
                        <p>Sequence through a list of values over time.</p>
                        <ul>
                            <li><strong>Values:</strong> Comma-separated list (e.g., <code>0.1, 0.5, 1.0, 0.5</code>)</li>
                            <li><strong>Fit:</strong> Sync to BPM timing</li>
                            <li><strong>Smooth:</strong> Interpolate between values</li>
                            <li><strong>Ease:</strong> Easing curve for transitions</li>
                        </ul>

                        <h3 class="h4 mt-4 mb-3 text-warning"><i class="bi bi-graph-up me-2"></i>LFO Node</h3>
                        <p>Low Frequency Oscillator for continuous animation.</p>
                        <table class="table table-dark table-sm table-bordered">
                            <tr><th>Parameter</th><th>Description</th></tr>
                            <tr><td><strong>Frequency</strong></td><td>Speed of oscillation (Hz or beats)</td></tr>
                            <tr><td><strong>Measure</strong></td><td>hz, seconds, frames, or beats (BPM sync)</td></tr>
                            <tr><td><strong>Range</strong></td><td>Output [min, max] values</td></tr>
                            <tr><td><strong>Curve</strong></td><td>sine, square, sawtooth, triangle, pulse, random, s&h, sync</td></tr>
                        </table>

                        <h3 class="h4 mt-4 mb-3 text-warning"><i class="bi bi-music-note-beamed me-2"></i>MIDI Node</h3>
                        <p>Receive MIDI input to control parameters.</p>
                        <table class="table table-dark table-sm table-bordered">
                            <tr><th>Track Type</th><th>Description</th></tr>
                            <tr><td><strong>Note</strong></td><td>Last played note (0-127)</td></tr>
                            <tr><td><strong>Velocity</strong></td><td>Note velocity (0-127)</td></tr>
                            <tr><td><strong>CC</strong></td><td>Control Change value (specify CC number)</td></tr>
                            <tr><td><strong>Pitch Bend</strong></td><td>Pitch wheel (-8192 to 8192)</td></tr>
                            <tr><td><strong>Aftertouch</strong></td><td>Channel pressure</td></tr>
                        </table>
                        <p class="small text-muted">Use <strong>transpose</strong> to map input range to output range.</p>

                        <h3 class="h4 mt-4 mb-3 text-warning"><i class="bi bi-soundwave me-2"></i>Audio Node</h3>
                        <p>Analyze audio for reactive visuals (powered by Meyda).</p>
                        <table class="table table-dark table-sm table-bordered">
                            <tr><th>Feature</th><th>Description</th></tr>
                            <tr><td><strong>RMS</strong></td><td>Overall loudness</td></tr>
                            <tr><td><strong>Energy</strong></td><td>Audio energy level</td></tr>
                            <tr><td><strong>ZCR</strong></td><td>Zero crossing rate (brightness/noise)</td></tr>
                            <tr><td><strong>Spectral Centroid</strong></td><td>Tonal brightness</td></tr>
                            <tr><td><strong>Bands</strong></td><td>Frequency bands (bass, lowMid, mid, highMid, treble)</td></tr>
                            <tr><td><strong>Transients</strong></td><td>Detect beats/transients</td></tr>
                        </table>
                        <div class="alert alert-info border-0 bg-info bg-opacity-10">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Tip:</strong> Enable <strong>Adaptive Range</strong> to auto-calibrate sensitivity!
                        </div>

                        <h3 class="h4 mt-4 mb-3 text-warning"><i class="bi bi-link-45deg me-2"></i>Connecting Data Nodes</h3>
                        <p>Data nodes output values through their <span class="badge bg-primary">blue</span> parameter connector. Connect them to any parameter input on shader nodes.</p>
                        <ol>
                            <li>Create a data node (LFO, MIDI, Audio, Array)</li>
                            <li>Click on target shader node to open parameters</li>
                            <li>Change parameter type from "Constant" to desired data source type</li>
                            <li>Select the data node from the dropdown</li>
                        </ol>
                    </div>

                    <!-- SCENES TAB -->
                    <div class="tab-pane fade" id="help-scenes" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Scenes & Transitions</h2>
                        <p>Create multi-scene performances with automated transitions.</p>

                        <h3 class="h4 mt-4 mb-3 text-warning">Scene Management</h3>
                        <ul>
                            <li><strong>Open Panel:</strong> Click <strong>Scenes</strong> button in toolbar</li>
                            <li><strong>Add Scene:</strong> Click <strong>+ ADD SCENE</strong> (saves current canvas)</li>
                            <li><strong>Select Scene:</strong> Click on scene to load it</li>
                            <li><strong>Reorder:</strong> Drag and drop scenes</li>
                            <li><strong>Edit Properties:</strong> Click scene to open settings drawer</li>
                        </ul>

                        <h3 class="h4 mt-4 mb-3 text-warning">Scene Properties</h3>
                        <table class="table table-dark table-bordered table-sm">
                            <tr><th>Property</th><th>Description</th></tr>
                            <tr><td><strong>Name</strong></td><td>Scene display name</td></tr>
                            <tr><td><strong>Color</strong></td><td>Visual identifier in panel</td></tr>
                            <tr><td><strong>Duration</strong></td><td>How long scene plays (seconds/minutes/beats)</td></tr>
                            <tr><td><strong>Repetitions</strong></td><td>Times to repeat before moving on</td></tr>
                            <tr><td><strong>Follow Action</strong></td><td>What happens after: Next, Previous, Random, Stay, etc.</td></tr>
                        </table>

                        <h3 class="h4 mt-4 mb-3 text-warning">Transition Types</h3>
                        <div class="row g-2">
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">None</span> - Instant cut</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Crossfade</span> - Opacity blend</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Fade to Black</span> - Through black</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Wipe L-R</span> - Horizontal wipe</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Wipe U-D</span> - Vertical wipe</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Radial</span> - Circle reveal</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Glitch</span> - Digital noise</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Zoom</span> - Zoom with bloom</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Pixelate</span> - Pixel dissolve</div>
                            <div class="col-6 col-md-4"><span class="badge bg-secondary">Melt</span> - Luminance distortion</div>
                        </div>

                        <div class="alert alert-info border-0 bg-info bg-opacity-10 mt-4">
                            <i class="bi bi-lightbulb me-2"></i>
                            <strong>Playback:</strong> Click <strong>PLAY</strong> with scenes configured to start automated performance. Scenes will transition according to their duration and follow actions.
                        </div>
                    </div>

                    <!-- SHORTCUTS TAB -->
                    <div class="tab-pane fade" id="help-shortcuts" role="tabpanel">
                        <h2 class="h3 mb-3 text-info">Keyboard Shortcuts Reference</h2>
                        
                        <div class="row g-4">
                            <div class="col-md-6">
                                <h3 class="h5 text-warning">General</h3>
                                <table class="table table-dark table-sm table-bordered">
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>Z</kbd></td><td>Undo</td></tr>
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>Y</kbd></td><td>Redo</td></tr>
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>S</kbd></td><td>Save patch</td></tr>
                                    <tr><td><kbd>Escape</kbd></td><td>Deselect all / Close panels</td></tr>
                                    <tr><td><kbd>F11</kbd></td><td>Toggle fullscreen</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h3 class="h5 text-warning">Selection</h3>
                                <table class="table table-dark table-sm table-bordered">
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>A</kbd></td><td>Select all nodes</td></tr>
                                    <tr><td><kbd>Shift</kbd>+Click</td><td>Add to selection</td></tr>
                                    <tr><td><kbd>Delete</kbd>/<kbd>Backspace</kbd></td><td>Delete selected</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h3 class="h5 text-warning">Clipboard</h3>
                                <table class="table table-dark table-sm table-bordered">
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>Copy</td></tr>
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>V</kbd></td><td>Paste</td></tr>
                                    <tr><td><kbd>Ctrl</kbd>+<kbd>D</kbd></td><td>Duplicate</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h3 class="h5 text-warning">Navigation</h3>
                                <table class="table table-dark table-sm table-bordered">
                                    <tr><td><kbd>Space</kbd>+Drag</td><td>Pan canvas</td></tr>
                                    <tr><td>Mouse Wheel</td><td>Zoom in/out</td></tr>
                                    <tr><td><kbd>Home</kbd></td><td>Reset view</td></tr>
                                    <tr><td>Double-Click</td><td>Add node at position</td></tr>
                                </table>
                            </div>
                        </div>

                        <hr class="border-secondary my-4">

                        <h3 class="h4 text-warning">Quick Tips</h3>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="card bg-secondary bg-opacity-25 border-secondary">
                                    <div class="card-body">
                                        <h6 class="card-title text-info"><i class="bi bi-lightning me-2"></i>Fast Workflow</h6>
                                        <ul class="small mb-0">
                                            <li>Double-click to quickly add nodes</li>
                                            <li>Use box selection to move groups</li>
                                            <li>Right-click for context menus</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-secondary bg-opacity-25 border-secondary">
                                    <div class="card-body">
                                        <h6 class="card-title text-info"><i class="bi bi-eye me-2"></i>Preview Tips</h6>
                                        <ul class="small mb-0">
                                            <li>Preview window is draggable!</li>
                                            <li>Changes update in real-time</li>
                                            <li>Use PLAY for fullscreen performance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="modal-footer border-secondary">
                <a href="https://hydra.ojack.xyz/docs/" target="_blank" class="btn btn-outline-info me-auto">
                    <i class="bi bi-book me-1"></i>Hydra Documentation
                </a>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Credits Modal -->
<div class="modal fade" id="creditsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Credits & Licence</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <h2 class="h4 text-info mb-3">Credits</h2>
                <ul class="list-unstyled">
                    <li class="mb-2"><i class="bi bi-caret-right-fill text-secondary"></i> This app is based on Hydra Synth by Olivia Jack: <a href="https://ojack.xyz/" target="_blank" class="link-info">https://ojack.xyz/</a></li>
                    <li class="mb-2 mt-3 text-muted">Many shaders were inspired by the work of following artists, creators and coders:</li>
                    @foreach($authors as $author)
                    <li class="mb-1 ms-3">
                        Shaders by {{ $author->name }}: 
                        @if($author->url)
                            <a href="{{ $author->url }}" target="_blank" class="link-light text-decoration-none">{{ $author->url }}</a>
                        @endif
                    </li>
                    @endforeach
                </ul>

                <h3 class="h5 text-info mt-4 mb-3">Open Source Libraries</h3>
                <ul>
                    <li>Hydra (<a href="https://hydra.ojack.xyz/" target="_blank" class="link-light">hydra.ojack.xyz</a>) — Licensed under MIT License</li>
                    <li>Meyda (<a href="https://meyda.js.org/" target="_blank" class="link-light">meyda.js.org</a>) — Licensed under MIT License</li>
                    <li>NodeGraph.js (<a href="https://github.com/almerito/NodeGraph" target="_blank" class="link-light">github.com/almerito/NodeGraph</a>) — Licensed under AGPL-3.0</li>
                </ul>
                <p class="small text-muted">We gratefully acknowledge the authors and contributors of these projects and shaders.</p>

                <hr class="border-secondary my-4">

                <h2 class="h4 text-warning mb-3">SOFTWARE LICENSE AGREEMENT</h2>
                <h3 class="h6 text-white mb-2">GNU Affero General Public License v3.0</h3>
                <p class="small">Copyright (C) <strong>2025 - Maximilian Ascari</strong></p>
                
                 <div class="p-3 bg-secondary bg-opacity-10 border border-secondary rounded small font-monospace mb-3">
                    <p class="mb-2">This program is free software: you can redistribute it and/or modify it
                    under the terms of the <strong>GNU Affero General Public License</strong>
                    as published by the Free Software Foundation, either version 3 of the License.</p>

                    <p class="mb-0">This program is distributed in the hope that it will be useful,
                    but <strong>WITHOUT ANY WARRANTY</strong>; without even the implied warranty of
                    <em>MERCHANTABILITY</em> or <em>FITNESS FOR A PARTICULAR PURPOSE</em>.
                    See the GNU Affero General Public License for more details.</p>
                </div>
                
                 <p class="small">
                    You should have received a copy of the GNU Affero General Public License
                    along with this program. If not, see:
                    <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" class="link-info">https://www.gnu.org/licenses/agpl-3.0.html</a>
                </p>
            </div>
             <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Changelog Modal -->
<div class="modal fade" id="changelogModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Changelog</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4" id="changelogContainer">
                <!-- Changelog items will be appended here -->
                <div class="text-center text-muted py-5" id="changelogLoading">
                    <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading updates...</p>
                </div>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
