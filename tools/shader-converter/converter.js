
// Helper to perform robust GLSL -> WGSL replacements
function convertToWgsl(glslCode) {
    let wgsl = glslCode;

    // 1. Basic Type Replacement (Safe global replacements)
    // ----------------------------------------------------

    // const -> let
    // but handle 'const float x' -> 'let x' ??
    // WGSL: let x : f32 = ...
    // GLSL: const float x = ...
    // We'll replace 'const type' with 'let'.
    // float/int/etc -> var (assuming mutable by default in GLSL body)
    // NOTE: In GLSL 'float x = 1.0;' is mutable. In WGSL 'var x = 1.0;' matched.

    // 1b. Handle 'input.position' (Legacy Hydra/GLSLism)
    wgsl = wgsl.replace(/\binput\.position\.xy\b/g, '(_st * uniforms.resolution)');
    wgsl = wgsl.replace(/\binput\.position\.x\b/g, '(_st.x * uniforms.resolution.x)');
    wgsl = wgsl.replace(/\binput\.position\.y\b/g, '(_st.y * uniforms.resolution.y)');
    wgsl = wgsl.replace(/\bconst\s+(?:float|int|vec[234]|mat[234])\s+/g, 'let ');

    // Replace mutable type declarations: "float x =" -> "var x ="
    // We use a safe list of types.
    const types = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3', 'mat4'];
    types.forEach(type => {
        // "float x =" -> "var x ="
        // "vec3 v =" -> "var v ="
        const regexEq = new RegExp(`\\b${type}\\s+([a-zA-Z0-9_]+)\\s*=`, 'g');
        wgsl = wgsl.replace(regexEq, 'var $1 =');

        // "float x;" -> "var x = 0.0;" (Need initialization in WGSL)
        // This is tricky without knowing default values for every type.
        // We'll do basic ones.
        const regexDecl = new RegExp(`\\b${type}\\s+([a-zA-Z0-9_]+)\\s*;`, 'g');
        let defaultVal = '0.0'; // fallback
        if (type === 'int') defaultVal = '0';
        if (type === 'bool') defaultVal = 'false';
        if (type.startsWith('vec')) defaultVal = `${type}f(0.0)`; // vec3 -> vec3f(0.0) - incomplete constructor but safer? No, vec3f(0.0) works (splat)
        if (type === 'vec2') defaultVal = 'vec2f(0.0, 0.0)';
        if (type === 'vec3') defaultVal = 'vec3f(0.0, 0.0, 0.0)';
        if (type === 'vec4') defaultVal = 'vec4f(0.0, 0.0, 0.0, 0.0)';

        wgsl = wgsl.replace(regexDecl, `var $1 = ${defaultVal};`);
    });

    // 2. Constructors (vec2 -> vec2f)
    // -------------------------------
    // Safe to replace generically if followed by (
    wgsl = wgsl.replace(/\bvec2\s*\(/g, 'vec2f(');
    wgsl = wgsl.replace(/\bvec3\s*\(/g, 'vec3f(');
    wgsl = wgsl.replace(/\bvec4\s*\(/g, 'vec4f(');
    wgsl = wgsl.replace(/\bmat2\s*\(/g, 'mat2x2f(');
    wgsl = wgsl.replace(/\bmat3\s*\(/g, 'mat3x3f(');
    wgsl = wgsl.replace(/\bmat4\s*\(/g, 'mat4x4f(');

    // 3. Built-ins / Global Uniforms
    // ------------------------------
    wgsl = wgsl.replace(/\btime\b/g, 'uniforms.time');
    wgsl = wgsl.replace(/\bresolution\b/g, 'uniforms.resolution');
    // Using a more complex replacement for gl_FragCoord to ensure we don't break things like gl_FragCoord.xy
    // But since .xy is common, we handle it explicitly first.
    wgsl = wgsl.replace(/\bgl_FragCoord\.xy\b/g, '(_st * uniforms.resolution)');
    wgsl = wgsl.replace(/\bgl_FragCoord\.x\b/g, '(_st.x * uniforms.resolution.x)');
    wgsl = wgsl.replace(/\bgl_FragCoord\.y\b/g, '(_st.y * uniforms.resolution.y)');
    wgsl = wgsl.replace(/\bgl_FragCoord\b/g, 'vec4f(_st * uniforms.resolution, 0.0, 1.0)');

    // 4. Casting (int() -> i32(), float() -> f32())
    // ----------------------------------------------
    // Only safely replace when used as function call, not type decl usually handled above.
    // "int(" -> "i32("
    wgsl = wgsl.replace(/\bint\s*\(/g, 'i32(');
    wgsl = wgsl.replace(/\bfloat\s*\(/g, 'f32(');

    // 5. Advanced Parsing Replacements (Texture, If-statements)
    // ---------------------------------------------------------
    // We iterate through the string to safely handle parentheses and braces.

    wgsl = processAdvancedSyntax(wgsl);

    // 6. Preprocessor Defines
    // -----------------------
    // Inline #define constants
    const defineRegex = /^\s*#define\s+([a-zA-Z0-9_]+)\s+(.*)$/gm;
    let defineMatch;
    const defines = [];
    while ((defineMatch = defineRegex.exec(wgsl)) !== null) {
        defines.push({
            name: defineMatch[1],
            value: defineMatch[2].trim(),
            fullMatch: defineMatch[0]
        });
    }
    defines.forEach(def => {
        wgsl = wgsl.replace(def.fullMatch, '');
        const usageRegex = new RegExp(`\\b${def.name}\\b`, 'g');
        wgsl = wgsl.replace(usageRegex, `(${def.value})`);
    });

    // 7. Type Mismatches (Heuristic)
    // ------------------------------
    // max(vec, float) -> max(vec, vec(float))
    // We try to catch max/min calls using regex (imperfect but helpful).
    wgsl = wgsl.replace(/\bmax\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([0-9]+\.?[0-9]*)\s*\)/g, 'max($1, vec3f($2))'); // Assuming vec3 Context
    wgsl = wgsl.replace(/\bmin\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([0-9]+\.?[0-9]*)\s*\)/g, 'min($1, vec3f($2))');

    // clamp(vec, 0.0, 1.0) -> saturate(vec)
    wgsl = wgsl.replace(/clamp\s*\(\s*([^,]+)\s*,\s*0\.0\s*,\s*1\.0\s*\)/g, 'saturate($1)');

    return wgsl;
}

// Robust processor for function calls and control flow
function processAdvancedSyntax(code) {
    // We walk the code to find:
    // - texture(...) calls
    // - if (...) stmt; structures

    let result = '';
    let i = 0;

    while (i < code.length) {
        // Check for 'texture('
        if (code.substr(i).startsWith('texture')) {
            const match2D = code.substr(i).match(/^texture2D\s*\(/);
            const matchStd = code.substr(i).match(/^texture\s*\(/);

            if (match2D || matchStd) {
                const match = match2D || matchStd;
                const startArgs = i + match[0].length;
                const args = parseArguments(code, startArgs);

                if (args.endIndex !== -1) {
                    // Reconstruct call
                    // texture(tex, uv) -> textureSample(tex, tex_sampler, uv)
                    // texture(texNM, uv) -> textureSample(texNM, texSampler, uv)

                    if (args.list.length >= 2) {
                        const texName = args.list[0].trim();
                        const uvCoord = args.list[1].trim();

                        let samplerName = 'texSampler'; // Default for generic texture()
                        if (match2D) {
                            // texture2D(tex0, ...) -> tex0_sampler
                            samplerName = `${texName}_sampler`;
                        }

                        // Check if it's one of Hydra's standard textures
                        if (/^tex[0-9]+$/.test(texName)) {
                            // in Hydra wgsl, we usually use 'texSampler' for all? 
                            // Or 'tex0_sampler'?
                            // Looking at existing hydra-synth-wgsl, it uses `texSampler` for `texture(texN, ...)`.
                            samplerName = 'texSampler';
                        }

                        result += `textureSample(${texName}, ${samplerName}, ${uvCoord})`;
                        i = args.endIndex + 1; // Skip past closing ')'
                        continue;
                    }
                }
            }
        }

        // Check for 'mod(' -> '%'
        // We'll trust regex for mod for now, or implement parsed replacement if needed.
        // Let's stick to regex for mod in main function (it's simpler).

        // Check for 'if (' without brace
        // match: if ( ... ) ... ;
        // We need to lookahead.
        if (code.substr(i).match(/^if\s*\(/)) {
            // Find end of condition
            const parenStart = code.indexOf('(', i);
            const parenEnd = findMatchingParen(code, parenStart);

            if (parenEnd !== -1) {
                // Check what follows
                let j = parenEnd + 1;
                while (j < code.length && /\s/.test(code[j])) j++; // skip whitespace

                if (code[j] !== '{') {
                    // Single statement detected!
                    // Find end of statement (semicolon)
                    const semi = code.indexOf(';', j);
                    if (semi !== -1) {
                        // Verify no brace in between?
                        const braceCheck = code.substring(j, semi);
                        if (!braceCheck.includes('{')) {
                            const condition = code.substring(i, parenEnd + 1); // "if (...)"
                            const statement = code.substring(j, semi + 1); // "stmt;"

                            result += `${condition} { ${statement} }`;
                            i = semi + 1;
                            continue;
                        }
                    }
                }
            }
        }

        // Just copy character
        result += code[i];
        i++;
    }

    return result;
}

// Helper: Scan balanced arguments
function parseArguments(code, startIndex) {
    let depth = 0;
    let currentArg = '';
    const list = [];
    let i = startIndex;

    for (; i < code.length; i++) {
        const char = code[i];

        if (char === '(') {
            depth++;
            currentArg += char;
        } else if (char === ')') {
            if (depth === 0) {
                // End of arguments
                if (currentArg.trim()) list.push(currentArg);
                return { list, endIndex: i };
            }
            depth--;
            currentArg += char;
        } else if (char === ',' && depth === 0) {
            list.push(currentArg);
            currentArg = '';
        } else {
            currentArg += char;
        }
    }
    return { list: [], endIndex: -1 }; // Error or unclosed
}

// Helper: Find matching closing parenthesis
function findMatchingParen(code, startIndex) {
    let depth = 1;
    for (let i = startIndex + 1; i < code.length; i++) {
        if (code[i] === '(') depth++;
        if (code[i] === ')') depth--;
        if (depth === 0) return i;
    }
    return -1;
}

function processFile(content, overwrite) {
    const setFuncRegex = /setFunction\s*\(\s*(\{[\s\S]*?\})\s*\)/g;
    let match;
    let output = content;
    let replacements = [];

    while ((match = setFuncRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const body = match[1];

        // Parse properties
        const glslMatch = body.match(/glsl\s*:\s*`([\s\S]*?)`/);
        const glsl3Match = body.match(/glsl3\s*:\s*`([\s\S]*?)`/);
        const wgslMatch = body.match(/wgsl\s*:\s*`([\s\S]*?)`/);

        if (wgslMatch && !overwrite) {
            continue;
        }

        const sourceCode = glsl3Match ? glsl3Match[1] : (glslMatch ? glslMatch[1] : null);

        if (sourceCode) {
            // Apply conversion
            const converted = convertToWgsl(sourceCode);

            // Reconstruct body
            let newBody = body;
            if (wgslMatch) {
                newBody = newBody.replace(/wgsl\s*:\s*`[\s\S]*?`/, `wgsl: \`\n${converted}\``);
            } else {
                if (glslMatch) {
                    const insertPos = glslMatch.index + glslMatch[0].length;
                    newBody = newBody.slice(0, insertPos) + `,\n  wgsl: \`\n${converted}\`` + newBody.slice(insertPos);
                } else if (glsl3Match) {
                    const insertPos = glsl3Match.index + glsl3Match[0].length;
                    newBody = newBody.slice(0, insertPos) + `,\n  wgsl: \`\n${converted}\`` + newBody.slice(insertPos);
                }
            }

            replacements.push({
                start: match.index,
                end: match.index + fullMatch.length,
                text: `setFunction(${newBody})`
            });
        }
    }

    replacements.reverse().forEach(rep => {
        output = output.substring(0, rep.start) + rep.text + output.substring(rep.end);
    });

    return output;
}

// UI Handling - Browser environment check
if (typeof document !== 'undefined') {
    const inputEl = document.getElementById('input-code');
    const outputEl = document.getElementById('output-code');
    const btnConvert = document.getElementById('btn-convert');
    const chkOverwrite = document.getElementById('chk-overwrite');
    const statusEl = document.getElementById('status');

    if (btnConvert) {
        btnConvert.addEventListener('click', () => {
            try {
                statusEl.innerText = 'Converting...';
                statusEl.className = 'status';

                const content = inputEl.value;
                if (!content.trim()) {
                    statusEl.innerText = 'Input is empty';
                    statusEl.className = 'status error';
                    return;
                }

                const overwrite = chkOverwrite.checked;
                const result = processFile(content, overwrite);

                outputEl.value = result;
                statusEl.innerText = 'Conversion Complete';
                statusEl.className = 'status success';
            } catch (e) {
                console.error(e);
                statusEl.innerText = 'Error: ' + e.message;
                statusEl.className = 'status error';
            }
        });
    }
} else {
    // Node.js export for testing
    module.exports = { processFile, convertToWgsl };
}
