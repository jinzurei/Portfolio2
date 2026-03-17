import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import React from 'react';
import { PlatoCanvas } from './components/PlatoCanvas';
import { LiquidCanvas } from './components/LiquidCanvas';

// ─── Types ────────────────────────────────────────────────
interface Project {
  id: string;
  tag: string;
  title: string;
  year: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
}

interface Essay {
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  pdf: string;
}

// ─── Data ────────────────────────────────────────────────
const projects: Project[] = [
  {
    id: '01',
    tag: 'AI Engineering',
    title: 'Ignis',
    year: '2025',
    description:
      'A sophisticated local AI assistant featuring advanced memory systems, personality evolution, and cognitive architectures. Implements local LLM inference using llama.cpp, multi-layered memory with episodic and semantic components, and a dynamic personality engine that adapts through conversation. Includes web interface, RESTful API endpoints, and comprehensive testing suite.',
    tech: ['Python', 'FastAPI', 'llama.cpp', 'ChromaDB', 'JavaScript', 'HTML5/CSS3'],
    github: 'https://github.com/jinzurei/Ignis',
  },
  {
    id: '02',
    tag: 'Game Engine',
    title: 'I Am The Fool',
    year: '2025',
    description:
      'A modular 2D platformer engine built from scratch in Python and Pygame, featuring custom physics, infinite procedural levels, and advanced game architecture. Implements symplectic Euler integration for frame-rate independent physics, variable-height jumping with easing curves, and a sophisticated camera system with parallax scrolling.',
    tech: ['Python', 'Pygame', 'Git', 'PowerShell'],
    github: 'https://github.com/jinzurei/IAmTheFool',
  },
  {
    id: '03',
    tag: 'Creative Portfolio',
    title: 'Portfolio (Legacy)',
    year: '2025',
    description:
      'A high-performance creative showcase built 100% in vanilla JavaScript + Three.js. Features original real-time GLSL shaders — topographic contours with 3D simplex noise + RGB glitch bursts — glassmorphism UI with backdrop blur, 3D flip cards, animated starfield, 3D Earth with ASCII overlay, and a custom WebGL scrollbar. Optimized for smooth performance with graceful degradation.',
    tech: ['Three.js', 'WebGL/GLSL', 'JavaScript ES6+', 'CSS3 Grid', 'HTML5'],
    github: 'https://github.com/jinzurei/portfolio',
    live: 'https://jinzurei.github.io/portfolio/',
  },
  {
    id: '04',
    tag: 'Client Work',
    title: 'songim.dev',
    year: '2025',
    description:
      'A sleek, immersive single-page portfolio for Song Im — a multidisciplinary creative in game development and digital media. Built as a scroll-driven experience with a dark cosmic aesthetic, animated particle/dot-field backgrounds, smooth section anchoring, and Markdown-driven content. Designed from a Figma prototype and deployed via GitHub Pages.',
    tech: ['TypeScript', 'Vite', 'React', 'CSS/PostCSS', 'Figma', 'Markdown'],
    github: 'https://github.com/jinzurei/songim.dev',
    live: 'https://songim.dev',
  },
  {
    id: '05',
    tag: 'Web Application',
    title: 'WDD 131 Final',
    year: '2024',
    description:
      'A comprehensive web development course project featuring multiple interactive applications. Includes a responsive temple gallery with dynamic filtering, a plant encyclopedia with botanical API integration and local CSV data mapping, and JavaScript applications demonstrating DOM manipulation, progressive enhancement, and lazy loading.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    github: 'https://github.com/jinzurei/wdd131',
    live: 'https://jinzurei.github.io/wdd131/',
  },
  {
    id: '06',
    tag: 'Web Development',
    title: 'Rapidds Rafting',
    year: '2024',
    description:
      'Responsive multi-page website demonstrating semantic HTML5 architecture and modern CSS methodologies. Implemented component-based design patterns with mobile-first Flexbox and Grid layouts, Google Maps API integration, WebP image optimization, and W3C standards validation. Deployed via continuous integration on GitHub Pages.',
    tech: ['HTML5', 'CSS3', 'GitHub Pages', 'Git'],
    github: 'https://github.com/jinzurei/wdd130',
    live: 'https://jinzurei.github.io/wdd130/wwr/',
  },
];

const essays: Essay[] = [
  {
    title: 'Shaders as Philosophy',
    date: 'Feb 2026',
    excerpt:
      'A GLSL fragment shader decides what every pixel *is*. That\'s not rendering — that\'s ontology. Writing shaders taught me that the gap between code and experience is thinner than anyone admits.',
    tag: 'Graphics · Philosophy',
    pdf: '/essays/shaders-as-philosophy.pdf',
  },
  {
    title: 'Building Ignis: What Memory Means for Machines',
    date: 'Jan 2026',
    excerpt:
      'Episodic recall, semantic compression, personality drift — building a local AI assistant forced me to confront what "remembering" actually requires. The engineering problem *is* the philosophical problem.',
    tag: 'AI · Cognitive Architecture',
    pdf: '/essays/building-ignis.pdf',
  },
  {
    title: 'Physics Engines and the Problem of Time',
    date: 'Nov 2025',
    excerpt:
      'Symplectic Euler integration solves the frame-rate independence problem. But underneath the math is a deeper question: what does it mean for a simulated world to have its own consistent time?',
    tag: 'Game Dev · Philosophy',
    pdf: '/essays/physics-engines-and-time.pdf',
  },
  {
    title: 'The Portfolio as Self-Portrait',
    date: 'Oct 2025',
    excerpt:
      'Every portfolio is an argument about identity. The glassmorphism, the shaders, the deliberate aesthetics — these aren\'t decoration. They\'re claims about who you are and what you value.',
    tag: 'Design · Identity',
    pdf: '/essays/portfolio-as-self-portrait.pdf',
  },
];

const domains = [
  {
    glyph: 'λ',
    label: 'Philosophy',
    sub: 'Foundation',
    description: 'Before every system, the question of why it should exist at all. Logic, phenomenology, ethics, ontology — not as background reading, but as method. The lens through which every technical decision is examined.',
  },
  {
    glyph: '∂',
    label: 'Full-Stack Engineering',
    sub: 'Frontend · Backend · Infra',
    description: 'JavaScript, TypeScript, Python, React, FastAPI, Three.js — the whole stack as a unified argument. From responsive layouts to RESTful APIs to GPU-accelerated shaders, every layer reasoned from first principles.',
  },
  {
    glyph: '◻',
    label: 'UI/UX Design',
    sub: 'Interface as Phenomenology',
    description: 'Glassmorphism, particle fields, scroll-driven experiences — design is the structure of experience. From Figma prototypes to production CSS, every affordance is a claim about human attention.',
  },
  {
    glyph: '⬡',
    label: 'Game Development',
    sub: 'Engines · Physics · Worlds',
    description: 'Custom physics engines, procedural generation, symplectic integration — games are the most honest medium. I build interactive systems from scratch where meaning is procedural and consequences are real.',
  },
  {
    glyph: '∞',
    label: 'AI & Cognitive Systems',
    sub: 'Memory · Personality · Inference',
    description: 'Local LLM inference, episodic memory architectures, personality engines that evolve through conversation. The philosophical problem of alignment is not separate from the technical one.',
  },
  {
    glyph: '⊕',
    label: 'Graphics & Shaders',
    sub: 'WebGL · GLSL · Three.js',
    description: 'Original GLSL shaders, 3D simplex noise, RGB chromatic aberration, real-time topographic contours — the GPU as creative medium. Every fragment shader is a philosophical claim about perception.',
  },
];

// ─── Shared styles ────────────────────────────────────────
const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const SERIF: CSSProperties = { fontFamily: "'EB Garamond', Georgia, serif" };

// Gold palette
const G1 = '#D4AF37';           // solid gold
const G2 = 'rgba(212,175,55,0.80)'; // rich gold
const G3 = 'rgba(212,175,55,0.45)'; // muted gold
const G4 = 'rgba(212,175,55,0.20)'; // subtle gold
const G5 = 'rgba(212,175,55,0.08)'; // barely-there gold (borders)
const GHOVER = '#F0D080';        // bright gold hover

// ─── Reveal Hook ─────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Nav ──────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const links = ['about', 'domains', 'work', 'writing', 'contact'];

  return (
    <nav
      style={{
        ...MONO,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        transition: 'background 0.5s ease, border-color 0.5s ease',
        background: scrolled ? 'rgba(3,3,3,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${G5}` : '1px solid transparent',
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          fontSize: '11px',
          letterSpacing: '3.5px',
          color: G2,
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        TANNER LIVINGSTON
      </button>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {links.map((s) => (
          <button
            key={s}
            onClick={() => scrollTo(s)}
            style={{
              fontSize: '9px',
              letterSpacing: '2.2px',
              color: G4,
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = GHOVER)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = G4)}
          >
            {s}
          </button>
        ))}
        <a
          href="https://github.com/jinzurei"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '9px',
            letterSpacing: '2.2px',
            color: G4,
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'color 0.25s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = GHOVER)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = G4)}
        >
          github ↗
        </a>
      </div>
    </nav>
  );
}

// ─── Hero Overlay ────────────────────────────────────────
function HeroOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        padding: '0 56px',
      }}
    >
      {/* Left-side gradient backdrop — covers only the left ~55% */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.10) 68%, transparent 100%)',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'left', maxWidth: '560px' }}>
        {/* Eyebrow */}
        <p
          style={{
            ...MONO,
            fontSize: '10px',
            letterSpacing: '5px',
            color: G3,
            textTransform: 'uppercase',
            marginBottom: '22px',
          }}
        >
          TANNER LIVINGSTON
        </p>

        {/* Main theme word */}
        <VisionaryHeading />

        {/* Divider */}
        <div
          style={{
            width: '48px',
            height: '1px',
            background: G2,
            marginBottom: '26px',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            ...MONO,
            fontSize: '9px',
            letterSpacing: '4px',
            color: G4,
            textTransform: 'uppercase',
          }}
        >
          PHILOSOPHER &nbsp;·&nbsp; DEVELOPER &nbsp;·&nbsp; DESIGNER
        </p>
      </div>
    </div>
  );
}

function VisionaryHeading() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentX = useRef(-200);
  const targetX = useRef(-200);
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const lerp = () => {
      // Smoothly interpolate toward target
      const dx = targetX.current - currentX.current;
      if (Math.abs(dx) > 0.1) {
        currentX.current += dx * 0.12;
      } else {
        currentX.current = targetX.current;
      }
      el.style.setProperty('--shine-x', `${currentX.current}%`);
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Map mouse X within element to background-position range
      // 0% mouse → -100% bg, 100% mouse → 0% bg (shine layer is 200% wide)
      const relX = (e.clientX - rect.left) / rect.width; // 0..1
      targetX.current = -100 + relX * 100; // -100% to 0%
    };

    const onEnter = () => {
      isHovering.current = true;
    };

    const onLeave = () => {
      isHovering.current = false;
      // Slide shine off-screen
      targetX.current = -200;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <h1
      ref={headingRef}
      className="visionary-heading"
      style={{
        ...SERIF,
        fontSize: 'clamp(72px, 10vw, 140px)',
        fontWeight: 400,
        fontStyle: 'italic',
        lineHeight: 1,
        letterSpacing: '-1px',
        filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.5)) drop-shadow(0 2px 8px rgba(0,0,0,0.9))',
        marginBottom: '28px',
        pointerEvents: 'auto',
        cursor: 'default',
      }}
    >
      Visionary
    </h1>
  );
}

// ─── Intro Section ────────────────────────────────────────
function Intro() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        background: '#030303',
        padding: '140px 40px 120px',
        maxWidth: '960px',
        margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '40px' }}>
        001 / About
      </p>

      <h2
        style={{
          ...SERIF,
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.88)',
          lineHeight: 1.2,
          marginBottom: '56px',
          letterSpacing: '-0.5px',
        }}
      >
        Before the code,<br />
        the question.
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
        }}
      >
        <div>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
            I'm a passionate creator who blends <em style={{ color: G2 }}>imagination</em> and <em style={{ color: G2 }}>technology</em> — through digital content, game development, AI systems, and storytelling.
          </p>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginTop: '20px' }}>
            Before designing an interface, I ask what it means for a user to <em>know</em> something through it. Before architecting a system, I ask what the system is claiming about the world. Before writing a single function, I trace the logic back to its axioms.
          </p>
          {/* ── Liquid canvas — isolated from PlatoCanvas, paste your animation into LiquidCanvas.tsx ── */}
          <div style={{ flex: 1, marginTop: '32px', minHeight: '240px', position: 'relative' }}>
            <LiquidCanvas />
          </div>
        </div>
        <div>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85 }}>
            Currently diving deeper into web development, creative design, and bringing big-picture thinking to life.
          </p>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginTop: '20px' }}>
            Outside of coding, I enjoy exploring new people, learning continuously, and pushing myself to grow creatively and technically at every step — exercising curiosity, intention, and craft.
          </p>

          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: `1px solid ${G5}` }}>
            <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '24px' }}>
              Stack & inquiry
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {([
                { category: 'Frontend & Web', items: ['JavaScript', 'HTML5', 'CSS3', 'Three.js', 'WebGL/GLSL', 'React', 'TypeScript'] },
                { category: 'Backend', items: ['Node.js', 'FastAPI'] },
                { category: 'Languages', items: ['Python', 'C# / .NET'] },
                { category: 'Game Dev', items: ['Pygame', 'Panda3D'] },
                { category: 'AI / ML', items: ['LangChain', 'llama.cpp', 'ChromaDB'] },
                { category: 'Tools & DevOps', items: ['Vite', 'Git', 'GitHub Actions', 'PowerShell', 'Batch'] },
                { category: 'Design & Data', items: ['Figma', 'JSON'] },
              ] as const).map(({ category, items }) => (
                <div key={category}>
                  <p style={{ ...MONO, fontSize: '8px', letterSpacing: '1.8px', color: G4, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {category}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {items.map((t) => (
                      <StackPill key={t} label={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackPill({ label }: { label: string }) {
  return (
    <span
      style={{
        ...MONO,
        fontSize: '9px',
        letterSpacing: '1.5px',
        color: G3,
        textTransform: 'uppercase',
        padding: '5px 12px',
        border: `1px solid ${G5}`,
        borderRadius: '2px',
        transition: 'color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = GHOVER;
        el.style.borderColor = 'rgba(212,175,55,0.35)';
        el.style.boxShadow = '0 0 12px rgba(212,175,55,0.25), inset 0 0 8px rgba(212,175,55,0.06)';
        el.style.background = 'rgba(212,175,55,0.04)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = G3;
        el.style.borderColor = G5;
        el.style.boxShadow = 'none';
        el.style.background = 'transparent';
      }}
    >
      {label}
    </span>
  );
}

// ─── Quote Band ────────────────────────────────────────────
function QuoteBand() {
  const { ref, visible } = useReveal(0.2);

  return (
    <div
      ref={ref}
      style={{
        background: '#000',
        borderTop: `1px solid ${G5}`,
        borderBottom: `1px solid ${G5}`,
        padding: '80px 40px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    >
      <blockquote
        style={{
          ...SERIF,
          fontSize: 'clamp(22px, 3vw, 38px)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: G3,
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.5,
          letterSpacing: '0.3px',
        }}
      >
        "The unexamined life is not worth living."
      </blockquote>
      <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginTop: '28px' }}>
        Socrates · Apology, 38a — and every codebase I inherit
      </p>
    </div>
  );
}

// ─── Domains Section ──────────────────────────────────────
function DomainsSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section
      id="domains"
      ref={ref}
      style={{
        background: '#030303',
        padding: '120px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
        002 / Domains
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1px',
          background: G5,
          border: `1px solid ${G5}`,
        }}
      >
        {domains.map((d, i) => (
          <DomainCard key={d.label} domain={d} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function DomainCard({ domain, delay }: { domain: typeof domains[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(212,175,55,0.04)' : '#030303',
        padding: '40px 36px',
        transition: 'background 0.3s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          ...SERIF,
          fontSize: '32px',
          color: G4,
          fontStyle: 'italic',
          lineHeight: 1,
          marginBottom: '24px',
          transition: 'color 0.3s ease',
          ...(hovered ? { color: G1 } : {}),
        }}
      >
        {domain.glyph}
      </div>
      <p style={{ ...MONO, fontSize: '11px', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {domain.label}
      </p>
      <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.5px', color: G3, textTransform: 'uppercase', marginBottom: '20px' }}>
        {domain.sub}
      </p>
      <p style={{ ...MONO, fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
        {domain.description}
      </p>
    </div>
  );
}

// ─── Work Section ─────────────────────────────────────────
function WorkSection() {
  const { ref, visible } = useReveal(0.06);

  return (
    <section
      id="work"
      style={{
        background: '#000',
        padding: '120px 40px',
        borderTop: `1px solid ${G5}`,
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
          003 / Selected Work
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: G5 }}>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, delay }: { project: Project; delay: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: '#000',
        borderBottom: `1px solid ${G5}`,
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr auto',
          alignItems: 'center',
          gap: '24px',
          padding: '28px 32px',
          cursor: 'pointer',
          transition: 'background 0.25s ease',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.03)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <span style={{ ...MONO, fontSize: '10px', color: G4, letterSpacing: '1px' }}>
          {project.id}
        </span>
        <div>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.8px', color: G3, textTransform: 'uppercase', marginBottom: '8px' }}>
            {project.tag}
          </p>
          <h3
            style={{
              ...SERIF,
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <span style={{ ...MONO, fontSize: '9px', color: G4, letterSpacing: '1px' }}>
            {project.year}
          </span>
          <span
            style={{
              ...MONO,
              fontSize: '10px',
              color: G3,
              transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              display: 'inline-block',
              lineHeight: 1,
            }}
          >
            +
          </span>
        </div>
      </div>

      {/* Expanded details */}
      <div
        style={{
          maxHeight: expanded ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ padding: '0 32px 36px 104px' }}>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.85, maxWidth: '600px', marginBottom: '24px' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  ...MONO,
                  fontSize: '9px',
                  letterSpacing: '1.2px',
                  color: G3,
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  border: `1px solid ${G5}`,
                  borderRadius: '2px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {(project.github || project.live) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...MONO,
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: G3,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    border: `1px solid ${G5}`,
                    borderRadius: '2px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = GHOVER;
                    (e.currentTarget as HTMLElement).style.borderColor = G3;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = G3;
                    (e.currentTarget as HTMLElement).style.borderColor = G5;
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Source
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...MONO,
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: G3,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    border: `1px solid ${G5}`,
                    borderRadius: '2px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = GHOVER;
                    (e.currentTarget as HTMLElement).style.borderColor = G3;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = G3;
                    (e.currentTarget as HTMLElement).style.borderColor = G5;
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Site
                </a>
              )}
              {project.github && project.live && (
                <span style={{ ...MONO, fontSize: '8px', color: G4, letterSpacing: '1px' }}>
                  ·
                </span>
              )}
              {project.live && (
                <span style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px' }}>
                  {project.live.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Essay Modal ──────────────────────────────────────────
function EdgeParticleCanvas({ cardRef }: { cardRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Pt {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      radius: number;
      r: number; g: number; b: number;
    }

    const pool: Pt[] = [];

    const spawn = () => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const edge = Math.floor(Math.random() * 4);
      const speed = 0.3 + Math.random() * 0.8;
      const drift = (Math.random() - 0.5) * 0.4;
      let x: number, y: number, vx: number, vy: number;

      if (edge === 0) { x = rect.left + Math.random() * rect.width; y = rect.top; vx = drift; vy = -speed; }
      else if (edge === 1) { x = rect.right; y = rect.top + Math.random() * rect.height; vx = speed; vy = drift; }
      else if (edge === 2) { x = rect.left + Math.random() * rect.width; y = rect.bottom; vx = drift; vy = speed; }
      else { x = rect.left; y = rect.top + Math.random() * rect.height; vx = -speed; vy = drift; }

      let r: number, g: number, b: number;
      if (Math.random() < 0.65) {
        r = 190 + Math.floor(Math.random() * 65); g = 150 + Math.floor(Math.random() * 60); b = 30 + Math.floor(Math.random() * 50);
      } else {
        r = 255; g = 240 + Math.floor(Math.random() * 15); b = 190 + Math.floor(Math.random() * 60);
      }

      const maxLife = 80 + Math.floor(Math.random() * 120);
      pool.push({ x, y, vx, vy, life: maxLife, maxLife, radius: 0.5 + Math.random() * 1.5, r, g, b });
    };

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 4; i++) spawn();
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) { pool.splice(i, 1); continue; }
        const frac = p.life / p.maxLife;
        let alpha = frac > 0.85 ? (1 - frac) / 0.15 : frac < 0.25 ? frac / 0.25 : 1;
        alpha *= 0.72;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha * 0.10})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha * 0.88})`; ctx.fill();
      }
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [cardRef]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 201 }} />;
}

function EssayModal({ essay, onClose }: { essay: Essay | null; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!essay) { setVisible(false); return; }
    const id = setTimeout(() => setVisible(true), 16);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [essay, onClose]);

  if (!essay) return null;

  return (
    <>
      <EdgeParticleCanvas cardRef={cardRef} />
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.86)', cursor: 'pointer' }} />
      {/* Card */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -48%) scale(0.97)',
          zIndex: 202,
          background: '#070707',
          border: `1px solid ${G2}`,
          maxWidth: '700px', width: 'calc(100% - 48px)',
          maxHeight: '82vh', overflowY: 'auto',
          padding: 'clamp(32px, 5vw, 60px)',
          boxShadow: `0 0 60px rgba(212,175,55,0.12), 0 0 160px rgba(212,175,55,0.05)`,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.38s ease, transform 0.38s ease',
        }}
      >
        <button
          onClick={onClose}
          style={{ ...MONO, position: 'absolute', top: '18px', right: '22px', background: 'none', border: 'none', color: G3, fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px 8px', transition: 'color 0.2s' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = GHOVER)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = G3)}
        >×</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase' }}>{essay.tag}</p>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.5px', color: G4 }}>{essay.date}</p>
        </div>

        <h2 style={{ ...SERIF, fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.2, marginBottom: '28px' }}>
          {essay.title}
        </h2>

        <div style={{ width: '36px', height: '1px', background: G2, marginBottom: '32px' }} />

        <p style={{ ...MONO, fontSize: '13px', lineHeight: 1.95, color: 'rgba(255,255,255,0.60)' }}>
          {essay.excerpt}
        </p>

        <div style={{ marginTop: '44px', paddingTop: '22px', borderTop: `1px solid ${G5}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ ...SERIF, fontSize: '12px', fontStyle: 'italic', color: G4 }}>— Tanner Livingston</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* PDF download icon button */}
            <a
              href={essay.pdf}
              download
              onClick={(e) => e.stopPropagation()}
              title="Download PDF"
              style={{
                ...MONO,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '9px',
                letterSpacing: '1.8px',
                color: G1,
                textTransform: 'uppercase',
                textDecoration: 'none',
                background: 'rgba(212,175,55,0.05)',
                border: `1px solid ${G2}`,
                borderRadius: '2px',
                padding: '6px 14px',
                transition: 'background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(212,175,55,0.12)';
                el.style.boxShadow = '0 0 18px rgba(212,175,55,0.18)';
                el.style.color = GHOVER;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(212,175,55,0.05)';
                el.style.boxShadow = 'none';
                el.style.color = G1;
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PDF
            </a>
            <button
              onClick={onClose}
              style={{ ...MONO, fontSize: '9px', letterSpacing: '1.8px', color: G3, textTransform: 'uppercase', background: 'none', border: `1px solid ${G5}`, borderRadius: '2px', padding: '6px 14px', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GHOVER; (e.currentTarget as HTMLElement).style.borderColor = G3; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = G3; (e.currentTarget as HTMLElement).style.borderColor = G5; }}
            >Close</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Writing Section ──────────────────────────────────────
function WritingSection() {
  const { ref, visible } = useReveal(0.08);
  const [openEssay, setOpenEssay] = useState<Essay | null>(null);

  return (
    <>
      <EssayModal essay={openEssay} onClose={() => setOpenEssay(null)} />
      <section
        id="writing"
        style={{
          background: '#030303',
          padding: '120px 40px',
          borderTop: `1px solid ${G5}`,
        }}
      >
        <div
          ref={ref}
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
            004 / Writing
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            {essays.map((e, i) => (
              <EssayRow key={e.title} essay={e} delay={i * 80} onClick={() => setOpenEssay(e)} />
            ))}
          </div>

          <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: `1px solid ${G5}` }}>
            <p style={{ ...MONO, fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.8 }}>
              These essays exist at the intersection of technical practice and philosophical inquiry. They are working documents — arguments in progress.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function EssayRow({ essay, delay, onClick }: { essay: Essay; delay: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '32px 0',
        borderBottom: `1px solid ${G5}`,
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
        opacity: hovered ? 1 : 0.8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.8px', color: G4, textTransform: 'uppercase', marginBottom: '12px' }}>
            {essay.tag}
          </p>
          <h3
            style={{
              ...SERIF,
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              fontWeight: 400,
              color: hovered ? G1 : 'rgba(255,255,255,0.80)',
              lineHeight: 1.3,
              marginBottom: '14px',
              transition: 'color 0.25s ease',
            }}
          >
            {essay.title}
          </h3>
          <p style={{ ...MONO, fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.8, maxWidth: '520px' }}>
            {essay.excerpt}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '2px', flexShrink: 0 }}>
          <span style={{ ...MONO, fontSize: '9px', color: G4, letterSpacing: '1px' }}>
            {essay.date}
          </span>
          <span
            style={{
              ...MONO,
              fontSize: '12px',
              color: hovered ? G1 : G4,
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              transition: 'transform 0.25s ease, color 0.25s ease',
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Contact / Footer ─────────────────────────────────────
function Contact() {
  const { ref, visible } = useReveal(0.15);

  return (
    <section
      id="contact"
      style={{
        background: '#000',
        borderTop: `1px solid ${G5}`,
        padding: '120px 40px 80px',
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
          005 / Contact
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
          <div>
            <h2
              style={{
                ...SERIF,
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.2,
                marginBottom: '28px',
              }}
            >
              Let's think<br />together.
            </h2>
            <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
              I'm interested in projects that ask difficult questions — where the design problem is actually a philosophical problem in disguise.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '20px' }}>
            {[
              { label: 'GitHub', value: 'jinzurei', href: 'https://github.com/jinzurei' },
              { label: 'Portfolio', value: 'jinzurei.github.io/portfolio', href: 'https://jinzurei.github.io/portfolio/' },
              { label: 'Email', value: 'available on request', href: null },
            ].map(({ label, value, href }) => (
              <div key={label} style={{ paddingBottom: '20px', borderBottom: `1px solid ${G5}` }}>
                <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '8px' }}>
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...MONO,
                      fontSize: '13px',
                      color: G3,
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = GHOVER)}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = G3)}
                  >
                    {value} ↗
                  </a>
                ) : (
                  <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>
                    {value}
                  </p>
                )}
              </div>
            ))}

            {/* ── CV / Résumé download — replace href with the real hosted PDF path ── */}
            <div style={{ paddingTop: '4px' }}>
              <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '14px' }}>
                Curriculum Vitae
              </p>
              <a
                href="/tanner-livingston-cv.pdf"
                download="Tanner_Livingston_CV.pdf"
                style={{
                  ...MONO,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  color: G1,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '11px 20px',
                  border: `1px solid ${G2}`,
                  borderRadius: '2px',
                  background: 'rgba(212,175,55,0.05)',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(212,175,55,0.12)';
                  el.style.boxShadow = '0 0 24px rgba(212,175,55,0.18)';
                  el.style.color = GHOVER;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(212,175,55,0.05)';
                  el.style.boxShadow = 'none';
                  el.style.color = G1;
                }}
              >
                {/* download arrow */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV / Résumé
              </a>
              <p style={{ ...MONO, fontSize: '9px', color: G4, letterSpacing: '1px', marginTop: '10px' }}>
                PDF · Updated 2026
              </p>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            marginTop: '100px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase' }}>
            Tanner Livingston © 2025
          </p>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.5px', color: G4, textTransform: 'uppercase' }}>
            Philosophy · Code · Design · Writing · Games
          </p>
          <p style={{ ...SERIF, fontSize: '11px', fontStyle: 'italic', color: G4 }}>
            "The unexamined code is not worth shipping."
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: '#030303', color: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div style={{ position: 'relative' }}>
        <PlatoCanvas />
        <HeroOverlay />
      </div>
      <Intro />
      <QuoteBand />
      <DomainsSection />
      <WorkSection />
      <WritingSection />
      <Contact />
    </div>
  );
}