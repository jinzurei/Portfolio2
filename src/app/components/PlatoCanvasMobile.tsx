// ============================================================================
// PlatoCanvasMobile.tsx — Mobile-optimized Plato particle canvas
// ============================================================================
// Lightweight version of PlatoCanvas for mobile devices.
// Zoomed to focus on face/upper torso, fills entire mobile viewport.
// No HUD overlay — cleaner for small screens.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import imgSrc from '@/assets/e28c320d1044e02ef4a05a7f8e5b01321f031ca8.png';

const G1 = '#F2D46A';

export function PlatoCanvasMobile() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current!;
    const container = containerRef.current!;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = 0, H = 0;
    let img: HTMLImageElement | null = null;

    const resize = () => {
      const newW = canvas.offsetWidth;
      const newH = canvas.offsetHeight;
      
      // Update canvas pixel dimensions
      canvas.width  = newW;
      canvas.height = newH;
      
      // If dimensions actually changed and image is loaded, reinitialize particles
      if ((newW !== W || newH !== H) && img && img.naturalWidth > 0) {
        W = newW;
        H = newH;
        initParticles(img);
      } else {
        W = newW;
        H = newH;
      }
    };
    resize();

    let px:   Float32Array = new Float32Array(0);
    let py:   Float32Array = new Float32Array(0);
    let pox:  Float32Array = new Float32Array(0);
    let poy:  Float32Array = new Float32Array(0);
    let pvx:  Float32Array = new Float32Array(0);
    let pvy:  Float32Array = new Float32Array(0);
    let pr:   Uint8Array   = new Uint8Array(0);
    let pg:   Uint8Array   = new Uint8Array(0);
    let pb:   Uint8Array   = new Uint8Array(0);
    let prad: Float32Array = new Float32Array(0);
    let N = 0;

    const mouse = { x: -9999, y: -9999 };
    let animId: number;

    // Mobile physics: snappier, more responsive
    const SPRING_K = 0.056;  // slightly snappier than desktop
    const DAMPING  = 0.88;
    const REPEL_R  = 75;     // tighter radius for mobile touch
    const REPEL_R2 = REPEL_R * REPEL_R;
    const REPEL_F  = 26;     // stronger repel on touch

    let shimmerPhase: Float32Array = new Float32Array(0);
    let shimmerSpeed: Float32Array = new Float32Array(0);
    let shimmerAmp:   Float32Array = new Float32Array(0);

    const initParticles = (img: HTMLImageElement) => {
      if (W === 0 || H === 0) {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      if (W === 0 || H === 0) {
        requestAnimationFrame(() => initParticles(img));
        return;
      }

      const SW = img.naturalWidth  || 1550;
      const SH = img.naturalHeight || 944;
      const oc2 = document.createElement('canvas');
      oc2.width  = SW;
      oc2.height = SH;
      const oct = oc2.getContext('2d', { willReadFrequently: true })!;
      oct.drawImage(img, 0, 0, SW, SH);
      const id = oct.getImageData(0, 0, SW, SH);
      const d  = id.data;

      // MOBILE ZOOM: cover mode fills entire screen without gaps
      const scale = Math.max(W / SW, H / SH); // cover (crop to fill)
      const dW   = SW * scale;
      const dH   = SH * scale;
      // Center the image vertically so full face is visible
      const offX = (W - dW) / 2;
      const offY = (H - dH) / 2;                  // center vertically

      const xs:    number[] = [];
      const ys:    number[] = [];
      const rs:    number[] = [];
      const gs:    number[] = [];
      const bs:    number[] = [];
      const rads:  number[] = [];
      const sAmps: number[] = [];

      // Slightly higher density on mobile (tighter screen space)
      const keepChance = 0.24 + (brightness => brightness / 255) * 0.22;

      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const i          = (y * SW + x) * 4;
          const a          = d[i + 3];
          if (a < 10) continue;

          const r          = d[i];
          const g          = d[i + 1];
          const b          = d[i + 2];
          const brightness = r * 0.299 + g * 0.587 + b * 0.114;
          if (brightness < 3) continue;

          const kc = 0.24 + (brightness / 255) * 0.22;
          if (Math.random() > kc) continue;

          xs.push(offX + x * scale);
          ys.push(offY + y * scale);

          const roll = Math.random();
          let cr: number, cg: number, cb: number, amp: number;

          if (roll < 0.68) {
            cr = 255; cg = 253; cb = 245;
            amp = Math.random() * 0.18 + 0.06;
          } else if (roll < 0.90) {
            cr = 195 + Math.floor(Math.random() * 25);
            cg = 158 + Math.floor(Math.random() * 28);
            cb = 40  + Math.floor(Math.random() * 25);
            amp = Math.random() * 0.28 + 0.14;
          } else {
            cr = 240 + Math.floor(Math.random() * 15);
            cg = 195 + Math.floor(Math.random() * 20);
            cb = 55  + Math.floor(Math.random() * 30);
            amp = Math.random() * 0.38 + 0.22;
          }

          const brightScale = 0.04 + Math.pow(brightness / 255, 0.78) * 0.96;
          rs.push(Math.round(cr * brightScale));
          gs.push(Math.round(cg * brightScale));
          bs.push(Math.round(cb * brightScale));
          sAmps.push(amp);

          const sizeBoost = (brightness / 255) * 0.9;
          rads.push(Math.random() * 1.5 + 0.6 + sizeBoost);
        }
      }

      N    = xs.length;
      px   = new Float32Array(N);
      py   = new Float32Array(N);
      pox  = new Float32Array(N);
      poy  = new Float32Array(N);
      pvx  = new Float32Array(N);
      pvy  = new Float32Array(N);
      pr   = new Uint8Array(N);
      pg   = new Uint8Array(N);
      pb   = new Uint8Array(N);
      prad = new Float32Array(N);

      const spreadX = W * 0.48;
      const spreadY = H * 0.32;

      for (let i = 0; i < N; i++) {
        pox[i]  = xs[i];
        poy[i]  = ys[i];
        px[i]   = xs[i] + (Math.random() - 0.5) * spreadX;
        py[i]   = ys[i] + (Math.random() - 0.5) * spreadY;
        pvx[i]  = (Math.random() - 0.5) * 2.5;
        pvy[i]  = (Math.random() - 0.5) * 2.5;
        pr[i]   = rs[i];
        pg[i]   = gs[i];
        pb[i]   = bs[i];
        prad[i] = rads[i];
      }

      shimmerPhase = new Float32Array(N);
      shimmerSpeed = new Float32Array(N);
      shimmerAmp   = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        shimmerPhase[i] = Math.random() * Math.PI * 2;
        shimmerSpeed[i] = Math.random() * 0.06 + 0.018;
        shimmerAmp[i]   = sAmps[i];
      }
    };

    const drawVignette = () => {
      if (W <= 0 || H <= 0) return;
      const cx = W * 0.5;
      const cy = H * 0.45;
      const rx = W * 0.5;
      ctx.save();
      ctx.scale(1, H / W);
      const grad = ctx.createRadialGradient(cx, cy * (W / H), rx * 0.25, cx, cy * (W / H), rx);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.42)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, W);
      ctx.restore();
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      if (N === 0) return;

      const mx = mouse.x;
      const my = mouse.y;

      for (let i = 0; i < N; i++) {
        pvx[i] += (pox[i] - px[i]) * SPRING_K;
        pvy[i] += (poy[i] - py[i]) * SPRING_K;

        pvx[i] *= DAMPING;
        pvy[i] *= DAMPING;

        const dx = px[i] - mx;
        const dy = py[i] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R2 && d2 > 0.5) {
          const dist = Math.sqrt(d2);
          const f = ((REPEL_R - dist) / REPEL_R) * REPEL_F;
          pvx[i] += (dx / dist) * f;
          pvy[i] += (dy / dist) * f;
        }

        px[i] += pvx[i];
        py[i] += pvy[i];

        const absV = Math.abs(pvx[i]) + Math.abs(pvy[i]);
        const velAlpha = Math.min(absV * 0.06, 0.4);
        const alpha    = 0.88 + velAlpha;

        const shimmer = 1 + Math.sin(shimmerPhase[i]) * shimmerAmp[i];
        shimmerPhase[i] += shimmerSpeed[i];
        const sr = Math.min(255, Math.round(pr[i] * shimmer));
        const sg = Math.min(255, Math.round(pg[i] * shimmer));
        const sb = Math.min(255, Math.round(pb[i] * shimmer));

        ctx.fillStyle = `rgba(${sr},${sg},${sb},${alpha})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], prad[i], 0, 6.283185307);
        ctx.fill();
      }

      drawVignette();
    };

    const imgElem = new Image();
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      img = imgElem;  // Store image reference for resize to access
      initParticles(imgElem);
      animate();
    };
    imgElem.onload  = start;
    imgElem.onerror = () => {
      if (!started) { started = true; animate(); }
    };
    imgElem.src = imgSrc;
    if (imgElem.complete && imgElem.naturalWidth > 0) start();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * (W / r.width);
      mouse.y = (e.clientY - r.top)  * (H / r.height);
    };
    const onLeave    = () => { mouse.x = -9999; mouse.y = -9999; };
    const onTouch    = (e: TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = (t.clientX - r.left) * (W / r.width);
      mouse.y = (t.clientY - r.top)  * (H / r.height);
    };
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchmove', onTouch, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchmove', onTouch);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'brightness(1.15) contrast(1.1)',
        }}
      />
    </div>
  );
}
