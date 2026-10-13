import { useEffect, useRef, memo } from 'react'

const COLOR_CACHE = new Map()

function parseColor(input, fallback) {
  if (typeof input !== 'string') return fallback
  let hit = COLOR_CACHE.get(input)
  if (hit === undefined) {
    hit = parseColorRaw(input)
    COLOR_CACHE.set(input, hit)
  }
  return hit ?? fallback
}

function parseColorRaw(raw) {
  let s = raw.trim()
  const v = /^var\(\s*--[^,]+,\s*(.+)\)$/.exec(s)
  if (v) s = v[1].trim()
  if (s[0] === '#') {
    const h = s.slice(1)
    const x = (a) => parseInt(a, 16)
    let r, g, b, a = 255
    if (h.length === 3 || h.length === 4) {
      r = x(h[0] + h[0])
      g = x(h[1] + h[1])
      b = x(h[2] + h[2])
      if (h.length === 4) a = x(h[3] + h[3])
    } else if (h.length === 6 || h.length === 8) {
      r = x(h.slice(0, 2))
      g = x(h.slice(2, 4))
      b = x(h.slice(4, 6))
      if (h.length === 8) a = x(h.slice(6, 8))
    } else return null
    const out = [r / 255, g / 255, b / 255, a / 255]
    return out.every(Number.isFinite) ? out : null
  }
  const m = /^(rgba?|hsla?)\(([^)]*)\)$/i.exec(s)
  if (!m) return null
  const parts = m[2].split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3) return null
  const numVal = (p, scale) =>
    p.endsWith('%') ? (parseFloat(p) / 100) * scale : parseFloat(p)
  const alpha = parts.length > 3 ? numVal(parts[3], 1) : 1
  let rgb
  if (m[1].toLowerCase().startsWith('rgb')) {
    rgb = [
      numVal(parts[0], 255) / 255,
      numVal(parts[1], 255) / 255,
      numVal(parts[2], 255) / 255,
    ]
  } else {
    const hh = (((parseFloat(parts[0]) % 360) + 360) % 360) / 360
    const ss = numVal(parts[1], 1)
    const ll = numVal(parts[2], 1)
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss
    const p = 2 * ll - q
    const f = (t) => {
      t = (t + 1) % 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    rgb = [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)]
  }
  const out = [rgb[0], rgb[1], rgb[2], alpha]
  return out.every(Number.isFinite)
    ? out.map((c) => Math.min(1, Math.max(0, c)))
    : null
}

function num(v, d) {
  return typeof v === 'number' && Number.isFinite(v) ? v : d
}

const ADVANCED_DEFAULTS = {
  envPeriodMs: 4500,
  envFloor: 20,
  crestDrift: 6,
  twistSpeed: 40,
  swaySpeed: 52,
  humps: 100,
  r1Y: 58,
  r1Amp: 16,
  r1Thick: 14,
  r2Y: 66,
  r2Amp: 10,
  r2Thick: 8,
  r2Gain: 70,
  r3Y: 55,
  r3Amp: 13,
  r3Thick: 24,
  r3Gain: 35,
  lineWidth: 120,
  lineAlpha: 45,
  exposure: 100,
  edgeFade: 60,
  curl: 4,
  fill: 12,
  glowRadius: 6,
  twistBias: 30,
  hoverLift: 5,
  seed: 0,
  glowAmount: 50,
}

function effectUniforms(gl, u, p) {
  const adv = { ...ADVANCED_DEFAULTS, ...(p.advanced ?? {}) }
  const A = (k) => num(adv[k], ADVANCED_DEFAULTS[k])
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
  const f = (name, v) => {
    const loc = u(name)
    if (loc) gl.uniform1f(loc, v)
  }
  const deg = Math.PI / 180
  const dpr =
    typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1

  f('uAmp', clamp(num(p.amplitude, 50), 0, 100) / 50)
  const uLinesLoc = u('uLines')
  if (uLinesLoc) {
    gl.uniform1i(uLinesLoc, Math.round(clamp(num(p.lines, 48), 2, 128)))
  }
  f('uGlow', clamp(A('glowAmount'), 0, 100) / 50)
  f('uDirAngle', num(p.direction, 0) * deg)
  f('uDpr', dpr)

  f('uEnvPeriod', Math.max(100, A('envPeriodMs')) / 1000)
  f('uEnvMin', clamp(A('envFloor'), 0, 100) / 100)
  f('uDrift', A('crestDrift') * deg)
  f('uTwist', A('twistSpeed') * deg)
  f('uSway', A('swaySpeed') * deg)
  f('uFreq', Math.max(10, A('humps')) / 100)
  f('uLineW', Math.max(10, A('lineWidth')) / 100)
  f('uLineA', clamp(A('lineAlpha'), 0, 100) / 100)
  f('uExposure', (3.2 * Math.max(0, A('exposure'))) / 100)
  f('uEdgeFade', clamp(A('edgeFade'), 0, 100) / 100)
  f('uCurl', A('curl') / 100)
  f('uFill', Math.max(0, A('fill')) / 100)
  f('uGlowR', Math.max(0.5, A('glowRadius')) / 100)
  f('uBias', clamp(A('twistBias'), 0, 200) / 100)
  f('uHoverLift', A('hoverLift') / 100)
  f('uSeed', A('seed') * deg)

  const uR0 = u('uR0')
  if (uR0) {
    gl.uniform4f(uR0, A('r1Y') / 100, A('r1Amp') / 100, A('r1Thick') / 100, 1)
  }
  const uR1 = u('uR1')
  if (uR1) {
    gl.uniform4f(
      uR1,
      A('r2Y') / 100,
      A('r2Amp') / 100,
      A('r2Thick') / 100,
      Math.max(0, A('r2Gain')) / 100
    )
  }
  const uR2 = u('uR2')
  if (uR2) {
    gl.uniform4f(
      uR2,
      A('r3Y') / 100,
      A('r3Amp') / 100,
      A('r3Thick') / 100,
      Math.max(0, A('r3Gain')) / 100
    )
  }
}

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uScale;
uniform float uAmp;
uniform int uLines;
uniform float uGlow;
uniform float uDpr;
uniform float uEnvPeriod;
uniform float uEnvMin;
uniform float uDrift;
uniform float uTwist;
uniform float uSway;
uniform float uFreq;
uniform float uLineW;
uniform float uLineA;
uniform float uExposure;
uniform float uEdgeFade;
uniform float uCurl;
uniform float uFill;
uniform float uGlowR;
uniform float uBias;
uniform float uHoverLift;
uniform float uSeed;
uniform float uDirAngle;
uniform vec4 uR0;
uniform vec4 uR1;
uniform vec4 uR2;
out vec4 outColor;
const float PI = 3.14159265;

float ribbon(float X, float py, float t, float env, vec4 R, float ph, float om, float w, float lift, out float glow) {
    ph += uSeed;
    float amp = R.y * uAmp;
    float a = sin(PI * X - uDrift * om * t + ph);
    float b = sin(2.0 * PI * 0.65 * X + uSway * om * t + ph * 1.7);
    float c = sin(2.0 * PI * 1.35 * X - 0.6 * uSway * om * t + ph * 2.3);
    float cy = R.x - env * amp * (0.8 * a + 0.28 * b + 0.14 * c) - lift;
    float tw = sin(2.0 * PI * 0.8 * X - uTwist * om * t + ph - 0.94);
    float th = R.z * mix(1.0, env, 0.45) * (uBias + tw) / max(1.0 + uBias, 1e-4);
    float cu = uCurl * sin(2.0 * PI * 1.7 * X + 0.8 * uSway * om * t + ph * 0.7);

    float d0 = py - cy;
    float half_ = 0.5 * abs(th);
    float I = 0.0;
    if (abs(d0) < half_ + abs(cu) * 0.7 + 4.0 * w) {
        float n = float(max(uLines, 2));
        float w2 = max(w * w, 1e-10);
        for (int j = 0; j < 128; j++) {
            if (j >= uLines) break;
            float s = float(j) / max(n - 1.0, 1.0) - 0.5;
            float d = d0 - s * th - cu * (s * s - 0.0833) * 4.0;
            float k = 1.0 - uEdgeFade * (s + 0.5);
            I += k * exp(-d * d / w2);
        }
        I *= uLineA;
    }
    float inside = 1.0 - smoothstep(half_, half_ + 2.0 * w, abs(d0));
    I += uFill * inside;
    float dd = max(abs(d0) - half_, 0.0) / max(uGlowR, 1e-4);
    glow = exp(-dd * dd) * R.w;
    return I * R.w;
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    float H = max(uRes.y, 1.0);
    float x = fc.x / max(uRes.x, 1.0);
    float py0 = 1.0 - fc.y / H;
    float aspect = uRes.x / H;
    float ca = cos(uDirAngle);
    float sa = sin(uDirAngle);
    float dx = x - 0.5;
    float dy = py0 - 0.5;
    float X = (dx * ca - dy * sa) * uFreq / max(uScale, 0.05) + 0.5;
    float py = (dx * sa + dy * ca) + 0.5;
    float t = uTime;
    float env = mix(uEnvMin, 1.0, 0.5 + 0.5 * cos(2.0 * PI * t / max(uEnvPeriod, 0.1)));
    float w = max(0.6 * uLineW * uDpr / H, 0.5 / H);
    float mdx = (x - uMouse.x) * aspect;
    float lift = uHover * uHoverLift * exp(-mdx * mdx * 6.0);

    float g0, g1, g2;
    float I = ribbon(X, py, t, env, uR2, 0.5, 0.73, w, lift * 0.6, g2);
    I += ribbon(X, py, t, env, uR1, 2.4, 1.37, w, lift * 0.8, g1);
    I += ribbon(X, py, t, env, uR0, 0.0, 1.0, w, lift, g0);
    I += uGlow * 0.035 * (g0 + g1 + g2);

    float v = 1.0 - exp(-max(I, 0.0) * uExposure);
    vec3 c1 = uBase * vec3(0.16, 0.16, 0.24);
    vec3 c2 = uBase * vec3(0.40, 0.40, 0.62);
    vec3 c3 = uBase * vec3(0.61, 0.60, 0.81);
    vec3 col = mix(uBg, c1, smoothstep(0.0, 0.12, v));
    col = mix(col, c2, smoothstep(0.12, 0.3, v));
    col = mix(col, c3, smoothstep(0.3, 0.5, v));
    col = mix(col, uBase, smoothstep(0.5, 0.72, v));
    col = mix(col, uAccent, smoothstep(0.72, 1.0, v));
    outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

const __originkitPresetProps = {
  advanced: {
    r1Y: 58,
    r2Y: 66,
    r3Y: 55,
    curl: 4,
    fill: 12,
    seed: 0,
    humps: 100,
    r1Amp: 16,
    r2Amp: 10,
    r3Amp: 13,
    r2Gain: 70,
    r3Gain: 35,
    r1Thick: 14,
    r2Thick: 8,
    r3Thick: 24,
    edgeFade: 60,
    envFloor: 20,
    exposure: 100,
    hoverLift: 5,
    lineAlpha: 45,
    lineWidth: 120,
    swaySpeed: 52,
    twistBias: 30,
    crestDrift: 6,
    glowRadius: 6,
    twistSpeed: 40,
    envPeriodMs: 4500,
  },
}

function __OriginkitBase_WAVEES(props) {
  const {
    background = '#000000',
    baseColor = '#A96CFF',
    accentColor = '#3DFF00',
    speed = 50,
    scale = 300,
    hover = 200,
    style,
    className,
  } = props

  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
    })
    if (!gl) return
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const sh = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('WAVEES shader:', gl.getShaderInfoLog(s))
      }
      return s
    }
    const prog = gl.createProgram()
    const vShader = sh(gl.VERTEX_SHADER, VERT)
    const fShader = sh(gl.FRAGMENT_SHADER, FRAG)
    gl.attachShader(prog, vShader)
    gl.attachShader(prog, fShader)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('WAVEES link:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const cache = new Map()
    const u = (name) => {
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(prog, name))
      return cache.get(name) ?? null
    }

    let W = 0
    let H = 0
    const resize = () => {
      W = root.offsetWidth
      H = root.offsetHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
    }
    const ro = new ResizeObserver(resize)
    ro.observe(root)
    resize()

    let mx = 0.5
    let my = 0.5
    let tx = 0.5
    let ty = 0.5
    let over = 0
    let hov = 0

    const onMove = (e) => {
      if (W <= 0 || H <= 0) return
      const rect = canvas.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        tx = (e.clientX - rect.left) / W
        ty = 1 - (e.clientY - rect.top) / H
        over = 1
      } else {
        over = 0
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    let clock = 0
    let raf = 0
    let last = -1
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20)
      last = now
      const p = propsRef.current
      clock =
        (clock +
          dt *
            (Math.max(0, Math.min(100, num(p.speed, 50))) / 50) *
            (reduced ? 0.25 : 1)) %
        3600
      const k = 1 - Math.exp(-dt * 6)
      mx += (tx - mx) * k
      my += (ty - my) * k
      hov += (over - hov) * k
      const bg = parseColor(p.background, [0.03, 0.03, 0.04, 1])
      const base = parseColor(p.baseColor, [0.23, 0.18, 0.55, 1])
      const acc = parseColor(p.accentColor, [0.91, 0.42, 0.57, 1])
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u('uRes'), canvas.width, canvas.height)
      gl.uniform1f(u('uTime'), clock)
      gl.uniform2f(u('uMouse'), mx, my)
      gl.uniform1f(
        u('uHover'),
        hov * (Math.max(0, Math.min(200, num(p.hover, 100))) / 100)
      )
      gl.uniform3f(u('uBg'), bg[0], bg[1], bg[2])
      gl.uniform3f(u('uBase'), base[0], base[1], base[2])
      gl.uniform3f(u('uAccent'), acc[0], acc[1], acc[2])
      gl.uniform1f(
        u('uScale'),
        Math.max(10, Math.min(300, num(p.scale, 100))) / 100
      )
      effectUniforms(gl, u, p)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vShader)
      gl.deleteShader(fShader)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function WaveRibbons(props) {
  return <__OriginkitBase_WAVEES {...__originkitPresetProps} {...props} />
}

export default memo(WaveRibbons)
export { WaveRibbons, WaveRibbons as WAVEES }
