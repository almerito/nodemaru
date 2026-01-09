<!-- Help Modal -->
<div class="modal fade" id="helpModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Nodemaru Visual Composer - Help</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <h1 class="h3 mb-3">Nodemaru Visual Composer Help</h1>

                <p class="lead">Welcome to the visual patcher for <a href="https://hydra.ojack.xyz/" target="_blank" class="link-info">Hydra Live Coding</a>.
                    This tool allows you to create complex visual synthesizers using a node-based interface.</p>

                <div class="mb-4 p-3 border border-secondary rounded bg-secondary bg-opacity-10">
                    <h2 class="h4 text-info">How does it work</h2>
                    <div class="row g-3 mt-2">
                        <div class="col-md-6">
                            <div class="card bg-dark border-secondary h-100">
                                <div class="card-body">
                                    <p class="card-text">This tool is a visual patcher for <a href="https://hydra.ojack.xyz/" target="_blank" class="link-info">Hydra Live Coding</a>. It creates animated visuals that can react to <strong>Audio</strong>, <strong>Video</strong>, <strong>Webcam</strong>, <strong>Screen capture</strong>, <strong>Midi</strong>, <strong>LFO</strong> and more.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card bg-dark border-secondary h-100">
                                <div class="card-body">
                                    <p class="card-text">To create a patch, start with a <strong>Source</strong> or <strong>External Source</strong> node. To add a node, you can <em>double click</em> with left mouse button over the canvas or click on the <strong>Add Node (+)</strong> button.</p>
                                </div>
                            </div>
                        </div>
                         <div class="col-md-6">
                            <div class="card bg-dark border-secondary h-100">
                                <div class="card-body">
                                    <p class="card-text">A patch must start with a <strong>Source</strong> or <strong>External Source</strong> node and end with a <strong>Output</strong> node. The <strong>Render</strong> node is a special node that accepts a node as input and outputs the result to the screen. If no nodes are connected to the Render node, it will output a maximum of four Output nodes (<em>o0-o3</em>).</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card bg-dark border-secondary h-100">
                                <div class="card-body">
                                    <p class="card-text"><strong>Connect nodes</strong> by dragging the <em>output socket</em> of one node to the <em>input socket</em> of another node.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="card bg-dark border-secondary">
                                <div class="card-body">
                                    <p class="card-text">There are two kind of connectors (dots): <strong>Nodes Connectors</strong> (orange=output and green=input) and <strong>Parameters Connectors</strong> (blue). Node connectors are used to connect nodes, while parameters connectors are used to connect parameters.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h2 class="h4 text-info">Interface Controls</h2>
                    <ul>
                        <li><strong>Canvas Navigation:</strong> Hold <kbd class="bg-secondary text-white">Middle Mouse Button</kbd> or <kbd class="bg-secondary text-white">Space + Left Drag</kbd> to Pan. Scroll to Zoom.</li>
                        <li><strong>Add Node:</strong> Click the <strong>Add Node (+)</strong> button or Double-Click on the canvas.</li>
                        <li><strong>Selection:</strong> Click a node to select. <kbd class="bg-secondary text-white">Shift + Click</kbd> to select multiple.</li>
                         <li><strong>Box Selection:</strong> Hold <kbd class="bg-secondary text-white">Right Mouse Button</kbd> and drag to select multiple nodes.</li>
                        <li><strong>Delete:</strong> Select node(s) and press <kbd class="bg-secondary text-white">Delete</kbd> or <kbd class="bg-secondary text-white">Backspace</kbd>.</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h2 class="h4 text-info">Toolbar Buttons</h2>
                    <ul>
                        <li><strong>New:</strong> Reset the canvas and start a fresh project.</li>
                        <li><strong>Save:</strong> Save preset to database (requires login).</li>
                        <li><strong>Load:</strong> Load preset from database.</li>
                        <li><strong>Export:</strong> Download your patch as a <code>.json</code> file.</li>
                        <li><strong>Import:</strong> Load a patch from a <code>.json</code> file.</li>
                        <li><strong>Settings:</strong> Configure global BPM and speed.</li>
                        <li><strong>Help:</strong> Open this page.</li>
                        <li><strong>Add Node (+):</strong> Open node library.</li>
                        <li><strong>Scenes:</strong> <span class="badge bg-success">NEW</span> Open the Scenes management panel.</li>
                        <li><strong>Preview:</strong> Compile and run your visual patch in a small draggable window. <span class="badge bg-success">NEW</span> You can drag the preview window around!</li>
                        <li><strong>PLAY:</strong> Compile and run your visual patch in full screen.</li>
                        <li><strong>RECORD:</strong> Record your visual patch as a video file ready to export.</li>
                    </ul>
                </div>
                
                 <div class="mb-4">
                    <h2 class="h4 text-info">Scenes & Transitions <span class="badge bg-success">NEW</span></h2>
                    <p>Create multi-scene performances with automated transitions between visual patches.</p>
                     
                    <h5 class="h6 text-white mt-3">Scenes Panel</h5>
                    <ul>
                        <li><strong>Open Panel:</strong> Click the <strong>Scenes</strong> button in the toolbar. The panel is draggable!</li>
                        <li><strong>Add Scene:</strong> Click <strong>+ ADD SCENE</strong> to create a new scene from the current canvas state.</li>
                        <li><strong>Select Scene:</strong> Click on a scene to load it into the editor.</li>
                        <li><strong>Reorder Scenes:</strong> Drag and drop scenes to change playback order.</li>
                        <li><strong>Delete Scene:</strong> Click the X button on a scene to remove it.</li>
                    </ul>

                     <h5 class="h6 text-white mt-3">Transition Types</h5>
                    <ul>
                        <li><strong>Crossfade:</strong> Simple opacity blend between scenes.</li>
                        <li><strong>Fade to Black:</strong> Fades out to black, then fades in the new scene.</li>
                        <li><strong>Wipe (Horizontal/Vertical):</strong> Wipe transitions.</li>
                        <li><strong>Radial:</strong> Circular reveal from center.</li>
                        <li><strong>Glitch:</strong> Digital glitch effect.</li>
                        <li><strong>Zoom:</strong> Zoom-in transition with bloom effect.</li>
                         <li><strong>Pixelate:</strong> Pixelation effect during transition.</li>
                        <li><strong>Melt:</strong> Luminance-based distortion effect.</li>
                    </ul>
                </div>

                <div class="mb-4">
                     <h2 class="h4 text-info">User Account System <span class="badge bg-success">NEW</span></h2>
                    <p>Create an account to save and manage your patches in the cloud.</p>
                    <ul>
                        <li><strong>Login:</strong> Access your account using email/password or Google authentication.</li>
                        <li><strong>Profile:</strong> Once logged in, your nickname is displayed in the header. Click on it to edit your profile or logout.</li>
                        <li><strong>Edit Profile:</strong> Update your name, nickname, or password anytime.</li>
                         <li><strong>Logout:</strong> Click on your nickname and select Logout to sign out.</li>
                    </ul>
                </div>

                <div class="mb-4">
                     <h2 class="h4 text-info">Recording Settings <span class="badge bg-success">NEW</span></h2>
                    <p>Record your visual patches as video files. Access these settings from <strong>Settings → Recording Settings</strong>.</p>
                    <ul>
                         <li><strong>FPS:</strong> 30 FPS or 60 FPS.</li>
                         <li><strong>Video Format:</strong> WebM (VP9/VP8) or MP4 (H.264/H.265).</li>
                        <li><strong>Quality:</strong> Bitrate slider from 2 Mbps to 100 Mbps.</li>
                        <li><strong>Record Audio:</strong> Enable to include audio.</li>
                    </ul>
                </div>
                
                <hr class="border-secondary">
                
                <div class="mb-4">
                    <h2 class="h3 text-warning">Node Types</h2>
                    
                    <h3 class="h5 mt-3 text-info">Sources</h3>
                    <p>Generators that start a chain. Examples: <code>osc</code>, <code>shape</code>, <code>noise</code>, <code>voronoi</code>, <code>gradient</code>, <code>solid</code>.</p>
                    
                     <h3 class="h5 mt-3 text-info">External Source <span class="badge bg-success">NEW</span></h3>
                    <p>Load external media into source buffers (s0-s3): Local Image/Video, Remote Image, Webcam, Screen capture.</p>
                    <div class="alert alert-warning border-0 bg-secondary bg-opacity-25 text-warning">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i> NOTE: An External Source node MUST be connected to a <strong>Source Input</strong> node.
                    </div>

                    <h3 class="h5 mt-3 text-info">Geometry</h3>
                    <p>Transformers that alter the coordinate space. Examples: <code>rotate</code>, <code>scale</code>, <code>kaleid</code>, <code>pixelate</code>, <code>repeat</code>, <code>scroll</code>.</p>

                    <h3 class="h5 mt-3 text-info">Color</h3>
                    <p>Modifiers for pixel colors. Examples: <code>posterize</code>, <code>invert</code>, <code>contrast</code>, <code>brightness</code>, <code>saturate</code>, <code>hue</code>, <code>colorama</code>.</p>
                    
                    <h3 class="h5 mt-3 text-info">Blend</h3>
                    <p>Combine two textures. Examples: <code>blend</code>, <code>add</code>, <code>diff</code>, <code>mask</code>, <code>mult</code>.</p>
                    
                    <h3 class="h5 mt-3 text-info">Modulate</h3>
                    <p>Use texture luminosity to deform coordinates. Examples: <code>modulate</code>, <code>modulateRotate</code>, <code>modulateScale</code>, <code>modulateKaleid</code>.</p>
                </div>
                
                <hr class="border-secondary">

                 <div class="mb-4">
                    <h2 class="h3 text-warning">Data Nodes</h2>
                    
                    <h3 class="h5 mt-3 text-info">Array Nodes</h3>
                    <p>Create lists of values to sequence parameters. Supports BPM sync, smoothing, easing.</p>
                    
                    <h3 class="h5 mt-3 text-info">LFO Nodes</h3>
                    <p>Low Frequency Oscillators. Waveforms: Sine, Square, Sawtooth, Triangle, Pulse.</p>
                    
                    <h3 class="h5 mt-3 text-info">MIDI Nodes <span class="badge bg-success">NEW</span></h3>
                    <p>Receive MIDI input (Note, velocity, CC, Pitch Bend) to control parameters in real-time.</p>
                    
                    <h3 class="h5 mt-3 text-info">Audio Nodes <span class="badge bg-warning text-dark">UPDATED</span></h3>
                    <p>Analyze audio for reactive visuals (powered by Meyda).</p>
                    <p><strong>Features:</strong> RMS, Energy, ZCR, Spectral Centroid, Loudness, Rhythm, Bands, Transients, etc.</p>
                 </div>

            </div>
            <div class="modal-footer border-secondary">
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
