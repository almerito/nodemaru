/**
 * WebGLCompositor.js
 * Blends two canvas sources with transitions using WebGL.
 * Ported from legacy codebase for Nodmearu V2.
 */

export class WebGLCompositor {
    /**
     * @param {HTMLCanvasElement} outputCanvas - The main canvas where the result is drawn
     */
    constructor(outputCanvas) {
        this.canvas = outputCanvas;
        this.gl = this.canvas.getContext('webgl', {
            preserveDrawingBuffer: true,
            alpha: false
        });

        if (!this.gl) {
            console.error('[Compositor] WebGL not supported on output canvas');
            return;
        }

        this.program = null;
        this.textureA = null;
        this.textureB = null;
        this.positionBuffer = null;
        this.texCoordBuffer = null;

        // Attribute/Uniform locations
        this.loc = {};

        this.initShaders();
        this.initBuffers();
    }

    initShaders() {
        const gl = this.gl;

        // Vertex shader
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        // Fragment shader with blend modes
        const fsSource = `
            precision mediump float;
            uniform sampler2D u_textureA;
            uniform sampler2D u_textureB;
            uniform float u_blend;
            uniform int u_mode;
            varying vec2 v_texCoord;

            // Simple random function
            float rand(vec2 co) {
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            // Simple noise
            float noise(vec2 p) {
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                
                float res = mix(
                    mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
                    mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
                return res * res;
            }

            void main() {
                vec4 colorA = texture2D(u_textureA, v_texCoord);
                vec4 colorB = texture2D(u_textureB, v_texCoord);
                
                if (u_mode == 0) {
                    // CrossFade
                    gl_FragColor = mix(colorA, colorB, u_blend);
                } else if (u_mode == 1) {
                    // FadeToBlack
                    if (u_blend < 0.5) {
                        float t = u_blend * 2.0;
                        gl_FragColor = mix(colorA, vec4(0.0, 0.0, 0.0, 1.0), t);
                    } else {
                        float t = (u_blend - 0.5) * 2.0;
                        gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), colorB, t);
                    }
                } else if (u_mode == 2) {
                    // Wipe Horizontal
                    float threshold = u_blend;
                    // Add slight softness
                    float edge = smoothstep(threshold - 0.01, threshold + 0.01, v_texCoord.x);
                    gl_FragColor = mix(colorB, colorA, edge);
                } else if (u_mode == 3) {
                    // Wipe Vertical
                    float threshold = u_blend;
                    float edge = smoothstep(threshold - 0.01, threshold + 0.01, v_texCoord.y);
                    gl_FragColor = mix(colorB, colorA, edge); 
                } else if (u_mode == 4) {
                    // Radial Wipe
                    vec2 center = vec2(0.5, 0.5);
                    // Adjust aspect ratio if needed, but for now simple circle
                    float dist = distance(v_texCoord, center);
                    // Max distance is 0.707 (corner). Multiply by 1.5 to cover fully.
                    float threshold = u_blend * 1.5; 
                    float edge = smoothstep(threshold - 0.01, threshold + 0.01, dist);
                    gl_FragColor = mix(colorB, colorA, edge);
                } else if (u_mode == 5) {
                    // Glitch
                    float disp = noise(vec2(v_texCoord.y, u_blend) * 20.0) * 0.1 * sin(u_blend * 3.14);
                    vec2 p = v_texCoord + vec2(disp, 0.0);
                    vec4 glitchedA = texture2D(u_textureA, p);
                    vec4 glitchedB = texture2D(u_textureB, p);
                    
                    // Simple color shifting (chromatic aberration)
                    float shift = 0.02 * sin(u_blend * 10.0);
                    glitchedA.r = texture2D(u_textureA, p + vec2(shift, 0.0)).r;
                    glitchedA.b = texture2D(u_textureA, p - vec2(shift, 0.0)).b;
                    
                    glitchedB.r = texture2D(u_textureB, p + vec2(shift, 0.0)).r;
                    glitchedB.b = texture2D(u_textureB, p - vec2(shift, 0.0)).b;

                    gl_FragColor = mix(glitchedA, glitchedB, u_blend);
                } else if (u_mode == 6) {
                    // Zoom
                    // A zooms in/out, B zooms in/out
                    float scale = 1.0 - u_blend * 0.5; // Starts at 1.0, ends at 0.5
                    vec2 center = vec2(0.5);
                    vec2 uvA = (v_texCoord - center) * (1.0 + u_blend) + center; // A zooms out
                    vec2 uvB = (v_texCoord - center) * (2.0 - u_blend) + center; // B zooms in

                    vec4 cA = texture2D(u_textureA, clamp(uvA, 0.0, 1.0));
                    vec4 cB = texture2D(u_textureB, clamp(uvB, 0.0, 1.0));
                    
                    // Fade out boundaries
                    if(uvA.x < 0.0 || uvA.x > 1.0 || uvA.y < 0.0 || uvA.y > 1.0) cA = vec4(0.0);
                    if(uvB.x < 0.0 || uvB.x > 1.0 || uvB.y < 0.0 || uvB.y > 1.0) cB = vec4(0.0);

                    gl_FragColor = mix(cA, cB, u_blend);
                } else if (u_mode == 7) {
                    // Pixelate
                    float pixels = mix(200.0, 10.0, sin(u_blend * 3.14));
                    vec2 p = floor(v_texCoord * pixels) / pixels;
                    vec4 pA = texture2D(u_textureA, p);
                    vec4 pB = texture2D(u_textureB, p);
                    gl_FragColor = mix(pA, pB, u_blend);
                } else if (u_mode == 8) {
                    // Luminance Melt
                    vec3 lumaCoef = vec3(0.299, 0.587, 0.114);
                    float lumaB = dot(colorB.rgb, lumaCoef);
                    // Use Blend to threshold luma
                    float edge = step(1.0 - u_blend, lumaB);
                    gl_FragColor = mix(colorA, colorB, edge);
                } else {
                    // Default
                    gl_FragColor = colorA;
                }
            }
        `;

        const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('[Compositor] Program link error:', gl.getProgramInfoLog(this.program));
        }

        // Get uniform locations
        this.loc.u_textureA = gl.getUniformLocation(this.program, 'u_textureA');
        this.loc.u_textureB = gl.getUniformLocation(this.program, 'u_textureB');
        this.loc.u_blend = gl.getUniformLocation(this.program, 'u_blend');
        this.loc.u_mode = gl.getUniformLocation(this.program, 'u_mode');
        this.loc.a_position = gl.getAttribLocation(this.program, 'a_position');
        this.loc.a_texCoord = gl.getAttribLocation(this.program, 'a_texCoord');
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('[Compositor] Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    initBuffers() {
        const gl = this.gl;

        // Full-screen quad positions
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1
        ]), gl.STATIC_DRAW);

        // Texture coordinates (flipped Y for correct orientation)
        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ]), gl.STATIC_DRAW);

        // Create textures
        this.textureA = this.createTexture();
        this.textureB = this.createTexture();
    }

    createTexture() {
        const gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return texture;
    }

    updateTexture(texture, sourceCanvas) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
    }

    resize(width, height) {
        // Canvas size might be updated externally, but we must ensure viewport is correct
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    /**
     * Blend two canvases
     * @param {HTMLCanvasElement} canvasA - Source canvas A
     * @param {HTMLCanvasElement} canvasB - Source canvas B
     * @param {number} blend - Blend factor 0-1 (0 = A, 1 = B)
     * @param {string} mode - 'crossFade' | 'fadeToBlack' | 'wipe' | etc.
     */
    blend(canvasA, canvasB, blend, mode = 'crossFade') {
        const gl = this.gl;

        // Update textures
        this.updateTexture(this.textureA, canvasA);
        this.updateTexture(this.textureB, canvasB);

        // Use program
        gl.useProgram(this.program);

        // Bind position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.loc.a_position);
        gl.vertexAttribPointer(this.loc.a_position, 2, gl.FLOAT, false, 0, 0);

        // Bind texCoord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.enableVertexAttribArray(this.loc.a_texCoord);
        gl.vertexAttribPointer(this.loc.a_texCoord, 2, gl.FLOAT, false, 0, 0);

        // Bind textures
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textureA);
        gl.uniform1i(this.loc.u_textureA, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textureB);
        gl.uniform1i(this.loc.u_textureB, 1);

        // Set blend amount
        gl.uniform1f(this.loc.u_blend, blend);

        // Set mode
        const modeMap = {
            crossFade: 0,
            fadeToBlack: 1, fadeBlack: 1,
            wipe: 2, wipe_lr: 2,
            'wipe-v': 3, wipe_ud: 3,
            radial: 4,
            glitch: 5,
            zoom: 6,
            pixelate: 7,
            melt: 8,
            none: 0
        };
        gl.uniform1i(this.loc.u_mode, modeMap[mode] !== undefined ? modeMap[mode] : 0);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * Copy a single canvas to output (no blending)
     */
    copy(sourceCanvas) {
        if (!sourceCanvas || sourceCanvas.width === 0) return;

        // Treat as blend 0 with A=Source, B=Source
        this.blend(sourceCanvas, sourceCanvas, 0, 'none');
    }

    dispose() {
        const gl = this.gl;
        if (this.program) gl.deleteProgram(this.program);
        if (this.textureA) gl.deleteTexture(this.textureA);
        if (this.textureB) gl.deleteTexture(this.textureB);
        if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
        if (this.texCoordBuffer) gl.deleteBuffer(this.texCoordBuffer);
    }
}
