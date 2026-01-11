---
description: Debug and create shaders in the database
---

# Shader Debug & Creation Workflow

This workflow allows quick debugging of existing shaders and generation of new shader definitions for the `shaders` database table.

## Database Schema Reference

The `shaders` table has the following relevant JSON fields:
- **`params`**: Parameter definitions for the shader UI
- **`options`**: Additional options (classname, preview, etc.)
- **`set_function`**: The `setFunction` definition for Hydra registration

---

## 1. DEBUG EXISTING SHADER

When the user provides a shader name (e.g., "sepia"), execute:

### Step 1: Fetch shader from database
```bash
php artisan tinker --execute="echo json_encode(App\Models\Shader::where('name', 'SHADER_NAME')->first()->toArray(), JSON_PRETTY_PRINT);"
```

### Step 2: Validate the fetched data

Check the following:

#### A. `set_function` validation
- Must be a valid JSON object with keys: `name`, `type`, `inputs`, `glsl`
- `type` must be one of: `src`, `color`, `coord`, `combine`, `combineCoord`
- `inputs` must be an array of input definitions
- `glsl` must be valid GLSL3 code (no syntax errors, proper semicolons, balanced braces)

Common GLSL errors:
- Missing semicolons
- Undeclared variables
- Incorrect texture sampling (use `texture()` not `texture2D()`)
- Missing return statement
- Type mismatches (vec3 vs vec4)

#### B. `params` validation
- Must be a valid JSON object where keys are parameter names
- Each parameter should have: `type`, `default`
- Optional: `min`, `max`, `values` (for select), `hint`, `order`
- Types: `float`, `int`, `select`, `checkbox`, `textarea`, `multiple`, `range`

#### C. `options` validation
- Optional field, can be null or empty object
- May contain: `classname`, `preview`, `nodeColor`

### Step 3: Report issues to user
List all validation errors found.

---

## 2. CREATE NEW SHADER

When user provides shader code (GLSL) and requirements:

### Step 1: Determine shader type
- `src` = Source shader (generates image from nothing, takes no texture input)
- `color` = Color modifier (modifies RGB/A, takes `_c0` as input color)
- `coord` = Coordinate modifier (modifies UV, returns vec2)
- `combine` = Blends two textures (takes `_c0` and `_c1`)
- `combineCoord` = Modulates coordinates with texture

### Step 2: Generate `set_function` JSON

Template:
```json
{
  "name": "shaderName",
  "type": "color",
  "inputs": [
    { "name": "amount", "type": "float", "default": 1.0 }
  ],
  "glsl": "return vec4(result, 1.0);",
  "helpers": ["helperFunctionName"]
}
```

Input types: `float`, `vec2`, `vec3`, `vec4`, `sampler2D`, `float[]` (for arrays like audio bands)

### Step 2b: Using the `helpers` Parameter

**IMPORTANT**: GLSL does NOT support nested function definitions! If your shader needs helper functions (e.g., `hsv2rgb`, custom line drawing), you MUST use the `helpers` parameter.

The `helpers` field is a **single string** containing all helper GLSL functions that Hydra will inject into the shader code at compile time.

#### helpers Field Structure (in set_function)
```json
{
  "name": "myShader",
  "type": "src",
  "inputs": [...],
  "glsl": "vec3 col = hsv2rgb_custom(vec3(time, 1.0, 1.0));\\nfloat l = drawLine(uv, p0, p1, 0.02);\\nreturn vec4(col * l, 1.0);",
  "helpers": "vec3 hsv2rgb_custom(vec3 c) {\\n    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);\\n    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\\n    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\\n}\\n\\nfloat drawLine(vec2 p, vec2 a, vec2 b, float w) {\\n    vec2 d = b - a;\\n    float t = clamp(dot(p-a, d) / dot(d, d), 0.0, 1.0);\\n    return 1.0 - smoothstep(0.0, w, length(p - a - d*t));\\n}"
}
```

**Key points:**
- `helpers` is a **string**, not an array
- Put ALL helper functions in one string, separated by `\\n\\n`
- Functions defined in `helpers` are injected BEFORE the main shader function
- Use unique function names to avoid conflicts with built-ins

#### Built-in Helpers (already available)
These functions are already provided by Hydra and can be used directly without adding to helpers:
- `_hsvToRgb(vec3 hsv)` - HSV to RGB conversion
- `_rgbToHsv(vec3 rgb)` - RGB to HSV conversion  
- `_luminance(vec3 rgb)` - Calculate luminance
- `_noise(vec3 v)` - Simplex 3D noise

**DO NOT** define functions inside the `glsl` code block - this will cause syntax errors!

### Step 3: Generate `params` JSON

Template:
```json
{
  "amount": {
    "type": "multiple",
    "default": 1.0,
    "min": 0,
    "max": 2,
    "hint": "Effect intensity",
    "order": 0,
    "items": [
      { "item": "constant", "default": 1.0, "min": 0, "max": 2 }
    ]
  }
}
```

For simple params (non-animatable):
```json
{
  "amount": {
    "type": "float",
    "default": 1.0,
    "min": 0,
    "max": 2,
    "hint": "Effect intensity"
  }
}
```

### Step 4: Generate `options` JSON (if needed)

```json
{
  "classname": "MyCustomNode",
  "preview": "{node}().out(o1)",
  "nodeColor": "#ff5722"
}
```

### Step 5: Output complete SQL or JSON

Provide:
1. `set_function` (JSON, escaped for SQL)
2. `params` (JSON)
3. `options` (JSON)

---

## 3. COMMON ISSUES CHECKLIST

### GLSL Compilation Errors
- [ ] All variables declared before use
- [ ] Correct GLSL3 syntax (no `varying`, use `in`/`out`)
- [ ] Proper function return types
- [ ] **NO nested functions** - use `helpers` field for custom functions
- [ ] Use built-in helpers when available (`_hsvToRgb`, `_noise`, etc.)
- [ ] `_st` (UV), `_c0` (input color), `time` (animation) available

### JSON Format Errors
- [ ] Valid JSON syntax (quotes, commas, braces)
- [ ] No trailing commas
- [ ] Escaped special characters in GLSL strings

### Type Mismatches
- [ ] `src` shaders return `vec4`
- [ ] `color` shaders return `vec4`
- [ ] `coord` shaders return `vec2`
- [ ] Input types match usage in GLSL

---

## 4. QUICK REFERENCE

### Hydra Built-in Variables
- `_st` - UV coordinates (vec2)
- `_c0` - Input texture color (vec4)
- `_tex0` - Input texture sampler
- `_tex1` - Second input texture (for combine)
- `time` - Animation time (float)
- `resolution` - Canvas resolution (vec2)

### setFunction Type Mapping
| Type | Input | Output | Use Case |
|------|-------|--------|----------|
| `src` | none | vec4 | Pattern generators |
| `color` | vec4 | vec4 | Color effects |
| `coord` | vec2 | vec2 | Distortions |
| `combine` | 2x vec4 | vec4 | Blending |
| `combineCoord` | vec4 + vec2 | vec2 | Modulation |
