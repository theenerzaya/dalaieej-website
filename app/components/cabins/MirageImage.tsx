/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * MirageImage
 * ─────────────────────────────────────────────────────────────────────────────
 * A faithful port of Hoteller's `distortion_grid` hover effect — a WebGL
 * liquid/mirage crossfade between two images driven by an animated
 * displacement map.
 *
 * How it works (vanilla WebGL, ~150 LOC, no pixi.js):
 *   • A full-bleed quad is rendered with a fragment shader that samples two
 *     image textures. The shader reads a displacement map and offsets the UVs
 *     by (map.xy - 0.5) * intensity * progress for each image, in opposite
 *     directions, then blends between them by `progress`.
 *   • `progress` is animated 0 → 1 on pointer enter and back on leave with an
 *     eased rAF loop (configurable speed in/out, matching Hoteller's defaults).
 *   • The displacement map is generated on the fly from a <canvas> with soft
 *     radial gradients — no asset dependency, stable across locales, and
 *     unique per instance for organic variation.
 *
 * Fallback:
 *   • If WebGL or any image fails to load, the component renders the "before"
 *     image as a plain <img>, and the hover simply crossfades to the "after"
 *     image via CSS opacity. Zero regressions for low-power clients.
 *
 * Usage is intentionally small:
 *   <MirageImage
 *     before="/spa-a.jpg"
 *     after="/spa-b.jpg"
 *     alt="Relax Spa"
 *     className="aspect-[5/3]"
 *   />
 */

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assetUrl";

type Props = {
  before: string;
  after: string;
  alt: string;
  className?: string;
  /** Max displacement strength. Hoteller ships 0.2; 0.14 reads well at UI scale. */
  intensity?: number;
  /** Seconds to animate into the hovered state. */
  speedIn?: number;
  /** Seconds to animate back to the resting state. */
  speedOut?: number;
};

/* -------------------------------------------------------------------------- */
/*  Displacement map generator                                                */
/* -------------------------------------------------------------------------- */

function makeDisplacementCanvas(size = 512): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);

  const blobs = 28;
  for (let i = 0; i < blobs; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 40 + Math.random() * 200;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const rc = Math.floor(Math.random() * 255);
    const gc = Math.floor(Math.random() * 255);
    const bc = Math.floor(Math.random() * 255);
    g.addColorStop(0, `rgba(${rc},${gc},${bc},0.55)`);
    g.addColorStop(1, `rgba(128,128,128,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas;
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/* -------------------------------------------------------------------------- */

const VERT_SRC = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = `
precision mediump float;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_disp;
uniform float u_progress;
uniform float u_intensity;
uniform vec2 u_res;
uniform vec2 u_tex1Res;
uniform vec2 u_tex2Res;
varying vec2 v_uv;

// Cover-fit the child texture inside the canvas (like CSS background-size: cover).
vec2 coverUV(vec2 uv, vec2 canvasRes, vec2 texRes) {
  float canvasAspect = canvasRes.x / canvasRes.y;
  float texAspect = texRes.x / texRes.y;
  vec2 scale = vec2(1.0);
  if (canvasAspect > texAspect) {
    // Canvas is wider: match width, crop vertically.
    scale = vec2(1.0, texAspect / canvasAspect);
  } else {
    scale = vec2(canvasAspect / texAspect, 1.0);
  }
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec4 dispSample = texture2D(u_disp, v_uv);
  vec2 disp = (dispSample.rg - 0.5) * u_intensity;

  vec2 uv1 = v_uv + disp * u_progress;
  vec2 uv2 = v_uv - disp * (1.0 - u_progress);

  vec2 cuv1 = coverUV(uv1, u_res, u_tex1Res);
  vec2 cuv2 = coverUV(uv2, u_res, u_tex2Res);

  vec4 c1 = texture2D(u_tex1, cuv1);
  vec4 c2 = texture2D(u_tex2, cuv2);

  gl_FragColor = mix(c1, c2, u_progress);
}`;

/* -------------------------------------------------------------------------- */
/*  Small GL helpers                                                          */
/* -------------------------------------------------------------------------- */

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[MirageImage] shader compile failed", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function makeProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[MirageImage] program link failed", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

function makeTexture(
  gl: WebGLRenderingContext,
  source: TexImageSource,
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return tex;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function MirageImage({
  before,
  after,
  alt,
  className = "",
  intensity = 0.14,
  speedIn = 1.2,
  speedOut = 1.4,
}: Props) {
  const beforeUrl = assetUrl(before);
  const afterUrl = assetUrl(after);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoveringRef = useRef(false);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let tex1: WebGLTexture | null = null;
    let tex2: WebGLTexture | null = null;
    let dispTex: WebGLTexture | null = null;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      try {
        const ctx = canvas.getContext("webgl", {
          premultipliedAlpha: true,
          antialias: true,
          alpha: true,
        });
        if (!ctx) {
          if (!disposed) setFailed(true);
          return;
        }
        gl = ctx;

        program = makeProgram(gl);
        if (!program) {
          if (!disposed) setFailed(true);
          return;
        }

        const posAttr = gl.getAttribLocation(program, "a_pos");
        const uvAttr = gl.getAttribLocation(program, "a_uv");

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // Two triangles covering clip-space, UVs flipped vertically
        // (GL origin bottom-left vs image origin top-left).
        const verts = new Float32Array([
          -1, -1, 0, 1,
           1, -1, 1, 1,
          -1,  1, 0, 0,
          -1,  1, 0, 0,
           1, -1, 1, 1,
           1,  1, 1, 0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(uvAttr);
        gl.vertexAttribPointer(uvAttr, 2, gl.FLOAT, false, 16, 8);

        const [loaded1, loaded2] = await Promise.all([
          loadImage(beforeUrl),
          loadImage(afterUrl),
        ]);
        if (disposed || !gl) return;

        tex1 = makeTexture(gl, loaded1);
        tex2 = makeTexture(gl, loaded2);
        dispTex = makeTexture(gl, makeDisplacementCanvas(512));
        if (!tex1 || !tex2 || !dispTex) {
          if (!disposed) setFailed(true);
          return;
        }

        gl.useProgram(program);
        gl.uniform1i(gl.getUniformLocation(program, "u_tex1"), 0);
        gl.uniform1i(gl.getUniformLocation(program, "u_tex2"), 1);
        gl.uniform1i(gl.getUniformLocation(program, "u_disp"), 2);
        gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), intensity);
        gl.uniform2f(
          gl.getUniformLocation(program, "u_tex1Res"),
          loaded1.naturalWidth || 1,
          loaded1.naturalHeight || 1,
        );
        gl.uniform2f(
          gl.getUniformLocation(program, "u_tex2Res"),
          loaded2.naturalWidth || 1,
          loaded2.naturalHeight || 1,
        );

        const resize = () => {
          if (!gl || !canvas) return;
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          const rect = host.getBoundingClientRect();
          const w = Math.max(1, Math.floor(rect.width * dpr));
          const h = Math.max(1, Math.floor(rect.height * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            if (program) {
              gl.useProgram(program);
              gl.uniform2f(
                gl.getUniformLocation(program, "u_res"),
                w,
                h,
              );
            }
          }
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const draw = () => {
          if (disposed || !gl || !program) return;
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex1);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, tex2);
          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, dispTex);

          gl.uniform1f(
            gl.getUniformLocation(program, "u_progress"),
            progressRef.current,
          );

          gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        let lastT = performance.now();
        const tick = (now: number) => {
          if (disposed) return;
          const dt = Math.min(0.05, (now - lastT) / 1000);
          lastT = now;
          const target = hoveringRef.current ? 1 : 0;
          const speed = 1 / (hoveringRef.current ? speedIn : speedOut);
          const diff = target - progressRef.current;
          if (Math.abs(diff) > 0.0005) {
            progressRef.current += diff * Math.min(1, dt * speed * 3);
            draw();
          }
          rafRef.current = requestAnimationFrame(tick);
        };

        if (!disposed) {
          setReady(true);
          draw();
          rafRef.current = requestAnimationFrame(tick);
        }
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (resizeObserver) resizeObserver.disconnect();
      if (gl) {
        if (tex1) gl.deleteTexture(tex1);
        if (tex2) gl.deleteTexture(tex2);
        if (dispTex) gl.deleteTexture(dispTex);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [beforeUrl, afterUrl, intensity, speedIn, speedOut]);

  const onEnter = () => {
    hoveringRef.current = true;
  };
  const onLeave = () => {
    hoveringRef.current = false;
  };

  return (
    <div
      ref={hostRef}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={`group relative overflow-hidden ${className}`}
      aria-label={alt}
    >
      {/* Fallback / SEO image — always present, hidden once WebGL takes over. */}
      <img
        src={beforeUrl}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          ready && !failed ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* CSS crossfade layer — used only when WebGL fails. */}
      {failed ? (
        <img
          src={afterUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms] ease-out group-hover:opacity-100"
        />
      ) : null}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full ${
          ready && !failed ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      />
    </div>
  );
}
