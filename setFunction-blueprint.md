# Hydra setFunction Blueprint

Complete guide for creating custom functions with `setFunction()`.

---

## Basic Structure

```javascript
setFunction({
  name: 'myFunction',      // Function name (used in Hydra code)
  type: 'src',             // Transform type (see below)
  inputs: [                // Additional parameters
    { name: 'param1', type: 'float', default: 1.0 },
    { name: 'param2', type: 'float', default: 0.5 }
  ],
  glsl: `...`,             // GLSL1 code (required)
  glsl3: `...`             // GLSL3 code (optional, for WebGL2)
})
```

---

## Available Types

### 1. `src` - Source

**Generates a color from coordinates.**

| Property | Value |
|----------|-------|
| **Return Type** | `vec4` (RGBA color) |
| **Base Argument** | `vec2 _st` (coordinates 0.0-1.0) |
| **Usage** | Chain start or with texture input |

```javascript
// Example: Pattern generator
setFunction({
  name: 'myPattern',
  type: 'src',
  inputs: [
    { name: 'freq', type: 'float', default: 10.0 }
  ],
  glsl: `
    float v = sin(_st.x * freq + time);
    return vec4(v, v, v, 1.0);
  `
})
// Usage: myPattern(10).out(o0)
```

```javascript
// Example: With texture input
setFunction({
  name: 'myEffect',
  type: 'src',
  inputs: [
    { name: 'tex', type: 'sampler2D' },
    { name: 'amount', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec4 col = texture2D(tex, _st);
    return col * amount;
  `
})
// Usage: myEffect(o1, 0.8).out(o0)
```

**Connections:**
- ✅ `.out(o0)` - Direct output
- ✅ `.color(...)` - Color modification
- ✅ `.coord(...)` - Coordinate modification (internal pre-sampling)
- ✅ `.blend(...)`, `.add(...)`, `.mult(...)` - Combination
- ✅ `.modulate(...)` - Coordinate modulation

---

### 2. `color` - Color

**Modifies an existing color.**

| Property | Value |
|----------|-------|
| **Return Type** | `vec4` (modified color) |
| **Base Argument** | `vec4 _c0` (previous color) |
| **Usage** | Color post-processing |

```javascript
setFunction({
  name: 'posterize',
  type: 'color',
  inputs: [
    { name: 'levels', type: 'float', default: 4.0 }
  ],
  glsl: `
    vec3 c = floor(_c0.rgb * levels) / levels;
    return vec4(c, _c0.a);
  `
})
// Usage: osc().posterize(8).out(o0)
```

**Connections:**
- ✅ After any source: `osc().myColor()`
- ✅ Multiple chain: `osc().color1().color2()`
- ❌ CANNOT modify sampling coordinates
- ❌ CANNOT access original texture

---

### 3. `coord` - Coordinates

**Modifies UV coordinates.**

| Property | Value |
|----------|-------|
| **Return Type** | `vec2` (new coordinates) |
| **Base Argument** | `vec2 _st` (current coordinates) |
| **Usage** | Geometric distortion |

```javascript
setFunction({
  name: 'wobble',
  type: 'coord',
  inputs: [
    { name: 'amount', type: 'float', default: 0.1 }
  ],
  glsl: `
    vec2 st = _st;
    st.x += sin(st.y * 10.0 + time) * amount;
    return st;
  `
})
// Usage: osc().wobble(0.2).out(o0)
```

**Connections:**
- ✅ After sources: `osc().wobble()`
- ✅ Before color: `osc().wobble().color()`
- ✅ Multiple chain: `osc().wobble1().wobble2()`

---

### 4. `combine` - Combination

**Combines two color sources.**

| Property | Value |
|----------|-------|
| **Return Type** | `vec4` (combined color) |
| **Base Arguments** | `vec4 _c0` (first color), `vec4 _c1` (second color) |
| **Usage** | Blending, overlay, multi-layer effects |

```javascript
setFunction({
  name: 'overlay',
  type: 'combine',
  inputs: [
    { name: 'tex', type: 'sampler2D' },
    { name: 'amount', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec4 c1 = texture2D(tex, _st);
    return mix(_c0, c1, amount);
  `
})
// Usage: osc().overlay(o1, 0.5).out(o0)
```

**Note:** `_c1` is automatically populated if you pass a GlslSource as first argument:
```javascript
// Simple definition
setFunction({
  name: 'myBlend',
  type: 'combine',
  inputs: [
    { name: 'amount', type: 'float', default: 0.5 }
  ],
  glsl: `return mix(_c0, _c1, amount);`
})
// Usage: osc().myBlend(noise(), 0.5).out(o0)
```

**Connections:**
- ✅ `source1.myBlend(source2, params)`
- ✅ Chain: `osc().blend1(noise()).blend2(shape())`

---

### 5. `combineCoord` - Modulation

**Uses a color to modulate coordinates.**

| Property | Value |
|----------|-------|
| **Return Type** | `vec2` (new coordinates) |
| **Base Arguments** | `vec2 _st` (coordinates), `vec4 _c0` (modulating color) |
| **Usage** | Displacement, feedback loop |

```javascript
setFunction({
  name: 'displace',
  type: 'combineCoord',
  inputs: [
    { name: 'tex', type: 'sampler2D' },
    { name: 'amount', type: 'float', default: 0.1 }
  ],
  glsl: `
    vec4 c = texture2D(tex, _st);
    return _st + (c.rg - 0.5) * amount;
  `
})
// Usage: osc().displace(noise(), 0.2).out(o0)
```

**Connections:**
- ✅ `source.modulate(modulatorSource, amount)`
- ✅ Chain: `osc().modulate1(noise()).modulate2(shape())`

---

## Input Types

| Type | GLSL | Example |
|------|------|---------|
| `float` | `float` | `{ name: 'amount', type: 'float', default: 1.0 }` |
| `sampler2D` | `sampler2D` | `{ name: 'tex', type: 'sampler2D' }` |
| `vec2` | `vec2` | `{ name: 'offset', type: 'vec2', default: [0,0] }` |
| `vec3` | `vec3` | `{ name: 'color', type: 'vec3', default: [1,0,0] }` |
| `vec4` | `vec4` | `{ name: 'tint', type: 'vec4', default: [1,1,1,1] }` |

---

## Available Global Variables

| Variable | Type | Description |
|----------|------|-------------|
| `time` | `float` | Time in seconds |
| `resolution` | `vec2` | Canvas dimensions (px) |
| `prevBuffer` | `sampler2D` | Previous frame (feedback) |

---

## GLSL3 Features (WebGL2)

If using `engine: 'glsl3'`, you can use this property. However, it is **no longer recommended** to duplicate logic if `glsl` and `glsl3` are identical (except for `texture2D` vs `texture`). The system now automatically converts `glsl` code to `glsl3` compatible code at runtime.

Use `glsl3` ONLY if you need specific WebGL2 features like `bitwise operators`, `loops with non-constant limits`, or `integer types`.

```javascript
setFunction({
  name: 'bitEffect',
  type: 'src',
  inputs: [...],
  glsl3: `
    // Integer types
    ivec2 p = ivec2(_st * 100.0);
    int t = int(time);
    
    // Bitwise operators (GLSL3 only)
    int noise = p.x ^ p.y ^ t;
    
    vec4 col = texture(tex, _st);
    return col;
  `,
  glsl: `return texture2D(tex, _st);` // Fallback required for WebGL1
})
```

---

## Helper Functions

You can define reusable helper functions using the `helpers` property. These functions are injected into the shader scope and deduplicated automatically. This avoids the need to inline complex logic inside the main `glsl` body.

```javascript
setFunction({
  name: 'myFractal',
  type: 'src',
  inputs: [...],
  helpers: `
    // Define reusable helper functions here
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  glsl: `
    // Use helpers directly
    vec2 uv = rot2d(time) * _st;
    float n = hash(uv);
    return vec4(n);
  `
})
```
 **Benefits:**
 - Clean, readable `glsl` code.
 - Reusability across multiple shaders (Deduplication handles identical helpers).
 - No need to wrap in `glsl3` block separately (helpers work for both).


---

## Quick Connection Schema

```
┌─────────────┐
│    src      │──────┬──────────────────────────────────────────┐
│ (generates) │      │                                          │
└─────────────┘      ▼                                          ▼
              ┌─────────────┐                            ┌─────────────┐
              │   coord     │                            │   color     │
              │ (distorts)  │                            │ (colors)    │
              └──────┬──────┘                            └──────┬──────┘
                     │                                          │
                     ▼                                          ▼
              ┌─────────────┐                            ┌─────────────┐
              │  combine    │◄───────────────────────────│   combine   │
              │ (blending)  │                            │ (blending)  │
              └──────┬──────┘                            └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │combineCoord │
              │ (modulate)  │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   .out()    │
              └─────────────┘
```

---

## Complete Examples

### Procedural Pattern (src)
```javascript
setFunction({
  name: 'plasma',
  type: 'src',
  inputs: [
    { name: 'scale', type: 'float', default: 5.0 },
    { name: 'speed', type: 'float', default: 1.0 }
  ],
  glsl: `
    float t = time * speed;
    float v = sin(_st.x * scale + t);
    v += sin(_st.y * scale + t);
    v += sin((_st.x + _st.y) * scale + t);
    v = v / 3.0 * 0.5 + 0.5;
    return vec4(v, v * 0.5, 1.0 - v, 1.0);
  `
})
```

### Post-Effect (color)
```javascript
setFunction({
  name: 'vignette',
  type: 'color',
  inputs: [
    { name: 'radius', type: 'float', default: 0.5 },
    { name: 'softness', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec2 uv = _st - 0.5;
    float dist = length(uv);
    float vig = smoothstep(radius, radius - softness, dist);
    return vec4(_c0.rgb * vig, _c0.a);
  `
})
// Note: _st is not available by default in color, use uniform or calculation
```

### Distortion (coord)
```javascript
setFunction({
  name: 'fisheye',
  type: 'coord',
  inputs: [
    { name: 'power', type: 'float', default: 2.0 }
  ],
  glsl: `
    vec2 uv = _st - 0.5;
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    r = pow(r, power);
    return vec2(r * cos(theta), r * sin(theta)) + 0.5;
  `
})
```
