import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

import './CircularGallery.css';

function debounce(func: any, wait: number) {
  let timeout: any;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

const DEFAULT_FONT = '600 28px Inter, system-ui, sans-serif';
const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';

function deriveFontFamilyFromUrl(url: string) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

async function loadFontFromStylesheet(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family: string | null = null;
  const fontFaces: FontFace[] = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors: any = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      (document as any).fonts.add(face);
    })
  );
  return family;
}

async function loadFontFromFile(url: string) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  (document as any).fonts.add(fontFace);
  return family;
}

async function loadCustomFont(fontUrl: string) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

async function resolveFont(font: string, fontUrl?: string) {
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);
  // Prefer page fonts. Fetching Google Fonts CSS via FontFace often returns a
  // Latin-only subset and makes Cyrillic gallery titles invisible.
  if (!effectiveUrl || /family=Inter/i.test(effectiveUrl)) {
    if ((document as any).fonts && (document as any).fonts.load) {
      try {
        await (document as any).fonts.load(
          font,
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя'
        );
        await (document as any).fonts.ready;
      } catch {}
    }
    return font;
  }
  try {
    const family = await loadCustomFont(effectiveUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px';
    const resolved = `${prefix} "${family}"`;
    if ((document as any).fonts && (document as any).fonts.load) {
      try {
        await (document as any).fonts.load(
          resolved,
          'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя'
        );
      } catch {}
    }
    return resolved;
  } catch (error) {
    console.error('CircularGallery: unable to load font from', fontUrl, error);
    return font;
  }
}

function getFontSize(font: string) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function deriveCaptionFont(font: string) {
  const size = Math.max(12, Math.round(getFontSize(font) * 0.7));
  return font
    .replace(/(\d+)px/, `${size}px`)
    .replace(/^(italic\s+)?(bold|[6-9]00)\s+/i, '$1400 ');
}

function colorWithAlpha(color: string, alpha: number) {
  const hex = String(color || '').trim();
  const short = /^#([0-9a-f]{3})$/i.exec(hex);
  const full = /^#([0-9a-f]{6})$/i.exec(hex);
  let r = 255, g = 255, b = 255;
  if (short) {
    r = parseInt(short[1][0] + short[1][0], 16);
    g = parseInt(short[1][1] + short[1][1], 16);
    b = parseInt(short[1][2] + short[1][2], 16);
  } else if (full) {
    r = parseInt(full[1].slice(0, 2), 16);
    g = parseInt(full[1].slice(2, 4), 16);
    b = parseInt(full[1].slice(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function wrapCaption(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = String(text).trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function createTextTexture(gl: any, text: string, font = 'bold 30px monospace', color = 'black', wrapWidth = 0) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = getFontSize(font);
  const lineH = Math.ceil(fontSize * 1.12);

  context.font = font;
  const lines = wrapWidth > 0 ? wrapCaption(context, text, wrapWidth) : [String(text || '')];
  let contentW = 0;
  for (const line of lines) {
    contentW = Math.max(contentW, Math.ceil(context.measureText(line).width));
  }
  const contentH = Math.max(lineH, lines.length * lineH);
  canvas.width = Math.max(1, (contentW + 24) * dpr);
  canvas.height = Math.max(1, (contentH + 8) * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.font = font;
  context.fillStyle = color;
  const cx = canvas.width / (2 * dpr);
  lines.forEach((line, i) => {
    context.fillText(line, cx, 4 + i * lineH);
  });

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return {
    texture,
    width: canvas.width / dpr,
    height: canvas.height / dpr,
    fontPx: fontSize,
    lineH,
    lineCount: lines.length
  };
}

class Title {
  gl: any; plane: any; renderer: any; text: string; textColor: string; font: string; kind: string;
  wrapWidth: number; mesh: any; textureAspect!: number; textureHeight!: number; fontPx!: number;
  lineH = 16; lineCount = 1;
  worldH = 0; localBottom = 0;
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif', kind = 'title', wrapWidth = 0 }: any) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.kind = kind;
    this.wrapWidth = wrapWidth;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height, fontPx, lineH, lineCount } = createTextTexture(
      this.gl, this.text, this.font, this.textColor, this.wrapWidth
    );
    this.fontPx = fontPx;
    this.lineH = lineH;
    this.lineCount = lineCount;
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.textureAspect = width / height;
    this.textureHeight = height;
    this.layout();
    this.mesh.setParent(this.plane);
  }
  layout(anchorBelow = 0) {
    if (!this.mesh || !this.plane) return;
    const sx = Math.max(this.plane.scale.x, 0.001);
    const sy = Math.max(this.plane.scale.y, 0.001);
    const worldFontH = this.kind === 'caption' ? sy * 0.05 : sy * 0.078;
    const lineH = Math.max(this.lineH || this.fontPx || 16, 1);
    const textureWidth = this.textureAspect * this.textureHeight;
    const worldTextW = worldFontH * 1.12 / lineH * textureWidth;
    const worldTextH = worldFontH * 1.12 / lineH * this.textureHeight;
    this.mesh.scale.set(worldTextW / sx, worldTextH / sy, 1);
    const localTextH = worldTextH / sy;
    const gap = this.kind === 'caption' ? 0.012 : 0.02;
    this.mesh.position.set(0, -0.5 - anchorBelow - gap - localTextH * 0.5, 0.02);
    this.worldH = worldTextH;
    this.localBottom = anchorBelow + gap + localTextH;
  }
}

const CARD_WIDTH_PX = 494;
const CARD_HEIGHT_PX = 299;
const CARD_GAP_PX = 24;

function getCardSizePx(_screen: { width: number; height: number }) {
  return { width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX };
}

class Media {
  extra: number; geometry: any; gl: any; image: string; index: number; length: number;
  renderer: any; scene: any; screen: any; text: string; caption: string; viewport: any; bend: number;
  textColor: string; borderRadius: number; font: string; program: any; plane: any;
  title: any; subtitle: any; scale!: number; padding!: number; width!: number; widthTotal!: number;
  x!: number; speed!: number; isBefore!: boolean; isAfter!: boolean;
  constructor({
    geometry, gl, image, index, length, renderer, scene, screen, text, caption, viewport,
    bend, textColor, borderRadius = 0, font
  }: any) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.caption = caption || '';
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.onResize();
    this.createTitle();
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          // Aspect-correct radius so corners are circular in screen space
          float minDim = min(uPlaneSizes.x, uPlaneSizes.y);
          vec2 aspect = minDim > 0.0 ? uPlaneSizes / minDim : vec2(1.0);
          vec2 p = (vUv - 0.5) * aspect;
          vec2 halfSize = 0.5 * aspect;
          float r = min(uBorderRadius, min(halfSize.x, halfSize.y));
          float d = roundedBoxSDF(p, halfSize - r, r);
          float edgeSmooth = 0.0025;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          if (uImageSizes.x < 1.0 || uImageSizes.y < 1.0) {
            gl_FragColor = vec4(0.18, 0.14, 0.24, alpha);
            return;
          }

          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.onerror = () => {
      console.error('CircularGallery: failed to load image', this.image);
      this.program.uniforms.uImageSizes.value = [1, 1];
    };
    img.src = this.image;
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    if (this.title?.mesh) this.title.mesh.setParent(null);
    if (this.subtitle?.mesh) this.subtitle.mesh.setParent(null);
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
      kind: 'title',
      wrapWidth: 280
    });
    this.subtitle = this.caption
      ? new Title({
          gl: this.gl,
          plane: this.plane,
          renderer: this.renderer,
          text: this.caption,
          textColor: '#ffffff',
          font: deriveCaptionFont(this.font),
          kind: 'caption',
          wrapWidth: 280
        })
      : null;
    this.layoutLabels();
  }
  layoutLabels() {
    if (this.title) this.title.layout(0);
    if (this.subtitle) this.subtitle.layout(this.title?.localBottom || 0);
  }
  update(scroll: any, direction: string | null) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    let y = 0;
    if (this.bend === 0) {
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }
    const sy = this.plane.scale.y;
    const reservedTextH = sy * (0.078 * 1.12 * 2 + 0.02 + 0.05 * 1.12 * 2 + 0.012);
    const bottom = sy / 2 + reservedTextH + sy * 0.04;
    const limit = this.viewport.height / 2 * 0.92;
    this.plane.position.y = y + Math.max(0, bottom - limit);

    this.speed = scroll.current - scroll.last;

    if (!direction || !Number.isFinite(this.widthTotal) || this.widthTotal === 0) return;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport }: any = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    if (!this.screen?.width || !this.screen?.height || !this.viewport?.width || !this.viewport?.height) {
      return;
    }
    this.plane.scale.x = (CARD_WIDTH_PX / this.screen.width) * this.viewport.width;
    this.plane.scale.y = (CARD_HEIGHT_PX / this.screen.height) * this.viewport.height;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = (CARD_GAP_PX / this.screen.width) * this.viewport.width;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
    if (!Number.isFinite(this.extra)) this.extra = 0;
    this.layoutLabels();
  }
}

class App {
  container: HTMLElement; scrollSpeed: number; scroll: any; onCheckDebounce: any;
  renderer: any; gl: any; camera: any; scene: any; screen: any; viewport: any;
  planeGeometry: any; mediasImages: any[] = []; medias: Media[] = []; isDown = false;
  start = 0; raf = 0; onClick?: (index: number) => void;
  boundOnResize: any; boundOnTouchDown: any; boundOnTouchMove: any;
  boundOnTouchUp: any;   boundOnKeyDown: any; boundOnClick: any;
  dragDistance = 0;
  initialCentered = false;
  resizeObserver?: ResizeObserver;

  constructor(
    container: HTMLElement,
    {
      items, bend, textColor = '#ffffff', borderRadius = 0,
      font = '600 28px Inter, system-ui, sans-serif', scrollSpeed = 2, scrollEase = 0.05, onClick
    }: any = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.initialCentered = false;
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 400);
    this.onClick = onClick;
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.centerOnMiddle();
    this.update();
    this.addEventListeners();

    requestAnimationFrame(() => this.onResize());
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
  }
  centerOnMiddle() {
    if (this.initialCentered || !this.medias?.length) return;
    const width = this.medias[0]?.width;
    if (!width || !Number.isFinite(width)) return;
    const uniqueCount = Math.max(1, Math.round(this.mediasImages.length / 2));
    const middleIndex = Math.floor(uniqueCount / 2);
    const start = width * middleIndex;
    this.scroll.current = start;
    this.scroll.target = start;
    this.scroll.last = start;
    this.initialCentered = true;
  }
  createRenderer() {
    const canvas = document.createElement('canvas');
    canvas.className = 'circular-gallery-canvas';
    this.renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50, widthSegments: 100
    });
  }
  createMedias(items: any[], bend = 1, textColor: string, borderRadius: number, font: string) {
    const galleryItems = items && items.length ? items : [];
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry, gl: this.gl, image: data.image,
        index, length: this.mediasImages.length, renderer: this.renderer,
        scene: this.scene, screen: this.screen, text: data.text, caption: data.caption,
        viewport: this.viewport, bend, textColor, borderRadius, font
      });
    });
  }
  onTouchDown(e: any) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.dragDistance = 0;
  }
  onTouchMove(e: any) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const worldPerPx =
      this.screen?.width > 0 && this.viewport?.width
        ? this.viewport.width / this.screen.width
        : 0.05;
    const distance = (this.start - x) * worldPerPx * this.scrollSpeed;
    this.dragDistance = Math.abs(this.start - x);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onClickHandler(e: MouseEvent) {
    if (this.dragDistance > 5) return;
    const rect = this.gl.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Convert to viewport coordinates
    const ndcX = (x / rect.width) * 2 - 1;
    const ndcY = -((y / rect.height) * 2 - 1);
    const worldX = ndcX * (this.viewport.width / 2);
    const worldY = ndcY * (this.viewport.height / 2);
    // Find nearest media
    let closest: Media | null = null;
    let closestDist = Infinity;
    for (const m of this.medias) {
      const dx = m.plane.position.x - worldX;
      const dy = m.plane.position.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist && Math.abs(dx) < m.plane.scale.x / 2 && Math.abs(dy) < m.plane.scale.y / 2 + 1) {
        closestDist = dist;
        closest = m;
      }
    }
    if (closest && this.onClick) {
      const originalLen = this.mediasImages.length / 2;
      this.onClick(closest.index % originalLen);
    }
  }
  onKeyDown(e: KeyboardEvent) {
    const step = this.medias?.[0]?.width || this.scrollSpeed * 5;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += step;
        this.onCheckDebounce();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= step;
        this.onCheckDebounce();
        break;
      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;
    }
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    if (!width || !Number.isFinite(width)) return;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    if (!this.screen.width || !this.screen.height) return;
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
    this.centerOnMiddle();
  }
  update() {
    const delta = this.scroll.target - this.scroll.current;
    if (Math.abs(delta) < 0.001) {
      this.scroll.current = this.scroll.target;
    } else {
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    }
    const direction =
      this.scroll.current > this.scroll.last
        ? 'right'
        : this.scroll.current < this.scroll.last
          ? 'left'
          : null;
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    this.boundOnClick = this.onClickHandler.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    this.gl.canvas.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    this.gl.canvas.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp);
    this.gl.canvas.addEventListener('click', this.boundOnClick);
    this.container?.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    window.removeEventListener('resize', this.boundOnResize);
    if (this.gl && this.gl.canvas) {
      this.gl.canvas.removeEventListener('mousedown', this.boundOnTouchDown);
      this.gl.canvas.removeEventListener('touchstart', this.boundOnTouchDown);
      this.gl.canvas.removeEventListener('click', this.boundOnClick);
    }
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
    if (this.container) {
      this.container.removeEventListener('keydown', this.boundOnKeyDown);
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string; caption?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  onItemClick?: (index: number) => void;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.08,
  font = '600 28px Inter, system-ui, sans-serif',
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05,
  onItemClick
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    let app: App | undefined;
    let isMounted = true;

    app = new App(containerRef.current, {
      items, bend, textColor, borderRadius,
      font, scrollSpeed, scrollEase,
      onClick: onItemClick
    });

    resolveFont(font, fontUrl)
      .then(resolvedFont => {
        if (!isMounted || !app?.medias) return;
        app.medias.forEach(media => {
          media.font = resolvedFont;
          media.createTitle();
        });
      })
      .catch(error => console.error('CircularGallery: font load failed', error));

    return () => {
      isMounted = false;
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase, onItemClick]);
  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery."
    />
  );
}
