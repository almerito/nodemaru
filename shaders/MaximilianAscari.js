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
    // Calcoliamo la luminosità (luma) della texture di maschera (_c1)
    float luma = dot(_c1.rgb, vec3(0.299, 0.587, 0.114));
    // Invertiamo: Bianco -> Trasparente, Nero -> Visibile
    float inv = 1.0 - luma;
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0) * zoom;
    float t = time * speed * 0.2;
    
    // Rotate UV using helper
    uv = rot2d(t) * uv;
    
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
      
      // Add rotation per iteration using helper
      float fi = float(i);
      uv = rot2d(t * 0.5 + fi * 0.3) * uv;
      
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed * 0.2;
    
    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -50.0 * zoom);
    
    // Rotate camera around origin using helper
    ro.xz = rot2d(t) * ro.xz;
    
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
    
    // Precompute rotation matrices
    mat2 rotXZ = rot2d(t);
    mat2 rotXY = rot2d(t * 1.89);
    
    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * marchT;
      
      // Map function - folding space
      vec3 mp = p;
      for (int j = 0; j < 8; j++) {
        mp.xz = rotXZ * mp.xz;
        mp.xy = rotXY * mp.xy;
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 p = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Camera movement
    vec3 ro = vec3(0.0, -0.2, t * 4.0);
    vec3 ray = normalize(vec3(p, zoom));
    
    // Rotate ray using helper
    ray.xy = rot2d(sin(t * 0.03) * 5.0) * ray.xy;
    ray.yz = rot2d(sin(t * 0.05) * 0.2) * ray.yz;
    
    float accumulation = 0.0;
    
    // Fixed rotation matrix for box
    mat2 boxRot = rot2d(0.8);
    
    // Simplified raymarching
    for (int i = 0; i < 20; i++) {
      float marchT = float(i) * 0.5;
      vec3 pos = ro + ray * marchT;
      
      // Modulo repetition
      pos = mod(pos - 2.0, 4.0) - 2.0;
      
      // Simple distance estimation (box-like)
      vec3 q = abs(pos);
      q.xy *= boxRot;
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
  helpers: `
    float hash21(float p) {
      return fract(sin(p * 127.1) * 43758.5453);
    }
    vec3 hsv2rgb(float h, float s, float v) {
      float hh = fract(h) * 6.0;
      float sector = floor(hh);
      float ff = hh - sector;
      float p = v * (1.0 - s);
      float q = v * (1.0 - s * ff);
      float t = v * (1.0 - s * (1.0 - ff));
      if (sector == 0.0) return vec3(v, t, p);
      if (sector == 1.0) return vec3(q, v, p);
      if (sector == 2.0) return vec3(p, v, t);
      if (sector == 3.0) return vec3(p, q, v);
      if (sector == 4.0) return vec3(t, p, v);
      return vec3(v, p, q);
    }
  `,
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    vec3 col = vec3(0.02);
    
    float numLines = clamp(lines, 1.0, 20.0);
    
    for (float i = 0.0; i < 20.0; i++) {
      if (i >= numLines) break;
      
      // Random seeds using helper
      float seed = hash21(i);
      float seed2 = hash21(i * 2.45);
      
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
      
      // Color using helper
      float lineHue = hue + i * 0.08 + t * 0.05;
      vec3 lineCol = hsv2rgb(lineHue, 0.8, 1.0);
      
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed + 385.0;
    
    // Time animation
    float tfract = fract(t);
    tfract *= tfract;
    float animT = (floor(t) + tfract) * 0.2;
    
    // Camera
    vec3 ro = vec3(0.0, 0.0, -40.0 / zoom);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    // Raymarching
    float marchDist = 0.0;
    vec3 col = vec3(0.0);
    
    // Precompute rotation matrices using helper
    mat2 rot1 = rot2d(animT);
    mat2 rot2 = rot2d(animT * 1.89);
    mat2 rot3 = rot2d(animT * 20.0);
    
    for(int i = 0; i < 50; i++) {
        vec3 p = ro + marchDist * rd;
        vec3 q = p;
        
        // Iterative folding
        vec3 pp = p;
        for(int j = 0; j < 13; j++) {
            pp.xz = rot1 * pp.xz;
            pp.xy = rot2 * pp.xy;
            pp.xz = abs(pp.xz);
            pp.xz -= 1.0;
        }
        
        // Q rotation for artifacts
        q.xy = rot3 * q.xy;
        
        // Box distances
        vec3 b1 = abs(pp) - vec3(2.0, 0.5, 0.3);
        float d1 = max(b1.x, max(b1.y, b1.z));
        
        vec3 b2 = abs(q) - vec3(0.5, 2.0, 0.3);
        float d2 = max(b2.x, max(b2.y, b2.z));
        
        float d = min(d1, d2) * 0.5;
        
        if(d > 200.0) break;
        if(d < 0.01) d = 0.1;
        
        marchDist += d;
        
        // Color accumulation
        float iter = float(i) / 50.0;
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
    float sdBox3(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
  `,
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    vec3 ro = vec3(0.0, 0.0, -1.0 * (2.0 - zoom));
    vec3 rd = normalize(vec3(uv, 1.0));
    
    vec3 col = vec3(0.0);
    float marchDist = 0.0;
    
    for(int i=0; i<64; i++){
        vec3 p = ro + marchDist * rd;
        vec3 q = p;
        q *= 1.4;
        
        float segments = max(3.0, complexity);
        float angper = 6.28318 / segments;
        float angle = t + atan(q.y, q.x) * 2.0;
        
        float r = length(q.xy) - 0.7;
        
        // Twist rotation using helper
        float a_twist = (t + angle) * 0.5;
        mat2 twistMat = rot2d(a_twist);
        // Note: original used transposed matrix, keeping same behavior
        vec2 twisted = vec2(r, q.z) * mat2(sin(a_twist), cos(a_twist), -cos(a_twist), sin(a_twist));
        r = twisted.x;
        q.z = twisted.y;
        
        // Repetition limits
        float lim = 1.0;
        float c_z = 0.13 * ((1.1 + 0.6 * max(0.0, sin(t))) * 0.9);
        float round_z = floor(q.z/c_z + 0.5);
        q.z = q.z - c_z * clamp(round_z, -lim, lim);
        
        float c_r = 0.11 * ((1.1 + 0.6 * max(0.0, cos(1.57 + t))) * 0.9);
        float round_r = floor(r/c_r + 0.5);
        r = r - c_r * clamp(round_r, -lim, lim);
        
        angle = mod(angle + angper, angper) - angper/2.0;
        vec2 q_xy = vec2(angle, r);
        
        // Signed box distance using helper
        vec3 box_size = vec3((6.28318/segments)-0.22, 0.05, 0.06);
        float d = sdBox3(vec3(q_xy, q.z), box_size) - 0.01;
        
        if(d < 0.001) {
            float glow = 1.0 - float(i)/64.0;
            col = vec3(0.4, 0.8, 0.9) * glow;
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
  helpers: `
    float hash22(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Grid setup
    float zoom = 5.0 * density;
    vec2 grid = uv * zoom;
    vec2 id = floor(grid);
    vec2 gv = fract(grid) - 0.5;
    
    vec3 col = vec3(0.0);
    
    // Check neighbor cells (3x3)
    for(float y=-1.0; y<=1.0; y++) {
        for(float x=-1.0; x<=1.0; x++) {
            vec2 offs = vec2(x, y);
            vec2 nID = id + offs;
            
            // Random hash using helper
            float n = hash22(nID);
            
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
            float halo = smoothstep(r + 0.2, r, d) * 0.3;
            float shadow = smoothstep(r + 0.05, r, d + 0.05) * 0.5;
            
            vec3 bubbleCol = c * (circle + halo);
            bubbleCol -= vec3(shadow) * 0.2;
            
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
  helpers: `
    vec3 hash23(vec2 p) {
      return fract(sin(vec3(
        dot(p, vec2(127.1, 311.7)),
        dot(p, vec2(269.5, 183.3)),
        dot(p, vec2(419.2, 371.9))
      )) * 43758.5453);
    }
  `,
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
            
            // Random attributes using helper
            vec3 hash = hash23(nID);
            
            // Random Direction
            float moveType = floor(hash.x * 4.0);
            vec2 dir = vec2(0.0);
            if(moveType < 1.0) dir = vec2(-1, 0);
            else if(moveType < 2.0) dir = vec2(1, 0);
            else if(moveType < 3.0) dir = vec2(0, 1);
            else dir = vec2(0, -1);
            
            // Movement
            float t_offset = hash.y * 10.0;
            float t_move = t + t_offset;
            float smooth_t = smoothstep(0.1, 0.9, fract(t_move));
            vec2 pos = offs + dir * smooth_t * jitter;
            
            // Draw
            if(hash.z > 0.2) {
                float d = length(gv - pos);
                float r = 0.35;
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
    { name: 'spacing', type: 'float', default: 0.9 },
    { name: 'rotation', type: 'float', default: 0.0 }
  ],
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 u = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec4 o = vec4(0.0);
    float r = 0.9;
    float t = time * speed;
    
    // Rotation matrix using helper
    mat2 rot = rot2d(rotation * t * 0.1);
    
    for (float i = 0.0; i < 20.0; i++) {
        // Distance to square border
        float d = abs(max(abs(u.x), abs(u.y)) - r);
        
        // Glow
        float intensity = 0.0014 / max(d, 0.0001);
        
        // Color variation
        vec3 col = vec3(intensity);
        col *= 0.5 + 0.5 * cos(vec3(0,2,4) + i * 0.2 + t);
        
        o += vec4(col, 0.0);
        
        // Move center
        vec2 motion = 0.4 * abs(fract(t * (0.3 + vec2(-i, i) * 0.001)) - 0.5) - 0.1;
        u -= motion * r;
        
        // Apply rotation
        if(rotation != 0.0) u *= rot;
        
        // Scale down
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
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
  `,
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    vec3 col = vec3(0.0);
    
    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -2.5 / size);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    // Rotation matrix using helper
    mat2 rot = rot2d(t * 0.2);
    mat2 rotInner = rot2d(t * 0.1);
    mat2 rotFixed = mat2(0.8, 0.6, -0.6, 0.8);
    
    float t_ray = 0.0;
    
    // Raymarching Loop
    for(int i=0; i<40; i++) {
        vec3 p = ro + rd * t_ray;
        
        // Scene Rotation
        p.xz *= rot;
        p.xy *= rot;
        
        // KIFS Fractaling
        float scale = 1.0;
        for(int j=0; j<4; j++) {
            p = abs(p) - vec3(0.5, 1.0, 0.5) * size;
            p.xy *= rotInner;
            p.xz *= rotFixed;
            scale *= 0.7;
        }
        
        // Distance function
        float d = length(max(abs(p) - vec3(0.1), 0.0)); 
        d = abs(d) - 0.005;
        
        // Glow accumulation
        vec3 pal = 0.5 + 0.5 * cos(vec3(0,2,4) + length(p)*2.0 + t);
        float brightness = glow / (0.005 + abs(d));
        
        col += pal * brightness * 0.1;
        
        // Advance ray
        t_ray += max(abs(d) * 0.5, 0.02);
    }
    
    // Tone mapping
    col = col / (1.0 + col);
    col = pow(col, vec3(0.8));
    
    return vec4(col, 1.0);
  `
});


setFunction({
  name: 'kaleidoFog',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'glow', type: 'float', default: 1.0 },
    { name: 'distort', type: 'float', default: 3.0 }
  ],
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }
  `,
  glsl: `
    vec2 uv = (_st * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed * 0.125;
    
    // Camera setup
    float o_cam = 2.09439;
    vec3 ro = 3.0 * vec3(cos(t - o_cam), cos(t), cos(t + o_cam));
    vec3 ta = vec3(0.0);
    
    // Ray direction
    vec3 f = normalize(ta - ro);
    vec3 r = normalize(cross(vec3(0,1,0), f));
    vec3 u_cam = cross(f, r);
    vec3 rd = normalize(f * 0.95 + uv.x * r + uv.y * u_cam);
    
    vec3 col = vec3(0.0);
    float dO = 0.0;
    float o_dist = 2.09439;
    
    // Raymarching
    for(int i=0; i<100; i++) {
        vec3 p = ro + rd * dO;
        
        // Distort with rotations
        vec3 p_dist = p;
        float t_dist = distort * length(p_dist) - 0.5 * time * speed;
        
        p_dist.xy = rot2d(t_dist - o_dist) * p_dist.xy;
        p_dist.yz = rot2d(t_dist) * p_dist.yz;
        p_dist.zx = rot2d(t_dist + o_dist) * p_dist.zx;
        
        p_dist = fract(0.8 * p_dist) - 0.5;
        
        // Distance calculation
        float d_xz = length(p_dist.xz) - 0.5;
        float k = 0.25;
        float dS = k * length(vec2(d_xz, p_dist.y)) + 0.0001;
        
        if(abs(dS) < 0.0001 || dO > 50.0) break;
        dO += dS;
    }
    
    if(dO < 50.0) {
        vec3 p = ro + rd * dO;
        
        // Coloring
        float v = exp(-0.31 * length(p));
        v = smoothstep(0.0, 1.0, v);
        v *= v;
        
        // Palette using helper
        float pal_t = 0.77 + 0.15 * length(p);
        vec3 color_pal = palette(pal_t, vec3(1.0), vec3(1.0), vec3(1.0), 0.8 * vec3(0,1,2)/3.0);
        
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

// Chromatic Glitch Shader
// Adapted from Shadertoy - creates VHS/digital glitch effect with chromatic aberration
// Using helper function for random hash
setFunction({
  name: 'chromaticGlitch',
  type: 'color',
  inputs: [
    { name: 'intensity', type: 'float', default: 0.1 },
    { name: 'speed', type: 'float', default: 1.0 },
  ],
  helpers: `
    float hash22(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  glsl: `
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float tm = mod(time * speed * 100.0, 32.0) / 110.0;
  float gnm = clamp(intensity, 0.0, 1.0);
  
  // Random using helper
  float rnd0 = hash22(floor(vec2(tm, tm) * 6.0) / 6.0);
  float r0 = clamp((1.0 - gnm) * 0.7 + rnd0, 0.0, 1.0);
  float rnd1 = hash22(vec2(floor(uv.x * 10.0 * r0) / (10.0 * r0), tm));
  float r1 = 0.5 - 0.5 * gnm + rnd1;
  r1 = 1.0 - max(0.0, min(r1, 0.9999999));
  float rnd2 = hash22(vec2(floor(uv.y * 40.0 * r1) / (40.0 * r1), tm));
  float r2 = clamp(rnd2, 0.0, 1.0);
  float rnd3 = hash22(vec2(floor(uv.y * 10.0 * r0) / (10.0 * r0), tm));
  float r3 = (1.0 - clamp(rnd3 + 0.8, 0.0, 1.0)) - 0.1;
  float pxrnd = hash22(uv + tm);
  
  float ofs = 0.05 * r2 * intensity * (rnd0 > 0.5 ? 1.0 : -1.0);
  ofs += 0.5 * pxrnd * ofs;
  uv.y += 0.1 * r3 * intensity;
  
  // Chromatic sampling
  vec2 uvR = vec2(clamp(uv.x + ofs, 0.0, 1.0), uv.y);
  vec2 uvG = vec2(clamp(uv.x + ofs * 0.5, 0.0, 1.0), uv.y);
  vec2 uvB = vec2(clamp(uv.x, 0.0, 1.0), uv.y);
  
  float rr = texture2D(tex0, uvR).r;
  float gg = texture2D(tex0, uvG).g;
  float bb = texture2D(tex0, uvB).b;
  
  return vec4(rr, gg, bb, _c0.a);
`})

// chromaGlitch - Full multi-sample version
// Type: color (chainable after src/osc/etc)
setFunction({
  name: 'chromaGlitch',
  type: 'color',
  inputs: [
    { name: 'glitchAmount', type: 'float', default: 0.1 },
    { name: 'numSamples', type: 'float', default: 10.0 }
  ],
  helpers: `
    float hash22(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  glsl: `
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    float rnd0 = hash22(floor(vec2(time * 100.0, time * 100.0) * 6.0) / 6.0);
    float gnm = clamp(glitchAmount, 0.0, 1.0);
    float r0 = clamp((1.0 - gnm) * 0.7 + rnd0, 0.0, 1.0);
    
    float truncX = floor(uv.x * 10.0 * r0) / (10.0 * r0);
    float rnd1 = hash22(vec2(truncX, time));
    float r1 = 0.5 - 0.5 * gnm + rnd1;
    r1 = 1.0 - max(0.0, min(r1, 0.9999999));
    
    float truncY = floor(uv.y * 40.0 * r1) / (40.0 * r1);
    float rnd2 = hash22(vec2(truncY, time));
    float r2 = clamp(rnd2, 0.0, 1.0);
    
    float pxrnd = hash22(uv + time);
    float ofs = 0.05 * r2 * gnm * (rnd0 > 0.5 ? 1.0 : -1.0);
    ofs += 0.5 * pxrnd * ofs;
    
    float truncY2 = floor(uv.y * 10.0 * r0) / (10.0 * r0);
    float rnd3 = hash22(vec2(truncY2, time));
    uv.y += 0.1 * (1.0 - clamp(rnd3 + 0.8, 0.0, 1.0) - 0.1) * gnm;
    
    vec4 sum = vec4(0.0);
    vec3 wsum = vec3(0.0);
    float ns = max(1.0, numSamples);
    
    for(float i = 0.0; i < 20.0; i += 1.0) {
      if(i >= ns) break;
      float t = i / ns;
      vec2 sampleUV = uv;
      sampleUV.x = clamp(sampleUV.x + ofs * t, 0.0, 1.0);
      
      vec4 sampleCol = texture2D(tex0, sampleUV);
      
      float lo = step(t, 0.5);
      float hi = 1.0 - lo;
      float remapped = clamp((t - 1.0/6.0) / (5.0/6.0 - 1.0/6.0), 0.0, 1.0);
      float w = clamp(1.0 - abs(2.0 * remapped - 1.0), 0.0, 1.0);
      float neg_w = 1.0 - w;
      vec3 s = vec3(lo, 1.0, hi) * vec3(neg_w, w, neg_w);
      s = pow(s, vec3(1.0 / 2.2));
      
      sampleCol.rgb *= s;
      sum += sampleCol;
      wsum += s;
    }
    
    sum.rgb /= max(wsum, vec3(0.001));
    sum.a /= ns;
    
    return vec4(sum.rgb, _c0.a);
  `
})

// Glitch CRT Effect - CRT styling with scanlines, noise, RGB shift, vignette
// Type: color (chainable after any source)
setFunction({
  name: 'glitch_crt',
  type: 'color',
  inputs: [
    { name: 'amount', type: 'float', default: 0.5 },
    { name: 'scanlines', type: 'float', default: 0.5 },
    { name: 'rgbShift', type: 'float', default: 0.01 }
  ],
  helpers: `
    float hash22(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  glsl: `
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time;
    
    // Glitch timing
    float duration = 5.0;
    float glitchPulse = smoothstep(0.0, duration * amount, mod(t, duration)) * 
                        smoothstep(duration * amount, 0.0, mod(t, duration));
    
    // Chromatic aberration
    float offset = rgbShift * (1.0 + glitchPulse * 2.0);
    
    // Sample with RGB shift
    vec3 col;
    col.r = texture2D(tex0, uv + vec2(offset, 0.0)).r;
    col.g = texture2D(tex0, uv).g;
    col.b = texture2D(tex0, uv - vec2(offset, 0.0)).b;
    
    // Scanlines
    float scanline = sin(uv.y * resolution.y * 1.5) * 0.5 + 0.5;
    scanline = pow(scanline, 1.5);
    col = mix(col, col * scanline, scanlines * 0.5);
    
    // White noise using helper
    float n = hash22(uv + t);
    col += (n - 0.5) * amount * 0.15 * glitchPulse;
    
    // Vignette
    vec2 vigUV = uv * 2.0 - 1.0;
    float vig = 1.0 - dot(vigUV * 0.5, vigUV * 0.5);
    col *= vig;
    
    return vec4(col, _c0.a);
  `
})

// cubeMatrix - Raymarched 3D rotating cubes with grid pattern
// Type: src (generates procedural content)
// Using helpers for rotation and SDF functions
setFunction({
  name: 'cubeMatrix',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'gridDensity', type: 'float', default: 50.0 },
    { name: 'colorR', type: 'float', default: 0.0 },
    { name: 'colorG', type: 'float', default: 1.0 },
    { name: 'colorB', type: 'float', default: 0.0 }
  ],
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
    float sdBox3(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
  `,
  glsl: `
    vec2 uv = (_st - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    float t = time * speed;
    
    // Raymarching setup
    vec3 ro = vec3(0.0, 0.0, -4.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    float rayT = 0.0;
    float d = 0.0;
    vec3 col = vec3(0.0);
    vec3 p = vec3(0.0);
    
    // Precompute rotation matrices using helper
    mat2 rot1 = rot2d(t);
    mat2 rot2 = rot2d(-0.5 * t);
    mat2 rot3 = rot2d(0.5 * t);
    
    // Raymarching loop
    for (int i = 0; i < 80; i++) {
      p = ro + rayT * rd;
      vec3 bp = p;
      
      // Cube 1 - small, fast rotation
      vec3 p1 = bp;
      p1.xy = rot1 * p1.xy;
      p1.xz = rot1 * p1.xz;
      float d1 = sdBox3(p1, vec3(0.33));
      
      // Cube 2 - medium, at z=5
      vec3 p2 = bp;
      p2.z -= 5.0;
      p2.xy = rot2 * p2.xy;
      p2.xz = rot2 * p2.xz;
      float d2 = sdBox3(p2, vec3(1.5));
      
      // Cube 3 - large, at z=9
      vec3 p3 = bp;
      p3.z -= 9.0;
      p3.xy = rot3 * p3.xy;
      p3.xz = rot2 * p3.xz;
      float d3 = sdBox3(p3, vec3(3.0));
      
      d = min(min(d1, d2), d3);
      rayT += d;
      if (d < 0.0001 || rayT > 20.0) break;
    }
    
    if (d < 0.0001) {
      // Simple lighting based on position
      float dif = 0.5 + 0.5 * p.y / (length(p) + 0.001);
      float fog = exp(-0.01 * rayT * rayT) * 0.1;
      float c = dif + fog;
      
      // Grid pattern
      float gridScale = mix(20.0, 100.0, sin(0.5 * t) * 0.5 + 0.5) * gridDensity / 50.0;
      vec2 gp = abs(fract(uv * gridScale) - 0.5);
      float grid = max(gp.x, gp.y) - 0.4 * c;
      col += smoothstep(0.0, 0.01, grid);
      col += 1.0 - c;
      col = 1.0 - col;
    }
    
    return vec4(col * vec3(colorR, colorG, colorB), 1.0);
  `
})

// phantomTunnel - Volumetric fractal tunnel with IFS boxes
// Type: src (generates procedural content)
// Inspired by Phantom Mode by aiekick
// Using helpers for rotation, SDF and polar modulo functions
setFunction({
  name: 'phantomTunnel',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'intensity', type: 'float', default: 1.0 },
    { name: 'complexity', type: 'float', default: 5.0 }
  ],
  helpers: `
    mat2 rot2d(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }
    float sdBox3(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
    vec2 pmod5(vec2 p) {
      float a = atan(p.x, p.y) + 3.14159 / 5.0;
      float n = 6.28318 / 5.0;
      a = floor(a / n) * n;
      return rot2d(-a) * p;
    }
  `,
  glsl: `
    vec2 p = (_st - 0.5) * 2.0;
    p.x *= resolution.x / resolution.y;
    
    float t = time * speed;
    
    // Camera setup
    vec3 cPos = vec3(0.0, 0.0, -3.0 * t);
    vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));
    vec3 cUp = vec3(sin(t), 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);
    
    // Volumetric accumulation
    float acc = 0.0;
    float acc2 = 0.0;
    float rayT = 0.0;
    
    // Precompute rotation matrices using helpers
    mat2 rotXY = rot2d(t * 0.3);
    mat2 rotXZ = rot2d(t * 0.1);
    mat2 rotXZ2 = rot2d(t);
    
    int iters = int(clamp(complexity, 2.0, 8.0));
    
    for (int i = 0; i < 80; i++) {
      vec3 pos = cPos + ray * rayT;
      vec3 p1 = pos;
      
      // Modulo repetition
      p1.x = mod(p1.x - 5.0, 10.0) - 5.0;
      p1.y = mod(p1.y - 5.0, 10.0) - 5.0;
      p1.z = mod(p1.z, 16.0) - 8.0;
      
      // Polar modulo using helper
      p1.xy = pmod5(p1.xy);
      
      // IFS Box
      vec3 ifsP = p1;
      for (int j = 0; j < 8; j++) {
        if (j >= iters) break;
        ifsP = abs(ifsP) - 1.0;
        ifsP.xy = rotXY * ifsP.xy;
        ifsP.xz = rotXZ * ifsP.xz;
      }
      ifsP.xz = rotXZ2 * ifsP.xz;
      
      // Box SDF using helper
      float dist = sdBox3(ifsP, vec3(0.4, 0.8, 0.3));
      
      dist = max(abs(dist), 0.02);
      float a = exp(-dist * 3.0);
      
      // Highlight rings
      if (mod(length(pos) + 24.0 * t, 30.0) < 3.0) {
        a *= 2.0;
        acc2 += a;
      }
      acc += a;
      rayT += dist * 0.5;
    }
    
    vec3 col = vec3(acc * 0.01, acc * 0.011 + acc2 * 0.002, acc * 0.012 + acc2 * 0.005) * intensity;
    
    return vec4(col, 1.0);
  `
})

// Supernova Tunnel - Kaleidoscopic chromatic tunnel
// Type: src (generates procedural content)
// Original by Danilo Guanabara (pouet.net/prod.php?which=57245)
// All functions inlined for Hydra compatibility
setFunction({
  name: 'supernovaTunnel',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 9.0 },
    { name: 'brightness', type: 'float', default: 0.01 }
  ],
  glsl: `
    float t = time * speed;
    vec2 r = resolution.xy;
    vec3 c = vec3(0.0);
    float l = 0.0;
    float z = t;
    
    // RGB chromatic separation loop
    for (int i = 0; i < 3; i++) {
      vec2 uv = _st;
      vec2 p = _st;
      p -= 0.5;
      p.x *= r.x / r.y;
      z += 0.07;
      l = length(p);
      uv += p / l * (sin(z) + 1.0) * abs(sin(l * zoom - z - z));
      
      if (i == 0) c.r = brightness / length(mod(uv, 1.0) - 0.5);
      else if (i == 1) c.g = brightness / length(mod(uv, 1.0) - 0.5);
      else c.b = brightness / length(mod(uv, 1.0) - 0.5);
    }
    
    return vec4(c / l, 1.0);
  `
})

// fractalZoom - Iterative fractal with cosine palette
// Type: src (generates procedural content)
// Original by Kishimisu (shadertoy.com/view/mtyGWy)
// Palette by Inigo Quilez (iquilezles.org/articles/palettes)
setFunction({
  name: 'fractalZoom',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 0.4 },
    { name: 'scale', type: 'float', default: 1.5 },
    { name: 'iterations', type: 'float', default: 4.0 }
  ],
  helpers: `
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }
  `,
  glsl: `
    vec2 uv = (_st - 0.5) * 2.0;
    uv.x *= resolution.x / resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    float t = time * speed;
    int iters = int(clamp(iterations, 1.0, 8.0));
    
    for (int i = 0; i < 8; i++) {
      if (i >= iters) break;
      
      uv = fract(uv * scale) - 0.5;
      
      float d = length(uv) * exp(-length(uv0));
      
      // IQ cosine palette using helper
      float palT = length(uv0) + float(i) * 0.4 + t;
      vec3 col = palette(palT, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.263, 0.416, 0.557));
      
      d = sin(d * 8.0 + t) / 8.0;
      d = abs(d);
      d = pow(0.01 / d, 1.2);
      
      finalColor += col * d;
    }
    
    return vec4(finalColor, 1.0);
  `
})

setFunction({
  name: 'siliconDreams',
  type: 'src',
  inputs: [
    { name: 'speed', type: 'float', default: 1.0 },
    { name: 'zoom', type: 'float', default: 1.0 },
    { name: 'complexity', type: 'float', default: 1.0 }
  ],
  helpers: `
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    vec3 HSV2RGB_FUNC(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        return c.z * mix(K.xxx, clamp(abs(fract(c.xxx + K.xyz) * 6.0 - K.www) - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 getBY() { return HSV2RGB_FUNC(vec3(0.05+0.7, 0.7, 0.8)); }
    vec3 getBG() { return HSV2RGB_FUNC(vec3(0.95+0.7, 0.6, 0.3)); }
    vec3 getBW() { return HSV2RGB_FUNC(vec3(0.55+0.7, 0.3, 2.0)); }
    vec3 getBF() { return HSV2RGB_FUNC(vec3(0.82+0.7, 0.6, 2.0)); }
    // const mat2 MatR = mat2(1.2, 1.6, -1.6, 1.2);

    float hash(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 58.233))) * 13758.5453);
    }

    vec3 tanh_approx(vec3 x) {
      vec3 x2 = x*x;
      return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
    }

    float ray_sphere(vec3 ro, vec3 rd, vec4 sph) {
      vec3 oc = ro - sph.xyz;
      float b = dot(oc, rd);
      float c = dot(oc, oc) - sph.w*sph.w;
      float h = b*b - c;
      if(h < 0.0) return -1.0; 
      h = sqrt(h);
      return -b - h;
    }

    float ray_plane(vec3 ro, vec3 rd, vec4 p) {
      return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
    }

    float doctahedron(vec3 p, float s) {
      p = abs(p);
      return (p.x + p.y + p.z - s) * 0.57735027;
    }

    vec3 path(float z) {
      return vec3(vec2(25, 3.3) + vec2(6, 1.41) * cos(vec2(0.056, 0.035) * z), z);
    }

    vec3 dpath(float z) {
      return vec3(-vec2(6, 1.41) * vec2(0.056, 0.035) * sin(vec2(0.056, 0.035) * z), 1.0);
    }

    vec3 ddpath(float z) {
      return vec3(-vec2(6, 1.41) * vec2(0.056, 0.035) * vec2(0.056, 0.035) * cos(vec2(0.056, 0.035) * z), 0.0);
    }

    float dfbm(vec3 p) {
      float d = p.y + 0.6;
      float a = 1.0;
      vec2 D = vec2(0.0);
      vec2 P = 0.23 * p.xz;
      vec4 o;
      mat2 MatR = mat2(1.2, 1.6, -1.6, 1.2);

      for(int j=0; j<7; ++j) {
        o = cos(vec4(P.x, P.x, P.y, P.y) + vec4(11, 0, 11, 0));
        vec3 pp = vec3(o.y, o.x, 0.0) * vec3(o.z, o.w, o.z);
        D += pp.xy;
        d -= a * (1.0 + pp.z) / (1.0 + 3.0 * dot(D, D));
        P *= MatR;
        a *= 0.55;
      }
      return d;
    }

    float dpyramid(vec3 p, out vec3 oo) {
      const float ZZ_CONST = 11.0;
      const float PR = 0.66;
      vec2 n = floor(p.xz / ZZ_CONST + 0.5);
      p.xz -= n * ZZ_CONST;

      float h0 = hash(n);
      float h1 = fract(9677.0 * h0);
      float h = 0.3 * ZZ_CONST * h0 * h0 + 0.1;
      float d = doctahedron(p, h);

      oo = vec3(1e3, 0.0, 0.0);
      if(h1 < PR) return 1e3;
      oo = vec3(d, h0, h);
      return d;
    }

    float df(vec3 p, out vec3 oo) {
      p.y = abs(p.y);
      float d0 = dfbm(p);
      float d1 = dpyramid(p, oo);
      return min(d0, d1);
    }

    float fbm_noise(float x) {
      float a = 1.0;
      float h = 0.0;
      for(int i=0; i<5; ++i) {
        h += a * sin(x);
        x *= 2.03;
        x += 123.4;
        a *= 0.55;
      }
      return abs(h);
    }
  `,
  glsl: `
    const float TAU = 6.283185307;
    const vec3 FC = vec3(0.04, 0.08, 0.0);
    const vec3 LD = vec3(0.267, -0.133, 0.801);
    const vec3 RN = vec3(-0.099, 0.99, 0.099);
    const vec4 GG = vec4(-700.0, 300.0, 1000.0, 400.0);
    const float OFF = 0.7;

    vec2 r = resolution.xy;
    vec2 p2 = (gl_FragCoord.xy * 2.0 - r) / r.y;
    p2 /= zoom;
    p2 = -p2; // Fix 180 degree rotation
    vec2 q2 = gl_FragCoord.xy / r;
    
    float d = 1.0;
    float z = 0.0;
    float T = time * speed * 3.0;
    
    vec3 oo;
    vec3 O = vec3(0.0);
    vec3 p;
    vec3 P = path(T);
    vec3 ZZ = normalize(dpath(T) + vec3(0.0, -0.1, 0.0));
    vec3 XX = normalize(cross(ZZ, vec3(0.0, 1.0, 0.0) + ddpath(T)));
    vec3 YY = cross(XX, ZZ);
    vec3 R_dir = normalize(-p2.x * XX + p2.y * YY + 2.0 * ZZ);
    
    vec3 cBY = getBY();
    vec3 cBW = getBW();
    vec3 cBG = getBG();
    vec3 cBF = getBF();
    
    vec3 Y_col = (1.0 + R_dir.x) * cBY;
    vec3 S = (1.0 + R_dir.y) * cBW * Y_col;
    
    vec4 M;
    
    int maxIter = int(50.0 * complexity);
    
    for(int i=0; i<80; ++i) {
        if (i >= maxIter) break;
        if(d <= 1e-5 || z >= 2e2) break;
        p = z * R_dir + P;
        d = df(p, oo);
        if(p.y > 0.0) {
            O += cBG + min(d, 9.0) * Y_col;
        } else {
            O += S;
            oo.x *= 9.0;
        }
        
        O += mix(0.02, 1.0, 0.5 + 0.5 * sin(time * speed + TAU * oo.y))
           * smoothstep(oo.z * 0.78, oo.z * 0.8, abs(p.y))
           / max(oo.x + oo.x * oo.x * oo.x * oo.x * 9.0, 1e-2)
           * cBF;
           
        z += d * 0.7;
    }
    
    O *= 9E-3;
    
    if(R_dir.y > 0.0) {
        M = GG;
        vec3 S_bg = M.xyz + P;
        M.xyz = S_bg;
        float d_sph = ray_sphere(P, R_dir, M);
        z = d_sph;
        d = d_sph;
        
        Y_col = vec3(0.0);
        if(z > 0.0) {
            p = P + R_dir * z;
            ZZ = normalize(p - M.xyz);
            Y_col += max(dot(LD, ZZ), 0.0)
                   * smoothstep(1.0, 0.89, 1.0 + dot(R_dir, ZZ))
                   * fbm_noise(2e-2 * dot(p, RN));
        }
        
        M = vec4(RN, -dot(RN, S_bg));
        float z_plane = ray_plane(P, R_dir, M);
        z = z_plane;
        
        if(z > 0.0 && (d < 0.0 || z < d)) {
             p = P + R_dir * z;
             d = distance(S_bg, p);
             Y_col += abs(dot(LD, RN))
                    * step(GG.w * 1.41, d)
                    * step(d, GG.w * 2.0)
                    * fbm_noise(0.035 * d);
        }
        Y_col *= smoothstep(0.0, 0.2, R_dir.y);
        Y_col += clamp((hsv2rgb(vec3(OFF - 0.4 * R_dir.y, 0.5 + 1.0 * R_dir.y, 3.0 / (1.0 + 800.0 * R_dir.y * R_dir.y * R_dir.y)))), 0.0, 1.0);
        
        O *= Y_col;
    }
    
    // O -= (length(q2) + 0.2) * FC; // Remove vignetting for full screen
    O = tanh_approx(O);
    O = max(O, 0.0);
    O = sqrt(O);
    
    return vec4(O, 1.0);
  `
})
