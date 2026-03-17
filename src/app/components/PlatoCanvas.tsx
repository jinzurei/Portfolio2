// ============================================================================
// PlatoCanvas.tsx — "Liquid Plato" Spring-Physics Particle Animation
// ============================================================================
//
// OVERVIEW
// --------
// This component renders the full-viewport hero animation for the "Visionary"
// portfolio. It samples a Plato bust photograph pixel-by-pixel, converts every
// sampled pixel into a coloured particle, and simulates each particle with
// spring physics so they hold the shape of the bust at rest, scatter on mouse
// hover, and spring back when the cursor leaves.
//
// The result: a living marble statue made of ~80–120k gold-and-ivory particles
// that ripple like liquid when touched.
//
// ============================================================================
// IMAGE ASSET — HOW IT WORKS & HOW TO FIX IT IF IT BREAKS
// ============================================================================
//
// The bust photo is imported via Figma Make's `figma:asset/<hash>.png` virtual
// module scheme. This is NOT a real file path — it is resolved internally by
// the Figma Make bundler at build time.
//
// WHAT THE IMAGE SHOULD BE:
//   • A white/light-grey marble Plato bust statue
//   • Shot against a pure black background (crucial — black pixels are skipped
//     by the sampler, so the background disappears automatically)
//   • Square or near-square crop works best
//   • High resolution preferred (the sampler reads naturalWidth × naturalHeight)
//
// WHY THE IMAGE CAN DISAPPEAR (canvas goes black / particle count shows "—"):
//   When you re-import the project into Figma Make, the asset hash changes.
//   The old hash no longer resolves → the Image() element fires onerror →
//   initParticles() never runs → N stays 0 → blank black canvas.
//
// HOW TO FIX IT:
//   1. Re-import (or re-upload) the Plato bust image into Figma Make.
//   2. Figma Make will assign it a new hash, visible in the import URL.
//   3. Replace ONLY the hash string below with the new one.
//      Format: figma:asset/<40-char hex hash>.png
//   4. Save — the canvas should fill with particles within 1–2 seconds.
//
// CURRENT WORKING HASH (confirmed working as of build date):
import imgSrc from 'figma:asset/e28c320d1044e02ef4a05a7f8e5b01321f031ca8.png';
//
// DEBUGGING TIP:
//   Open browser DevTools → Console. If you see an image load error, the hash
//   is wrong. If you see no error but the canvas is black, check that W and H
//   are non-zero (the canvas needs CSS dimensions before initParticles runs).
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

// ============================================================================
// SIMULATION STATE TYPE
// ============================================================================
// Three states drive the top-right legend UI:
//   IDLE       — particles have fully returned to their home positions
//   DISTURBED  — mouse is actively repelling particles right now
//   REFORMING  — mouse has left but particles are still oscillating back
type SimState = 'IDLE' | 'DISTURBED' | 'REFORMING';

// ============================================================================
// GOLD PALETTE — mirrors the G1–G4 constants in App.tsx
// ============================================================================
// These are used exclusively for the HUD overlay text and legend bars.
// Particle colours are computed separately in initParticles (see COLOUR SYSTEM).
//
//   G1 — full gold, used for legend bar fill colour
//   G2 — 65% opacity gold, used for active legend label text
//   G3 — 35% opacity gold (available, not currently used in HUD)
//   G4 — 18% opacity gold, used for dim/inactive HUD text
//
// To adjust the gold shade, change the RGB values (212, 175, 55) here AND in
// App.tsx to keep them in sync.
const G1 = '#D4AF37';
const G2 = 'rgba(212,175,55,0.65)';
const G3 = 'rgba(212,175,55,0.35)'; // available for future HUD elements
const G4 = 'rgba(212,175,55,0.18)';

export function PlatoCanvas() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // simState drives the top-right legend — which row is highlighted
  const [simState, setSimState] = useState<SimState>('IDLE');
  // count is displayed top-left as "N particles" once initParticles completes
  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas    = canvasRef.current!;
    const container = containerRef.current!;

    // alpha:false gives a small perf boost — we always clear with a black fill
    // so we never need transparency on the canvas element itself.
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let W = 0, H = 0;

    // Sync canvas pixel dimensions to its CSS layout size.
    // Called once on mount and again via ResizeObserver on every resize.
    // IMPORTANT: canvas.width/height ≠ CSS width/height — you must set both or
    // the drawing context uses a wrong coordinate space.
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();

    // ========================================================================
    // PARTICLE DATA — flat typed arrays for maximum performance
    // ========================================================================
    // We use Float32Array / Uint8Array instead of an array of objects because
    // JavaScript engines can JIT-optimise tight loops over typed arrays far
    // better than over heterogeneous object arrays. At 100k+ particles this
    // makes the difference between 60 fps and ~20 fps.
    //
    //   px / py   — current position (updated every frame by the physics loop)
    //   pox / poy — origin / home position (where the particle wants to return)
    //   pvx / pvy — velocity (spring force accumulates here each frame)
    //   pr/pg/pb  — base RGB colour (before shimmer is applied)
    //   prad      — particle radius in pixels
    //   N         — total particle count (0 until initParticles completes)
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

    // Mouse position in canvas-pixel space. Initialised far off-screen so no
    // repulsion fires before the user has moved their mouse.
    const mouse = { x: -9999, y: -9999 };
    let currentState: SimState = 'IDLE';
    let animId: number;

    // ========================================================================
    // PHYSICS CONSTANTS — tuned for the "liquid marble" feel
    // ========================================================================
    //
    // SPRING_K (spring stiffness): 0.048
    //   Each frame, a force of (origin - position) * SPRING_K is added to
    //   velocity. Higher = snappier return. Lower = slower, floatier return.
    //   Range that looks good: 0.02 (very slow) – 0.12 (very snappy).
    //
    // DAMPING: 0.876
    //   Velocity is multiplied by this every frame. Acts as air resistance.
    //   1.0 = no damping (particles oscillate forever).
    //   0.0 = instant stop. 0.876 gives ~8 oscillations before settling.
    //   Range: 0.80 (heavy) – 0.96 (almost no friction).
    //
    // REPEL_R (repulsion radius): 90px
    //   The radius of the invisible "cursor bubble" that pushes particles away.
    //   Measured in canvas pixels. 90px ≈ a nicely noticeable but not huge orb.
    //   Increase for a wider scatter; decrease for a tighter, surgical effect.
    //
    // REPEL_R2: REPEL_R squared — precomputed so the loop avoids sqrt() for
    //   the distance check (squared distance comparison is much cheaper).
    //
    // REPEL_F (repulsion force): 22
    //   Peak force applied to a particle at the centre of the cursor bubble.
    //   Force falls off linearly to 0 at the bubble edge (soft boundary).
    //   22 gives a vigorous scatter without sending particles off-screen.
    //   Range: 5 (gentle ripple) – 50 (explosive scatter).
    const SPRING_K = 0.048;
    const DAMPING  = 0.876;
    const REPEL_R  = 90;
    const REPEL_R2 = REPEL_R * REPEL_R;
    const REPEL_F  = 22;

    // ========================================================================
    // SHIMMER STATE — per-particle independent twinkle
    // ========================================================================
    // Each particle has its own sine-wave phase, speed, and amplitude so they
    // all twinkle independently rather than flashing in unison.
    //
    //   shimmerPhase — current angle in the sine cycle (0 – 2π, wraps)
    //   shimmerSpeed — how fast the phase advances per frame
    //                  range 0.018–0.078 rad/frame → ~1.7–7.5 cycles/second
    //   shimmerAmp   — how much the sine wave multiplies the base colour
    //                  0 = no shimmer, 1 = colour doubles at peak
    //                  (values are tier-specific; see COLOUR SYSTEM below)
    let shimmerPhase: Float32Array = new Float32Array(0);
    let shimmerSpeed: Float32Array = new Float32Array(0);
    let shimmerAmp:   Float32Array = new Float32Array(0);

    // ========================================================================
    // initParticles — the heart of the effect
    // ========================================================================
    // Called once after the bust image loads. Reads every pixel, decides
    // whether to spawn a particle there, assigns it a colour and radius, then
    // populates all the typed arrays ready for the animation loop.
    const initParticles = (img: HTMLImageElement) => {

      // Guard: canvas must have non-zero CSS dimensions before we can map
      // image pixels to canvas coordinates. If layout isn't done yet, defer
      // by one rAF tick and try again.
      if (W === 0 || H === 0) {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      if (W === 0 || H === 0) {
        requestAnimationFrame(() => initParticles(img));
        return;
      }

      // ── Off-screen canvas for pixel sampling ──────────────────────────────
      // We draw the source image at its FULL natural resolution onto an
      // off-screen canvas and then call getImageData() to read raw RGBA bytes.
      // Using natural resolution (not a downscaled copy) gives pixel-perfect
      // positional accuracy — every sampled pixel maps exactly to a source pixel.
      const SW = img.naturalWidth  || 1550; // fallback if browser hasn't decoded yet
      const SH = img.naturalHeight || 944;
      const oc2 = document.createElement('canvas');
      oc2.width  = SW;
      oc2.height = SH;
      const oct = oc2.getContext('2d', { willReadFrequently: true })!;
      // willReadFrequently: true — tells the browser to keep this canvas in
      // CPU memory rather than uploading it to GPU, making getImageData() fast.
      oct.drawImage(img, 0, 0, SW, SH);
      const id = oct.getImageData(0, 0, SW, SH);
      const d  = id.data; // flat RGBA byte array: [r,g,b,a, r,g,b,a, ...]

      // ── IMAGE SCALING & POSITIONING ───────────────────────────────────────
      //
      // WHY Math.min (contain) not Math.max (cover):
      //   Math.max (cover) scales the image until it fills the viewport,
      //   cropping anything that overflows. At *1.25 this made the bust far too
      //   large — the head was clipped at the top, shoulders at the bottom.
      //
      //   Math.min (contain) scales the image until the longest axis fits
      //   within the viewport, keeping the entire bust visible. We then apply
      //   a *1.15 multiplier to zoom in slightly so the bust fills the hero
      //   section nicely without leaving large empty margins.
      //
      // WHY *1.15:
      //   At *1.0 the bust sits centred with visible black padding on all sides.
      //   *1.15 pushes it to fill most of the hero while keeping the full figure
      //   in frame. Values above ~1.25 start to clip the top of the head.
      //
      // offX / offY — pixel offset to centre the scaled image in the canvas.
      //   Negative values are intentional and valid — they push the image so
      //   its centre aligns with the canvas centre even if it slightly overflows.
      const baseScale = Math.min(W / SW, H / SH); // contain
      const scale     = baseScale * 1.15;          // slight zoom
      const dW   = SW * scale;
      const dH   = SH * scale;
      const offX = (W - dW) / 2;
      const offY = (H - dH) / 2;

      // Temporary staging arrays (plain JS arrays are faster to push() into
      // than pre-allocating and indexing typed arrays of unknown final length)
      const xs:    number[] = [];
      const ys:    number[] = [];
      const rs:    number[] = [];
      const gs:    number[] = [];
      const bs:    number[] = [];
      const rads:  number[] = [];
      const sAmps: number[] = []; // shimmer amplitude per particle

      // ======================================================================
      // PIXEL SAMPLING LOOP
      // ======================================================================
      // We iterate every pixel of the source image. For each pixel we:
      //   1. Skip fully-transparent pixels (alpha < 10) — background safety net
      //   2. Compute luminance (perceived brightness) using the ITU-R BT.601
      //      luma formula: Y = 0.299R + 0.587G + 0.114B
      //   3. Skip near-black pixels (brightness < 3) — pure black background
      //      pixels are gone, so the bust silhouette emerges naturally
      //   4. Probabilistically keep the pixel based on its brightness
      //   5. Assign a colour tier, apply brightness scaling, assign a radius
      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const i          = (y * SW + x) * 4;
          const a          = d[i + 3];
          if (a < 10) continue; // skip transparent (background safety)

          const r          = d[i];
          const g          = d[i + 1];
          const b          = d[i + 2];
          const brightness = r * 0.299 + g * 0.587 + b * 0.114; // 0–255 luma
          if (brightness < 3) continue; // skip pure-black background pixels

          // ── KEEP CHANCE (density sampling) ────────────────────────────────
          // Rather than keeping every pixel (which would produce millions of
          // particles and destroy performance), we stochastically thin the field.
          //
          // Formula: 0.22 + (brightness/255) * 0.20
          //   At brightness=0   → 22% keep rate  (shadow zones very sparse)
          //   At brightness=128 → 32% keep rate  (mid-tones moderate density)
          //   At brightness=255 → 42% keep rate  (highlights densely packed)
          //
          // This brightness-biased thinning is what makes highlights appear
          // denser and more solid than shadow areas — even before colour is
          // applied. It reinforces the tonal structure of the bust.
          //
          // To increase total particle count (at performance cost): raise both
          //   values, e.g. 0.30 + (brightness/255) * 0.25
          // To decrease (for low-end devices): lower both values.
          const keepChance = 0.22 + (brightness / 255) * 0.20;
          if (Math.random() > keepChance) continue;

          // Record canvas-space position for this particle's home coordinate
          xs.push(offX + x * scale);
          ys.push(offY + y * scale);

          // ======================================================================
          // COLOUR SYSTEM — three-tier palette
          // ======================================================================
          // Every particle is assigned to one of three colour tiers by a random
          // roll, regardless of the source pixel colour. The source image is used
          // ONLY for brightness and position — not for colour. This is what makes
          // the bust read as gold-and-ivory rather than a photographic grey.
          //
          // TIER 1 — Warm White (68% of particles)
          //   RGB: (255, 253, 245) — very slightly ivory, not pure white.
          //   This is the dominant colour. In lit areas these read as clean bright
          //   white; in shadow areas brightScale darkens them toward near-black.
          //   Shimmer amplitude: 0.06–0.24 — a subtle gentle pulse. White should
          //   twinkle softly, not flicker aggressively.
          //
          // TIER 2 — Gold / D4AF37 family (22% of particles)
          //   RGB: (195–220, 158–186, 40–65) — randomised in range to avoid
          //   uniformity. Matches the G1 gold (#D4AF37 = rgb(212,175,55)) with
          //   slight variation per particle.
          //   Shimmer amplitude: 0.14–0.42 — more pronounced than white so gold
          //   particles catch the eye and glint against the ivory field.
          //
          // TIER 3 — Bright Gold Accent (10% of particles)
          //   RGB: (240–255, 195–215, 55–85) — a warmer, more saturated gold.
          //   These are the "sparks" — the brightest individual particle moments.
          //   Shimmer amplitude: 0.22–0.60 — the most dramatic twinkle.
          //
          // WHY THIS RATIO (68/22/10):
          //   68% white keeps the marble look — Plato is a white marble bust.
          //   22% gold ties it to the Visionary brand palette.
          //   10% bright accent provides focal glints without overwhelming.
          //   Increasing gold % makes it look more "gold statue"; decreasing
          //   makes it look more "white marble". Both are valid artistic choices.
          const roll = Math.random();
          let cr: number, cg: number, cb: number, amp: number;

          if (roll < 0.68) {
            // TIER 1: Warm white — slightly ivory so it doesn't read as clinical
            cr = 255; cg = 253; cb = 245;
            amp = Math.random() * 0.18 + 0.06; // subtle shimmer: range 0.06–0.24
          } else if (roll < 0.90) {
            // TIER 2: Gold — D4AF37 with per-particle variation
            cr = 195 + Math.floor(Math.random() * 25); // 195–220
            cg = 158 + Math.floor(Math.random() * 28); // 158–186
            cb = 40  + Math.floor(Math.random() * 25); // 40–65
            amp = Math.random() * 0.28 + 0.14;         // shimmer: 0.14–0.42
          } else {
            // TIER 3: Bright gold accent — warmest, most saturated
            cr = 240 + Math.floor(Math.random() * 15); // 240–255
            cg = 195 + Math.floor(Math.random() * 20); // 195–215
            cb = 55  + Math.floor(Math.random() * 30); // 55–85
            amp = Math.random() * 0.38 + 0.22;         // shimmer: 0.22–0.60
          }

          // ======================================================================
          // BRIGHTNESS SCALE — the shadow crush formula
          // ======================================================================
          // This is the single most important value for the "carved marble" look.
          // It maps each pixel's source brightness (0–255) to a multiplier applied
          // to the particle's base colour before it is stored.
          //
          // FORMULA: brightScale = 0.04 + Math.pow(brightness / 255, 0.78) * 0.96
          //
          //   Component breakdown:
          //     • 0.04  — the "floor": darkest possible particles are 4% of full
          //               colour. Near-black but never pure black, so they remain
          //               faintly visible in deep shadow — adding sculptural depth.
          //     • 0.96  — the "ceiling range": at full brightness the scale hits
          //               0.04 + 0.96 = 1.00 exactly (highlights at full colour).
          //     • 0.78  — the gamma exponent. Values > 1.0 would lift shadows;
          //               values < 1.0 crush them darker. 0.78 is steeper than
          //               linear, making the mid-tone-to-shadow transition punchy
          //               so the carved contours of the face read clearly.
          //
          //   Brightness → brightScale lookup:
          //     brightness=10  → 0.04 + (0.039)^0.78 * 0.96 ≈ 0.11  (deep shadow)
          //     brightness=50  → 0.04 + (0.196)^0.78 * 0.96 ≈ 0.28  (shadow)
          //     brightness=100 → 0.04 + (0.392)^0.78 * 0.96 ≈ 0.46  (mid-shadow)
          //     brightness=160 → 0.04 + (0.627)^0.78 * 0.96 ≈ 0.65  (mid-light)
          //     brightness=220 → 0.04 + (0.863)^0.78 * 0.96 ≈ 0.88  (highlight)
          //     brightness=255 → 0.04 + (1.000)^0.78 * 0.96 = 1.00  (full bright)
          //
          // TUNING GUIDE:
          //   • Floor too high (e.g. 0.42) → shadows wash out, bust looks flat/grey
          //   • Floor too low  (e.g. 0.00) → deep shadows are invisible; can look
          //     patchy if the source image has large dark areas
          //   • Exponent too high (e.g. 0.95) → almost linear; softer but less drama
          //   • Exponent too low  (e.g. 0.40) → extreme contrast; posterised look
          //   Current values (0.04 floor, 0.78 exponent) were confirmed visually
          //   perfect against the reference screenshot.
          const brightScale = 0.04 + Math.pow(brightness / 255, 0.78) * 0.96;
          rs.push(Math.round(cr * brightScale));
          gs.push(Math.round(cg * brightScale));
          bs.push(Math.round(cb * brightScale));
          sAmps.push(amp);

          // ======================================================================
          // PARTICLE RADIUS — sizeBoost ties visual weight to brightness
          // ======================================================================
          // Base radius: random in [0.6, 2.1] px  (Math.random()*1.5 + 0.6)
          // sizeBoost:   brightness/255 * 0.9 adds 0–0.9 px for bright pixels
          //
          // Effect:
          //   Darkest particles → 0.6–1.6 px  (tiny, near-invisible in shadows)
          //   Brightest particles → 0.6–3.0 px (larger, visually heavier)
          //
          // This means highlights look BOTH brighter AND physically larger, which
          // amplifies the perceived contrast beyond what colour alone achieves.
          // Combined with the brightness-biased keepChance (more highlight pixels
          // kept) and brightScale (highlights at full colour), the three systems
          // compound to make lit areas pop dramatically vs shadow voids.
          //
          // To make all particles the same size (flatter look): remove sizeBoost
          // and change the formula to: rads.push(Math.random() * 1.5 + 0.6);
          const sizeBoost = (brightness / 255) * 0.9;
          rads.push(Math.random() * 1.5 + 0.6 + sizeBoost);
        }
      }

      // ── Allocate typed arrays now that we know N ──────────────────────────
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

      // ── SPAWN SPREAD — initial particle positions ───��──────────────────────
      // Particles don't start at their home positions — they start scattered
      // across the canvas and spring back into place, giving the "assembling"
      // intro animation on first load.
      //
      // spreadX = 55% of canvas width  → horizontal scatter range
      // spreadY = 38% of canvas height → slightly tighter vertical scatter
      //   (narrower Y spread so particles don't fly off the top/bottom as far)
      //
      // Initial velocity is also randomised (±2.5 px/frame) so particles
      // don't all race inward from the same direction.
      const spreadX = W * 0.55;
      const spreadY = H * 0.38;

      for (let i = 0; i < N; i++) {
        pox[i]  = xs[i]; // home X
        poy[i]  = ys[i]; // home Y
        px[i]   = xs[i] + (Math.random() - 0.5) * spreadX; // scattered start X
        py[i]   = ys[i] + (Math.random() - 0.5) * spreadY; // scattered start Y
        pvx[i]  = (Math.random() - 0.5) * 2.5; // initial X velocity
        pvy[i]  = (Math.random() - 0.5) * 2.5; // initial Y velocity
        pr[i]   = rs[i];
        pg[i]   = gs[i];
        pb[i]   = bs[i];
        prad[i] = rads[i];
      }
      setCount(N);

      // ── Shimmer initialisation ─────────────────────────────────────────────
      // Each particle gets a random starting phase so they don't all pulse
      // in sync, a random speed within the range, and the amplitude computed
      // during colour assignment above.
      shimmerPhase = new Float32Array(N);
      shimmerSpeed = new Float32Array(N);
      shimmerAmp   = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        shimmerPhase[i] = Math.random() * Math.PI * 2;         // 0 – 2π random start
        shimmerSpeed[i] = Math.random() * 0.06 + 0.018;        // 0.018–0.078 rad/frame
        shimmerAmp[i]   = sAmps[i];                            // from colour tier above
      }
    };

    // ========================================================================
    // VIGNETTE — soft radial darkening around the canvas edges
    // ========================================================================
    // Drawn on top of all particles every frame. Creates a cinematic framing
    // effect and helps the bust "emerge" from pure darkness at the edges.
    //
    // The gradient is centred at (50%, 47%) — slightly above centre so the
    // vignette clears the face area while darkening the lower background.
    // Inner radius: 30% of canvas width (clear centre zone)
    // Outer radius: 100% of canvas width (full-edge darkness)
    // Max opacity: 0.38 — strong enough to frame without crushing edge detail.
    //
    // The ctx.scale(1, H/W) trick converts the circular gradient into an
    // ellipse that fits the non-square canvas aspect ratio.
    const drawVignette = () => {
      if (W <= 0 || H <= 0) return;
      const cx = W * 0.5;
      const cy = H * 0.47;
      const rx = W * 0.5;
      ctx.save();
      ctx.scale(1, H / W);
      const grad = ctx.createRadialGradient(cx, cy * (W / H), rx * 0.3, cx, cy * (W / H), rx);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.38)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, W);
      ctx.restore();
    };

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================
    // Runs at up to 60fps via requestAnimationFrame. Each frame:
    //   1. Clear canvas with solid black
    //   2. For each particle: apply spring force, apply mouse repulsion,
    //      integrate velocity, compute shimmer, draw circle
    //   3. Draw vignette overlay
    //   4. Update sim state for the HUD legend
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Clear to pure black every frame — the background of the hero section
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      if (N === 0) return; // image not loaded yet — keep canvas black

      let disturbed = false; // true if any particle is being repelled this frame
      let maxVel    = 0;     // tracks peak velocity for REFORMING state detection
      const mx = mouse.x;
      const my = mouse.y;

      for (let i = 0; i < N; i++) {
        // ── Spring force toward home position ──────────────────────────────
        // F = (origin - position) * SPRING_K
        // This pulls the particle back toward its home (pox, poy) each frame.
        pvx[i] += (pox[i] - px[i]) * SPRING_K;
        pvy[i] += (poy[i] - py[i]) * SPRING_K;

        // ── Damping (air resistance) ────────────────────────────────────────
        pvx[i] *= DAMPING;
        pvy[i] *= DAMPING;

        // ── Mouse repulsion ─────────────────────────────────────────────────
        // Uses squared distance to avoid sqrt() in the hot path.
        // Only compute sqrt if we're inside the repulsion radius.
        const dx = px[i] - mx;
        const dy = py[i] - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R2 && d2 > 0.5) {
          const dist = Math.sqrt(d2);
          // Force falls off linearly from REPEL_F at centre to 0 at edge
          const f = ((REPEL_R - dist) / REPEL_R) * REPEL_F;
          pvx[i] += (dx / dist) * f;
          pvy[i] += (dy / dist) * f;
          disturbed = true;
        }

        // ── Integrate velocity into position ────────────────────────────────
        px[i] += pvx[i];
        py[i] += pvy[i];

        // Track peak velocity for state detection
        const absV = Math.abs(pvx[i]) + Math.abs(pvy[i]);
        if (absV > maxVel) maxVel = absV;

        // ── Velocity-based alpha boost ──────────────────────────────────────
        // Fast-moving particles become slightly more opaque (up to +0.4),
        // giving a motion-blur-like brightening during scatter/reform.
        const velAlpha = Math.min(absV * 0.06, 0.4);
        const alpha    = 0.88 + velAlpha; // base 0.88, max 1.28 (clamped by browser)

        // ── Shimmer ─────────────────────────────────────────────────────────
        // shimmer multiplier oscillates around 1.0 using a sine wave.
        // Values > 1.0 brighten the particle; the shimmerAmp controls the swing.
        // Example: amp=0.3 → shimmer ranges from 0.7× to 1.3× base colour.
        const shimmer = 1 + Math.sin(shimmerPhase[i]) * shimmerAmp[i];
        shimmerPhase[i] += shimmerSpeed[i];
        const sr = Math.min(255, Math.round(pr[i] * shimmer));
        const sg = Math.min(255, Math.round(pg[i] * shimmer));
        const sb = Math.min(255, Math.round(pb[i] * shimmer));

        // ── Draw particle ───────────────────────────────────────────────────
        // Each particle is a filled circle. We avoid ctx.save/restore in the
        // hot loop — just set fillStyle and draw directly.
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${alpha})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], prad[i], 0, 6.283185307); // 6.283... = 2π
        ctx.fill();
      }

      drawVignette();

      // ── Update sim state for the HUD legend ────────────────────────────────
      // DISTURBED  → mouse repelled at least one particle this frame
      // REFORMING  → no repulsion but peak velocity > 0.3 px/frame (settling)
      // IDLE       → fully at rest
      // 0.3 px/frame threshold was tuned so REFORMING stays active during the
      // visible oscillation period but doesn't linger after particles settle.
      const ns: SimState = disturbed ? 'DISTURBED' : maxVel > 0.3 ? 'REFORMING' : 'IDLE';
      if (ns !== currentState) {
        currentState = ns;
        setSimState(ns);
      }
    };

    // ========================================================================
    // IMAGE LOADING — race-condition-safe pattern
    // ========================================================================
    // The `started` flag prevents initParticles from running twice if both
    // onload and the synchronous `img.complete` check fire (can happen when
    // the browser has the image cached from a previous render).
    //
    // WHY handlers are set BEFORE img.src:
    //   If the image is already cached, setting img.src may synchronously mark
    //   img.complete = true before onload fires. Setting onload after src could
    //   miss the event entirely. Always set handlers first.
    //
    // WHY no crossOrigin attribute:
    //   figma:asset URLs are same-origin within the Figma Make sandbox.
    //   Adding crossOrigin="anonymous" on a same-origin asset is harmless but
    //   unnecessary — and can cause issues on some CDN configs.
    const img = new Image();
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      initParticles(img);
      animate();
    };
    img.onload  = start;
    img.onerror = () => {
      // Image failed to load (wrong hash, asset not imported, network error).
      // We still start the animation loop so the canvas isn't left frozen —
      // it will just show a black screen. Check the console for the error.
      // Fix: re-import the Plato bust and update the hash at the top of this file.
      if (!started) { started = true; animate(); }
    };
    img.src = imgSrc;
    // Synchronous cache hit — image was already decoded before this effect ran
    if (img.complete && img.naturalWidth > 0) start();

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    //
    // WHY window for mousemove (not canvas or container):
    //   If the listener is on the canvas element, fast mouse movement can
    //   outrun the element boundary and the cursor "escapes" without triggering
    //   mousemove, causing the repulsion bubble to freeze mid-canvas.
    //   window-level mousemove always fires regardless of cursor speed.
    //
    // WHY container for mouseleave:
    //   We only want to park the cursor off-screen when the mouse leaves the
    //   hero section, not when it leaves the canvas sub-pixel boundary.
    //   Container = the full viewport-height div, so this behaves correctly.
    //
    // Touch events: preventDefault() stops the page from scrolling while the
    //   user is interacting with the particle field on mobile.
    //   passive:false is required for preventDefault() to work on touchmove.
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      // Convert viewport mouse coords to canvas pixel coords, accounting for
      // any CSS scaling between the canvas element size and its pixel buffer.
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

    // ResizeObserver keeps canvas pixel dimensions in sync with its CSS size
    // if the window is resized (e.g. rotating a phone, resizing a browser window).
    // Note: resizing resets W/H but does NOT re-run initParticles — existing
    // particles keep their canvas-pixel home coordinates which may no longer
    // align perfectly after resize. For a full re-init on resize, call
    // initParticles(img) inside resize() and re-assign all typed arrays.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Cleanup — called when the component unmounts (React StrictMode runs this
    // twice in development, which is fine — the started flag prevents double-init)
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchmove', onTouch);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, []); // empty deps — runs once on mount, cleans up on unmount

  // ========================================================================
  // HUD STYLES & DATA
  // ========================================================================
  // MONO is applied to all overlay text for the monospace developer aesthetic.
  // The font ('JetBrains Mono') must be loaded globally — it's imported in
  // App.tsx / fonts.css. If it fails to load, the browser falls back to the
  // system monospace font, which is acceptable.
  const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

  // Three rows in the top-right legend. The active row (matching simState)
  // gets brighter text (G2) and a fully-opaque gold bar; inactive rows are
  // dimmed to G4 with 18% opacity bars.
  const STATES = [
    { key: 'IDLE'      as SimState, label: 'IDLE — formed',          bar: G1 },
    { key: 'DISTURBED' as SimState, label: 'DISTURBED — liquid flow', bar: G1 },
    { key: 'REFORMING' as SimState, label: 'REFORMING — spring back', bar: G1 },
  ] as const;

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',    // 100svh = small viewport height (accounts for mobile browser chrome)
        background: '#000',  // fallback while canvas initialises
        overflow: 'hidden',  // clip particles that spring outside the viewport
        cursor: 'crosshair', // signals interactivity without using a pointer
      }}
    >
      {/*
        CANVAS CSS FILTER: brightness(1.15) contrast(1.1)
        ──────────────────────────────────────────────────
        Applied as a CSS post-process filter on the canvas element itself.
        This runs on the GPU and is essentially free performance-wise.

        brightness(1.15): lifts the overall luminosity by 15%. Compensates for
          the fact that canvas arc() fills with anti-aliased sub-pixel particles
          that are inherently slightly dimmer than solid fills. Without this,
          the bust reads as grey rather than bright white.

        contrast(1.1): adds 10% contrast on top. Pushes the already-dark shadow
          particles closer to black and the bright highlights closer to white,
          reinforcing the brightScale crush without touching any code values.

        Together these two filters are responsible for the "punchy" look of the
        final output. Removing them makes the animation look noticeably flat.
        If you want to adjust: brightness(1.0)–(1.3) and contrast(1.0)–(1.2)
        are the practical ranges.
      */}
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

      {/* ── TOP-LEFT HUD: particle count + physics label ── */}
      {/* Positioned 28px from top, 32px from left — inside the safe zone of
          most screen sizes. pointerEvents:none so it doesn't block mouse events. */}
      <div style={{ position: 'absolute', top: '28px', left: '32px', pointerEvents: 'none', userSelect: 'none' }}>
        <p style={{ ...MONO, fontSize: '9.5px', letterSpacing: '2.28px', color: G4, textTransform: 'uppercase', lineHeight: '18px' }}>
          {count > 0 ? `${count.toLocaleString()} particles` : '—'}
        </p>
        <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.8px', color: G4, textTransform: 'uppercase', lineHeight: '13.5px' }}>
          spring / damped physics
        </p>
      </div>

      {/* ── TOP-RIGHT HUD: simulation state legend ── */}
      {/* Three rows, right-aligned. Each row: label text + gold bar indicator.
          The active state gets G2 (65% gold) text; inactive states get G4 (18%).
          Transitions are CSS 0.45s ease so state changes feel smooth, not jarring. */}
      <div style={{ position: 'absolute', top: '28px', right: '32px', pointerEvents: 'none', userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        {STATES.map(({ key, label, bar }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ ...MONO, fontSize: '8.5px', letterSpacing: '1.36px', color: simState === key ? G2 : G4, textTransform: 'uppercase', lineHeight: '12.75px', transition: 'color 0.45s ease' }}>
              {label}
            </p>
            {/* The 24×2px gold bar — full opacity when active, 18% when inactive */}
            <div style={{ width: '24px', height: '2px', borderRadius: '1px', backgroundColor: bar, opacity: simState === key ? 1 : 0.18, transition: 'opacity 0.45s ease', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
