setFunction({
  name: 'transparency',
  type: 'color',
  inputs: [
    { name: 'r', type: 'float', default: 0.0 },
    { name: 'g', type: 'float', default: 1.0 },
    { name: 'b', type: 'float', default: 0.0 },
    { name: 'tol', type: 'float', default: 0.1 },
    { name: 'soft', type: 'float', default: 0.1 }
  ],
  glsl: `
    vec3 target = vec3(r, g, b);
    float d = distance(_c0.rgb, target);
    
    // Calcolo alpha: se d < tol diventa trasparente.
    // Usiamo 'soft' per gestire la sfumatura.
    float alpha = smoothstep(tol, tol + max(soft, 0.0001), d);
    
    // Manteniamo il colore originale modificando solo l'alpha
    return vec4(_c0.rgb, _c0.a * alpha);
  `
})

setFunction({
  name: 'position',
  type: 'coord',
  inputs: [
    { name: 'positionX', type: 'float', default: 0.5 }, // 0.5 is horizontal center
    { name: 'positionY', type: 'float', default: 0.5 }  // 0.5 is vertical center
  ],
  glsl: `
    // _st rappresenta la coordinata del pixel corrente (0.0 -> 1.0)
    // La logica è: coord_campionata = _st + centro_texture - posizione_desiderata
    return _st + vec2(0.5) - vec2(positionX, positionY);
  `
})

setFunction({
  name: 'maskInv',
  type: 'combine',
  inputs: [
  ],
  glsl: `
    // 1. Calcoliamo la luminosità (luma) della texture di maschera (_c1)
    // Usiamo i coefficienti standard per la percezione umana
    float luma = dot(_c1.rgb, vec3(0.299, 0.587, 0.114));

    // 2. Invertiamo il valore:
    // Se è Bianco (1.0) -> Diventa 0.0 (Trasparente/Nero)
    // Se è Nero (0.0) -> Diventa 1.0 (Visibile)
    float inv = 1.0 - luma;

    // 3. Moltiplichiamo il colore originale (_c0) per la maschera invertita
    // Questo applica l'alpha/oscuramento
    return _c0 * inv;
  `
})

setFunction({
  name: 'shapeOutline',
  type: 'src',
  inputs: [
    { name: 'sides', type: 'float', default: 3.0 },
    { name: 'radius', type: 'float', default: 0.3 },
    { name: 'width', type: 'float', default: 0.02 },
    { name: 'smoothing', type: 'float', default: 0.01 }
  ],
  glsl: `
    // Stessa logica di shape nativo
    vec2 st = _st * 2.0 - 1.0;
    float a = atan(st.x, st.y) + 3.1416;
    float r = (2.0 * 3.1416) / sides;
    float d = cos(floor(0.5 + a / r) * r - a) * length(st);
    
    // Outer shape (filled)
    float outer = 1.0 - smoothstep(radius, radius + smoothing + 0.0000001, d);
    // Inner shape (hole)
    float inner = 1.0 - smoothstep(radius - width, radius - width + smoothing + 0.0000001, d);
    // Outline = outer - inner
    float outline = outer - inner;
    
    // Return like shape does: color in RGB, alpha=1
    return vec4(vec3(outline), 1.0);
  `
});

setFunction({
  name: 'geodist',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'intensity', type: 'float', default: 1.0 },
    { name: 'scale', type: 'float', default: 4.0 }
  ],
  glsl: `
    // Convert _st to centered UV
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    float a = atan(uv.y, uv.x);
    vec2 p = cos(a + t) * vec2(cos(0.5 * t), sin(0.3 * t));
    vec2 q = cos(t) * vec2(cos(t), sin(t));
    
    float d1 = length(uv - p);
    float d2 = length(uv);
    
    vec2 uv2 = 2.0 * cos(log(length(uv) + 0.001) * 0.25 - 0.5 * t + log(vec2(d1, d2) / (d1 + d2 + 0.001)));
    
    vec2 fpos = fract(scale * uv2) - 0.5;
    float d = max(abs(fpos.x), abs(fpos.y));
    float k = 5.0 / resolution.y;
    float s = smoothstep(-k, k, 0.25 - d);
    
    vec3 col = vec3(s, 0.5 * s, 0.1 - 0.1 * s) * intensity;
    
    // Replace 1/cosh(x) with 2/(exp(x) + exp(-x))
    float x = -2.5 * (length(uv - p) + length(uv));
    float sech = 2.0 / (exp(x) + exp(-x));
    col += sech * vec3(1.0, 0.5, 0.1) * intensity;
    
    float c = cos(10.0 * length(uv2) + 4.0 * t);
    col += (0.5 + 0.5 * c) * vec3(0.5, 1.0, 1.0) * 
           exp(-9.0 * abs(cos(9.0 * a + t) * uv.x + 
                          sin(9.0 * a + t) * uv.y + 
                          0.1 * c)) * intensity;
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'fractal3d',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.0 },
    { name: 'detail', type: 'float', default: 3.0 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0) * zoom;
    float t = time * speed * 0.2;
    
    // Rotate UV
    float angle = t;
    float c = cos(angle);
    float s = sin(angle);
    uv = mat2(c, -s, s, c) * uv;
    
    // Fractal iterations
    vec3 col = vec3(0.0);
    float dist = 1000.0;
    int iterations = int(clamp(detail, 1.0, 20.0));
    
    for (int i = 0; i < 20; i++) {
      if (i >= iterations) break;
      
      // Fold and scale
      uv = abs(uv);
      uv = uv - 0.5;
      uv = uv * 1.5;
      
      // Add rotation per iteration
      float fi = float(i);
      float a = t * 0.5 + fi * 0.3;
      float co = cos(a);
      float si = sin(a);
      uv = mat2(co, -si, si, co) * uv;
      
      // Calculate distance
      float d = length(uv);
      dist = min(dist, d);
    }
    
    // Colorize based on distance
    float brightness = 1.0 / (dist * 2.0 + 0.5);
    col = vec3(brightness, brightness * 0.8, brightness * 0.5);
    col = pow(col, vec3(0.8)) * 1.2;
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'tunnel3d',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'scale', type: 'float', default: 2.0 },
    { name: 'depth', type: 'float', default: 3.0 }
  ],
  glsl: `
    vec2 uv = _st * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    
    float t = time * speed;
    
    // Tunnel effect - polar coordinates
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    // Prevent division by zero
    radius = max(radius, 0.01);
    
    // Create tunnel depth
    float tunnelZ = depth / radius + t * 5.0;
    float tunnelX = angle / 3.14159 * scale;
    
    // Create pattern with multiple layers
    vec2 tunnelUV = vec2(tunnelX, tunnelZ);
    
    // Noise-like pattern using sine waves
    float pattern = 0.0;
    pattern += sin(tunnelUV.x * 8.0 + tunnelUV.y * 2.0) * 0.5;
    pattern += sin(tunnelUV.x * 4.0 - tunnelUV.y * 3.0 + t) * 0.3;
    pattern += sin(tunnelUV.y * 6.0 + sin(tunnelUV.x * 2.0)) * 0.2;
    
    // Add depth shading
    float shade = 1.0 / (radius * 3.0 + 0.5);
    
    // Color based on pattern and depth
    vec3 col = vec3(0.0);
    col.r = (0.5 + 0.5 * sin(pattern + t)) * shade;
    col.g = (0.5 + 0.5 * sin(pattern + t + 2.0)) * shade * 0.8;
    col.b = (0.5 + 0.5 * sin(pattern + t + 4.0)) * shade * 0.6;
    
    // Add vignette
    col *= 1.0 - radius * 0.3;
    
    // Add some grain
    float grain = fract(sin(dot(uv + t, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
    col += grain;
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'fractalPyramid',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.0 },
    { name: 'colorMix', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed * 0.2;
    
    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -50.0 * zoom);
    
    // Rotate camera around origin
    float ca = cos(t);
    float sa = sin(t);
    ro.xz = mat2(ca, sa, -sa, ca) * ro.xz;
    
    // Camera vectors
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf, vec3(0.0, 1.0, 0.0)));
    vec3 cu = normalize(cross(cf, cs));
    
    // Ray direction
    vec3 uuv = ro + cf * 3.0 + uv.x * cs + uv.y * cu;
    vec3 rd = normalize(uuv - ro);
    
    // Raymarching
    float marchT = 0.0;
    vec3 col = vec3(0.0);
    float d = 1.0;
    
    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * marchT;
      
      // Inline map function - folding space
      vec3 mp = p;
      for (int j = 0; j < 8; j++) {
        float ft = t;
        // Rotate XZ
        float c1 = cos(ft);
        float s1 = sin(ft);
        mp.xz = mat2(c1, s1, -s1, c1) * mp.xz;
        // Rotate XY
        float c2 = cos(ft * 1.89);
        float s2 = sin(ft * 1.89);
        mp.xy = mat2(c2, s2, -s2, c2) * mp.xy;
        // Fold
        mp.xz = abs(mp.xz);
        mp.xz -= 0.5;
      }
      d = dot(sign(mp), mp) / 5.0 * 0.5;
      
      if (d < 0.02) break;
      if (d > 100.0) break;
      
      // Palette: mix cyan to magenta based on distance
      float palD = length(p) * 0.1;
      vec3 palCol = mix(vec3(0.2, 0.7, 0.9), vec3(1.0, 0.0, 1.0), palD * colorMix);
      col += palCol / (400.0 * d);
      
      marchT += d;
    }
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'triwave1',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'depth', type: 'float', default: 1.0 },
    { name: 'brightness', type: 'float', default: 1.0 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Simple triangle-like wave pattern
    vec2 p = uv * depth;
    p.x += sin(p.y * 6.0 + t) * 0.3;
    p.y += cos(p.x * 6.0 + t) * 0.3;
    
    float wave = abs(fract(p.x + p.y) - 0.5) * 2.0;
    float pattern = sin(wave * 10.0 + t) * 0.5 + 0.5;
    
    pattern *= brightness;
    
    return vec4(vec3(pattern), 1.0);
  `
});

setFunction({
  name: 'triwave2',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'depth', type: 'float', default: 1.0 },
    { name: 'intensity', type: 'float', default: 1.0 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    vec2 p = uv * depth;
    p.x += sin(p.y * 8.0 + t) * 0.4 + cos(t * 0.2 + p.y) * 0.2;
    p.y += cos(p.x * 8.0 - t) * 0.4 + sin(t * 0.2 + p.x) * 0.2;
    
    float wave = fract(p.x + p.y + sin(t) * 0.5);
    wave = abs(wave * 2.0 - 1.0);
    float pattern = pow(wave, 3.0);
    
    pattern *= intensity;
    
    return vec4(vec3(pattern), 1.0);
  `
});

setFunction({
  name: 'triwave3',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'depth', type: 'float', default: 1.0 },
    { name: 'contrast', type: 'float', default: 1.0 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    vec2 p = uv * depth;
    
    // Wavy distortion
    p += vec2(sin(p.y * 5.0 + t), cos(p.x * 5.0 + t)) * 0.3;
    
    // Create pattern
    float d = length(p);
    float wave = sin(d * 12.0 - t * 2.0);
    wave = abs(fract(wave) - 0.5) * 2.0;
    
    float pattern = smoothstep(0.3, 0.7, wave);
    pattern *= contrast;
    
    return vec4(vec3(pattern), 1.0);
  `
});

setFunction({
  name: 'lowTechTunnel',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'radius', type: 'float', default: 2.0 },
    { name: 'detail', type: 'float', default: 1.0 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Tunnel coordinates
    float angle = atan(uv.y, uv.x);
    float dist = length(uv);
    
    // Prevent division by zero
    dist = max(dist, 0.01);
    
    // Depth calculation
    float depth = radius / dist + t * 4.0;
    
    // Path oscillation
    vec2 pathOffset = vec2(
      cos(depth * 0.1) * 0.5,
      cos(depth * 0.12) * 0.5
    );
    
    // Adjust UV by path
    vec2 adjustedUV = uv - pathOffset * 0.3;
    float adjustedDist = length(adjustedUV);
    float adjustedAngle = atan(adjustedUV.y, adjustedUV.x);
    
    // Tunnel radius modulation
    float tunnelRadius = cos(depth * 0.6) * 0.3 + 1.2;
    
    // Add noise texture
    float noise1 = sin(angle * 6.0 + depth * 0.5) * cos(depth * 0.3);
    float noise2 = sin(angle * 12.0 + depth * 2.0 + t) * 0.5;
    
    // Tunnel walls
    float tunnel = tunnelRadius - adjustedDist + noise1 * 0.15 * detail + noise2 * 0.05 * detail;
    tunnel = smoothstep(0.0, 0.2, tunnel);
    
    // Orb (moving sphere)
    vec3 orbPos = vec3(
      pathOffset.x + sin(t),
      pathOffset.y + sin(t * 2.0),
      mod(depth + sin(t * 2.0), 8.0) - 4.0
    );
    float orbDist = length(vec3(uv, 0.0) - orbPos);
    float orb = smoothstep(0.3, 0.1, orbDist);
    
    // Combine
    vec3 col = vec3(0.0);
    col += tunnel * vec3(0.1, 0.2, 0.5);
    col += orb * vec3(10.0, 20.0, 50.0) * 0.01;
    
    // Depth fog
    col *= 1.0 - dist * 0.3;
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'octgrams',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.5 },
    { name: 'brightness', type: 'float', default: 1.0 }
  ],
  glsl: `
    vec2 p = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Camera movement
    vec3 ro = vec3(0.0, -0.2, t * 4.0);
    vec3 ray = normalize(vec3(p, zoom));
    
    // Rotate ray
    float ca = cos(sin(t * 0.03) * 5.0);
    float sa = sin(sin(t * 0.03) * 5.0);
    ray.xy = mat2(ca, sa, -sa, ca) * ray.xy;
    
    float ca2 = cos(sin(t * 0.05) * 0.2);
    float sa2 = sin(sin(t * 0.05) * 0.2);
    ray.yz = mat2(ca2, sa2, -sa2, ca2) * ray.yz;
    
    float accumulation = 0.0;
    
    // Simplified raymarching
    for (int i = 0; i < 20; i++) {
      float marchT = float(i) * 0.5;
      vec3 pos = ro + ray * marchT;
      
      // Modulo repetition
      pos = mod(pos - 2.0, 4.0) - 2.0;
      
      // Animated box pattern
      float timeOffset = t - float(i) * 0.01;
      float pulse = sin(timeOffset * 0.4);
      
      // Simple distance estimation (box-like)
      vec3 q = abs(pos);
      q.xy *= mat2(cos(0.8), sin(0.8), -sin(0.8), cos(0.8));
      float boxDist = max(max(q.x, q.y), q.z) - 0.4;
      
      // Accumulate color
      accumulation += exp(-abs(boxDist) * 23.0);
    }
    
    vec3 col = vec3(accumulation * 0.02 * brightness);
    col += vec3(0.0, 0.2 * abs(sin(t)), 0.5 + sin(t) * 0.2);
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'neonLines',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'lines', type: 'float', default: 10.0 },
    { name: 'hue', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    vec3 col = vec3(0.02);
    
    float numLines = clamp(lines, 1.0, 20.0);
    
    for (float i = 0.0; i < 20.0; i++) {
      if (i >= numLines) break;
      
      // Pseudo-random seeds
      float seed = fract(sin(i * 127.1) * 43758.5);
      float seed2 = fract(sin(i * 311.7) * 43758.5);
      
      // Wave parameters
      float freq = 3.0 * (0.5 + seed);
      float amp = 0.3 * (0.3 + seed2 * 0.7);
      float phase = seed * 6.28 + t * (0.5 + seed * 0.5);
      
      float lineY = sin(uv.x * freq + phase) * amp;
      lineY += (seed - 0.5) * 1.5;
      
      float d = abs(uv.y - lineY);
      
      // Glow
      float lineGlow = 0.02 / (d + 0.001);
      lineGlow = pow(lineGlow, 1.5) * 0.5;
      
      // Pulse
      float pulse = 0.5 + 0.5 * sin(t * 2.0 + i * 1.5);
      lineGlow *= 0.5 + pulse * 0.5;
      
      // Trail
      float trail = smoothstep(-1.5, 0.5, uv.x + sin(t + seed * 6.28) * 0.3);
      lineGlow *= trail;
      
      // Color with hue variation (inline HSV to RGB)
      float lineHue = hue + i * 0.08 + t * 0.05;
      float h = fract(lineHue);
      float s = 0.8;
      float v = 1.0;
      
      float hh = h * 6.0;
      float sector = floor(hh);
      float ff = hh - sector;
      float p = v * (1.0 - s);
      float q = v * (1.0 - s * ff);
      float tt = v * (1.0 - s * (1.0 - ff));
      
      vec3 lineCol;
      if (sector == 0.0) lineCol = vec3(v, tt, p);
      else if (sector == 1.0) lineCol = vec3(q, v, p);
      else if (sector == 2.0) lineCol = vec3(p, v, tt);
      else if (sector == 3.0) lineCol = vec3(p, q, v);
      else if (sector == 4.0) lineCol = vec3(tt, p, v);
      else lineCol = vec3(v, p, q);
      
      col += lineCol * lineGlow;
    }
    
    col = pow(col, vec3(0.9));
    col = clamp(col, 0.0, 1.0);
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'fractalComplex',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.0 },
    { name: 'colorShift', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed + 385.0;
    
    // Time animation
    float tfract = fract(t);
    tfract *= tfract;
    float animT = (floor(t) + tfract) * 0.2;
    
    // Camera
    vec3 ro = vec3(0.0, 0.0, -40.0 / zoom);
    vec3 rd = normalize(vec3(uv, 1.0)); // Simplified perspective
    
    // Raymarching
    float marchDist = 0.0;
    vec3 col = vec3(0.0);
    
    for(int i = 0; i < 50; i++) {
        vec3 p = ro + marchDist * rd;
        
        // --- Map Function Inline ---
        // Rotations
        vec3 q = p;
        
        // Iterative folding
        mat2 rot1 = mat2(cos(animT), sin(animT), -sin(animT), cos(animT));
        mat2 rot2 = mat2(cos(animT * 1.89), sin(animT * 1.89), -sin(animT * 1.89), cos(animT * 1.89));
        
        vec3 pp = p;
        for(int j = 0; j < 13; j++) {
            pp.xz = rot1 * pp.xz;
            pp.xy = rot2 * pp.xy;
            pp.xz = abs(pp.xz);
            pp.xz -= 1.0;
        }
        
        // Q rotation for artifacts
        mat2 rot3 = mat2(cos(animT * 20.0), sin(animT * 20.0), -sin(animT * 20.0), cos(animT * 20.0));
        q.xy = rot3 * q.xy;
        
        // Box distances
        vec3 b1 = abs(pp) - vec3(2.0, 0.5, 0.3);
        float d1 = max(b1.x, max(b1.y, b1.z));
        
        vec3 b2 = abs(q) - vec3(0.5, 2.0, 0.3);
        float d2 = max(b2.x, max(b2.y, b2.z));
        
        float d = min(d1, d2) * 0.5;
        // --- End Map ---
        
        if(d > 200.0) break;
        if(d < 0.01) d = 0.1; // Artifact glow trick
        
        marchDist += d;
        
        // Color accumulation
        float iter = float(i) / 50.0;
        // Palette mix
        vec3 c1 = vec3(0.0, 0.2, 0.2) + colorShift * 0.1;
        vec3 c2 = vec3(0.8, 0.2, 0.5) + colorShift * 0.1;
        vec3 pal = mix(c1, c2, 1.0 - iter) * 3.5;
        
        col += pal * 0.005 / (0.2 + abs(d));
    }
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'fractalRing',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.0 },
    { name: 'complexity', type: 'float', default: 15.0 }
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    vec3 ro = vec3(0.0, 0.0, -1.0 * (2.0 - zoom));
    vec3 rd = normalize(vec3(uv, 1.0));
    
    vec3 col = vec3(0.0);
    float marchDist = 0.0;
    
    for(int i=0; i<64; i++){
        vec3 p = ro + marchDist * rd;
        
        // --- MAP LOGIC ---
        vec3 q = p;
        q *= 1.4;
        
        float segments = max(3.0, complexity);
        float angper = 6.28318 / segments;
        float angle = t + atan(q.y, q.x) * 2.0;
        
        float r = length(q.xy) - 0.7;
        
        // Twist rotation
        float a_twist = (t + angle) * 0.5;
        float c_twist = cos(a_twist);
        float s_twist = sin(a_twist);
        vec2 twisted = vec2(r, q.z) * mat2(s_twist, c_twist, -c_twist, s_twist);
        r = twisted.x;
        q.z = twisted.y;
        
        // Repetition limits
        float lim = 1.0;
        float c_z = 0.13 * ((1.1 + 0.6 * max(0.0, sin(t))) * 0.9);
        float round_z = floor(q.z/c_z + 0.5); // Manual round
        q.z = q.z - c_z * clamp(round_z, -lim, lim);
        
        float c_r = 0.11 * ((1.1 + 0.6 * max(0.0, cos(1.57 + t))) * 0.9);
        float round_r = floor(r/c_r + 0.5); // Manual round
        r = r - c_r * clamp(round_r, -lim, lim);
        
        angle = mod(angle + angper, angper) - angper/2.0;
        vec2 q_xy = vec2(angle, r);
        
        // Signed box distance
        vec3 box_size = vec3((6.28318/segments)-0.22, 0.05, 0.06);
        vec3 d_vec = abs(vec3(q_xy, q.z)) - box_size;
        float d = length(max(d_vec, 0.0)) + min(max(d_vec.x, max(d_vec.y, d_vec.z)), 0.0) - 0.01;
        // --- END MAP ---
        
        if(d < 0.001) {
            float glow = 1.0 - float(i)/64.0;
            col = vec3(0.4, 0.8, 0.9) * glow; // Blue-ish glow
            break;
        }
        
        if(marchDist > 10.0) break;
        marchDist += d * 0.6;
    }
    
    // Background Radial
    if(length(col) < 0.01) {
        float ang = sin(atan(rd.x, rd.y) * 5.0 + sin(t) * 0.5 + 0.5) * 0.5 + 0.5;
        vec3 bg = mix(vec3(0.4, 0.2, 0.68), vec3(0.0), length(uv) - 0.15);
        col = bg * ang;
    }
    
    return vec4(col, 1.0);
  `
});





setFunction({
  name: 'movingBubbles',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'density', type: 'float', default: 1.0 },
    { name: 'jitter', type: 'float', default: 0.5 }
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Grid setup
    float zoom = 5.0 * density;
    vec2 grid = uv * zoom;
    vec2 id = floor(grid);
    vec2 gv = fract(grid) - 0.5;
    
    vec3 col = vec3(0.0);
    
    // Check neighbor cells (3x3) to allow circles crossing borders
    for(float y=-1.0; y<=1.0; y++) {
        for(float x=-1.0; x<=1.0; x++) {
            vec2 offs = vec2(x, y);
            vec2 nID = id + offs;
            
            // Random hash per cell
            float n = fract(sin(dot(nID, vec2(12.9898, 78.233))) * 43758.5453);
            
            // Animate position
            vec2 pos = offs;
            pos.x += sin(t * (n * 0.5 + 0.5) + n * 6.28) * 0.4 * jitter;
            pos.y += cos(t * (n * 0.5 + 0.5) + n * 6.28) * 0.4 * jitter;
            
            // Distance to circle center
            float d = length(gv - pos);
            
            // Radius modulation
            float r = 0.25 + 0.15 * sin(t * 2.0 + n * 10.0);
            
            // Color palette
            vec3 c = 0.6 + 0.4 * cos(t + nID.xyx * 0.8 + vec3(0,2,4));
            
            // Draw circle with glow
            float circle = smoothstep(r, r - 0.05, d);
            float halo = smoothstep(r + 0.2, r, d) * 0.3; // Glow
            float shadow = smoothstep(r + 0.05, r, d + 0.05) * 0.5; // Pseudo 3D shadow
            
            vec3 bubbleCol = c * (circle + halo);
            bubbleCol -= vec3(shadow) * 0.2; // Apply shadow
            
            // Specular highlight
            float spec = smoothstep(0.1, 0.0, length(gv - pos - vec2(-0.05, 0.05)));
            bubbleCol += vec3(spec) * circle * 0.8;
            
            col += bubbleCol;
        }
    }
    
    // Gamma correction
    col = pow(col, vec3(1.0/2.2));
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'trafficGrid',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'density', type: 'float', default: 1.0 },
    { name: 'jitter', type: 'float', default: 0.8 }
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Grid Setup
    float zoom = 8.0 * density;
    vec2 grid = uv * zoom;
    vec2 id = floor(grid);
    vec2 gv = fract(grid) - 0.5;
    
    vec3 col = vec3(0.0);
    
    // Iterate neighbors
    for(float y=-1.0; y<=1.0; y++) {
        for(float x=-1.0; x<=1.0; x++) {
            vec2 offs = vec2(x, y);
            vec2 nID = id + offs;
            
            // Random attributes
            vec3 hash = fract(sin(vec3(dot(nID, vec2(127.1, 311.7)), 
                                       dot(nID, vec2(269.5, 183.3)), 
                                       dot(nID, vec2(419.2, 371.9)))) * 43758.5453);
            
            // Random Direction (0=L, 1=R, 2=U, 3=D)
            float moveType = floor(hash.x * 4.0);
            vec2 dir = vec2(0.0);
            if(moveType < 1.0) dir = vec2(-1, 0);
            else if(moveType < 2.0) dir = vec2(1, 0);
            else if(moveType < 3.0) dir = vec2(0, 1);
            else dir = vec2(0, -1);
            
            // Random Time Offset & Speed
            float t_offset = hash.y * 10.0;
            // "Digital" movement: stop and go
            float t_move = t + t_offset;
            float step_t = floor(t_move);
            float smooth_t = smoothstep(0.1, 0.9, fract(t_move));
            
            // Calculate Position
            // Base pos + direction * movement
            // Jitter controls amplitude
            vec2 pos = offs + dir * smooth_t * jitter;
            
            // Draw
            if(hash.z > 0.2) { // 80% density effectively
                float d = length(gv - pos);
                float r = 0.35;
                
                // Color based on direction and ID
                vec3 c = 0.5 + 0.5 * cos(vec3(0,2,4) + moveType + t*0.5);
                
                float circle = smoothstep(r, r-0.05, d);
                col += circle * c;
            }
        }
    }
    
    return vec4(col, 1.0);
  `
});

setFunction({
  name: 'squareTunnel',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'spacing', type: 'float', default: 0.9 }, // r *= 0.9
    { name: 'rotation', type: 'float', default: 0.0 }
  ],
  glsl: `
    vec2 u = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec4 o = vec4(0.0);
    float r = 0.9;
    float t = time * speed;
    
    // Optional rotation matrix
    float s = sin(rotation * t * 0.1);
    float c = cos(rotation * t * 0.1);
    mat2 rot = mat2(c, -s, s, c);
    
    for (float i = 0.0; i < 20.0; i++) {
        // Draw square frame
        // abs(max(abs(u.x), abs(u.y)) - r) is distance to square border
        float d = abs(max(abs(u.x), abs(u.y)) - r);
        
        // Add glow (0.0014 / d)
        float intensity = 0.0014 / max(d, 0.0001); // Prevent div by zero
        
        // Color variation based on depth (i)
        vec3 col = vec3(intensity);
        col *= 0.5 + 0.5 * cos(vec3(0,2,4) + i * 0.2 + t);
        
        o += vec4(col, 0.0); // Additive blending
        
        // Move center for next square
        // Original: u -= (.4*abs(fract(iTime*(.3+vec2(-i,i)/1e3))-.5) - .1)*r;
        vec2 motion = 0.4 * abs(fract(t * (0.3 + vec2(-i, i) * 0.001)) - 0.5) - 0.1;
        u -= motion * r;
        
        // Apply rotation if requested
        if(rotation != 0.0) u *= rot;
        
        // Scale down next square
        r *= spacing;
    }
    
    o.a = 1.0;
    return o;
  `
});

setFunction({
  name: 'icosahedron',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'size', type: 'float', default: 1.0 },
    { name: 'glow', type: 'float', default: 0.005 }
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    vec3 col = vec3(0.0);
    
    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -2.5 / size);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    // Rotation matrix
    float s = sin(t * 0.2);
    float c = cos(t * 0.2);
    mat2 rot = mat2(c, -s, s, c);
    
    float t_ray = 0.0;
    
    // Raymarching Loop
    for(int i=0; i<40; i++) {
        vec3 p = ro + rd * t_ray;
        
        // Scene Rotation
        p.xz *= rot;
        p.xy *= rot;
        
        // KIFS Fractaling (Kaleidoscopic Iterated Function System)
        // This generates complex geometric symmetry
        float scale = 1.0;
        for(int j=0; j<4; j++) {
            p = abs(p) - vec3(0.5, 1.0, 0.5) * size; // Fold space
            
            // Rotate inside folds
            p.xy *= mat2(cos(t*0.1), sin(t*0.1), -sin(t*0.1), cos(t*0.1));
            p.xz *= mat2(0.8, 0.6, -0.6, 0.8);
            
            scale *= 0.7; // Decrease scale for details
        }
        
        // Distance function (Box frame logic)
        float d = length(max(abs(p) - vec3(0.1), 0.0)); 
        
        // Invert to create wireframe/hollow look
        d = abs(d) - 0.005;
        
        // Glow accumulation
        // Colors shift based on depth and position
        vec3 pal = 0.5 + 0.5 * cos(vec3(0,2,4) + length(p)*2.0 + t);
        float brightness = glow / (0.005 + abs(d)); // Inverse square falloff
        
        col += pal * brightness * 0.1;
        
        // Advance ray
        t_ray += max(abs(d) * 0.5, 0.02);
    }
    
    // Tone mapping
    col = col / (1.0 + col);
    col = pow(col, vec3(0.8)); // Gamma
    
    return vec4(col, 1.0);
  `
});


setFunction({
  name: 'kaleidoFog',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'glow', type: 'float', default: 1.0 },
    { name: 'distort', type: 'float', default: 3.0 } // Control distortion frequency
  ],
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed * 0.125;
    
    // Camera setup
    float o_cam = 2.09439; // 2 * pi / 3
    vec3 ro = 3.0 * vec3(cos(t - o_cam), cos(t), cos(t + o_cam));
    vec3 ta = vec3(0.0);
    
    // GetRayDir inline
    vec3 f = normalize(ta - ro);
    vec3 r = normalize(cross(vec3(0,1,0), f));
    vec3 u_cam = cross(f, r);
    vec3 rd = normalize(f * 0.95 + uv.x * r + uv.y * u_cam);
    
    vec3 col = vec3(0.0);
    float dO = 0.0;
    
    // Raymarching
    for(int i=0; i<100; i++) {
        vec3 p = ro + rd * dO;
        
        // --- Distort Function Inline ---
        vec3 p_dist = p;
        float o_dist = 2.09439;
        float t_dist = distort * length(p_dist) - 0.5 * time * speed;
        
        // Rotate p_dist xy, yz, zx
        float s1=sin(t_dist - o_dist), c1=cos(t_dist - o_dist);
        p_dist.xy = mat2(c1, -s1, s1, c1) * p_dist.xy;
        
        float s2=sin(t_dist), c2=cos(t_dist);
        p_dist.yz = mat2(c2, -s2, s2, c2) * p_dist.yz;
        
        float s3=sin(t_dist + o_dist), c3=cos(t_dist + o_dist);
        p_dist.zx = mat2(c3, -s3, s3, c3) * p_dist.zx;
        
        p_dist = fract(0.8 * p_dist) - 0.5;
        // --- End Distort ---
        
        // GetDist logic
        float d_xz = length(p_dist.xz) - 0.5;
        float k = 0.25;
        float dS = k * length(vec2(d_xz, p_dist.y)) + 0.0001;
        
        if(abs(dS) < 0.0001 || dO > 50.0) break;
        dO += dS;
    }
    
    if(dO < 50.0) {
        vec3 p = ro + rd * dO;
        // Calculate Normal (finite difference)
        float e = 0.001;
        
        // Helper for GetDist used in normal calc (simplified repeat)
        // Note: fully inlining normal calc with complex distort is verbose.
        // We can approximate or just use the distance for coloring to save code size/perf.
        // The original code used normal for diffuse lighting but mainly distance color.
        
        // Let's re-run distort for p to get color params
        vec3 p_dist = p;
        float o_dist = 2.09439;
        float t_dist = distort * length(p_dist) - 0.5 * time * speed;
        // ... (rotations omitted for brevity in comment, assuming shading relies mostly on position)
        // Actually, let's just use simple distance based shading as in original
        
        // Coloring
        float v = exp(-0.31 * length(p));
        v = smoothstep(0.0, 1.0, v);
        v *= v;
        
        // Palette
        vec3 pal_a = vec3(1.0);
        vec3 pal_b = vec3(1.0);
        vec3 pal_c = vec3(1.0);
        vec3 pal_d = 0.8 * vec3(0,1,2)/3.0;
        float pal_t = 0.77 + 0.15 * length(p);
        
        vec3 color_pal = pal_a + pal_b * cos(6.28318 * (pal_c * pal_t + pal_d));
        
        col = v * color_pal * glow;
    }
    
    return vec4(col, 1.0);
  `
});

// ============================================================================
// ASCII ART COLORED - Real-time ASCII art effect with color preservation
// ============================================================================
setFunction({
  name: 'ascii',
  type: 'color',
  inputs: [
    { name: 'cellSize', type: 'float', default: 8.0 },
    { name: 'sharpness', type: 'float', default: 1.0 },
    { name: 'colorIntensity', type: 'float', default: 1.0 }
  ],
  glsl: `
    // Cell coordinates
    vec2 cellCoord = floor(gl_FragCoord.xy / cellSize);
    vec2 cellCenter = (cellCoord + 0.5) * cellSize / resolution;
    
    // Get the average color of the cell (sample from input)
    vec4 cellColor = _c0;
    
    // Calculate luminance
    float luma = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Position within the cell (0-1)
    vec2 cellPos = fract(gl_FragCoord.xy / cellSize);
    
    // ASCII character patterns based on density
    // Characters from dark to bright: " .:-=+*#%@"
    float pattern = 0.0;
    
    // Level 0: space (darkest)
    if (luma < 0.1) {
      pattern = 0.0;
    }
    // Level 1: dot
    else if (luma < 0.2) {
      float d = length(cellPos - 0.5);
      pattern = 1.0 - smoothstep(0.05, 0.15, d);
    }
    // Level 2: colon (two dots)
    else if (luma < 0.3) {
      float d1 = length(cellPos - vec2(0.5, 0.3));
      float d2 = length(cellPos - vec2(0.5, 0.7));
      pattern = max(1.0 - smoothstep(0.05, 0.12, d1), 
                    1.0 - smoothstep(0.05, 0.12, d2));
    }
    // Level 3: dash (horizontal line)
    else if (luma < 0.4) {
      pattern = 1.0 - smoothstep(0.0, 0.15, abs(cellPos.y - 0.5));
      pattern *= step(0.25, cellPos.x) * step(cellPos.x, 0.75);
    }
    // Level 4: equals (two horizontal lines)
    else if (luma < 0.5) {
      float line1 = 1.0 - smoothstep(0.0, 0.1, abs(cellPos.y - 0.35));
      float line2 = 1.0 - smoothstep(0.0, 0.1, abs(cellPos.y - 0.65));
      pattern = max(line1, line2);
      pattern *= step(0.2, cellPos.x) * step(cellPos.x, 0.8);
    }
    // Level 5: plus sign
    else if (luma < 0.6) {
      float h = 1.0 - smoothstep(0.0, 0.12, abs(cellPos.y - 0.5));
      h *= step(0.15, cellPos.x) * step(cellPos.x, 0.85);
      float v = 1.0 - smoothstep(0.0, 0.12, abs(cellPos.x - 0.5));
      v *= step(0.15, cellPos.y) * step(cellPos.y, 0.85);
      pattern = max(h, v);
    }
    // Level 6: asterisk
    else if (luma < 0.7) {
      vec2 c = cellPos - 0.5;
      float h = 1.0 - smoothstep(0.0, 0.1, abs(c.y));
      float v = 1.0 - smoothstep(0.0, 0.1, abs(c.x));
      float d1 = 1.0 - smoothstep(0.0, 0.1, abs(c.x - c.y) / 1.414);
      float d2 = 1.0 - smoothstep(0.0, 0.1, abs(c.x + c.y) / 1.414);
      pattern = max(max(h, v), max(d1, d2));
      pattern *= step(length(c), 0.4);
    }
    // Level 7: hash/number sign
    else if (luma < 0.8) {
      float h1 = 1.0 - smoothstep(0.0, 0.08, abs(cellPos.y - 0.35));
      float h2 = 1.0 - smoothstep(0.0, 0.08, abs(cellPos.y - 0.65));
      float v1 = 1.0 - smoothstep(0.0, 0.08, abs(cellPos.x - 0.35));
      float v2 = 1.0 - smoothstep(0.0, 0.08, abs(cellPos.x - 0.65));
      pattern = max(max(h1, h2), max(v1, v2));
    }
    // Level 8: percent sign
    else if (luma < 0.9) {
      float d1 = length(cellPos - vec2(0.3, 0.7));
      float d2 = length(cellPos - vec2(0.7, 0.3));
      float slash = 1.0 - smoothstep(0.0, 0.12, abs(cellPos.x + cellPos.y - 1.0) / 1.414);
      pattern = max(max(1.0 - smoothstep(0.08, 0.15, d1), 
                        1.0 - smoothstep(0.08, 0.15, d2)), slash);
    }
    // Level 9: @ (brightest - almost filled)
    else {
      float d = length(cellPos - 0.5);
      float ring = 1.0 - smoothstep(0.25, 0.35, d);
      ring = max(ring, 1.0 - smoothstep(0.0, 0.15, d));
      float tail = 1.0 - smoothstep(0.0, 0.1, abs(cellPos.y - 0.5));
      tail *= step(0.5, cellPos.x) * step(cellPos.x, 0.9);
      pattern = max(ring, tail * 0.8);
    }
    
    // Apply sharpness
    pattern = pow(pattern, 1.0 / max(sharpness, 0.1));
    
    // Mix with original color
    vec3 finalColor = cellColor.rgb * mix(1.0, pattern, colorIntensity);
    
    return vec4(finalColor, cellColor.a);
  `
});

// ASCII art with custom character set (simpler, more stylized)
setFunction({
  name: 'asciiSimple',
  type: 'color',
  inputs: [
    { name: 'cellSize', type: 'float', default: 10.0 },
    { name: 'contrast', type: 'float', default: 1.5 }
  ],
  glsl: `
    // Cell coordinates
    vec2 cellCoord = floor(gl_FragCoord.xy / cellSize);
    vec2 cellPos = fract(gl_FragCoord.xy / cellSize);
    
    // Get color from input
    vec4 cellColor = _c0;
    
    // Calculate luminance with contrast
    float luma = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
    luma = pow(luma, 1.0 / contrast);
    
    // Quantize to 5 levels
    int level = int(luma * 5.0);
    
    // Simple geometric patterns
    float pattern = 0.0;
    vec2 c = cellPos - 0.5;
    
    if (level == 0) {
      // Empty
      pattern = 0.0;
    } else if (level == 1) {
      // Small dot
      pattern = 1.0 - smoothstep(0.0, 0.2, length(c));
    } else if (level == 2) {
      // Cross
      float h = abs(c.y) < 0.1 ? 1.0 : 0.0;
      float v = abs(c.x) < 0.1 ? 1.0 : 0.0;
      pattern = max(h, v) * step(length(c), 0.35);
    } else if (level == 3) {
      // Diamond
      pattern = 1.0 - smoothstep(0.25, 0.35, abs(c.x) + abs(c.y));
    } else {
      // Filled square
      pattern = step(abs(c.x), 0.4) * step(abs(c.y), 0.4);
    }
    
    // Apply pattern to color
    vec3 finalColor = cellColor.rgb * (0.2 + 0.8 * pattern);
    
    return vec4(finalColor, cellColor.a);
  `
});

// Matrix/hacker style ASCII with green tint
setFunction({
  name: 'asciiMatrix',
  type: 'color',
  inputs: [
    { name: 'cellSize', type: 'float', default: 8.0 },
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'greenTint', type: 'float', default: 0.8 }
  ],
  glsl: `
    // Cell coordinates
    vec2 cellCoord = floor(gl_FragCoord.xy / cellSize);
    vec2 cellPos = fract(gl_FragCoord.xy / cellSize);
    
    // Add falling effect based on column
    float fall = fract(cellCoord.y * 0.1 + time * speed + sin(cellCoord.x * 0.5) * 2.0);
    
    // Get color from input
    vec4 cellColor = _c0;
    float luma = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Pseudo-random character selection based on position and time
    float charSeed = fract(sin(dot(cellCoord, vec2(12.9898, 78.233)) + floor(time * speed * 5.0)) * 43758.5453);
    int charType = int(charSeed * 6.0);
    
    // Draw character patterns
    float pattern = 0.0;
    vec2 c = cellPos - 0.5;
    
    if (luma < 0.1) {
      pattern = 0.0;
    } else if (charType == 0) {
      // Vertical lines
      pattern = step(abs(c.x), 0.1);
    } else if (charType == 1) {
      // Horizontal lines
      pattern = step(abs(c.y), 0.1);
    } else if (charType == 2) {
      // Dots
      pattern = 1.0 - smoothstep(0.0, 0.2, length(c));
    } else if (charType == 3) {
      // Cross
      pattern = max(step(abs(c.x), 0.08), step(abs(c.y), 0.08));
      pattern *= step(max(abs(c.x), abs(c.y)), 0.35);
    } else if (charType == 4) {
      // Slash
      pattern = 1.0 - smoothstep(0.0, 0.15, abs(c.x - c.y));
    } else {
      // Box
      float box = step(abs(c.x), 0.35) * step(abs(c.y), 0.35);
      float inner = step(abs(c.x), 0.2) * step(abs(c.y), 0.2);
      pattern = box - inner * 0.5;
    }
    
    // Apply luminance threshold
    pattern *= smoothstep(0.05, 0.2, luma);
    
    // Matrix green color with glow
    vec3 matrixGreen = vec3(0.2, 1.0, 0.3);
    vec3 finalColor = mix(cellColor.rgb, matrixGreen, greenTint) * pattern;
    
    // Add falling glow effect
    finalColor += matrixGreen * 0.1 * (1.0 - fall) * pattern;
    
    return vec4(finalColor, cellColor.a);
  `
});

setFunction({
  name: 'forestLight',
  type: 'src',
  inputs: [
    { name: 'posX', type: 'float', default: 0.5 },
    { name: 'posY', type: 'float', default: 1.0 },
    { name: 'density', type: 'float', default: 1.5 },
    { name: 'speed', type: 'float', default: 0.2 },
    { name: 'rayStrength', type: 'float', default: 0.6 },
    { name: 'softness', type: 'float', default: 0.4 }
  ],
  glsl: `
    vec2 st = _st;
    float t = time * speed;
    
    // 1. Sorgente luminosa
    vec2 lightPos = vec2(posX, posY);
    vec2 rayDir = st - lightPos;
    float dist = length(rayDir);
    float angle = atan(rayDir.y, rayDir.x);

    // 2. Texture "Mura" delle foglie (ombre proiettate)
    float n = _noise(vec3(_st * 8.0 * density, t * 0.4));
    n += 0.4 * _noise(vec3(_st * 16.0 * density, t * 0.8));
    float mask = smoothstep(0.0, softness, n);
    
    // 3. RAGGI MUTANTI (Logica aggiornata)
    // Creiamo una variazione dinamica della frequenza dei raggi nel tempo
    float rayFreq = 15.0 + sin(t * 0.5) * 5.0; 
    
    // Primo set di raggi: oscillazione principale
    float rays1 = sin(angle * rayFreq + (t * 1.2)) * 0.5 + 0.5;
    
    // Secondo set di raggi: mutazione dello spessore e sfasamento
    // Usiamo il rumore per far apparire e scomparire i raggi in modo non lineare
    float rayMutation = _noise(vec3(angle * 2.0, t, 0.0));
    float rays2 = sin(angle * (10.0 + rayMutation * 10.0) - t) * 0.5 + 0.5;
    
    // Uniamo i raggi: la moltiplicazione crea fasci di luce che si spezzano e si fondono
    float combinedRays = pow(rays1 * rays2, 1.5);
    
    // 4. Intensità e decadimento
    float falloff = rayStrength / (dist + 0.3);
    float finalLight = combinedRays * mask * falloff;
    
    // Bagliore diffuso (ambientale)
    finalLight += mask * 0.12 * (1.0 - dist);

    // Colore caldo dorato
    vec3 sunColor = vec3(1.0, 0.92, 0.82);
    return vec4(sunColor * finalLight, 1.0);
  `
})

setFunction({
  name: 'toriiLogo',
  type: 'src',
  inputs: [
    { name: 'scale', type: 'float', default: 1.0 },
    { name: 'grainDensity', type: 'float', default: 12.0 },
    { name: 'flowSpeed', type: 'float', default: 0.1 },
    { name: 'roughness', type: 'float', default: 0.5 }
  ],
  glsl: `
    // 1. Gestione coordinate
    vec2 st = _st - 0.5;
    st.y = -st.y; // Y positivo = ALTO (Sistema cartesiano classico)
    st *= 2.0 / scale;
    float t = time * flowSpeed;
    vec2 d;

    // Fattore di inclinazione (tan(30°) ≈ 0.58)
    float slant = 0.58;

    // --- COSTRUZIONE DEL TORII ---

    // a. Gambe (Legs) - Piedi inclinati a 40°
    vec2 pLegs = st;
    pLegs.x = abs(pLegs.x) - 0.38;
    pLegs.y += 0.2; 
    float wLegs = 0.07 - (st.y * 0.03); 
    
    // Forma base
    d = abs(pLegs) - vec2(wLegs, 0.52);
    float legsBase = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

    // Taglio piedi (40°)
    vec2 pCut = st;
    float angle = radians(40.0);
    vec2 cutNormal = normalize(vec2(-sin(angle), -cos(angle)));
    float cutPlane = dot(vec2(abs(pCut.x) - 0.45, pCut.y + 0.72), cutNormal);
    float legs = max(legsBase, cutPlane);


    // --- TRAVI ORIZZONTALI (Correzione Inclinazione) ---
    // Logica invertita: width = base + (y * slant)
    // Dato che Y punta in alto, più saliamo (Y positivo), più la trave si allarga.

    // b. Trave Superiore (Kasagi)
    vec2 pTop = st;
    pTop.y -= 0.45; 
    pTop.y += cos(pTop.x * 2.8) * 0.15 - 0.12; 
    // CORREZIONE: Segno + per allargare in alto
    float wTop = 0.66 + (pTop.y * slant); 
    d = abs(pTop) - vec2(wTop, 0.08);
    float topBar = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

    // c. Seconda Trave (Shimaki)
    vec2 pShimaki = st;
    pShimaki.y -= 0.36; 
    // CORREZIONE: Segno +
    float wShimaki = 0.55 + (pShimaki.y * slant);
    d = abs(pShimaki) - vec2(wShimaki, 0.047); 
    float shimakiBar = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

    // d. Trave Media (Nuki)
    vec2 pMid = st;
    pMid.y -= 0.15;
    // CORREZIONE: Segno +
    float wMid = 0.50 + (pMid.y * slant);
    d = abs(pMid) - vec2(wMid, 0.045);
    float midBar = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

    // e. Supporto Centrale (Gakuzuka)
    vec2 pCenter = st;
    pCenter.y -= 0.23; 
    d = abs(pCenter) - vec2(0.025, 0.09);
    float centerTag = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);


    // --- ELEMENTI IN BASSO ---

    // f. Pallino
    vec2 pCircle = st;
    pCircle.y += 0.25; 
    float circle = length(pCircle) - 0.080;

    // g. Stanghetta
    vec2 pStick = st;
    pStick.y += 0.35; 
    d = abs(pStick) - vec2(0.020, 0.15);
    float stick = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);


    // --- RENDER ---
    float toriiStructure = min(min(min(min(legs, topBar), shimakiBar), midBar), centerTag);
    float fullShape = min(min(toriiStructure, circle), stick);

    float n = sin(st.x * 10.0 + t) * cos(st.y * 20.0 + t * 0.5);
    vec2 grainSt = st * vec2(1.0, 4.0);
    float grain = sin((grainSt.x + n * roughness * 0.2) * grainDensity);
    grain = smoothstep(0.4, 0.6, grain);

    float mask = smoothstep(0.01, -0.005, fullShape);
    vec3 bgColor = vec3(1.0);
    vec3 woodInk = mix(vec3(0.0), vec3(0.25), grain);

    return vec4(mix(bgColor, woodInk, mask), 1.0);
  `
})

setFunction({
  name: 'setAlpha',
  type: 'color',
  inputs: [
    { name: 'alpha', type: 'float', default: 1.0 }
  ],
  glsl: `
    return vec4(_c0.rgb, _c0.a * alpha);
  `
})

// Color Glitch - channel shift and noise
setFunction({
  name: 'colorShift',
  type: 'color',
  inputs: [
    { name: 'amount', type: 'float', default: 0.2 }
  ],
  glsl: `
    vec3 col = _c0.rgb;
    col.r = col.r + amount * 0.1;
    col.b = col.b - amount * 0.1;
    return vec4(col, _c0.a);
  `
})

// ============================================
// GLITCH COLOR EFFECT
// A digital glitch effect for color nodes
// ============================================
setFunction({
  name: 'glitch',
  type: 'color',
  inputs: [
    { name: 'intensity', type: 'float', default: 0.5 },
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'blockSize', type: 'float', default: 0.1 },
    { name: 'rgbShift', type: 'float', default: 0.02 }
  ],
  glsl: `
    // Time-based animation
    float t = time * speed;
    
    // Use _c0 position info - derive pseudo-UV from color gradients
    // For color shaders, create procedural position from pixel color
    float pseudoY = _c0.r * 0.3 + _c0.g * 0.59 + _c0.b * 0.11;
    float pseudoX = fract(t * 0.1 + pseudoY * 10.0);
    
    // Pseudo-random based on time
    float seed = fract(sin(dot(vec2(floor(t * 10.0), floor(pseudoY / blockSize)), vec2(12.9898, 78.233))) * 43758.5453);
    float seed2 = fract(sin(dot(vec2(floor(t * 15.0), floor(pseudoY / blockSize * 2.0)), vec2(93.9898, 67.345))) * 24634.6345);
    
    // Glitch trigger - creates random blocks of glitch
    float glitchTrigger = step(1.0 - intensity * 0.3, seed);
    
    // Displacement amount
    float displacement = (seed2 - 0.5) * 2.0 * intensity * glitchTrigger;
    
    // Scanline effect
    float scanlineNoise = fract(sin(floor(pseudoY * 100.0) + t * 50.0) * 43758.5453);
    float scanlineGlitch = step(0.98, scanlineNoise) * intensity * 0.5;
    
    // RGB channel separation (chromatic aberration)
    float rgbAmount = rgbShift * (1.0 + glitchTrigger * 3.0);
    
    // Work with color directly
    vec3 col = _c0.rgb;
    
    // Create RGB shift effect
    float shiftR = sin(pseudoX * 50.0 + t * 20.0) * rgbAmount * glitchTrigger;
    float shiftB = cos(pseudoX * 50.0 - t * 20.0) * rgbAmount * glitchTrigger;
    
    // Apply RGB shift
    col.r = col.r + shiftR + displacement * 0.2;
    col.b = col.b + shiftB - displacement * 0.2;
    
    // Add digital noise
    float noise = fract(sin(dot(vec2(pseudoX, pseudoY) + fract(t), vec2(12.9898, 78.233))) * 43758.5453);
    float noiseIntensity = intensity * 0.15 * step(0.95, seed);
    col = col + (noise - 0.5) * noiseIntensity * 2.0;
    
    // Occasional color inversion on glitch blocks
    float invertTrigger = step(0.92, seed2) * glitchTrigger;
    col = mix(col, 1.0 - col, invertTrigger * 0.5);
    
    // Add scanline darkening effect
    float scanline = sin(pseudoY * 200.0) * 0.5 + 0.5;
    col = col * (1.0 - scanlineGlitch * 0.3 * scanline);
    
    // Block corruption - occasionally show solid color blocks
    float blockCorrupt = step(0.97, seed) * glitchTrigger;
    vec3 corruptColor = vec3(
      step(0.5, fract(seed * 2.0)),
      step(0.5, fract(seed * 3.0)),
      step(0.5, fract(seed * 5.0))
    );
    col = mix(col, corruptColor, blockCorrupt * 0.7);
    
    // Clamp output to valid range
    col = clamp(col, 0.0, 1.0);
    
    return vec4(col, _c0.a);
  `
})

setFunction({
  name: 'bitGlitch',
  type: 'src', // Trasformazione Sorgente (sostituisce la catena o la prende come input)
  inputs: [
    { name: 'tex', type: 'sampler2D' }, // Input Texture esplicito
    { name: 'amount', type: 'float', default: 0.5 },
    { name: 'timeScale', type: 'float', default: 1.0 },
    { name: 'blocky', type: 'float', default: 0.1 }
  ],
  glsl3: `
    vec2 st = _st;
    
    // 1. Grid quantization (GLSL3 ivec2)
    ivec2 p = ivec2(st * 1000.0); 
    
    // 2. Integer time
    int t_int = int(time * timeScale * 100.0);
    
    // 3. Bitwise Noise (Sierpinski)
    int noise = (p.x ^ p.y ^ t_int) * int(amount * 10.0);
    
    // Manipolazione Coordinate (Data Mosh)
    // Qui possiamo modificare st PRIMA di campionare la texture
    if ((noise & 255) < int(amount * 50.0)) {
        st.x += float(noise % 100) * 0.001 * blocky;
    }
    
    // 4. Campionamento esplicito dell'input 'tex'
    vec4 col = texture(tex, fract(st));
    
    // 5. Bitwise Color Crushing
    ivec3 iCol = ivec3(col.rgb * 255.0);
    int mask = int(amount * 255.0);
    
    iCol.r = iCol.r ^ mask;       // XOR su Rosso
    iCol.g = iCol.g | (mask / 2); // OR su Verde
    
    // Ritorno al float
    return vec4(vec3(iCol) / 255.0, col.a);
  `,
  // Fallback opzionale per GLSL1 (se necessario, ma bitwise ops non sono supportati in GLSL1)
  glsl: `return texture2D(tex, _st);`
})