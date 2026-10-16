import { Renderer, Program, Mesh, Triangle, Color, Vec2 } from 'ogl';
import { useEffect, useRef } from 'react';

import './FloatingLines.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform float enableTop;
uniform float enableMiddle;
uniform float enableBottom;

uniform float topLineCount;
uniform float middleLineCount;
uniform float bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform float interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform float parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform float lineGradientCount;

out vec4 fragColor;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0.5) {
    return baseColor;
  }

  vec3 gradientColor;
  int count = int(lineGradientCount + 0.5);

  if (count == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(count - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, count - 1);
    gradientColor = mix(lineGradient[idx], lineGradient[idx2], f);
  }

  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax > 0.5) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0.5 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  bool shouldBend = interactive > 0.5;
  if (shouldBend) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom > 0.5) {
    int count = int(bottomLineCount + 0.5);
    for (int i = 0; i < 32; ++i) {
      if (i >= count) break;
      float fi = float(i);
      float t = fi / max(float(count - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        shouldBend
      ) * 0.2;
    }
  }

  if (enableMiddle > 0.5) {
    int count = int(middleLineCount + 0.5);
    for (int i = 0; i < 32; ++i) {
      if (i >= count) break;
      float fi = float(i);
      float t = fi / max(float(count - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        shouldBend
      );
    }
  }

  if (enableTop > 0.5) {
    int count = int(topLineCount + 0.5);
    for (int i = 0; i < 32; ++i) {
      if (i >= count) break;
      float fi = float(i);
      float t = fi / max(float(count - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        shouldBend
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}
`;

const MAX_GRADIENT_STOPS = 8;

type WaveType = 'top' | 'middle' | 'bottom';
type WavePosition = { x?: number; y?: number; rotate?: number };

function normalizeWaves(enabledWaves: string | WaveType[]): WaveType[] {
  const list = Array.isArray(enabledWaves)
    ? enabledWaves
    : String(enabledWaves).split(',').map((s) => s.trim());
  return list.filter((w): w is WaveType => w === 'top' || w === 'middle' || w === 'bottom');
}

function hexToRgb(hex: string): [number, number, number] {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
}

function emptyGradient(): [number, number, number][] {
  return Array.from({ length: MAX_GRADIENT_STOPS }, () => [1, 1, 1] as [number, number, number]);
}

export interface FloatingLinesProps {
  linesGradient?: string[];
  gradientStart?: string;
  gradientMid?: string;
  gradientEnd?: string;
  enabledWaves?: string | WaveType[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
}

export default function FloatingLines({
  linesGradient,
  gradientStart,
  gradientMid,
  gradientEnd,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 6,
  lineDistance = 5,
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const waves = normalizeWaves(enabledWaves);
  const gradient =
    linesGradient && linesGradient.length > 0
      ? linesGradient
      : [gradientStart, gradientMid, gradientEnd].filter(Boolean) as string[];

  const getLineCount = (waveType: WaveType) => {
    if (typeof lineCount === 'number') return lineCount;
    if (!waves.includes(waveType)) return 0;
    const index = waves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType: WaveType) => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!waves.includes(waveType)) return 0.1;
    const index = waves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = waves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = waves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = waves.includes('bottom') ? getLineCount('bottom') : 0;

  const topLineDistance = waves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDistance = waves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = waves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const targetMouse = new Vec2(-1000, -1000);
    const currentMouse = new Vec2(-1000, -1000);
    let targetInfluence = 0;
    let currentInfluence = 0;
    const targetParallax = new Vec2(0, 0);
    const currentParallax = new Vec2(0, 0);

    const renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    const gradientValue = emptyGradient();
    let gradientCount = 0;
    if (gradient.length > 0) {
      const stops = gradient.slice(0, MAX_GRADIENT_STOPS);
      gradientCount = stops.length;
      stops.forEach((hex, i) => {
        gradientValue[i] = hexToRgb(hex);
      });
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [1, 1, 1] },
        animationSpeed: { value: animationSpeed },
        enableTop: { value: waves.includes('top') ? 1 : 0 },
        enableMiddle: { value: waves.includes('middle') ? 1 : 0 },
        enableBottom: { value: waves.includes('bottom') ? 1 : 0 },
        topLineCount: { value: topLineCount },
        middleLineCount: { value: middleLineCount },
        bottomLineCount: { value: bottomLineCount },
        topLineDistance: { value: topLineDistance },
        middleLineDistance: { value: middleLineDistance },
        bottomLineDistance: { value: bottomLineDistance },
        topWavePosition: {
          value: [topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4],
        },
        middleWavePosition: {
          value: [
            middleWavePosition?.x ?? 5.0,
            middleWavePosition?.y ?? 0.0,
            middleWavePosition?.rotate ?? 0.2,
          ],
        },
        bottomWavePosition: {
          value: [
            bottomWavePosition?.x ?? 2.0,
            bottomWavePosition?.y ?? -0.7,
            bottomWavePosition?.rotate ?? 0.4,
          ],
        },
        iMouse: { value: [-1000, -1000] },
        interactive: { value: interactive ? 1 : 0 },
        bendRadius: { value: bendRadius },
        bendStrength: { value: bendStrength },
        bendInfluence: { value: 0 },
        parallax: { value: parallax ? 1 : 0 },
        parallaxStrength: { value: parallaxStrength },
        parallaxOffset: { value: [0, 0] },
        lineGradient: { value: gradientValue },
        lineGradientCount: { value: gradientCount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, 1];
    };
    setSize();

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (!active) return;
            setSize();
          })
        : null;
    if (ro) ro.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.dpr;
      targetMouse.set(x * dpr, (rect.height - y) * dpr);
      targetInfluence = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallax.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluence = 0.0;
    };

    if (interactive) {
      // window-level so the bg can stay pointer-events: none over page UI
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', handlePointerLeave);
    }

    let raf = 0;
    const start = performance.now();
    const renderLoop = (now: number) => {
      if (!active) return;
      program.uniforms.iTime.value = (now - start) * 0.001;

      if (interactive) {
        currentMouse.lerp(targetMouse, mouseDamping);
        program.uniforms.iMouse.value = [currentMouse.x, currentMouse.y];
        currentInfluence += (targetInfluence - currentInfluence) * mouseDamping;
        program.uniforms.bendInfluence.value = currentInfluence;
      }

      if (parallax) {
        currentParallax.lerp(targetParallax, mouseDamping);
        program.uniforms.parallaxOffset.value = [currentParallax.x, currentParallax.y];
      }

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(renderLoop);
    };
    raf = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    gradient.join('|'),
    waves.join('|'),
    topLineCount,
    middleLineCount,
    bottomLineCount,
    topLineDistance,
    middleLineDistance,
    bottomLineDistance,
    topWavePosition?.x,
    topWavePosition?.y,
    topWavePosition?.rotate,
    middleWavePosition?.x,
    middleWavePosition?.y,
    middleWavePosition?.rotate,
    bottomWavePosition?.x,
    bottomWavePosition?.y,
    bottomWavePosition?.rotate,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className="floating-lines-container"
      style={{ mixBlendMode }}
    />
  );
}
