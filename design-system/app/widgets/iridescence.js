/* Iridescence deco background — vanilla WebGL */
const IRIDESCENCE_VERTEX = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const IRIDESCENCE_FRAGMENT = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Iridescence shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createIridescenceProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, IRIDESCENCE_VERTEX);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, IRIDESCENCE_FRAGMENT);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Iridescence program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function destroyIridescence(ctn) {
  if (!ctn) return;
  if (typeof ctn._iridescenceCleanup === 'function') ctn._iridescenceCleanup();
  delete ctn._iridescenceCleanup;
  delete ctn.dataset.iridescenceInit;
}

function initSingleIridescence(ctn) {
  if (!ctn || ctn.dataset.iridescenceInit) return;

  const color = [0.06274509803921569, 0.7254901960784313, 0.5058823529411764];
  const amplitude = 0.1;
  const speed = 1;
  const mouseReact = true;
  const mousePos = { x: 0.5, y: 0.5 };

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  ctn.appendChild(canvas);

  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) return;

  const program = createIridescenceProgram(gl);
  if (!program) return;

  ctn.dataset.iridescenceInit = '1';

  const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  const uvLoc = gl.getAttribLocation(program, 'uv');
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    uTime: gl.getUniformLocation(program, 'uTime'),
    uColor: gl.getUniformLocation(program, 'uColor'),
    uResolution: gl.getUniformLocation(program, 'uResolution'),
    uMouse: gl.getUniformLocation(program, 'uMouse'),
    uAmplitude: gl.getUniformLocation(program, 'uAmplitude'),
    uSpeed: gl.getUniformLocation(program, 'uSpeed')
  };

  gl.useProgram(program);
  gl.uniform3fv(uniforms.uColor, color);
  gl.uniform1f(uniforms.uAmplitude, amplitude);
  gl.uniform1f(uniforms.uSpeed, speed);
  gl.uniform2f(uniforms.uMouse, mousePos.x, mousePos.y);
  gl.clearColor(1, 1, 1, 1);

  function resize() {
    const w = ctn.offsetWidth;
    const h = ctn.offsetHeight;
    if (!w || !h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform3f(uniforms.uResolution, w, h, w / h);
  }

  function handleMouseMove(e) {
    const rect = ctn.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    mousePos.x = x;
    mousePos.y = y;
    gl.uniform2f(uniforms.uMouse, x, y);
  }

  let animateId;
  let running = false;

  function update(t) {
    if (!running) return;
    animateId = requestAnimationFrame(update);
    gl.uniform1f(uniforms.uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    animateId = requestAnimationFrame(update);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(animateId);
  }

  resize();
  start();
  window.addEventListener('resize', resize, false);
  if (mouseReact) ctn.addEventListener('mousemove', handleMouseMove);

  const ro = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => resize())
    : null;
  if (ro) ro.observe(ctn);

  ctn._iridescenceCleanup = () => {
    stop();
    window.removeEventListener('resize', resize);
    if (mouseReact) ctn.removeEventListener('mousemove', handleMouseMove);
    if (ro) ro.disconnect();
    if (canvas.parentNode === ctn) ctn.removeChild(canvas);
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  };
}

function initIridescence(scope) {
  (scope || document).querySelectorAll('[data-iridescence]').forEach(initSingleIridescence);
}

function managePageIridescence() {
  document.querySelectorAll('[data-iridescence]').forEach(ctn => {
    const page = ctn.closest('.page');
    if (!page?.classList.contains('active')) destroyIridescence(ctn);
  });
  const active = document.querySelector('.page.active');
  if (active) initIridescence(active);
}
