import { useEffect, useRef } from 'react';

/**
 * LiquidCanvas — isolated placeholder.
 * Zero shared state with PlatoCanvas. Safe to drop your own
 * animation code directly into the `animate` function below.
 */
export function LiquidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Drop your animation code here ──────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      // your drawing calls go here
    };
    // ───────────────────────────────────────────────────────

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '4px',
      }}
    />
  );
}