var Ce = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
var pt = Ce((dt, Se) => {
  class Re {
    constructor({ device: e, context: r, format: n, label: o = "", width: i, height: h }) {
      this.device = e, this.context = r, this.format = n, this.label = o, this.width = i, this.height = h, this.pingPongIndex = 0, this.fbos = [], this.pipeline = null, this.bindGroup = null, this.uniformBuffer = null, this.vertexBuffer = null, this.sampler = null, this.device && this.initDevice(this.device, this.context, this.format);
    }
    setDevice(e, r, n) {
      this.device = e, this.context = r, this.format = n || this.format, this.initDevice(e, r, this.format);
    }
    initDevice(e, r, n) {
      this.fbos = [
        this._createFramebuffer(),
        this._createFramebuffer()
      ], this.vertexBuffer = this._createVertexBuffer(), this.sampler = e.createSampler({
        magFilter: "nearest",
        minFilter: "nearest"
      }), this.init();
    }
    _createFramebuffer() {
      return this.device ? this.device.createTexture({
        size: { width: this.width, height: this.height },
        format: this.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
      }) : null;
    }
    _createVertexBuffer() {
      if (!this.device) return null;
      const e = new Float32Array([
        -1,
        -1,
        3,
        -1,
        -1,
        3
      ]), r = this.device.createBuffer({
        size: e.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: !0
      });
      return new Float32Array(r.getMappedRange()).set(e), r.unmap(), r;
    }
    init() {
      this.device && (this.uniformBuffer = this.device.createBuffer({
        size: 16,
        // vec2 resolution + float time + padding
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      }));
    }
    resize(e, r) {
      this.width = e, this.height = r, !(!this.device || this.fbos.length === 0) && (this.fbos.forEach((n) => n && n.destroy()), this.fbos = [
        this._createFramebuffer(),
        this._createFramebuffer()
      ]);
    }
    getCurrent() {
      return this.fbos.length === 0 ? null : this.fbos[this.pingPongIndex];
    }
    getTexture() {
      if (this.fbos.length === 0) return null;
      const e = this.pingPongIndex ? 0 : 1;
      return this.fbos[e];
    }
    getPrevBuffer() {
      return this.fbos.length === 0 ? null : this.fbos[this.pingPongIndex];
    }
    /**
     * Compile and set up a render pipeline from WGSL shader code
     * @param {object} pass - Render pass with shader code and uniforms
     */
    async render(e) {
      if (!this.device) return;
      const { wgsl: r, uniforms: n } = e;
      let o = "", i = "";
      typeof r == "object" ? (o = r.header || "", i = r.body || "") : i = r || "";
      const h = this.device.createShaderModule({
        code: this._buildFullShader(o, i)
      }), f = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: { type: "filtering" }
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: "float" }
          }
        ]
      }), v = this.device.createPipelineLayout({
        bindGroupLayouts: [f]
      });
      this.pipeline = this.device.createRenderPipeline({
        layout: v,
        vertex: {
          module: h,
          entryPoint: "vs_main",
          buffers: [{
            arrayStride: 8,
            attributes: [{
              format: "float32x2",
              offset: 0,
              shaderLocation: 0
            }]
          }]
        },
        fragment: {
          module: h,
          entryPoint: "fs_main",
          targets: [{ format: this.format }]
        },
        primitive: {
          topology: "triangle-list"
        }
      }), this.bindGroup = this.device.createBindGroup({
        layout: f,
        entries: [
          { binding: 0, resource: { buffer: this.uniformBuffer } },
          { binding: 1, resource: this.sampler },
          { binding: 2, resource: this.getPrevBuffer().createView() }
        ]
      });
    }
    _buildFullShader(e, r) {
      return `
// Uniforms
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var prevBuffer: texture_2d<f32>;

// Vertex shader
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@location(0) pos: vec2<f32>) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4<f32>(pos, 0.0, 1.0);
  output.uv = (pos + 1.0) * 0.5;
  return output;
}

// Fragment shader Helper Functions
${e}

// Main Fragment Shader
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let time = uniforms.time;
  let resolution = uniforms.resolution;
  var _st = input.uv;
  var c = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  
  ${r}
  
  return c;
}
`;
    }
    /**
     * Execute a render pass with current pipeline
     * @param {object} props - Render properties (time, resolution)
     */
    tick(e) {
      if (!this.pipeline) return;
      const r = new Float32Array([
        e.resolution[0],
        e.resolution[1],
        e.time,
        0
        // padding
      ]);
      this.device.queue.writeBuffer(this.uniformBuffer, 0, r), this.pingPongIndex = this.pingPongIndex ? 0 : 1;
      const n = this.device.createCommandEncoder(), o = n.beginRenderPass({
        colorAttachments: [{
          view: this.fbos[this.pingPongIndex].createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
      });
      o.setPipeline(this.pipeline), o.setBindGroup(0, this.bindGroup), o.setVertexBuffer(0, this.vertexBuffer), o.draw(3), o.end(), this.device.queue.submit([n.finish()]);
    }
    /**
     * Render to the screen (final pass)
     * @param {object} props - Render properties
     */
    renderToScreen(e) {
      if (!this.pipeline) return;
      const r = this.device.createCommandEncoder(), n = r.beginRenderPass({
        colorAttachments: [{
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 1 }
        }]
      });
      n.setPipeline(this.pipeline), n.setBindGroup(0, this.bindGroup), n.setVertexBuffer(0, this.vertexBuffer), n.draw(3), n.end(), this.device.queue.submit([r.finish()]);
    }
    destroy() {
      this.fbos.forEach((e) => e.destroy()), this.vertexBuffer.destroy(), this.uniformBuffer.destroy();
    }
  }
  var ue = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  function xe(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  var V = { exports: {} }, pe;
  function Ae() {
    return pe || (pe = 1, typeof Object.create == "function" ? V.exports = function(e, r) {
      r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : V.exports = function(e, r) {
      if (r) {
        e.super_ = r;
        var n = function() {
        };
        n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
      }
    }), V.exports;
  }
  var ne, me;
  function Fe() {
    if (me) return ne;
    me = 1;
    function t() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }
    ne = t, t.EventEmitter = t, t.prototype._events = void 0, t.prototype._maxListeners = void 0, t.defaultMaxListeners = 10, t.prototype.setMaxListeners = function(i) {
      if (!r(i) || i < 0 || isNaN(i))
        throw TypeError("n must be a positive number");
      return this._maxListeners = i, this;
    }, t.prototype.emit = function(i) {
      var h, f, v, m, C, _;
      if (this._events || (this._events = {}), i === "error" && (!this._events.error || n(this._events.error) && !this._events.error.length)) {
        if (h = arguments[1], h instanceof Error)
          throw h;
        var S = new Error('Uncaught, unspecified "error" event. (' + h + ")");
        throw S.context = h, S;
      }
      if (f = this._events[i], o(f))
        return !1;
      if (e(f))
        switch (arguments.length) {
          // fast cases
          case 1:
            f.call(this);
            break;
          case 2:
            f.call(this, arguments[1]);
            break;
          case 3:
            f.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            m = Array.prototype.slice.call(arguments, 1), f.apply(this, m);
        }
      else if (n(f))
        for (m = Array.prototype.slice.call(arguments, 1), _ = f.slice(), v = _.length, C = 0; C < v; C++)
          _[C].apply(this, m);
      return !0;
    }, t.prototype.addListener = function(i, h) {
      var f;
      if (!e(h))
        throw TypeError("listener must be a function");
      return this._events || (this._events = {}), this._events.newListener && this.emit(
        "newListener",
        i,
        e(h.listener) ? h.listener : h
      ), this._events[i] ? n(this._events[i]) ? this._events[i].push(h) : this._events[i] = [this._events[i], h] : this._events[i] = h, n(this._events[i]) && !this._events[i].warned && (o(this._maxListeners) ? f = t.defaultMaxListeners : f = this._maxListeners, f && f > 0 && this._events[i].length > f && (this._events[i].warned = !0, console.error(
        "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
        this._events[i].length
      ), typeof console.trace == "function" && console.trace())), this;
    }, t.prototype.on = t.prototype.addListener, t.prototype.once = function(i, h) {
      if (!e(h))
        throw TypeError("listener must be a function");
      var f = !1;
      function v() {
        this.removeListener(i, v), f || (f = !0, h.apply(this, arguments));
      }
      return v.listener = h, this.on(i, v), this;
    }, t.prototype.removeListener = function(i, h) {
      var f, v, m, C;
      if (!e(h))
        throw TypeError("listener must be a function");
      if (!this._events || !this._events[i])
        return this;
      if (f = this._events[i], m = f.length, v = -1, f === h || e(f.listener) && f.listener === h)
        delete this._events[i], this._events.removeListener && this.emit("removeListener", i, h);
      else if (n(f)) {
        for (C = m; C-- > 0; )
          if (f[C] === h || f[C].listener && f[C].listener === h) {
            v = C;
            break;
          }
        if (v < 0)
          return this;
        f.length === 1 ? (f.length = 0, delete this._events[i]) : f.splice(v, 1), this._events.removeListener && this.emit("removeListener", i, h);
      }
      return this;
    }, t.prototype.removeAllListeners = function(i) {
      var h, f;
      if (!this._events)
        return this;
      if (!this._events.removeListener)
        return arguments.length === 0 ? this._events = {} : this._events[i] && delete this._events[i], this;
      if (arguments.length === 0) {
        for (h in this._events)
          h !== "removeListener" && this.removeAllListeners(h);
        return this.removeAllListeners("removeListener"), this._events = {}, this;
      }
      if (f = this._events[i], e(f))
        this.removeListener(i, f);
      else if (f)
        for (; f.length; )
          this.removeListener(i, f[f.length - 1]);
      return delete this._events[i], this;
    }, t.prototype.listeners = function(i) {
      var h;
      return !this._events || !this._events[i] ? h = [] : e(this._events[i]) ? h = [this._events[i]] : h = this._events[i].slice(), h;
    }, t.prototype.listenerCount = function(i) {
      if (this._events) {
        var h = this._events[i];
        if (e(h))
          return 1;
        if (h)
          return h.length;
      }
      return 0;
    }, t.listenerCount = function(i, h) {
      return i.listenerCount(h);
    };
    function e(i) {
      return typeof i == "function";
    }
    function r(i) {
      return typeof i == "number";
    }
    function n(i) {
      return typeof i == "object" && i !== null;
    }
    function o(i) {
      return i === void 0;
    }
    return ne;
  }
  var ie, de;
  function ze() {
    return de || (de = 1, ie = ue.performance && ue.performance.now ? function() {
      return performance.now();
    } : Date.now || function() {
      return +/* @__PURE__ */ new Date();
    }), ie;
  }
  var Y = { exports: {} }, G = { exports: {} }, Le = G.exports, ve;
  function ke() {
    return ve || (ve = 1, (function() {
      var t, e, r, n, o, i;
      typeof performance < "u" && performance !== null && performance.now ? G.exports = function() {
        return performance.now();
      } : typeof process < "u" && process !== null && process.hrtime ? (G.exports = function() {
        return (t() - o) / 1e6;
      }, e = process.hrtime, t = function() {
        var h;
        return h = e(), h[0] * 1e9 + h[1];
      }, n = t(), i = process.uptime() * 1e9, o = n - i) : Date.now ? (G.exports = function() {
        return Date.now() - r;
      }, r = Date.now()) : (G.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - r;
      }, r = (/* @__PURE__ */ new Date()).getTime());
    }).call(Le)), G.exports;
  }
  var ge;
  function Be() {
    if (ge) return Y.exports;
    ge = 1;
    for (var t = ke(), e = typeof window > "u" ? ue : window, r = ["moz", "webkit"], n = "AnimationFrame", o = e["request" + n], i = e["cancel" + n] || e["cancelRequest" + n], h = 0; !o && h < r.length; h++)
      o = e[r[h] + "Request" + n], i = e[r[h] + "Cancel" + n] || e[r[h] + "CancelRequest" + n];
    if (!o || !i) {
      var f = 0, v = 0, m = [], C = 1e3 / 60;
      o = function(_) {
        if (m.length === 0) {
          var S = t(), A = Math.max(0, C - (S - f));
          f = A + S, setTimeout(function() {
            var R = m.slice(0);
            m.length = 0;
            for (var F = 0; F < R.length; F++)
              if (!R[F].cancelled)
                try {
                  R[F].callback(f);
                } catch (q) {
                  setTimeout(function() {
                    throw q;
                  }, 0);
                }
          }, Math.round(A));
        }
        return m.push({
          handle: ++v,
          callback: _,
          cancelled: !1
        }), v;
      }, i = function(_) {
        for (var S = 0; S < m.length; S++)
          m[S].handle === _ && (m[S].cancelled = !0);
      };
    }
    return Y.exports = function(_) {
      return o.call(e, _);
    }, Y.exports.cancel = function() {
      i.apply(e, arguments);
    }, Y.exports.polyfill = function(_) {
      _ || (_ = e), _.requestAnimationFrame = o, _.cancelAnimationFrame = i;
    }, Y.exports;
  }
  var ae, ye;
  function Oe() {
    if (ye) return ae;
    ye = 1;
    var t = Ae(), e = Fe().EventEmitter, r = ze(), n = Be();
    ae = o;
    function o(i) {
      if (!(this instanceof o))
        return new o(i);
      this.running = !1, this.last = r(), this._frame = 0, this._tick = this.tick.bind(this), i && this.on("tick", i);
    }
    return t(o, e), o.prototype.start = function() {
      if (!this.running)
        return this.running = !0, this.last = r(), this._frame = n(this._tick), this;
    }, o.prototype.stop = function() {
      return this.running = !1, this._frame !== 0 && n.cancel(this._frame), this._frame = 0, this;
    }, o.prototype.tick = function() {
      this._frame = n(this._tick);
      var i = r(), h = i - this.last;
      this.emit("tick", h), this.last = i;
    }, ae;
  }
  var $e = Oe();
  const Ue = /* @__PURE__ */ xe($e);
  function Ie(t) {
    return navigator.mediaDevices.enumerateDevices().then((e) => e.filter((r) => r.kind === "videoinput")).then((e) => {
      let r = { audio: !1, video: !0 };
      return e[t] && (r.video = {
        deviceId: { exact: e[t].deviceId }
      }), window.navigator.mediaDevices.getUserMedia(r);
    }).then((e) => {
      const r = document.createElement("video");
      return r.setAttribute("autoplay", ""), r.setAttribute("muted", ""), r.setAttribute("playsinline", ""), r.srcObject = e, new Promise((n, o) => {
        r.addEventListener("loadedmetadata", () => {
          r.play().then(() => n({ video: r }));
        });
      });
    }).catch(console.log.bind(console));
  }
  function Pe(t) {
    return new Promise(function(e, r) {
      navigator.mediaDevices.getDisplayMedia(t).then((n) => {
        const o = document.createElement("video");
        o.srcObject = n, o.addEventListener("loadedmetadata", () => {
          o.play(), e({ video: o });
        });
      }).catch((n) => r(n));
    });
  }
  class De {
    constructor({ device: e, width: r, height: n, pb: o, label: i = "" }) {
      this.label = i, this.device = e, this.src = null, this.dynamic = !0, this.width = r, this.height = n, this.pb = o, this.tex = this._createTexture(1, 1), this._deferred = {
        width: r,
        height: n
      };
    }
    setDevice(e) {
      this.device = e, this._deferred && (this.tex = this._createTexture(this._deferred.width, this._deferred.height), this.src && this._updateTexture(this.src));
    }
    _createTexture(e, r) {
      return this.device ? this.device.createTexture({
        size: { width: e, height: r },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      }) : (e && r && (this._deferred = { width: e, height: r }), null);
    }
    _updateTexture(e, r = {}) {
      if (!this.device || !e) return;
      const n = e.videoWidth || e.width || this.width, o = e.videoHeight || e.height || this.height;
      (!this.tex || this.tex.width !== n || this.tex.height !== o) && (this.tex && this.tex.destroy(), this.tex = this._createTexture(n, o)), this.tex && (e instanceof HTMLVideoElement || e instanceof HTMLCanvasElement || e instanceof ImageBitmap || e instanceof HTMLImageElement) && this.device.queue.copyExternalImageToTexture(
        { source: e, flipY: r.flipY || !1 },
        { texture: this.tex },
        { width: n, height: o }
      );
    }
    init(e, r) {
      "src" in e && (this.src = e.src, this._updateTexture(this.src, r)), "dynamic" in e && (this.dynamic = e.dynamic);
    }
    initCam(e, r) {
      const n = this;
      Ie(e).then((o) => {
        n.src = o.video, n.dynamic = !0, n._updateTexture(n.src, r);
      }).catch((o) => console.log("could not get camera", o));
    }
    initVideo(e = "", r) {
      const n = document.createElement("video");
      n.crossOrigin = "anonymous", n.autoplay = !0, n.loop = !0, n.muted = !0, n.addEventListener("loadeddata", () => {
        this.src = n, n.play(), this._updateTexture(this.src, r), this.dynamic = !0;
      }), n.src = e;
    }
    initImage(e = "", r) {
      const n = document.createElement("img");
      n.crossOrigin = "anonymous", n.src = e, n.onload = () => {
        this.src = n, this.dynamic = !1, this._updateTexture(this.src, r);
      };
    }
    initStream(e, r) {
      let n = this;
      e && this.pb && (this.pb.initSource(e), this.pb.on("got video", function(o, i) {
        o === e && (n.src = i, n.dynamic = !0, n._updateTexture(n.src, r));
      }));
    }
    // index only relevant in atom-hydra + desktop apps
    initScreen(e = 0, r) {
      const n = this;
      Pe().then(function(o) {
        n.src = o.video, n._updateTexture(n.src, r), n.dynamic = !0;
      }).catch((o) => console.log("could not get screen", o));
    }
    // cache for the canvases, so we don't create them every time
    canvases = {};
    // Creates a canvas and returns the 2d context
    initCanvas(e = 1e3, r = 1e3) {
      if (this.canvases[this.label] == null) {
        const h = document.createElement("canvas").getContext("2d");
        h != null && (this.canvases[this.label] = h);
      }
      const n = this.canvases[this.label], o = n.canvas;
      return o.width !== e && o.height !== r ? (o.width = e, o.height = r) : n.clearRect(0, 0, e, r), this.init({ src: o }), this.dynamic = !0, n;
    }
    resize(e, r) {
      this.width = e, this.height = r;
    }
    clear() {
      this.src && this.src.srcObject && this.src.srcObject.getTracks && this.src.srcObject.getTracks().forEach((e) => e.stop()), this.src = null, this.tex && (this.tex.destroy(), this.tex = this._createTexture(1, 1));
    }
    tick(e) {
      this.src && this.dynamic === !0 && this.device && this._updateTexture(this.src);
    }
    getTexture() {
      return this.tex;
    }
  }
  const D = {};
  function je(t) {
    if (typeof t == "object") {
      if ("buttons" in t)
        return t.buttons;
      if ("which" in t) {
        var e = t.which;
        if (e === 2)
          return 4;
        if (e === 3)
          return 2;
        if (e > 0)
          return 1 << e - 1;
      } else if ("button" in t) {
        var e = t.button;
        if (e === 1)
          return 4;
        if (e === 2)
          return 2;
        if (e >= 0)
          return 1 << e;
      }
    }
    return 0;
  }
  D.buttons = je;
  function qe(t) {
    return t.target || t.srcElement || window;
  }
  D.element = qe;
  function Ge(t) {
    return typeof t == "object" && "pageX" in t ? t.pageX : 0;
  }
  D.x = Ge;
  function Ne(t) {
    return typeof t == "object" && "pageY" in t ? t.pageY : 0;
  }
  D.y = Ne;
  function Xe(t, e) {
    e || (e = t, t = window);
    var r = 0, n = 0, o = 0, i = {
      shift: !1,
      alt: !1,
      control: !1,
      meta: !1
    }, h = !1;
    function f(T) {
      var L = !1;
      return "altKey" in T && (L = L || T.altKey !== i.alt, i.alt = !!T.altKey), "shiftKey" in T && (L = L || T.shiftKey !== i.shift, i.shift = !!T.shiftKey), "ctrlKey" in T && (L = L || T.ctrlKey !== i.control, i.control = !!T.ctrlKey), "metaKey" in T && (L = L || T.metaKey !== i.meta, i.meta = !!T.metaKey), L;
    }
    function v(T, L) {
      var H = D.x(L), N = D.y(L);
      "buttons" in L && (T = L.buttons | 0), (T !== r || H !== n || N !== o || f(L)) && (r = T | 0, n = H || 0, o = N || 0, e && e(r, n, o, i));
    }
    function m(T) {
      v(0, T);
    }
    function C() {
      (r || n || o || i.shift || i.alt || i.meta || i.control) && (n = o = 0, r = 0, i.shift = i.alt = i.control = i.meta = !1, e && e(0, 0, 0, i));
    }
    function _(T) {
      f(T) && e && e(r, n, o, i);
    }
    function S(T) {
      D.buttons(T) === 0 ? v(0, T) : v(r, T);
    }
    function A(T) {
      v(r | D.buttons(T), T);
    }
    function R(T) {
      v(r & ~D.buttons(T), T);
    }
    function F() {
      h || (h = !0, t.addEventListener("mousemove", S), t.addEventListener("mousedown", A), t.addEventListener("mouseup", R), t.addEventListener("mouseleave", m), t.addEventListener("mouseenter", m), t.addEventListener("mouseout", m), t.addEventListener("mouseover", m), t.addEventListener("blur", C), t.addEventListener("keyup", _), t.addEventListener("keydown", _), t.addEventListener("keypress", _), t !== window && (window.addEventListener("blur", C), window.addEventListener("keyup", _), window.addEventListener("keydown", _), window.addEventListener("keypress", _)));
    }
    function q() {
      h && (h = !1, t.removeEventListener("mousemove", S), t.removeEventListener("mousedown", A), t.removeEventListener("mouseup", R), t.removeEventListener("mouseleave", m), t.removeEventListener("mouseenter", m), t.removeEventListener("mouseout", m), t.removeEventListener("mouseover", m), t.removeEventListener("blur", C), t.removeEventListener("keyup", _), t.removeEventListener("keydown", _), t.removeEventListener("keypress", _), t !== window && (window.removeEventListener("blur", C), window.removeEventListener("keyup", _), window.removeEventListener("keydown", _), window.removeEventListener("keypress", _)));
    }
    F();
    var P = {
      element: t
    };
    return Object.defineProperties(P, {
      enabled: {
        get: function() {
          return h;
        },
        set: function(T) {
          T ? F() : q();
        },
        enumerable: !0
      },
      buttons: {
        get: function() {
          return r;
        },
        enumerable: !0
      },
      x: {
        get: function() {
          return n;
        },
        enumerable: !0
      },
      y: {
        get: function() {
          return o;
        },
        enumerable: !0
      },
      mods: {
        get: function() {
          return i;
        },
        enumerable: !0
      }
    }), P;
  }
  var Z = { exports: {} }, Ye = Z.exports, _e;
  function Ke() {
    return _e || (_e = 1, (function(t, e) {
      (function(r, n) {
        t.exports = n();
      })(Ye, (function() {
        function r(c, s, u) {
          for (var l, p = 0, d = s.length; p < d; p++) !l && p in s || (l || (l = Array.prototype.slice.call(s, 0, p)), l[p] = s[p]);
          return c.concat(l || Array.prototype.slice.call(s));
        }
        var n = Object.freeze({ __proto__: null, blackman: function(c) {
          for (var s = new Float32Array(c), u = 2 * Math.PI / (c - 1), l = 2 * u, p = 0; p < c / 2; p++) s[p] = 0.42 - 0.5 * Math.cos(p * u) + 0.08 * Math.cos(p * l);
          for (p = Math.ceil(c / 2); p > 0; p--) s[c - p] = s[p - 1];
          return s;
        }, hamming: function(c) {
          for (var s = new Float32Array(c), u = 0; u < c; u++) s[u] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (u / c - 1));
          return s;
        }, hanning: function(c) {
          for (var s = new Float32Array(c), u = 0; u < c; u++) s[u] = 0.5 - 0.5 * Math.cos(2 * Math.PI * u / (c - 1));
          return s;
        }, sine: function(c) {
          for (var s = Math.PI / (c - 1), u = new Float32Array(c), l = 0; l < c; l++) u[l] = Math.sin(s * l);
          return u;
        } }), o = {};
        function i(c) {
          for (; c % 2 == 0 && c > 1; ) c /= 2;
          return c === 1;
        }
        function h(c, s) {
          if (s !== "rect") {
            if (s !== "" && s || (s = "hanning"), o[s] || (o[s] = {}), !o[s][c.length]) try {
              o[s][c.length] = n[s](c.length);
            } catch {
              throw new Error("Invalid windowing function");
            }
            c = (function(u, l) {
              for (var p = [], d = 0; d < Math.min(u.length, l.length); d++) p[d] = u[d] * l[d];
              return p;
            })(c, o[s][c.length]);
          }
          return c;
        }
        function f(c, s, u) {
          for (var l = new Float32Array(c), p = 0; p < l.length; p++) l[p] = p * s / u, l[p] = 13 * Math.atan(l[p] / 1315.8) + 3.5 * Math.atan(Math.pow(l[p] / 7518, 2));
          return l;
        }
        function v(c) {
          return Float32Array.from(c);
        }
        function m(c) {
          return 1125 * Math.log(1 + c / 700);
        }
        function C(c, s, u) {
          for (var l, p = new Float32Array(c + 2), d = new Float32Array(c + 2), b = s / 2, E = m(0), y = (m(b) - E) / (c + 1), g = new Array(c + 2), M = 0; M < p.length; M++) p[M] = M * y, d[M] = (l = p[M], 700 * (Math.exp(l / 1125) - 1)), g[M] = Math.floor((u + 1) * d[M] / s);
          for (var B = new Array(c), w = 0; w < B.length; w++) {
            for (B[w] = new Array(u / 2 + 1).fill(0), M = g[w]; M < g[w + 1]; M++) B[w][M] = (M - g[w]) / (g[w + 1] - g[w]);
            for (M = g[w + 1]; M < g[w + 2]; M++) B[w][M] = (g[w + 2] - M) / (g[w + 2] - g[w + 1]);
          }
          return B;
        }
        function _(c, s, u, l, p, d, b) {
          l === void 0 && (l = 5), p === void 0 && (p = 2), d === void 0 && (d = !0), b === void 0 && (b = 440);
          var E = Math.floor(u / 2) + 1, y = new Array(u).fill(0).map((function(z, k) {
            return c * (function(O, j) {
              return Math.log2(16 * O / j);
            })(s * k / u, b);
          }));
          y[0] = y[1] - 1.5 * c;
          var g, M, B, w = y.slice(1).map((function(z, k) {
            return Math.max(z - y[k]);
          }), 1).concat([1]), I = Math.round(c / 2), $ = new Array(c).fill(0).map((function(z, k) {
            return y.map((function(O) {
              return (10 * c + I + O - k) % c - I;
            }));
          })), U = $.map((function(z, k) {
            return z.map((function(O, j) {
              return Math.exp(-0.5 * Math.pow(2 * $[k][j] / w[j], 2));
            }));
          }));
          if (M = (g = U)[0].map((function() {
            return 0;
          })), B = g.reduce((function(z, k) {
            return k.forEach((function(O, j) {
              z[j] += Math.pow(O, 2);
            })), z;
          }), M).map(Math.sqrt), U = g.map((function(z, k) {
            return z.map((function(O, j) {
              return O / (B[j] || 1);
            }));
          })), p) {
            var se = y.map((function(z) {
              return Math.exp(-0.5 * Math.pow((z / c - l) / p, 2));
            }));
            U = U.map((function(z) {
              return z.map((function(k, O) {
                return k * se[O];
              }));
            }));
          }
          return d && (U = r(r([], U.slice(3), !0), U.slice(0, 3))), U.map((function(z) {
            return z.slice(0, E);
          }));
        }
        function S(c, s) {
          for (var u = 0, l = 0, p = 0; p < s.length; p++) u += Math.pow(p, c) * Math.abs(s[p]), l += s[p];
          return u / l;
        }
        function A(c) {
          var s = c.ampSpectrum, u = c.barkScale, l = c.numberOfBarkBands, p = l === void 0 ? 24 : l;
          if (typeof s != "object" || typeof u != "object") throw new TypeError();
          var d = p, b = new Float32Array(d), E = 0, y = s, g = new Int32Array(d + 1);
          g[0] = 0;
          for (var M = u[y.length - 1] / d, B = 1, w = 0; w < y.length; w++) for (; u[w] > M; ) g[B++] = w, M = B * u[y.length - 1] / d;
          for (g[d] = y.length - 1, w = 0; w < d; w++) {
            for (var I = 0, $ = g[w]; $ < g[w + 1]; $++) I += y[$];
            b[w] = Math.pow(I, 0.23);
          }
          for (w = 0; w < b.length; w++) E += b[w];
          return { specific: b, total: E };
        }
        function R(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          for (var u = new Float32Array(s.length), l = 0; l < u.length; l++) u[l] = Math.pow(s[l], 2);
          return u;
        }
        function F(c) {
          var s = c.ampSpectrum, u = c.melFilterBank, l = c.bufferSize;
          if (typeof s != "object") throw new TypeError("Valid ampSpectrum is required to generate melBands");
          if (typeof u != "object") throw new TypeError("Valid melFilterBank is required to generate melBands");
          for (var p = R({ ampSpectrum: s }), d = u.length, b = Array(d), E = new Float32Array(d), y = 0; y < E.length; y++) {
            b[y] = new Float32Array(l / 2), E[y] = 0;
            for (var g = 0; g < l / 2; g++) b[y][g] = u[y][g] * p[g], E[y] += b[y][g];
            E[y] = Math.log(E[y] + 1);
          }
          return Array.prototype.slice.call(E);
        }
        function q(c) {
          return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
        }
        var P = null, T = q((function(c, s) {
          var u = c.length;
          return s = s || 2, P && P[u] || (function(l) {
            (P = P || {})[l] = new Array(l * l);
            for (var p = Math.PI / l, d = 0; d < l; d++) for (var b = 0; b < l; b++) P[l][b + d * l] = Math.cos(p * (b + 0.5) * d);
          })(u), c.map((function() {
            return 0;
          })).map((function(l, p) {
            return s * c.reduce((function(d, b, E, y) {
              return d + b * P[u][E + p * u];
            }), 0);
          }));
        })), L = Object.freeze({ __proto__: null, amplitudeSpectrum: function(c) {
          return c.ampSpectrum;
        }, buffer: function(c) {
          return c.signal;
        }, chroma: function(c) {
          var s = c.ampSpectrum, u = c.chromaFilterBank;
          if (typeof s != "object") throw new TypeError("Valid ampSpectrum is required to generate chroma");
          if (typeof u != "object") throw new TypeError("Valid chromaFilterBank is required to generate chroma");
          var l = u.map((function(d, b) {
            return s.reduce((function(E, y, g) {
              return E + y * d[g];
            }), 0);
          })), p = Math.max.apply(Math, l);
          return p ? l.map((function(d) {
            return d / p;
          })) : l;
        }, complexSpectrum: function(c) {
          return c.complexSpectrum;
        }, energy: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0; l < s.length; l++) u += Math.pow(Math.abs(s[l]), 2);
          return u;
        }, loudness: A, melBands: F, mfcc: function(c) {
          var s = c.ampSpectrum, u = c.melFilterBank, l = c.numberOfMFCCCoefficients, p = c.bufferSize, d = Math.min(40, Math.max(1, l || 13));
          if (u.length < d) throw new Error("Insufficient filter bank for requested number of coefficients");
          var b = F({ ampSpectrum: s, melFilterBank: u, bufferSize: p });
          return T(b).slice(0, d);
        }, perceptualSharpness: function(c) {
          for (var s = A({ ampSpectrum: c.ampSpectrum, barkScale: c.barkScale }), u = s.specific, l = 0, p = 0; p < u.length; p++) l += p < 15 ? (p + 1) * u[p + 1] : 0.066 * Math.exp(0.171 * (p + 1));
          return l *= 0.11 / s.total;
        }, perceptualSpread: function(c) {
          for (var s = A({ ampSpectrum: c.ampSpectrum, barkScale: c.barkScale }), u = 0, l = 0; l < s.specific.length; l++) s.specific[l] > u && (u = s.specific[l]);
          return Math.pow((s.total - u) / s.total, 2);
        }, powerSpectrum: R, rms: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0; l < s.length; l++) u += Math.pow(s[l], 2);
          return u /= s.length, u = Math.sqrt(u);
        }, spectralCentroid: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          return S(1, s);
        }, spectralCrest: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = 0, l = -1 / 0;
          return s.forEach((function(p) {
            u += Math.pow(p, 2), l = p > l ? p : l;
          })), u /= s.length, u = Math.sqrt(u), l / u;
        }, spectralFlatness: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 0, p = 0; p < s.length; p++) u += Math.log(s[p]), l += s[p];
          return Math.exp(u / s.length) * s.length / l;
        }, spectralFlux: function(c) {
          var s = c.signal, u = c.previousSignal, l = c.bufferSize;
          if (typeof s != "object" || typeof u != "object") throw new TypeError();
          for (var p = 0, d = -l / 2; d < s.length / 2 - 1; d++) x = Math.abs(s[d]) - Math.abs(u[d]), p += (x + Math.abs(x)) / 2;
          return p;
        }, spectralKurtosis: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = s, l = S(1, u), p = S(2, u), d = S(3, u), b = S(4, u);
          return (-3 * Math.pow(l, 4) + 6 * l * p - 4 * l * d + b) / Math.pow(Math.sqrt(p - Math.pow(l, 2)), 4);
        }, spectralRolloff: function(c) {
          var s = c.ampSpectrum, u = c.sampleRate;
          if (typeof s != "object") throw new TypeError();
          for (var l = s, p = u / (2 * (l.length - 1)), d = 0, b = 0; b < l.length; b++) d += l[b];
          for (var E = 0.99 * d, y = l.length - 1; d > E && y >= 0; ) d -= l[y], --y;
          return (y + 1) * p;
        }, spectralSkewness: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          var u = S(1, s), l = S(2, s), p = S(3, s);
          return (2 * Math.pow(u, 3) - 3 * u * l + p) / Math.pow(Math.sqrt(l - Math.pow(u, 2)), 3);
        }, spectralSlope: function(c) {
          var s = c.ampSpectrum, u = c.sampleRate, l = c.bufferSize;
          if (typeof s != "object") throw new TypeError();
          for (var p = 0, d = 0, b = new Float32Array(s.length), E = 0, y = 0, g = 0; g < s.length; g++) {
            p += s[g];
            var M = g * u / l;
            b[g] = M, E += M * M, d += M, y += M * s[g];
          }
          return (s.length * y - d * p) / (p * (E - Math.pow(d, 2)));
        }, spectralSpread: function(c) {
          var s = c.ampSpectrum;
          if (typeof s != "object") throw new TypeError();
          return Math.sqrt(S(2, s) - Math.pow(S(1, s), 2));
        }, zcr: function(c) {
          var s = c.signal;
          if (typeof s != "object") throw new TypeError();
          for (var u = 0, l = 1; l < s.length; l++) (s[l - 1] >= 0 && s[l] < 0 || s[l - 1] < 0 && s[l] >= 0) && u++;
          return u;
        } });
        function H(c) {
          if (Array.isArray(c)) {
            for (var s = 0, u = Array(c.length); s < c.length; s++) u[s] = c[s];
            return u;
          }
          return Array.from(c);
        }
        var N = {}, te = {}, X = { bitReverseArray: function(c) {
          if (N[c] === void 0) {
            for (var s = (c - 1).toString(2).length, u = "0".repeat(s), l = {}, p = 0; p < c; p++) {
              var d = p.toString(2);
              d = u.substr(d.length) + d, d = [].concat(H(d)).reverse().join(""), l[p] = parseInt(d, 2);
            }
            N[c] = l;
          }
          return N[c];
        }, multiply: function(c, s) {
          return { real: c.real * s.real - c.imag * s.imag, imag: c.real * s.imag + c.imag * s.real };
        }, add: function(c, s) {
          return { real: c.real + s.real, imag: c.imag + s.imag };
        }, subtract: function(c, s) {
          return { real: c.real - s.real, imag: c.imag - s.imag };
        }, euler: function(c, s) {
          var u = -2 * Math.PI * c / s;
          return { real: Math.cos(u), imag: Math.sin(u) };
        }, conj: function(c) {
          return c.imag *= -1, c;
        }, constructComplexArray: function(c) {
          var s = {};
          s.real = c.real === void 0 ? c.slice() : c.real.slice();
          var u = s.real.length;
          return te[u] === void 0 && (te[u] = Array.apply(null, Array(u)).map(Number.prototype.valueOf, 0)), s.imag = te[u].slice(), s;
        } }, Ee = function(c) {
          var s = {};
          c.real === void 0 || c.imag === void 0 ? s = X.constructComplexArray(c) : (s.real = c.real.slice(), s.imag = c.imag.slice());
          var u = s.real.length, l = Math.log2(u);
          if (Math.round(l) != l) throw new Error("Input size must be a power of 2.");
          if (s.real.length != s.imag.length) throw new Error("Real and imaginary components must have the same length.");
          for (var p = X.bitReverseArray(u), d = { real: [], imag: [] }, b = 0; b < u; b++) d.real[p[b]] = s.real[b], d.imag[p[b]] = s.imag[b];
          for (var E = 0; E < u; E++) s.real[E] = d.real[E], s.imag[E] = d.imag[E];
          for (var y = 1; y <= l; y++) for (var g = Math.pow(2, y), M = 0; M < g / 2; M++) for (var B = X.euler(M, g), w = 0; w < u / g; w++) {
            var I = g * w + M, $ = g * w + M + g / 2, U = { real: s.real[I], imag: s.imag[I] }, se = { real: s.real[$], imag: s.imag[$] }, z = X.multiply(B, se), k = X.subtract(U, z);
            s.real[$] = k.real, s.imag[$] = k.imag;
            var O = X.add(z, U);
            s.real[I] = O.real, s.imag[I] = O.imag;
          }
          return s;
        }, Me = Ee, Te = (function() {
          function c(s, u) {
            var l = this;
            if (this._m = u, !s.audioContext) throw this._m.errors.noAC;
            if (s.bufferSize && !i(s.bufferSize)) throw this._m._errors.notPow2;
            if (!s.source) throw this._m._errors.noSource;
            this._m.audioContext = s.audioContext, this._m.bufferSize = s.bufferSize || this._m.bufferSize || 256, this._m.hopSize = s.hopSize || this._m.hopSize || this._m.bufferSize, this._m.sampleRate = s.sampleRate || this._m.audioContext.sampleRate || 44100, this._m.callback = s.callback, this._m.windowingFunction = s.windowingFunction || "hanning", this._m.featureExtractors = L, this._m.EXTRACTION_STARTED = s.startImmediately || !1, this._m.channel = typeof s.channel == "number" ? s.channel : 0, this._m.inputs = s.inputs || 1, this._m.outputs = s.outputs || 1, this._m.numberOfMFCCCoefficients = s.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13, this._m.numberOfBarkBands = s.numberOfBarkBands || this._m.numberOfBarkBands || 24, this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs), this._m.spn.connect(this._m.audioContext.destination), this._m._featuresToExtract = s.featureExtractors || [], this._m.barkScale = f(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize), this._m.melFilterBank = C(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize), this._m.inputData = null, this._m.previousInputData = null, this._m.frame = null, this._m.previousFrame = null, this.setSource(s.source), this._m.spn.onaudioprocess = function(p) {
              var d;
              l._m.inputData !== null && (l._m.previousInputData = l._m.inputData), l._m.inputData = p.inputBuffer.getChannelData(l._m.channel), l._m.previousInputData ? ((d = new Float32Array(l._m.previousInputData.length + l._m.inputData.length - l._m.hopSize)).set(l._m.previousInputData.slice(l._m.hopSize)), d.set(l._m.inputData, l._m.previousInputData.length - l._m.hopSize)) : d = l._m.inputData;
              var b = (function(E, y, g) {
                if (E.length < y) throw new Error("Buffer is too short for frame length");
                if (g < 1) throw new Error("Hop length cannot be less that 1");
                if (y < 1) throw new Error("Frame length cannot be less that 1");
                var M = 1 + Math.floor((E.length - y) / g);
                return new Array(M).fill(0).map((function(B, w) {
                  return E.slice(w * g, w * g + y);
                }));
              })(d, l._m.bufferSize, l._m.hopSize);
              b.forEach((function(E) {
                l._m.frame = E;
                var y = l._m.extract(l._m._featuresToExtract, l._m.frame, l._m.previousFrame);
                typeof l._m.callback == "function" && l._m.EXTRACTION_STARTED && l._m.callback(y), l._m.previousFrame = l._m.frame;
              }));
            };
          }
          return c.prototype.start = function(s) {
            this._m._featuresToExtract = s || this._m._featuresToExtract, this._m.EXTRACTION_STARTED = !0;
          }, c.prototype.stop = function() {
            this._m.EXTRACTION_STARTED = !1;
          }, c.prototype.setSource = function(s) {
            this._m.source && this._m.source.disconnect(this._m.spn), this._m.source = s, this._m.source.connect(this._m.spn);
          }, c.prototype.setChannel = function(s) {
            s <= this._m.inputs ? this._m.channel = s : console.error("Channel ".concat(s, " does not exist. Make sure you've provided a value for 'inputs' that is greater than ").concat(s, " when instantiating the MeydaAnalyzer"));
          }, c.prototype.get = function(s) {
            return this._m.inputData ? this._m.extract(s || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
          }, c;
        })(), re = { audioContext: null, spn: null, bufferSize: 512, sampleRate: 44100, melBands: 26, chromaBands: 12, callback: null, windowingFunction: "hanning", featureExtractors: L, EXTRACTION_STARTED: !1, numberOfMFCCCoefficients: 13, numberOfBarkBands: 24, _featuresToExtract: [], windowing: h, _errors: { notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"), featureUndef: new Error("Meyda: No features defined."), invalidFeatureFmt: new Error("Meyda: Invalid feature format"), invalidInput: new Error("Meyda: Invalid input."), noAC: new Error("Meyda: No AudioContext specified."), noSource: new Error("Meyda: No source node specified.") }, createMeydaAnalyzer: function(c) {
          return new Te(c, Object.assign({}, re));
        }, listAvailableFeatureExtractors: function() {
          return Object.keys(this.featureExtractors);
        }, extract: function(c, s, u) {
          var l = this;
          if (!s) throw this._errors.invalidInput;
          if (typeof s != "object") throw this._errors.invalidInput;
          if (!c) throw this._errors.featureUndef;
          if (!i(s.length)) throw this._errors.notPow2;
          this.barkScale !== void 0 && this.barkScale.length == this.bufferSize || (this.barkScale = f(this.bufferSize, this.sampleRate, this.bufferSize)), this.melFilterBank !== void 0 && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands || (this.melFilterBank = C(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)), this.chromaFilterBank !== void 0 && this.chromaFilterBank.length == this.chromaBands || (this.chromaFilterBank = _(this.chromaBands, this.sampleRate, this.bufferSize)), "buffer" in s && s.buffer === void 0 ? this.signal = v(s) : this.signal = s;
          var p = he(s, this.windowingFunction, this.bufferSize);
          if (this.signal = p.windowedSignal, this.complexSpectrum = p.complexSpectrum, this.ampSpectrum = p.ampSpectrum, u) {
            var d = he(u, this.windowingFunction, this.bufferSize);
            this.previousSignal = d.windowedSignal, this.previousComplexSpectrum = d.complexSpectrum, this.previousAmpSpectrum = d.ampSpectrum;
          }
          var b = function(E) {
            return l.featureExtractors[E]({ ampSpectrum: l.ampSpectrum, chromaFilterBank: l.chromaFilterBank, complexSpectrum: l.complexSpectrum, signal: l.signal, bufferSize: l.bufferSize, sampleRate: l.sampleRate, barkScale: l.barkScale, melFilterBank: l.melFilterBank, previousSignal: l.previousSignal, previousAmpSpectrum: l.previousAmpSpectrum, previousComplexSpectrum: l.previousComplexSpectrum, numberOfMFCCCoefficients: l.numberOfMFCCCoefficients, numberOfBarkBands: l.numberOfBarkBands });
          };
          if (typeof c == "object") return c.reduce((function(E, y) {
            var g;
            return Object.assign({}, E, ((g = {})[y] = b(y), g));
          }), {});
          if (typeof c == "string") return b(c);
          throw this._errors.invalidFeatureFmt;
        } }, he = function(c, s, u) {
          var l = {};
          c.buffer === void 0 ? l.signal = v(c) : l.signal = c, l.windowedSignal = h(l.signal, s), l.complexSpectrum = Me(l.windowedSignal), l.ampSpectrum = new Float32Array(u / 2);
          for (var p = 0; p < u / 2; p++) l.ampSpectrum[p] = Math.sqrt(Math.pow(l.complexSpectrum.real[p], 2) + Math.pow(l.complexSpectrum.imag[p], 2));
          return l;
        };
        return typeof window < "u" && (window.Meyda = re), re;
      }));
    })(Z)), Z.exports;
  }
  var We = Ke();
  const He = /* @__PURE__ */ xe(We);
  class Ve {
    constructor({
      numBins: e = 4,
      cutoff: r = 2,
      smooth: n = 0.4,
      max: o = 15,
      scale: i = 10,
      isDrawing: h = !1,
      parentEl: f = document.body
    }) {
      this.vol = 0, this.scale = i, this.max = o, this.cutoff = r, this.smooth = n, this.setBins(e), this.beat = {
        holdFrames: 20,
        threshold: 40,
        _cutoff: 0,
        // adaptive based on sound state
        decay: 0.98,
        _framesSinceBeat: 0
        // keeps track of frames
      }, this.onBeat = () => {
      }, this.canvas = document.createElement("canvas"), this.canvas.width = 100, this.canvas.height = 80, this.canvas.style.width = "100px", this.canvas.style.height = "80px", this.canvas.style.position = "absolute", this.canvas.style.right = "0px", this.canvas.style.bottom = "0px", f.appendChild(this.canvas), this.isDrawing = h, this.ctx = this.canvas.getContext("2d"), this.ctx.fillStyle = "#DFFFFF", this.ctx.strokeStyle = "#0ff", this.ctx.lineWidth = 0.5, window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia({ video: !1, audio: !0 }).then((v) => {
        this.stream = v, this.context = new AudioContext();
        let m = this.context.createMediaStreamSource(v);
        this.meyda = He.createMeydaAnalyzer({
          audioContext: this.context,
          source: m,
          featureExtractors: [
            "loudness"
            //  'perceptualSpread',
            //  'perceptualSharpness',
            //  'spectralCentroid'
          ]
        });
      }).catch((v) => console.log("ERROR", v));
    }
    detectBeat(e) {
      e > this.beat._cutoff && e > this.beat.threshold ? (this.onBeat(), this.beat._cutoff = e * 1.2, this.beat._framesSinceBeat = 0) : this.beat._framesSinceBeat <= this.beat.holdFrames ? this.beat._framesSinceBeat++ : (this.beat._cutoff *= this.beat.decay, this.beat._cutoff = Math.max(this.beat._cutoff, this.beat.threshold));
    }
    tick() {
      if (this.meyda) {
        var e = this.meyda.get();
        if (e && e !== null) {
          this.vol = e.loudness.total, this.detectBeat(this.vol);
          const r = (o, i) => o + i;
          let n = Math.floor(e.loudness.specific.length / this.bins.length);
          this.prevBins = this.bins.slice(0), this.bins = this.bins.map((o, i) => e.loudness.specific.slice(i * n, (i + 1) * n).reduce(r)).map((o, i) => o * (1 - this.settings[i].smooth) + this.prevBins[i] * this.settings[i].smooth), this.fft = this.bins.map((o, i) => (
            // Math.max(0, (bin - this.cutoff) / (this.max - this.cutoff))
            Math.max(0, (o - this.settings[i].cutoff) / this.settings[i].scale)
          )), this.isDrawing && this.draw();
        }
      }
    }
    setCutoff(e) {
      this.cutoff = e, this.settings = this.settings.map((r) => (r.cutoff = e, r));
    }
    setSmooth(e) {
      this.smooth = e, this.settings = this.settings.map((r) => (r.smooth = e, r));
    }
    setBins(e) {
      this.bins = Array(e).fill(0), this.prevBins = Array(e).fill(0), this.fft = Array(e).fill(0), this.settings = Array(e).fill(0).map(() => ({
        cutoff: this.cutoff,
        scale: this.scale,
        smooth: this.smooth
      })), this.bins.forEach((r, n) => {
        window["a" + n] = (o = 1, i = 0) => () => a.fft[n] * o + i;
      });
    }
    setScale(e) {
      this.scale = e, this.settings = this.settings.map((r) => (r.scale = e, r));
    }
    setMax(e) {
      this.max = e, console.log("set max is deprecated");
    }
    hide() {
      this.isDrawing = !1, this.canvas.style.display = "none";
    }
    show() {
      this.isDrawing = !0, this.canvas.style.display = "block";
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var e = this.canvas.width / this.bins.length, r = this.canvas.height / (this.max * 2);
      this.bins.forEach((n, o) => {
        var i = n * r;
        this.ctx.fillRect(o * e, this.canvas.height - i, e, i);
        var h = this.canvas.height - r * this.settings[o].cutoff;
        this.ctx.beginPath(), this.ctx.moveTo(o * e, h), this.ctx.lineTo((o + 1) * e, h), this.ctx.stroke();
        var f = this.canvas.height - r * (this.settings[o].scale + this.settings[o].cutoff);
        this.ctx.beginPath(), this.ctx.moveTo(o * e, f), this.ctx.lineTo((o + 1) * e, f), this.ctx.stroke();
      });
    }
  }
  class Qe {
    constructor(e) {
      this.mediaSource = new MediaSource(), this.stream = e, this.output = document.createElement("video"), this.output.autoplay = !0, this.output.loop = !0;
      let r = this;
      this.mediaSource.addEventListener("sourceopen", () => {
        console.log("MediaSource opened"), r.sourceBuffer = r.mediaSource.addSourceBuffer('video/webm; codecs="vp8"'), console.log("Source buffer: ", sourceBuffer);
      });
    }
    start() {
      let e = { mimeType: "video/webm;codecs=vp9" };
      this.recordedBlobs = [];
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, e);
      } catch (r) {
        console.log("Unable to create MediaRecorder with options Object: ", r);
        try {
          e = { mimeType: "video/webm,codecs=vp9" }, this.mediaRecorder = new MediaRecorder(this.stream, e);
        } catch (n) {
          console.log("Unable to create MediaRecorder with options Object: ", n);
          try {
            e = "video/vp8", this.mediaRecorder = new MediaRecorder(this.stream, e);
          } catch (o) {
            alert(`MediaRecorder is not supported by this browser.

Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.`), console.error("Exception while creating MediaRecorder:", o);
            return;
          }
        }
      }
      console.log("Created MediaRecorder", this.mediaRecorder, "with options", e), this.mediaRecorder.onstop = this._handleStop.bind(this), this.mediaRecorder.ondataavailable = this._handleDataAvailable.bind(this), this.mediaRecorder.start(100), console.log("MediaRecorder started", this.mediaRecorder);
    }
    stop() {
      this.mediaRecorder.stop();
    }
    _handleStop() {
      const e = new Blob(this.recordedBlobs, { type: this.mediaRecorder.mimeType }), r = window.URL.createObjectURL(e);
      this.output.src = r;
      const n = document.createElement("a");
      n.style.display = "none", n.href = r;
      let o = /* @__PURE__ */ new Date();
      n.download = `hydra-${o.getFullYear()}-${o.getMonth() + 1}-${o.getDate()}-${o.getHours()}.${o.getMinutes()}.${o.getSeconds()}.webm`, document.body.appendChild(n), n.click(), setTimeout(() => {
        document.body.removeChild(n), window.URL.revokeObjectURL(r);
      }, 300);
    }
    _handleDataAvailable(e) {
      e.data && e.data.size > 0 && this.recordedBlobs.push(e.data);
    }
  }
  const oe = {
    // no easing, no acceleration
    linear: function(t) {
      return t;
    },
    // accelerating from zero velocity
    easeInQuad: function(t) {
      return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function(t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function(t) {
      return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function(t) {
      return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function(t) {
      return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function(t) {
      return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function(t) {
      return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function(t) {
      return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
    // sin shape
    sin: function(t) {
      return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    }
  };
  var Je = (t, e, r, n, o) => (t - e) * (o - n) / (r - e) + n, ce = (t, e) => (t % e + e) % e;
  const be = {
    init: () => {
      Array.prototype.fast = function(t = 1) {
        return this._speed = t, this;
      }, Array.prototype.smooth = function(t = 1) {
        return this._smooth = t, this;
      }, Array.prototype.ease = function(t = "linear") {
        return typeof t == "function" ? (this._smooth = 1, this._ease = t) : oe[t] && (this._smooth = 1, this._ease = oe[t]), this;
      }, Array.prototype.offset = function(t = 0.5) {
        return this._offset = t % 1, this;
      }, Array.prototype.fit = function(t = 0, e = 1) {
        let r = Math.min(...this), n = Math.max(...this);
        var o = this.map((i) => Je(i, r, n, t, e));
        return o._speed = this._speed, o._smooth = this._smooth, o._ease = this._ease, o;
      };
    },
    getValue: (t = []) => ({ time: e, bpm: r }) => {
      let n = t._speed ? t._speed : 1, o = t._smooth ? t._smooth : 0, i = e * n * (r / 60) + (t._offset || 0);
      if (o !== 0) {
        let h = t._ease ? t._ease : oe.linear, f = i - o / 2, v = t[Math.floor(ce(f, t.length))], m = t[Math.floor(ce(f + 1, t.length))], C = Math.min(ce(f, 1) / o, 1);
        return h(C) * (m - v) + v;
      } else
        return t[Math.floor(i % t.length)], t[Math.floor(i % t.length)];
    }
  }, Ze = (t) => {
    var e = "", r = o(e), n = (i, h) => {
      e += `
      var ${i} = ${h}
    `, r = o(e);
    };
    return {
      addToContext: n,
      eval: (i) => r.eval(i)
    };
    function o(i) {
      globalThis.eval(i);
      var h = function(f) {
        globalThis.eval(f);
      };
      return {
        eval: h
      };
    }
  };
  class et {
    constructor(e, r, n = []) {
      this.makeGlobal = r, this.sandbox = Ze(), this.parent = e;
      var o = Object.keys(e);
      o.forEach((i) => this.add(i)), this.userProps = n;
    }
    add(e) {
      this.makeGlobal && (window[e] = this.parent[e]);
    }
    // sets on window as well as synth object if global (not needed for objects, which can be set directly)
    set(e, r) {
      this.makeGlobal && (window[e] = r), this.parent[e] = r;
    }
    tick() {
      this.makeGlobal && this.userProps.forEach((e) => {
        this.parent[e] = window[e];
      });
    }
    eval(e) {
      this.sandbox.eval(e);
    }
  }
  const tt = {
    float: {
      vec4: { name: "sum", args: [[1, 1, 1, 1]] },
      vec2: { name: "sum", args: [[1, 1]] }
    }
  }, le = (t) => (t = t.toString(), t.indexOf(".") < 0 && (t += "."), t);
  function rt(t, e, r) {
    const n = t.transform.inputs, o = t.userArgs, { generators: i } = t.synth, { src: h } = i;
    return n.map((f, v) => {
      const m = {
        value: f.default,
        type: f.type,
        //
        isUniform: !1,
        name: f.name,
        vecLen: 0
        //  generateGlsl: null // function for creating glsl
      };
      if (m.type === "float" && (m.value = le(f.default)), f.type.startsWith("vec"))
        try {
          m.vecLen = Number.parseInt(f.type.substr(3));
        } catch {
          console.log(`Error determining length of vector input type ${f.type} (${f.name})`);
        }
      if (o.length > v) {
        if (m.value = o[v], m.type === "vec4" && !(m.value.type === "GlslSource" || m.value.getTexture))
          throw new Error("Arguments must be a texture or GlslSource");
        typeof o[v] == "function" ? (m.value = (S, A, R) => {
          try {
            const F = o[v](A);
            return typeof F == "number" ? F : (console.warn("function does not return a number", o[v]), f.default);
          } catch (F) {
            return console.warn("ERROR", F), f.default;
          }
        }, m.isUniform = !0) : o[v].constructor === Array && (m.value = (S, A, R) => be.getValue(o[v])(A), m.isUniform = !0);
      }
      if (!(e < 0)) {
        if (m.value && m.value.transforms) {
          const S = m.value.transforms[m.value.transforms.length - 1];
          if (S.transform.glsl_return_type !== f.type) {
            const A = tt[f.type];
            if (typeof A < "u") {
              const R = A[S.transform.glsl_return_type];
              if (typeof R < "u") {
                const { name: F, args: q } = R;
                m.value = m.value[F](...q);
              }
            }
          }
          m.isUniform = !1;
        } else if (m.type === "float" && typeof m.value == "number")
          m.value = le(m.value);
        else if (m.type.startsWith("vec") && typeof m.value == "object" && Array.isArray(m.value))
          m.isUniform = !1, m.value = `${m.type}(${m.value.map(le).join(", ")})`;
        else if (m.value && m.value.getTexture)
          if (f.type === "sampler2D") {
            var C = m.value;
            m.value = () => C.getTexture(), m.isUniform = !0;
          } else {
            var _ = m.value;
            m.value = h(_), m.isUniform = !1;
          }
        m.isUniform && (m.name += e);
      }
      return m;
    });
  }
  function st(t) {
    var e = {
      uniforms: [],
      // list of uniforms used in shader
      wgslFunctions: [],
      // list of functions used in shader
      fragColor: ""
    }, r = we(t, e)("c", "st");
    e.fragColor = r;
    let n = {};
    return e.uniforms.forEach((o) => n[o.name] = o), e.uniforms = Object.values(n), e;
  }
  function fe(t, e) {
    return `${t}_i${e}`;
  }
  function we(t, e) {
    var r = (n, o) => "";
    return t.forEach((n, o) => {
      let i = rt(n, e.uniforms.length);
      i.forEach((f) => {
        f.isUniform && e.uniforms.push(f);
      }), nt(n, e.wgslFunctions) || e.wgslFunctions.push(n);
      var h = r;
      n.transform.type === "src" ? r = (f, v) => `${K(i, e)(`${f}${o}`, v)}
         ${f} = ${W(`${f}${o}`, v, n.name, i)};` : n.transform.type === "color" ? r = (f, v) => `${K(i, e)(`${f}${o}`, v)}
         ${h(f, v)}
         ${f} = ${W(`${f}${o}`, `${f}`, n.name, i)};` : n.transform.type === "coord" ? r = (f, v) => `${K(i, e)(`${f}${o}`, v)}
         ${v} = ${W(`${f}${o}`, `${v}`, n.name, i)};
         ${h(f, v)}` : n.transform.type === "combine" ? r = (f, v) => `${K(i, e)(`${f}${o}`, v)}
         ${h(f, v)}
         ${f} = ${W(`${f}${o}`, `${f}`, n.name, i)};` : n.transform.type === "combineCoord" && (r = (f, v) => `${K(i, e)(`${f}${o}`, v)}
         ${v} = ${W(`${f}${o}`, `${v}`, n.name, i)};
         ${h(f, v)}`);
    }), r;
  }
  function K(t, e) {
    let r = (o, i) => "";
    var n = r;
    return t.forEach((o, i) => {
      o.value.transforms && (n = r, r = (h, f) => {
        let v = fe(h, i), m = fe(`${f}_${h}`, i);
        return `var ${m}: vec2<f32> = ${f};
         ${n(h, f)}
         ${we(o.value.transforms, e)(v, m)}`;
      });
    }), r;
  }
  function W(t, e, r, n) {
    const o = n.map((i, h) => i.isUniform ? `uniforms.${i.name}` : i.value && i.value.transforms ? fe(t, h) : i.value).reduce((i, h) => `${i}, ${h}`, "");
    return `${r}(${e}${o})`;
  }
  function nt(t, e) {
    for (var r = 0; r < e.length; r++)
      if (t.name == e[r].name) return !0;
    return !1;
  }
  const it = {
    _luminance: {
      type: "util",
      glsl: `float _luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`,
      wgsl: `fn _luminance(rgb: vec3<f32>) -> f32 {
      let W = vec3<f32>(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`
    },
    _noise: {
      type: "util",
      glsl: `
    //	Simplex 3D Noise
    //	by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float _noise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
    `,
      wgsl: `
    // Simplex 3D Noise
    // by Ian McEwan, Ashima Arts - WGSL version
    fn permute_wgsl(x: vec4<f32>) -> vec4<f32> {
      return ((x * 34.0 + 1.0) * x) % vec4<f32>(289.0);
    }
    fn taylorInvSqrt_wgsl(r: vec4<f32>) -> vec4<f32> {
      return vec4<f32>(1.79284291400159) - 0.85373472095314 * r;
    }

    fn _noise(v: vec3<f32>) -> f32 {
      let C = vec2<f32>(1.0/6.0, 1.0/3.0);
      let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

      // First corner
      var i = floor(v + dot(v, vec3<f32>(C.y, C.y, C.y)));
      let x0 = v - i + dot(i, vec3<f32>(C.x, C.x, C.x));

      // Other corners
      let g = step(x0.yzx, x0.xyz);
      let l = vec3<f32>(1.0) - g;
      let i1 = min(g.xyz, l.zxy);
      let i2 = max(g.xyz, l.zxy);

      let x1 = x0 - i1 + vec3<f32>(C.x, C.x, C.x);
      let x2 = x0 - i2 + 2.0 * vec3<f32>(C.x, C.x, C.x);
      let x3 = x0 - vec3<f32>(1.0) + 3.0 * vec3<f32>(C.x, C.x, C.x);

      // Permutations
      i = i % vec3<f32>(289.0);
      let p = permute_wgsl(permute_wgsl(permute_wgsl(
                 i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));

      // Gradients
      let n_: f32 = 1.0/7.0;
      let ns = n_ * D.wyz - D.xzx;

      let j = p - 49.0 * floor(p * ns.z * ns.z);

      let x_ = floor(j * ns.z);
      let y_ = floor(j - 7.0 * x_);

      let xx = x_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let yy = y_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
      let h = vec4<f32>(1.0) - abs(xx) - abs(yy);

      let b0 = vec4<f32>(xx.xy, yy.xy);
      let b1 = vec4<f32>(xx.zw, yy.zw);

      let s0 = floor(b0) * 2.0 + vec4<f32>(1.0);
      let s1 = floor(b1) * 2.0 + vec4<f32>(1.0);
      let sh = -step(h, vec4<f32>(0.0));

      let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      let a1 = b1.xzyw + s1.xzyw * sh.zzww;

      var p0 = vec3<f32>(a0.xy, h.x);
      var p1 = vec3<f32>(a0.zw, h.y);
      var p2 = vec3<f32>(a1.xy, h.z);
      var p3 = vec3<f32>(a1.zw, h.w);

      // Normalise gradients
      let norm = taylorInvSqrt_wgsl(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 = p0 * norm.x;
      p1 = p1 * norm.y;
      p2 = p2 * norm.z;
      p3 = p3 * norm.w;

      // Mix final noise value
      var m = max(vec4<f32>(0.6) - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
      m = m * m;
      return 42.0 * dot(m*m, vec4<f32>(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    `
    },
    _rgbToHsv: {
      type: "util",
      glsl: `vec3 _rgbToHsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`,
      wgsl: `fn _rgbToHsv(c: vec3<f32>) -> vec3<f32> {
            let K = vec4<f32>(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            let p = mix(vec4<f32>(c.bg, K.wz), vec4<f32>(c.gb, K.xy), step(c.b, c.g));
            let q = mix(vec4<f32>(p.xyw, c.r), vec4<f32>(c.r, p.yzx), step(p.x, c.r));

            let d = q.x - min(q.w, q.y);
            let e: f32 = 1.0e-10;
            return vec3<f32>(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`
    },
    _hsvToRgb: {
      type: "util",
      glsl: `vec3 _hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`,
      wgsl: `fn _hsvToRgb(c: vec3<f32>) -> vec3<f32> {
        let K = vec4<f32>(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        let p = abs(fract(vec3<f32>(c.x, c.x, c.x) + K.xyz) * 6.0 - vec3<f32>(K.w, K.w, K.w));
        return c.z * mix(vec3<f32>(K.x, K.x, K.x), clamp(p - vec3<f32>(K.x, K.x, K.x), vec3<f32>(0.0), vec3<f32>(1.0)), c.y);
    }`
    }
  };
  let Q = null, J = null;
  async function at() {
    return Q || J || (J = (async () => {
      try {
        const t = await import("./web_naga-CH1sjz7U.js");
        return await t.default(), Q = t, console.log("[Hydra] Naga initialized (GLSL -> WGSL)"), Q;
      } catch (t) {
        throw console.error("[Hydra] Failed to initialize Naga:", t), t;
      }
    })(), J);
  }
  async function ot() {
    try {
      return await at(), !0;
    } catch {
      return !1;
    }
  }
  const ct = ot;
  var ee = function(t) {
    return this.transforms = [], t.transform && this.transforms.push(t), this.defaultOutput = t.defaultOutput, this.synth = t.synth, this.type = "WgslSource", this.defaultUniforms = t.defaultUniforms, this;
  };
  ee.prototype.addTransform = function(t) {
    this.transforms.push(t);
  };
  ee.prototype.out = function(t) {
    var e = t || this.defaultOutput;
    if (e) try {
      var r = this.compile(e);
      this.synth.currentFunctions = [], e.render(r);
    } catch (n) {
      console.warn("shader could not compile", n);
    }
  };
  ee.prototype.compile = function(t) {
    var e = st(this.transforms), r = {};
    e.uniforms.forEach((h) => {
      r[h.name] = h.value;
    });
    const n = Object.values(it).map((h) => h.wgsl).join(`
`), o = e.wgslFunctions.map((h) => {
      const f = h.transform || h, v = f.name, m = f.type, C = f.wgsl;
      if (!C) return "// missing wgsl for " + v;
      let _ = [], S = "vec4<f32>";
      return m === "src" ? (_.push("_st: vec2<f32>"), S = "vec4<f32>") : m === "coord" ? (_.push("_st: vec2<f32>"), S = "vec2<f32>") : m === "color" ? (_.push("_c0: vec4<f32>"), S = "vec4<f32>") : m === "combine" ? (_.push("_c0: vec4<f32>"), _.push("_c1: vec4<f32>"), S = "vec4<f32>") : m === "combineCoord" && (_.push("_st: vec2<f32>"), _.push("_c0: vec4<f32>"), S = "vec2<f32>"), f.inputs && f.inputs.forEach((A) => {
        const R = A.type === "float" ? "f32" : A.type;
        _.push(`${A.name}: ${R}`);
      }), `
fn ${v}(${_.join(", ")}) -> ${S} {
${C}
}
`;
    }).join(`
`), i = `
    ${e.fragColor}
    c = c; // Ensure c is used
  `;
    return {
      wgsl: {
        header: n + `
` + o,
        body: i
      },
      uniforms: Object.assign({}, this.defaultUniforms, r)
    };
  };
  const lt = () => [
    {
      name: "noise",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 10
        },
        {
          type: "float",
          name: "offset",
          default: 0.1
        }
      ],
      glsl: "   return vec4(vec3(_noise(vec3(_st*scale, offset*time))), 1.0);",
      wgsl: "   return vec4<f32>(vec3<f32>(_noise(vec3<f32>(_st*scale, offset*time))), 1.0);"
    },
    {
      name: "voronoi",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 5
        },
        {
          type: "float",
          name: "speed",
          default: 0.3
        },
        {
          type: "float",
          name: "blending",
          default: 0.3
        }
      ],
      glsl: `   vec3 color = vec3(.0);
   // Scale
   _st *= scale;
   // Tile the space
   vec2 i_st = floor(_st);
   vec2 f_st = fract(_st);
   float m_dist = 10.;  // minimun distance
   vec2 m_point;        // minimum point
   for (int j=-1; j<=1; j++ ) {
   for (int i=-1; i<=1; i++ ) {
   vec2 neighbor = vec2(float(i),float(j));
   vec2 p = i_st + neighbor;
   vec2 point = fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
   point = 0.5 + 0.5*sin(time*speed + 6.2831*point);
   vec2 diff = neighbor + point - f_st;
   float dist = length(diff);
   if( dist < m_dist ) {
   m_dist = dist;
   m_point = point;
   }
   }
   }
   // Assign a color using the closest point position
   color += dot(m_point,vec2(.3,.6));
   color *= 1.0 - blending*m_dist;
   return vec4(color, 1.0);`,
      wgsl: `   var color = vec3<f32>(0.0);
   var st = _st * scale;
   let i_st = floor(st);
   let f_st = fract(st);
   var m_dist: f32 = 10.0;
   var m_point: vec2<f32> = vec2<f32>(0.0);
   for (var j: i32 = -1; j <= 1; j = j + 1) {
     for (var i: i32 = -1; i <= 1; i = i + 1) {
       let neighbor = vec2<f32>(f32(i), f32(j));
       let p = i_st + neighbor;
       var point = fract(sin(vec2<f32>(dot(p, vec2<f32>(127.1, 311.7)), dot(p, vec2<f32>(269.5, 183.3)))) * 43758.5453);
       point = 0.5 + 0.5 * sin(time * speed + 6.2831 * point);
       let diff = neighbor + point - f_st;
       let dist = length(diff);
       if (dist < m_dist) {
         m_dist = dist;
         m_point = point;
       }
     }
   }
   color = color + vec3<f32>(dot(m_point, vec2<f32>(0.3, 0.6)));
   color = color * (1.0 - blending * m_dist);
   return vec4<f32>(color, 1.0);`
    },
    {
      name: "osc",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "frequency",
          default: 60
        },
        {
          type: "float",
          name: "sync",
          default: 0.1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st;
   float r = sin((st.x-offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   float g = sin((st.x+time*sync)*frequency)*0.5 + 0.5;
   float b = sin((st.x+offset/frequency+time*sync)*frequency)*0.5  + 0.5;
   return vec4(r, g, b, 1.0);`,
      wgsl: `   let st = _st;
   let r = sin((st.x - offset/frequency + time*sync) * frequency) * 0.5 + 0.5;
   let g = sin((st.x + time*sync) * frequency) * 0.5 + 0.5;
   let b = sin((st.x + offset/frequency + time*sync) * frequency) * 0.5 + 0.5;
   return vec4<f32>(r, g, b, 1.0);`
    },
    {
      name: "shape",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "sides",
          default: 3
        },
        {
          type: "float",
          name: "radius",
          default: 0.3
        },
        {
          type: "float",
          name: "smoothing",
          default: 0.01
        }
      ],
      glsl: `   vec2 st = _st * 2. - 1.;
   // Angle and radius from the current pixel
   float a = atan(st.x,st.y)+3.1416;
   float r = (2.*3.1416)/sides;
   float d = cos(floor(.5+a/r)*r-a)*length(st);
   return vec4(vec3(1.0-smoothstep(radius,radius + smoothing + 0.0000001,d)), 1.0);`,
      wgsl: `   let st = _st * 2.0 - 1.0;
   let a = atan2(st.x, st.y) + 3.1416;
   let r = (2.0 * 3.1416) / sides;
   let d = cos(floor(0.5 + a/r) * r - a) * length(st);
   return vec4<f32>(vec3<f32>(1.0 - smoothstep(radius, radius + smoothing + 0.0000001, d)), 1.0);`
    },
    {
      name: "gradient",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: "   return vec4(_st, sin(time*speed), 1.0);",
      wgsl: "   return vec4<f32>(_st, sin(time*speed), 1.0);"
    },
    {
      name: "src",
      type: "src",
      inputs: [
        {
          type: "sampler2D",
          name: "tex",
          default: NaN
        }
      ],
      glsl: `   //  vec2 uv = gl_FragCoord.xy/vec2(1280., 720.);
   return texture2D(tex, fract(_st));`,
      wgsl: "   return textureSample(tex, texSampler, fract(_st));"
    },
    {
      name: "solid",
      type: "src",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 0
        },
        {
          type: "float",
          name: "g",
          default: 0
        },
        {
          type: "float",
          name: "b",
          default: 0
        },
        {
          type: "float",
          name: "a",
          default: 1
        }
      ],
      glsl: "   return vec4(r, g, b, a);",
      wgsl: "   return vec4<f32>(r, g, b, a);"
    },
    {
      name: "rotate",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "angle",
          default: 10
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   float ang = angle + speed *time;
   xy = mat2(cos(ang),-sin(ang), sin(ang),cos(ang))*xy;
   xy += 0.5;
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   let ang = angle + speed * time;
   let rotMat = mat2x2<f32>(cos(ang), -sin(ang), sin(ang), cos(ang));
   xy = rotMat * xy;
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "scale",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1.5
        },
        {
          type: "float",
          name: "xMult",
          default: 1
        },
        {
          type: "float",
          name: "yMult",
          default: 1
        },
        {
          type: "float",
          name: "offsetX",
          default: 0.5
        },
        {
          type: "float",
          name: "offsetY",
          default: 0.5
        }
      ],
      glsl: `   vec2 xy = _st - vec2(offsetX, offsetY);
   xy*=(1.0/vec2(amount*xMult, amount*yMult));
   xy+=vec2(offsetX, offsetY);
   return xy;
   `,
      wgsl: `   var xy = _st - vec2<f32>(offsetX, offsetY);
   xy = xy * (1.0 / vec2<f32>(amount * xMult, amount * yMult));
   xy = xy + vec2<f32>(offsetX, offsetY);
   return xy;`
    },
    {
      name: "pixelate",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "pixelX",
          default: 20
        },
        {
          type: "float",
          name: "pixelY",
          default: 20
        }
      ],
      glsl: `   vec2 xy = vec2(pixelX, pixelY);
   return (floor(_st * xy) + 0.5)/xy;`,
      wgsl: `   let xy = vec2<f32>(pixelX, pixelY);
   return (floor(_st * xy) + 0.5) / xy;`
    },
    {
      name: "posterize",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "bins",
          default: 3
        },
        {
          type: "float",
          name: "gamma",
          default: 0.6
        }
      ],
      glsl: `   vec4 c2 = pow(_c0, vec4(gamma));
   c2 *= vec4(bins);
   c2 = floor(c2);
   c2/= vec4(bins);
   c2 = pow(c2, vec4(1.0/gamma));
   return vec4(c2.xyz, _c0.a);`,
      wgsl: `   var c2 = pow(_c0, vec4<f32>(gamma));
   c2 = c2 * vec4<f32>(bins);
   c2 = floor(c2);
   c2 = c2 / vec4<f32>(bins);
   c2 = pow(c2, vec4<f32>(1.0/gamma));
   return vec4<f32>(c2.xyz, _c0.a);`
    },
    {
      name: "shift",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 0.5
        },
        {
          type: "float",
          name: "g",
          default: 0
        },
        {
          type: "float",
          name: "b",
          default: 0
        },
        {
          type: "float",
          name: "a",
          default: 0
        }
      ],
      glsl: `   vec4 c2 = vec4(_c0);
   c2.r += fract(r);
   c2.g += fract(g);
   c2.b += fract(b);
   c2.a += fract(a);
   return vec4(c2.rgba);`,
      wgsl: `   var c2 = _c0;
   c2.r = c2.r + fract(r);
   c2.g = c2.g + fract(g);
   c2.b = c2.b + fract(b);
   c2.a = c2.a + fract(a);
   return c2;`
    },
    {
      name: "repeat",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "repeatX",
          default: 3
        },
        {
          type: "float",
          name: "repeatY",
          default: 3
        },
        {
          type: "float",
          name: "offsetX",
          default: 0
        },
        {
          type: "float",
          name: "offsetY",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) * offsetX;
   st.y += step(1., mod(st.x,2.0)) * offsetY;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x = st.x + step(1.0, st.y % 2.0) * offsetX;
   st.y = st.y + step(1.0, st.x % 2.0) * offsetY;
   return fract(st);`
    },
    {
      name: "modulateRepeat",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "repeatX",
          default: 3
        },
        {
          type: "float",
          name: "repeatY",
          default: 3
        },
        {
          type: "float",
          name: "offsetX",
          default: 0.5
        },
        {
          type: "float",
          name: "offsetY",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(repeatX, repeatY);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offsetX;
   st.y += step(1., mod(st.x,2.0)) + _c0.g * offsetY;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(repeatX, repeatY);
   st.x = st.x + step(1.0, st.y % 2.0) + _c0.r * offsetX;
   st.y = st.y + step(1.0, st.x % 2.0) + _c0.g * offsetY;
   return fract(st);`
    },
    {
      name: "repeatX",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.y += step(1., mod(st.x,2.0))* offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y = st.y + step(1.0, st.x % 2.0) * offset;
   return fract(st);`
    },
    {
      name: "modulateRepeatX",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.y += step(1., mod(st.x,2.0)) + _c0.r * offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.y = st.y + step(1.0, st.x % 2.0) + _c0.r * offset;
   return fract(st);`
    },
    {
      name: "repeatY",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 st = _st * vec2(1.0, reps);
   //  float f =  mod(_st.y,2.0);
   st.x += step(1., mod(st.y,2.0))* offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(1.0, reps);
   st.x = st.x + step(1.0, st.y % 2.0) * offset;
   return fract(st);`
    },
    {
      name: "modulateRepeatY",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "reps",
          default: 3
        },
        {
          type: "float",
          name: "offset",
          default: 0.5
        }
      ],
      glsl: `   vec2 st = _st * vec2(reps, 1.0);
   //  float f =  mod(_st.y,2.0);
   st.x += step(1., mod(st.y,2.0)) + _c0.r * offset;
   return fract(st);`,
      wgsl: `   var st = _st * vec2<f32>(reps, 1.0);
   st.x = st.x + step(1.0, st.y % 2.0) + _c0.r * offset;
   return fract(st);`
    },
    {
      name: "kaleid",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "nSides",
          default: 4
        }
      ],
      glsl: `   vec2 st = _st;
   st -= 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return r*vec2(cos(a), sin(a));`,
      wgsl: `   var st = _st - vec2<f32>(0.5);
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi: f32 = 2.0 * 3.1416;
   a = a % (pi / nSides);
   a = abs(a - pi / nSides / 2.0);
   return r * vec2<f32>(cos(a), sin(a));`
    },
    {
      name: "modulateKaleid",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "nSides",
          default: 4
        }
      ],
      glsl: `   vec2 st = _st - 0.5;
   float r = length(st);
   float a = atan(st.y, st.x);
   float pi = 2.*3.1416;
   a = mod(a,pi/nSides);
   a = abs(a-pi/nSides/2.);
   return (_c0.r+r)*vec2(cos(a), sin(a));`,
      wgsl: `   let st = _st - vec2<f32>(0.5);
   let r = length(st);
   var a = atan2(st.y, st.x);
   let pi: f32 = 2.0 * 3.1416;
   a = a % (pi / nSides);
   a = abs(a - pi / nSides / 2.0);
   return (_c0.r + r) * vec2<f32>(cos(a), sin(a));`
    },
    {
      name: "scroll",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speedX",
          default: 0
        },
        {
          type: "float",
          name: "speedY",
          default: 0
        }
      ],
      glsl: `
   _st.x += scrollX + time*speedX;
   _st.y += scrollY + time*speedY;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + scrollX + time * speedX;
   st.y = st.y + scrollY + time * speedY;
   return fract(st);`
    },
    {
      name: "scrollX",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.x += scrollX + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + scrollX + time * speed;
   return fract(st);`
    },
    {
      name: "modulateScrollX",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "scrollX",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.x += _c0.r*scrollX + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.x = st.x + _c0.r * scrollX + time * speed;
   return fract(st);`
    },
    {
      name: "scrollY",
      type: "coord",
      inputs: [
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.y += scrollY + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.y = st.y + scrollY + time * speed;
   return fract(st);`
    },
    {
      name: "modulateScrollY",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "scrollY",
          default: 0.5
        },
        {
          type: "float",
          name: "speed",
          default: 0
        }
      ],
      glsl: `   _st.y += _c0.r*scrollY + time*speed;
   return fract(_st);`,
      wgsl: `   var st = _st;
   st.y = st.y + _c0.r * scrollY + time * speed;
   return fract(st);`
    },
    {
      name: "add",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return (_c0+_c1)*amount + _c0*(1.0-amount);",
      wgsl: "   return (_c0 + _c1) * amount + _c0 * (1.0 - amount);"
    },
    {
      name: "sub",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return (_c0-_c1)*amount + _c0*(1.0-amount);",
      wgsl: "   return (_c0 - _c1) * amount + _c0 * (1.0 - amount);"
    },
    {
      name: "layer",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));",
      wgsl: "   return vec4<f32>(mix(_c0.rgb, _c1.rgb, _c1.a), clamp(_c0.a + _c1.a, 0.0, 1.0));"
    },
    {
      name: "blend",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.5
        }
      ],
      glsl: "   return _c0*(1.0-amount)+_c1*amount;",
      wgsl: "   return _c0 * (1.0 - amount) + _c1 * amount;"
    },
    {
      name: "mult",
      type: "combine",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return _c0*(1.0-amount)+(_c0*_c1)*amount;",
      wgsl: "   return _c0 * (1.0 - amount) + (_c0 * _c1) * amount;"
    },
    {
      name: "diff",
      type: "combine",
      inputs: [],
      glsl: "   return vec4(abs(_c0.rgb-_c1.rgb), max(_c0.a, _c1.a));",
      wgsl: "   return vec4<f32>(abs(_c0.rgb - _c1.rgb), max(_c0.a, _c1.a));"
    },
    {
      name: "modulate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.1
        }
      ],
      glsl: `   //  return fract(st+(_c0.xy-0.5)*amount);
   return _st + _c0.xy*amount;`,
      wgsl: "   return _st + _c0.xy * amount;"
    },
    {
      name: "modulateScale",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 1
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   xy*=(1.0/vec2(offset + multiple*_c0.r, offset + multiple*_c0.g));
   xy+=vec2(0.5);
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   xy = xy * (1.0 / vec2<f32>(offset + multiple * _c0.r, offset + multiple * _c0.g));
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "modulatePixelate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 10
        },
        {
          type: "float",
          name: "offset",
          default: 3
        }
      ],
      glsl: `   vec2 xy = vec2(offset + _c0.x*multiple, offset + _c0.y*multiple);
   return (floor(_st * xy) + 0.5)/xy;`,
      wgsl: `   let xy = vec2<f32>(offset + _c0.x * multiple, offset + _c0.y * multiple);
   return (floor(_st * xy) + 0.5) / xy;`
    },
    {
      name: "modulateRotate",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "multiple",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: `   vec2 xy = _st - vec2(0.5);
   float angle = offset + _c0.x * multiple;
   xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
   xy += 0.5;
   return xy;`,
      wgsl: `   var xy = _st - vec2<f32>(0.5);
   let angle = offset + _c0.x * multiple;
   let rotMat = mat2x2<f32>(cos(angle), -sin(angle), sin(angle), cos(angle));
   xy = rotMat * xy;
   xy = xy + vec2<f32>(0.5);
   return xy;`
    },
    {
      name: "modulateHue",
      type: "combineCoord",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return _st + (vec2(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0/resolution);",
      wgsl: "   return _st + (vec2<f32>(_c0.g - _c0.r, _c0.b - _c0.g) * amount * 1.0 / resolution);"
    },
    {
      name: "invert",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1
        }
      ],
      glsl: "   return vec4((1.0-_c0.rgb)*amount + _c0.rgb*(1.0-amount), _c0.a);",
      wgsl: "   return vec4<f32>((1.0 - _c0.rgb) * amount + _c0.rgb * (1.0 - amount), _c0.a);"
    },
    {
      name: "contrast",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 1.6
        }
      ],
      glsl: `   vec4 c = (_c0-vec4(0.5))*vec4(amount) + vec4(0.5);
   return vec4(c.rgb, _c0.a);`,
      wgsl: `   let c = (_c0 - vec4<f32>(0.5)) * vec4<f32>(amount) + vec4<f32>(0.5);
   return vec4<f32>(c.rgb, _c0.a);`
    },
    {
      name: "brightness",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 0.4
        }
      ],
      glsl: "   return vec4(_c0.rgb + vec3(amount), _c0.a);",
      wgsl: "   return vec4<f32>(_c0.rgb + vec3<f32>(amount), _c0.a);"
    },
    {
      name: "mask",
      type: "combine",
      inputs: [],
      glsl: `   float a = _luminance(_c1.rgb);
  return vec4(_c0.rgb*a, a*_c0.a);`,
      wgsl: `   let a = _luminance(_c1.rgb);
  return vec4<f32>(_c0.rgb * a, a * _c0.a);`
    },
    {
      name: "luma",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "threshold",
          default: 0.5
        },
        {
          type: "float",
          name: "tolerance",
          default: 0.1
        }
      ],
      glsl: `   float a = smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb));
   return vec4(_c0.rgb*a, a);`,
      wgsl: `   let a = smoothstep(threshold - (tolerance + 0.0000001), threshold + (tolerance + 0.0000001), _luminance(_c0.rgb));
   return vec4<f32>(_c0.rgb * a, a);`
    },
    {
      name: "thresh",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "threshold",
          default: 0.5
        },
        {
          type: "float",
          name: "tolerance",
          default: 0.04
        }
      ],
      glsl: "   return vec4(vec3(smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb))), _c0.a);",
      wgsl: "   return vec4<f32>(vec3<f32>(smoothstep(threshold - (tolerance + 0.0000001), threshold + (tolerance + 0.0000001), _luminance(_c0.rgb))), _c0.a);"
    },
    {
      name: "color",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "r",
          default: 1
        },
        {
          type: "float",
          name: "g",
          default: 1
        },
        {
          type: "float",
          name: "b",
          default: 1
        },
        {
          type: "float",
          name: "a",
          default: 1
        }
      ],
      glsl: `   vec4 c = vec4(r, g, b, a);
   vec4 pos = step(0.0, c); // detect whether negative
   // if > 0, return r * _c0
   // if < 0 return (1.0-r) * _c0
   return vec4(mix((1.0-_c0)*abs(c), c*_c0, pos));`,
      wgsl: `   let c = vec4<f32>(r, g, b, a);
   let pos = step(vec4<f32>(0.0), c);
   return mix((vec4<f32>(1.0) - _c0) * abs(c), c * _c0, pos);`
    },
    {
      name: "saturate",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 2
        }
      ],
      glsl: `   const vec3 W = vec3(0.2125, 0.7154, 0.0721);
   vec3 intensity = vec3(dot(_c0.rgb, W));
   return vec4(mix(intensity, _c0.rgb, amount), _c0.a);`,
      wgsl: `   let W = vec3<f32>(0.2125, 0.7154, 0.0721);
   let intensity = vec3<f32>(dot(_c0.rgb, W));
   return vec4<f32>(mix(intensity, _c0.rgb, amount), _c0.a);`
    },
    {
      name: "hue",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "hue",
          default: 0.4
        }
      ],
      glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c.r += hue;
   //  c.r = fract(c.r);
   return vec4(_hsvToRgb(c), _c0.a);`,
      wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c.r = c.r + hue;
   return vec4<f32>(_hsvToRgb(c), _c0.a);`
    },
    {
      name: "colorama",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "amount",
          default: 5e-3
        }
      ],
      glsl: `   vec3 c = _rgbToHsv(_c0.rgb);
   c += vec3(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4(c, _c0.a);`,
      wgsl: `   var c = _rgbToHsv(_c0.rgb);
   c = c + vec3<f32>(amount);
   c = _hsvToRgb(c);
   c = fract(c);
   return vec4<f32>(c, _c0.a);`
    },
    {
      name: "prev",
      type: "src",
      inputs: [],
      glsl: "   return texture2D(prevBuffer, fract(_st));",
      wgsl: "   return textureSample(prevBuffer, texSampler, fract(_st));"
    },
    {
      name: "sum",
      type: "color",
      inputs: [
        {
          type: "vec4",
          name: "scale",
          default: 1
        }
      ],
      glsl: `   vec4 v = _c0 * s;
   return v.r + v.g + v.b + v.a;
   }
   float sum(vec2 _st, vec4 s) { // vec4 is not a typo, because argument type is not overloaded
   vec2 v = _st.xy * s.xy;
   return v.x + v.y;`,
      wgsl: `   let v = _c0 * scale;
   return vec4<f32>(v.r + v.g + v.b + v.a);`
    },
    {
      name: "r",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.r * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.r * scale + offset);"
    },
    {
      name: "g",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.g * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.g * scale + offset);"
    },
    {
      name: "b",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.b * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.b * scale + offset);"
    },
    {
      name: "a",
      type: "color",
      inputs: [
        {
          type: "float",
          name: "scale",
          default: 1
        },
        {
          type: "float",
          name: "offset",
          default: 0
        }
      ],
      glsl: "   return vec4(_c0.a * scale + offset);",
      wgsl: "   return vec4<f32>(_c0.a * scale + offset);"
    }
  ];
  class ut {
    constructor({
      defaultUniforms: e,
      defaultOutput: r,
      extendTransforms: n = [],
      changeListener: o = (() => {
      })
    } = {}) {
      this.defaultOutput = r, this.defaultUniforms = e, this.changeListener = o, this.extendTransforms = n, this.generators = {}, this.init();
    }
    init() {
      const e = lt();
      return this.wgslTransforms = {}, this.generators = Object.entries(this.generators).reduce((r, [n, o]) => (this.changeListener({ type: "remove", synth: this, method: n }), r), {}), this.sourceClass = ee, Array.isArray(this.extendTransforms) ? e.concat(this.extendTransforms) : typeof this.extendTransforms == "object" && this.extendTransforms.type && e.push(this.extendTransforms), e.map((r) => this.setFunction(r));
    }
    _addMethod(e, r) {
      const n = this;
      if (this.wgslTransforms[e] = r, r.type === "src") {
        const o = (...i) => new this.sourceClass({
          name: e,
          transform: r,
          userArgs: i,
          defaultOutput: this.defaultOutput,
          defaultUniforms: this.defaultUniforms,
          synth: n
        });
        return this.generators[e] = o, this.changeListener({ type: "add", synth: this, method: e }), o;
      } else
        this.sourceClass.prototype[e] = function(...o) {
          return this.transforms.push({ name: e, transform: r, userArgs: o, synth: n }), this;
        };
    }
    setFunction(e) {
      (e.wgsl || e.glsl) && this._addMethod(e.name, e);
    }
  }
  const ft = Xe();
  class ht {
    constructor({
      pb: e = null,
      width: r = 1280,
      height: n = 720,
      numSources: o = 4,
      numOutputs: i = 4,
      makeGlobal: h = !0,
      autoLoop: f = !0,
      detectAudio: v = !0,
      enableStreamCapture: m = !0,
      canvas: C,
      precision: _,
      extendTransforms: S = {}
      // add your own functions on init
    } = {}) {
      if (be.init(), this.pb = e, this.width = r, this.height = n, this.renderAll = !1, this.detectAudio = v, this._gpuReady = !1, this._gpuInitPromise = null, this._pendingRenders = [], this.adapter = null, this.device = null, this.gpuContext = null, this.gpuFormat = null, this._initCanvas(C), this.synth = {
        time: 0,
        bpm: 30,
        width: this.width,
        height: this.height,
        fps: void 0,
        stats: {
          fps: 0
        },
        speed: 1,
        mouse: ft,
        render: this._render.bind(this),
        setResolution: this.setResolution.bind(this),
        update: (R) => {
        },
        // user defined update function
        afterUpdate: (R) => {
        },
        // user defined function run after update
        hush: this.hush.bind(this),
        tick: this.tick.bind(this)
      }, h && (window.loadScript = this.loadScript), this.timeSinceLastUpdate = 0, this._time = 0, _ && ["lowp", "mediump", "highp"].includes(_.toLowerCase()))
        this.precision = _.toLowerCase();
      else {
        let R = (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
        this.precision = R ? "highp" : "mediump";
      }
      if (this.extendTransforms = S, this.saveFrame = !1, this.captureStream = null, this.generator = void 0, this._initOutputs(i), this._initSources(o), this._generateGlslTransforms(), this._initWebGPU().then((R) => {
        this.o.forEach((F) => F.setDevice(R, this.gpuContext, this.gpuFormat)), this.s.forEach((F) => F.setDevice(R)), this._flushPendingRenders();
      }).catch((R) => {
        console.error("[Hydra] WebGPU initialization failed:", R);
      }), ct(), this.synth.screencap = () => {
        this.saveFrame = !0;
      }, m)
        try {
          this.captureStream = this.canvas.captureStream(25), this.synth.vidRecorder = new Qe(this.captureStream);
        } catch (R) {
          console.warn(`[hydra-synth warning]
new MediaSource() is not currently supported on iOS.`), console.error(R);
        }
      v && this._initAudio(), f && Ue(this.tick.bind(this)).start(), this.sandbox = new et(this.synth, h, ["speed", "update", "afterUpdate", "bpm", "fps"]);
    }
    /**
     * Initialize WebGPU - called in background, doesn't block constructor
     */
    async _initWebGPU() {
      return this._gpuInitPromise ? this._gpuInitPromise : (this._gpuInitPromise = (async () => {
        if (!navigator.gpu)
          throw new Error("WebGPU not supported in this browser");
        if (console.log("[Hydra] Initializing WebGPU..."), this.adapter = await navigator.gpu.requestAdapter({
          powerPreference: "high-performance"
        }), !this.adapter)
          throw new Error("Failed to get WebGPU adapter");
        return this.device = await this.adapter.requestDevice(), this.gpuContext = this.canvas.getContext("webgpu"), this.gpuFormat = navigator.gpu.getPreferredCanvasFormat(), this.gpuContext.configure({
          device: this.device,
          format: this.gpuFormat,
          alphaMode: "premultiplied"
        }), this._gpuReady = !0, console.log("[Hydra] WebGPU initialized successfully"), console.log("[Hydra] Adapter:", this.adapter.info || "info not available"), this.device;
      })(), this._gpuInitPromise);
    }
    /**
     * Execute any pending renders that were queued before GPU was ready
     */
    _flushPendingRenders() {
      if (this._gpuReady)
        for (; this._pendingRenders.length > 0; ) {
          const e = this._pendingRenders.shift();
          try {
            e();
          } catch (r) {
            console.error("[Hydra] Error executing pending render:", r);
          }
        }
    }
    eval(e) {
      this.sandbox.eval(e);
    }
    getScreenImage(e) {
      this.imageCallback = e, this.saveFrame = !0;
    }
    hush() {
      if (!this._gpuReady) {
        this._pendingRenders.push(() => this.hush());
        return;
      }
      this.s.forEach((e) => {
        e.clear();
      }), this.o.forEach((e) => {
        this.synth.solid(0, 0, 0, 0).out(e);
      }), this.synth.render(this.o[0]), this.sandbox.set("update", (e) => {
      }), this.sandbox.set("afterUpdate", (e) => {
      });
    }
    loadScript(e = "") {
      return new Promise((n, o) => {
        var i = document.createElement("script");
        i.onload = function() {
          console.log(`loaded script ${e}`), n();
        }, i.onerror = (h) => {
          console.log(`error loading script ${e}`, "log-error"), n();
        }, i.src = e, document.head.appendChild(i);
      });
    }
    setResolution(e, r) {
      this.canvas.width = e, this.canvas.height = r, this.width = e, this.height = r, this.sandbox.set("width", e), this.sandbox.set("height", r), this._gpuReady && (this.gpuContext.configure({
        device: this.device,
        format: this.gpuFormat,
        alphaMode: "premultiplied"
      }), this.o.forEach((n) => {
        n.resize(e, r);
      }), this.s.forEach((n) => {
        n.resize(e, r);
      }));
    }
    canvasToImage(e) {
      const r = document.createElement("a");
      r.style.display = "none";
      let n = /* @__PURE__ */ new Date();
      r.download = `hydra-${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}-${n.getHours()}.${n.getMinutes()}.${n.getSeconds()}.png`, document.body.appendChild(r);
      var o = this;
      this.canvas.toBlob((i) => {
        o.imageCallback ? (o.imageCallback(i), delete o.imageCallback) : (r.href = URL.createObjectURL(i), console.log(r.href), r.click());
      }, "image/png"), setTimeout(() => {
        document.body.removeChild(r), window.URL.revokeObjectURL(r.href);
      }, 300);
    }
    _initAudio() {
      this.synth.a = new Ve({
        numBins: 4,
        parentEl: this.canvas.parentNode
      });
    }
    // create main output canvas and add to screen
    _initCanvas(e) {
      e ? (this.canvas = e, this.width = e.width, this.height = e.height) : (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.imageRendering = "pixelated", document.body.appendChild(this.canvas));
    }
    _initOutputs(e) {
      const r = this;
      this.o = Array(e).fill().map((n, o) => {
        var i = new Re({
          device: this.device,
          context: this.gpuContext,
          format: this.gpuFormat,
          width: this.width,
          height: this.height,
          label: `o${o}`
        });
        return i.id = o, r.synth["o" + o] = i, i;
      }), this.output = this.o[0];
    }
    _initSources(e) {
      this.s = [];
      for (var r = 0; r < e; r++)
        this.createSource(r);
    }
    createSource(e) {
      let r = new De({
        device: this.device,
        pb: this.pb,
        width: this.width,
        height: this.height,
        label: `s${e}`
      });
      return this.synth["s" + this.s.length] = r, this.s.push(r), r;
    }
    _generateGlslTransforms() {
      var e = this;
      this.generator = new ut({
        defaultOutput: this.o[0],
        defaultUniforms: this.o[0] ? this.o[0].uniforms : {},
        extendTransforms: this.extendTransforms,
        changeListener: ({ type: r, method: n, synth: o }) => {
          r === "add" && (e.synth[n] = o.generators[n], e.sandbox && e.sandbox.add(n));
        }
      }), this.synth.setFunction = this.generator.setFunction.bind(this.generator);
    }
    _render(e) {
      if (!this._gpuReady) {
        this._pendingRenders.push(() => this._render(e));
        return;
      }
      e ? (this.output = e, this.isRenderingAll = !1) : this.isRenderingAll = !0;
    }
    // dt in ms
    tick(e, r) {
      if (this._gpuReady)
        try {
          if (this.sandbox.tick(), this.detectAudio === !0 && this.synth.a.tick(), this.sandbox.set("time", this.synth.time += e * 1e-3 * this.synth.speed), this.timeSinceLastUpdate += e, !this.synth.fps || this.timeSinceLastUpdate >= 1e3 / this.synth.fps) {
            if (this.synth.stats.fps = Math.ceil(1e3 / this.timeSinceLastUpdate), this.synth.update)
              try {
                this.synth.update(this.timeSinceLastUpdate);
              } catch (o) {
                console.log(o);
              }
            for (let o = 0; o < this.s.length; o++)
              this.s[o].tick(this.synth.time);
            const n = this.synth.time;
            for (let o = 0; o < this.o.length; o++)
              this.o[o].tick({
                time: n,
                mouse: this.synth.mouse,
                bpm: this.synth.bpm,
                resolution: [this.canvas.width, this.canvas.height]
              });
            if (this.isRenderingAll ? this._renderAll() : this._renderOutput(), this.synth.afterUpdate)
              try {
                this.synth.afterUpdate(this.timeSinceLastUpdate);
              } catch (o) {
                console.log(o);
              }
            this.timeSinceLastUpdate = 0;
          }
          this.saveFrame === !0 && (this.canvasToImage(), this.saveFrame = !1);
        } catch (n) {
          console.warn("Error during tick():", n);
        }
    }
    /**
     * Render all outputs in a 2x2 grid
     */
    _renderAll() {
      this._renderOutput();
    }
    /**
     * Render single output to screen
     */
    _renderOutput() {
      this.output && this.output.renderToScreen({
        time: this.synth.time,
        resolution: [this.canvas.width, this.canvas.height]
      });
    }
    /**
     * Wait for WebGPU to be ready
     * @returns {Promise} Resolves when WebGPU is initialized
     */
    async ready() {
      return this._gpuInitPromise;
    }
  }
  Se.exports = ht;
});
export default pt();
