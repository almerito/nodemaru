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
  "glsl": "return vec4(result, 1.0);"
}
```

Input types: `float`, `vec2`, `vec3`, `vec4`, `sampler2D`

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
- [ ] No undefined functions (inline helpers if needed)
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
