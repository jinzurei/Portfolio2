import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import React from 'react';
import { PlatoCanvas } from './components/PlatoCanvas';
import { PlatoCanvasMobile } from './components/PlatoCanvasMobile';
import { TannerCanvas } from './components/TannerCanvas';
import { useIsMobile } from './components/ui/use-mobile';

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
  fullContent?: (string | { type: 'equation'; equation: string; explanation: string })[];
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
    title: 'Plant search engine',
    year: '2024',
    description:
      'A comprehensive web development course project featuring multiple interactive applications. Includes a responsive temple gallery with dynamic filtering, a plant encyclopedia with botanical API integration and local CSV data mapping, and JavaScript applications demonstrating DOM manipulation, progressive enhancement, and lazy loading.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    github: 'https://github.com/jinzurei/wdd131',
    live: 'https://jinzurei.github.io/wdd131/project/search.html',
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
    title: 'Between Bytes and Books: AI\'s Role in Creative Expression',
    date: 'Oct 2023',
    excerpt:
      'A critical argumentative analysis of the Authors Guild v. OpenAI lawsuit. Examines how we should carefully approach AI training ethics, creative labor, and intellectual property through legal, economic, and philosophical lenses. Argues for a path where technology amplifies—rather than displaces—human creativity.',
    tag: 'AI · Analysis',
    pdf: 'essays/Bytes to books.pdf',
    fullContent: [
      'The recent lawsuit against OpenAI has ignited a pivotal conversation about the intersection of artificial intelligence and creative expression. The complaint is not merely a litigation document; rather a mirror reflecting the broader societal and ethical contemplations intertwined with AI\'s flourishing capabilities. This case is a narrative of transformation, a story that will be written in the silent spaces of courtrooms, in the intricate lines of code, and in the profound reflections of every stakeholder in the AI and creative ecosystems.',
      
      'The authors\' primary contention lies in the alleged illegal use of their copyrighted works for AI training. This claim, as articulated in Zhan\'s ABC News article underscores the core of the legal battle. It brings to light the opaque nature of AI training datasets and raises pertinent questions about the boundaries of fair use. OpenAI\'s defense, rooted in the principle of fair use, posits AI as a transformative entity that creates original expressions rather than replicating existing works. This perspective, while valid, is set against the backdrop of authors\' concerns about the commodification and unauthorized use of their creative outputs.',
      
      'As an enthusiast venturing into the domain of AI development, I find myself both a spectator and contributor to the ongoing saga of AI melding with the creative sphere. The foundation of training an AI model lies in its training corpus, a rich tapestry of text harvested from an array of sources encompassing books, articles, websites, and other textual mediums. In the spotlight of Authors Guild V. OpenAI, the literary contributions of revered authors such as George R.R. Martin can find their way into an AI\'s training corpus. This inclusion enables models like ChatGPT to absorb and emulate the stylistic and thematic nuances embedded in these texts. Max Zahn\'s article on ABC News lays bare the friction between individual creative liberties and the communal intellect epitomized by AI, voicing a contention against the incorporation and utilization of copyrighted materials in the training corpus.',
      
      'As the narrative unfolds, it beckons a deeper introspection, not just of the legal frameworks that govern AI and creative expression but of the ethical imperatives that underlie the discourse surrounding the commodification of creative labor. This legal endeavor, spearheaded by the writers guild, gestures towards a burgeoning era of alienation and displacement, where the essence of human creativity is at risk of being eclipsed by the behemoth of machine-generated content. The contention lies in the heart of the process—ChatGPT\'s training on a plethora of copyrighted works, albeit without permission, commodifying the labor of authors without attributing due credit or compensation. This commodification not only threatens the livelihood of individual authors but also heralds a potential erasure of human essence in literary creations.',
      
      'Despite the valid concerns raised by Max Zhan and the Writers Guild, I hold a conviction that excising the works of adept authors from the training corpus may not derail the imminent evolution or prowess of AI as seemingly insinuated in Zahn\'s narrative. While Zahn\'s exposition isn\'t devoid of merit concerning the industry impacts, the trajectory of AI\'s capabilities perhaps remains unswayed. While removing the works of the authors from the training corpus could ensure the protection of the authors intellectual property, I believe artificial intelligence does not rely solely on the works of others, but rather through the implementation of higher processing speeds, AI like ChatGPT can allow for a method of continuation at a high skill of writing to be produced. As with higher processing speeds used, the AI can think faster and produce writings to the same degree of penmanship without the need to use an author\'s collective works within its training data.',
      
      'Moreover, the lawsuit illuminates a pivotal shift in the control over the means of production, a core tenet of Marxist analysis. Traditionally, the pen and paper, and in modern times, digital platforms, have served as the means through which authors produce and disseminate their work. However, with the advent of AI, entities like OpenAI are emerging as new gatekeepers, potentially usurping control from individual creators and their guilds. The control over, and access to, AI technologies can significantly dictate the dynamics of creative production, thereby redefining the power structures within the literary domain.',
      
      'Furthermore, the narrative of AI as a marvel of human ingenuity, as posited in the lawsuit, stands juxtaposed against the looming specter of alienation. The very technology born out of human intellect now threatens to displace the human act of creative expression. While AI like ChatGPT is hailed for its ability to augment human creativity, the lawsuit highlights the precipice we teeter upon—where the line between augmentation and replacement is perilously thin.',
      
      'It is imperative to approach the issue with an open mind, understanding, and empathy. The future of AI and creative expression is not set in stone; it is a tapestry that we are weaving together. Every decision, every judgment, every piece of code, and every written word will shape this shared future. AI, with its transformative potential, holds the promise of amplifying human creativity, of ushering in an era where creative works reach new heights of innovation and impact. The challenge, and indeed the opportunity, lies in forging a path where AI and creative expression coexist, where technology amplifies rather than diminishes the human creative spirit.',
    ],
  },
  {
    title: 'How I stopped trusting the frame rate and learned to love Δt',
    date: 'Jan 2026',
    excerpt:
      'I engineered a physics system where gravity responds directly to player input. Hold jump = 1.0x gravity. Release early = 1.7x snappy response. Falling = 1.8x weight. Every action drives the physics in real-time. The frame-rate independence ensures consistency across hardware, but the real innovation is architectural: I put player agency at the center. Physics aren\'t constraints; they\'re expressions of player intent.',
    tag: 'Game Dev · Physics',
    pdf: 'essays/How I stopped trusting the frame rate and learned to love Δt.pdf',
    fullContent: [
      'When you\'re a student developer, it\'s easy to just follow the standard tutorials and accept how things are built. But the more I studied software, the more I realized that every architecture is essentially an argument. I decided it was time to stop relying on pre-packaged solutions and start drafting my own. I wanted to teach myself the absolute fundamentals of digital motion, control, and structure.',
      
      'The result was a solo project built entirely from the ground up in Python using the Pygame library. It\'s a custom 2D platformer engine that I named I Am The Fool. I chose the title because I knew exactly what I was getting myself into: I was going to make mistakes, chase my own tail, and purposefully over-engineer the solution. This wasn\'t about rushing a perfect project; it was a confrontation between me, the architect, and me, the fool, both fighting to evolve.',
      
      'Nowhere was this internal conflict more apparent than in how I chose to handle the concept of time.',
      
      'If you are new to game development and look up a standard tutorial on how to make a character jump, the recommendation is usually straightforward. The engine essentially tells you to update your character\'s position based on their velocity, and then update that velocity by a fixed gravity value. In code, it looks something like pos += vel followed by vel += gravity. It is explicit, easy to read, and—crucially—entirely dependent on the frame rate of the game.',
      
      'In that standard model, time is an illusion created by your monitor\'s refresh rate. If your game runs at 60 frames per second, gravity pulls your character down 60 times a second. If a background process hogs your computer\'s memory and your game dips to 30 frames per second, your character literally hangs in the air longer. The physics of the simulated world are fundamentally tethered to the hardware it runs on. This creates drift, instability, and completely inconsistent jump arcs. For a platformer game—where motion feel, pixel-perfect precision, and tight controls are the entire point—a hardware-dependent reality is unacceptable.',
      
      'I didn\'t want the easy way out. I wanted a standalone physics system that respected the passage of time regardless of how many frames the graphics card managed to push out.',
      
      'To achieve this, I abandoned the standard beginner\'s loop and implemented a Symplectic (or Semi-Implicit) Euler integrator. Underneath the intimidating math term, the concept is actually quite elegant: the engine completely decouples the visual rendering step from the underlying physical simulation. Instead of blindly adding pixels per frame, every single movement is calculated using a delta-time multiplier (Δt)—the actual, real-world fraction of a second that has passed since the last calculation. More importantly, the order of operations flips. Instead of changing the position and then the velocity, Symplectic Euler updates the velocity first. We calculate the new velocity based on gravity, the player\'s input acceleration, and dash impulses. Then, that newly updated velocity drives the change in position.',
      
      'The result is stable, frame-rate-independent physics. Whether the game is chugging at 20 frames per second on an old laptop or flying at 144 on a high-end rig, a jump covers the exact same distance in the exact same amount of real-world time.',
      
      'But I was already playing the fool, so I didn\'t stop at just fixing the math. I over-engineered the "feel" of the jump itself. Real-world gravity is constant, but video game gravity shouldn\'t be. I built a dynamic multiplier for gravity that changes depending on the player\'s inputs. If you hold the jump button, downward gravity is a standard 1400 px/s². If you release the button early for a short hop, a 1.7x multiplier kicks in, slamming you back to the ground. If you are falling from a ledge, a 1.8x multiplier gives the descent a heavy, snappy feel. I even added a terminal velocity cap of 2600 px/s and variable-height easing functions to smooth out the apex of the jump.',
      
      'Was any of this strictly necessary for a simple 2D Pygame project? Absolutely not. I could have imported a pre-packaged physics library or stuck to the basic formulas. But building I Am The Fool was a technical reflection. By forcing myself to manually construct a custom engine, divide the architecture cleanly, and solve the problem of time with discrete math, I wasn\'t just writing code. I was learning what it takes to play god in a digital universe—dictating the laws of physics, suffering the consequences of bad design, and slowly turning the fool into the architect.',
    ],
  },
  {
    title: 'The Portfolio as Self-Portrait',
    date: 'March 2026',
    excerpt:
      'When a portfolio becomes a case study of its own design philosophy, every decision—from rendering strategy to navigation hierarchy to color science—becomes legible proof of process. This is an essay about making the invisible visible: how engineering rigor, design intentionality, and philosophical coherence can be woven into a single site that communicates across disciplines. Read this if you want to understand how to build with measurable care.',
    tag: 'Design · Identity',
    pdf: 'essays/The Portfolio as Self-Portrait.pdf',
    fullContent: [
      'A portfolio is never just a collection of projects. It is a working demonstration of how the maker thinks and builds. When I started this site, I treated it exactly like any other system I ship: begin with the user\'s needs, define the information architecture from first principles, then implement with progressive enhancement, semantic markup, and measurable performance targets. The brief I gave myself was straightforward. I wanted to create a digital self-portrait that reveals my process—philosophy as the immutable foundation, full-stack execution, and user-first decisions—without forcing the visitor to read a résumé first. Every choice had to prove that I design and code with the person on the other side of the screen in mind, whether that person is a fellow developer scanning the stack, a hiring manager evaluating fit, or someone simply curious about the thinking behind the work.',

      'I began the build the same way I begin every project: with user-centered research. I ran informal card-sorting sessions on paper to map my own mental model of problem-solving, then translated those insights into low-fidelity wireframes in Figma. From there I moved to high-fidelity prototypes, testing focus order, hover states, and scroll behavior on both desktop and mobile. Only after validating the flows did I open the editor. This process—empathy mapping, iterative prototyping, and validation against real user scenarios—became the backbone of the entire site.',

      'The hero portrait is the most technically revealing piece on the page. Instead of a static raster image, I built a generative spring-physics particle system that samples the bust photograph pixel-by-pixel and converts every non-black pixel into a coloured particle held in place by spring forces. The system maintains 80–120k particles in Float32Array typed arrays—not heterogeneous objects—because JavaScript engines JIT-optimise tight loops over typed arrays far better than over object arrays. Each frame, every particle is pulled back toward its home position by a spring force weighted by its distance, damped to prevent infinite oscillation, and repelled away from the cursor by an inverse-distance force that creates a liquid, bubbly scatter effect. I disabled Three.js and used vanilla Canvas 2D rendering with hand-tuned physics constants: spring stiffness of 0.048, damping of 0.876 to settle after ~8 oscillations, a repulsion radius of 90px, and peak repulsion force of 22. The system also computes per-particle independent shimmer using sine-wave phases so every particle twinkles at its own cadence rather than flashing in unison. This low-level control lets the portrait behave like liquid marble—suspended in spring tension, responsive to touch, and algorithmically alive without the overhead of Three.js scene graphs. The visual result rewards sustained attention: the portrait only fully resolves when the visitor pauses because I tuned the particle density and spring constants to resolve slower than typical eye saccades. This mirrors exactly how I approach all interactive systems—give the user control over depth of engagement, never assume they want fireworks on first load.',

      { type: 'equation', equation: 'F_spring = (p_origin - p_current) × K\nv_new = (v_old + F_spring) × damping\np_new = p_current + v_new', explanation: 'Spring physics per particle per frame. K (stiffness) controls snap; damping multiplier (0.876) prevents oscillation runaway. For mouse repulsion: additional force applies based on distance from cursor, falling off linearly to 0 at repulsion radius boundary.' },

      'Color and typography were engineered as a tightly constrained design system using CSS custom properties for theming and easy maintenance. The near-black base (#0a0a0a) establishes strong figure-ground contrast in line with Gestalt principles while providing generous negative space. The single accent gold (#d4af37) was chosen because it resonates with the warm luminosity of the particle silhouettes in the hero animation; it serves as both an emotional cue and a functional affordance for links, headings, and interactive elements. I validated the entire palette against WCAG AA contrast ratios on every viewport size using automated tools, then cross-checked with manual testing on high-contrast modes.',

      { type: 'equation', equation: 'C_ratio = (L_light + 0.05) / (L_dark + 0.05) ≥ 4.5', explanation: 'WCAG AA contrast ratio formula ensuring legibility for all users. L represents relative luminance values normalized to [0, 1]. All text and interactive elements meet or exceed the 4.5:1 minimum across all viewport sizes and high-contrast modes.' },

      'Typography follows a modular scale: a warm display face for headings to give quiet presence, and a highly legible sans-serif body font with a 1.75 line-height ratio and a maximum measure of approximately 680 px on long-form pages.',

      { type: 'equation', equation: 'ideal_measure ≈ 2.5 × x-height_px', explanation: 'Optimal line length derived from classical readability research. The 680px measure is calculated from this ratio, reducing cognitive load and improving comprehension on extended text blocks.' },

      'Navigation and content flow were built in React with a component library that follows atomic design principles. The Domains section leads with a responsive CSS Grid of thematic cards rather than a traditional hero banner. Each card uses a simple inline SVG icon (lambda for Philosophy, delta for Full-Stack Engineering, rounded square for UI/UX as Phenomenology, and so on) and follows the exact hierarchy I use when approaching any new problem: Philosophy sits at the root because it is the layer I apply before writing a single function or drawing a single layout. On smaller screens, Flexbox handles the stack with mobile-first breakpoints, preserving scannability and logical tab order. ARIA landmarks, role attributes, and proper heading hierarchy were implemented from the first commit so screen-reader users receive the same information architecture as sighted visitors.',

      'The Selected Work section groups projects thematically rather than by date because that is how I actually reason across domains. Ignis (my local AI cognitive architecture) sits beside I Am The Fool (the game engine piece) because both explore memory, forgetting, and procedural generation—one through episodic recall and semantic compression in a LangChain-based system, the other through PyGame and entity-component patterns. Rapidds Rafting and the Plant Search Engine share space because both demonstrate the same production-grade patterns I ship for clients: semantic HTML5 architecture, modern CSS Grid and Flexbox layouts, Google Maps API integration with proper accessibility, and continuous deployment via GitHub Actions. Each project card uses semantic <article> markup, includes live-site and repository links, and displays a concise tech-stack summary using microdata. This lets technical readers quickly assess architectural decisions—React components, TypeScript typing, Node.js/FastAPI backends, WebGL/GLSL shaders, and W3C standards validation—without friction or guesswork.',

      'The Writing section extends the same architectural consistency. Essay modals are full-screen overlays that spawn a Canvas 2D particle background layer as a subtle visual continuation, ensuring smooth visual transitions without performance hits. Text content lives in a narrow column with proper heading hierarchy, generous whitespace, and reduced-motion support via the prefers-reduced-motion media query. I prototyped these modals in Figma, then translated them to production code that passes Lighthouse accessibility, performance, and best-practices audits on every commit. The layout deliberately minimizes distractions so the reader can focus on the argument—whether it is AI training ethics, the phenomenology of perception through interface design, or memory systems in local LLMs—exactly the way I want my own thinking to be received.',

      'Even the contact section was engineered for clarity and low friction. Links use consistent button styling with CSS transition-based hover states that provide immediate visual feedback. The CV download is a static PDF served from the same GitHub Pages pipeline that hosts the entire site, keeping the deployment surface minimal and auditable. "Let\'s think together" is simply the final call-to-action: an invitation to move from passive browsing to actual conversation, supported by direct GitHub, email, and archive links.',

      'Every technical decision on this site—from the spring physics constants down to the CSS Grid breakpoints, from semantic landmark roles to GitHub Actions workflows—was made using the same process I apply to client work or personal experiments: start from first principles, validate against real user needs (time, attention, accessibility, performance), measure results with real metrics, and iterate until the experience feels honest and quiet.',

      { type: 'equation', equation: 'Lighthouse ≥ 95\nCLS < 0.1\nFCP < 1.2s (throttled)\nCanvas frame time ≤ 16.67ms (60 fps)', explanation: 'Measurable performance targets enforced on every deployment. Lighthouse accessibility score benchmarks inclusive design. Cumulative Layout Shift and First Contentful Paint ensure smooth, responsive experience. Canvas physics and rendering stay within frame budget even on mid-range devices with 80–120k particles.' },

      'The stack I used here (React, TypeScript, Canvas 2D with typed arrays for physics, Tailwind-free vanilla CSS, GitHub Pages with CI) is the same stack I ship elsewhere. There is nothing hidden; the code is public, the decisions are traceable, and the care is measurable.',

      'In the end, this portfolio is my most complete self-portrait because every layer—frontend, backend patterns, spring physics architecture, accessibility layers, and performance budgeting—was built the same way I approach everything else: with the user in mind from the first axiom to the final interaction. I kept asking the same question at every step: How does this feel to the person reading it? Does it respect their time? Does it clearly show the way I like to work—asking first, building second, and always leaving room for them to step in if they choose?',

      'A traditional portfolio captures a single moment in time. This one tries to capture a consistent way of moving through problems, one thoughtful decision at a time.',

      'If you have read this far, you have already experienced the through-line I wanted to show. Thank you for giving it your time and attention.',
    ],
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
const G1 = '#F2D46A';                // solid gold (brighter)
const G2 = 'rgba(242,212,106,0.90)'; // rich gold
const G3 = 'rgba(242,212,106,0.58)'; // muted gold
const G4 = 'rgba(242,212,106,0.30)'; // subtle gold
const G5 = 'rgba(242,212,106,0.14)'; // barely-there gold (borders)
const GHOVER = '#FFE79A';            // bright gold hover

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
  const isMobile = useIsMobile();

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
    <>
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
          padding: isMobile ? '16px 20px' : '20px 40px',
          transition: 'background 0.5s ease, border-color 0.5s ease',
          background: scrolled ? 'rgba(3,3,3,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${G5}` : '1px solid transparent',
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontSize: isMobile ? '9px' : '11px',
            letterSpacing: '3.5px',
            color: G2,
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {isMobile ? 'TL' : 'TANNER LIVINGSTON'}
        </button>

        {/* Desktop links */}
        {!isMobile && (
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
        )}

        {/* Mobile hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              alignItems: 'flex-end',
              position: 'relative',
              width: '32px',
              height: '32px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '2px',
                background: G2,
                transition: 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
                transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
              }}
            />
            <div
              style={{
                width: '24px',
                height: '2px',
                background: G2,
                transition: 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
                marginTop: '6px',
                transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
              }}
            />
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: menuOpen ? 'rgba(3,3,3,0.95)' : 'rgba(3,3,3,0)',
            backdropFilter: menuOpen ? 'blur(12px)' : 'blur(0px)',
            borderBottom: menuOpen ? `1px solid ${G5}` : '1px solid transparent',
            display: 'flex',
            flexDirection: 'column',
            padding: menuOpen ? '16px' : '0px',
            gap: '12px',
            maxHeight: menuOpen ? '300px' : '0px',
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
            pointerEvents: menuOpen ? 'auto' : 'none',
          }}
        >
          {links.map((s, i) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              style={{
                fontSize: '10px',
                letterSpacing: '2px',
                color: G4,
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
                textAlign: 'left',
                transition: 'color 0.25s ease, transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.35s ease',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-16px)',
                opacity: menuOpen ? 1 : 0,
                transitionDelay: menuOpen ? `${i * 40}ms` : '0ms',
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
              fontSize: '10px',
              letterSpacing: '2px',
              color: G4,
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '8px 0',
              transition: 'color 0.25s ease, transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.35s ease',
              transform: menuOpen ? 'translateX(0)' : 'translateX(-16px)',
              opacity: menuOpen ? 1 : 0,
              transitionDelay: menuOpen ? `${links.length * 40}ms` : '0ms',
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
      )}
    </>
  );
}

// ─── Hero Overlay ────────────────────────────────────────
function HeroOverlay() {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: isMobile ? 'center' : 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        padding: isMobile ? '24px' : '0 56px',
      }}
    >
      {/* Left-side gradient backdrop — covers only the left ~55% on desktop, full on mobile */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isMobile 
            ? 'radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 35%, rgba(0,0,0,0.40) 80%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.10) 68%, transparent 100%)',
        }}
      />

      <div style={{ position: 'relative', textAlign: isMobile ? 'center' : 'left', maxWidth: isMobile ? '100%' : '560px' }}>
        {/* Eyebrow */}
        <p
          style={{
            ...MONO,
            fontSize: isMobile ? '8px' : '10px',
            letterSpacing: isMobile ? '3px' : '5px',
            color: G3,
            textTransform: 'uppercase',
            marginBottom: isMobile ? '12px' : '22px',
          }}
        >
          TANNER LIVINGSTON
        </p>

        {/* Main theme word */}
        <VisionaryHeading />

        {/* Divider */}
        <div
          style={{
            width: isMobile ? '36px' : '48px',
            height: '1px',
            background: G2,
            marginBottom: isMobile ? '12px' : '26px',
            marginLeft: isMobile ? 'auto' : 0,
            marginRight: isMobile ? 'auto' : 0,
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            ...MONO,
            fontSize: isMobile ? '7px' : '9px',
            letterSpacing: isMobile ? '2px' : '4px',
            color: G1,
            textTransform: 'uppercase',
            animation: 'shine-glow 3s ease-in-out infinite',
            textShadow: '0 0 0 rgba(242, 212, 106, 0)',
          }}
        >
          {isMobile ? 'PHILOSOPHER · DEVELOPER · DESIGNER' : 'PHILOSOPHER\u00A0·\u00A0 DEVELOPER\u00A0·\u00A0 DESIGNER'}
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

// ─── Reusable Shine Text Component ────────────────────────
interface ShineTextProps {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3';
  style?: CSSProperties;
}

function ShineText({ children, as: Component = 'p', style }: ShineTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const currentX = useRef(-200);
  const targetX = useRef(-200);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const lerp = () => {
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
      const relX = (e.clientX - rect.left) / rect.width;
      targetX.current = -100 + relX * 100;
    };

    const onLeave = () => {
      targetX.current = -200;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return React.createElement(Component as any, {
    ref: elementRef,
    className: 'visionary-heading',
    style: {
      ...style,
      pointerEvents: 'auto',
      cursor: 'default',
    },
    children,
  });
}

// ─── Intro Section ────────────────────────────────────────
function Intro() {
  const { ref, visible } = useReveal(0.1);
  const isMobile = useIsMobile();

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
      <ShineText as="p" style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '40px' }}>
        001 / About
      </ShineText>

      <ShineText
        as="h2"
        style={{
          ...SERIF,
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: G1,
          lineHeight: 1.2,
          marginBottom: '56px',
          letterSpacing: '-0.5px',
        }}
      >
        Before the code,<br />
        the question.
      </ShineText>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
        }}
      >
        <div>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
            I'm a BYU Idaho student and passionate creator who blends <em style={{ color: G2 }}>imagination</em> and <em style={{ color: G2 }}>technology</em> — through digital content, game development, AI systems, and storytelling.
          </p>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginTop: '20px' }}>
            Before designing an interface, I ask what it means for a user to <em>know</em> something through it. Before architecting a system, I ask what the system is claiming about the world. Before writing a single function, I trace the logic back to its axioms.
          </p>
          {/* Secondary portrait canvas placed left of Stack & inquiry column — desktop only */}
          {!isMobile && (
            <div
              style={{
                marginTop: '32px',
                width: 'clamp(365px, 52%, 300px)',
                height: 'clamp(575px, 18vw, 360px)',
                position: 'relative',
              }}
            >
              <TannerCanvas />
            </div>
          )}
        </div>
        <div>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85 }}>
            Currently diving deeper into web development, creative design, and bringing big-picture thinking to life.
          </p>
          <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginTop: '20px' }}>
            Outside of coding, I enjoy exploring new people, learning continuously, and pushing myself to grow creatively and technically at every step — exercising curiosity, intention, and craft.
          </p>

          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: `1px solid ${G5}` }}>
            <ShineText as="p" style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '24px' }}>
              Stack & inquiry
            </ShineText>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {([
                { category: 'Frontend & Web', items: ['JavaScript', 'HTML5', 'CSS3', 'Three.js', 'WebGL/GLSL', 'React', 'TypeScript'] },
                { category: 'Backend', items: ['Node.js', 'FastAPI'] },
                { category: 'Runtime', items: ['Python', 'C# / .NET'] },
                { category: 'Game Dev', items: ['Pygame', 'Panda3D'] },
                { category: 'AI / ML', items: ['LangChain', 'llama.cpp', 'ChromaDB'] },
                { category: 'Tools & DevOps', items: ['Vite', 'Git', 'GitHub Actions', 'PowerShell', 'Batch'] },
                { category: 'Design & Data', items: ['Figma', 'JSON'] },
              ] as const).map(({ category, items }) => (
                <div key={category}>
                  <ShineText as="p" style={{ ...MONO, fontSize: '8px', letterSpacing: '1.8px', color: G4, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {category}
                  </ShineText>
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

// ─── Quote Band ───────────────────────────────────────────
function QuoteHeading() {
  const quoteRef = useRef<HTMLElement>(null);
  const attributionRef = useRef<HTMLElement>(null);
  const currentX = useRef(-200);
  const targetX = useRef(-200);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = quoteRef.current;
    const attrEl = attributionRef.current;
    if (!el || !attrEl) return;

    const lerp = () => {
      // Smoothly interpolate toward target
      const dx = targetX.current - currentX.current;
      if (Math.abs(dx) > 0.1) {
        currentX.current += dx * 0.12;
      } else {
        currentX.current = targetX.current;
      }
      el.style.setProperty('--shine-x', `${currentX.current}%`);
      attrEl.style.setProperty('--shine-x', `${currentX.current}%`);
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

    const onLeave = () => {
      // Slide shine off-screen
      targetX.current = -200;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    attrEl.addEventListener('mousemove', onMove);
    attrEl.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      attrEl.removeEventListener('mousemove', onMove);
      attrEl.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <blockquote
        ref={quoteRef as any}
        className="visionary-heading"
        style={{
          ...SERIF,
          fontSize: 'clamp(22px, 3vw, 38px)',
          fontStyle: 'italic',
          fontWeight: 400,
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.5,
          letterSpacing: '0.3px',
          pointerEvents: 'auto',
          cursor: 'default',
        }}
      >
        "Knowledge which is acquired under compulsion obtains no hold on the mind."
      </blockquote>
      <p
        ref={attributionRef as any}
        className="visionary-heading"
        style={{
          ...MONO,
          fontSize: '9px',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginTop: '28px',
          pointerEvents: 'auto',
          cursor: 'default',
        }}
      >
        — Plato, The Republic
      </p>
    </>
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
      <QuoteHeading />
    </div>
  );
}

// ─── Domains Section ──────────────────────────────────────
function DomainsSection() {
  const { ref, visible } = useReveal(0.08);
  const isMobile = useIsMobile();

  return (
    <section
      id="domains"
      ref={ref}
      style={{
        background: '#030303',
        padding: isMobile ? '80px 20px' : '120px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      <ShineText as="p" style={{ ...MONO, fontSize: isMobile ? '8px' : '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: isMobile ? '36px' : '56px' }}>
        002 / Domains
      </ShineText>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1px',
          background: G5,
          border: `1px solid ${G5}`,
        }}
      >
        {domains.map((d, i) => (
          <DomainCard key={d.label} domain={d} delay={i * 80} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function DomainCard({ domain, delay, isMobile }: { domain: typeof domains[0]; delay: number; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(212,175,55,0.04)' : '#030303',
        padding: isMobile ? '28px 20px' : '40px 36px',
        transition: 'background 0.3s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          ...SERIF,
          fontSize: isMobile ? '24px' : '32px',
          color: G4,
          fontStyle: 'italic',
          lineHeight: 1,
          marginBottom: isMobile ? '16px' : '24px',
          transition: 'color 0.3s ease',
          ...(hovered ? { color: G1 } : {}),
        }}
      >
        {domain.glyph}
      </div>
      <p style={{ ...MONO, fontSize: isMobile ? '9px' : '11px', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {domain.label}
      </p>
      <p style={{ ...MONO, fontSize: isMobile ? '7px' : '9px', letterSpacing: '1.5px', color: G3, textTransform: 'uppercase', marginBottom: isMobile ? '12px' : '20px' }}>
        {domain.sub}
      </p>
      <p style={{ ...MONO, fontSize: isMobile ? '10px' : '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
        {domain.description}
      </p>
    </div>
  );
}

// ─── Work Section ─────────────────────────────────────────
function WorkSection() {
  const { ref, visible } = useReveal(0.06);
  const isMobile = useIsMobile();

  return (
    <section
      id="work"
      style={{
        background: '#000',
        padding: isMobile ? '80px 20px' : '120px 40px',
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
        <ShineText as="p" style={{ ...MONO, fontSize: isMobile ? '8px' : '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: isMobile ? '40px' : '56px' }}>
          003 / Selected Work
        </ShineText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: G5 }}>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} delay={i * 100} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, delay, isMobile }: { project: Project; delay: number; isMobile: boolean }) {
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
          gridTemplateColumns: isMobile ? '24px 1fr 24px' : '48px 1fr auto',
          alignItems: 'center',
          gap: isMobile ? '12px' : '24px',
          padding: isMobile ? '20px 16px' : '28px 32px',
          cursor: 'pointer',
          transition: 'background 0.25s ease',
        }}
        onMouseEnter={(e) => !isMobile && ((e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.03)')}
        onMouseLeave={(e) => !isMobile && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
      >
        <span style={{ ...MONO, fontSize: isMobile ? '8px' : '10px', color: G4, letterSpacing: '1px' }}>
          {project.id}
        </span>
        <div>
          <p style={{ ...MONO, fontSize: isMobile ? '8px' : '9px', letterSpacing: '1.8px', color: G3, textTransform: 'uppercase', marginBottom: '4px' }}>
            {project.tag}
          </p>
          <h3
            style={{
              ...SERIF,
              fontSize: isMobile ? 'clamp(16px, 2vw, 24px)' : 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', justifySelf: 'end' }}>
          <span style={{ ...MONO, fontSize: isMobile ? '7px' : '9px', color: G4, letterSpacing: '1px' }}>
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
          maxHeight: expanded ? (isMobile ? '600px' : '400px') : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ padding: isMobile ? '0 16px 24px 16px' : '0 32px 36px 104px' }}>
          <p style={{ ...MONO, fontSize: isMobile ? '12px' : '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.85, maxWidth: '100%', marginBottom: '20px' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  ...MONO,
                  fontSize: isMobile ? '8px' : '9px',
                  letterSpacing: isMobile ? '0.8px' : '1.2px',
                  color: G3,
                  textTransform: 'uppercase',
                  padding: isMobile ? '3px 8px' : '4px 10px',
                  border: `1px solid ${G5}`,
                  borderRadius: '2px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {(project.github || project.live) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', marginTop: '20px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...MONO,
                    fontSize: isMobile ? '8px' : '9px',
                    letterSpacing: isMobile ? '1px' : '1.5px',
                    color: G3,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    padding: isMobile ? '4px 10px' : '6px 14px',
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
                  <svg width={isMobile ? "10" : "12"} height={isMobile ? "10" : "12"} viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
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
                    fontSize: isMobile ? '8px' : '9px',
                    letterSpacing: isMobile ? '1px' : '1.5px',
                    color: G3,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    padding: isMobile ? '4px 10px' : '6px 14px',
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
                  <svg width={isMobile ? "10" : "12"} height={isMobile ? "10" : "12"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
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
        className="essay-modal"
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
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G2, textTransform: 'uppercase' }}>{essay.tag}</p>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.5px', color: G4 }}>{essay.date}</p>
        </div>

        <h2 style={{ ...SERIF, fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.2, marginBottom: '28px' }}>
          {essay.title}
        </h2>

        <div style={{ width: '36px', height: '1px', background: G2, marginBottom: '32px' }} />

        <p style={{ ...MONO, fontSize: '13px', lineHeight: 1.95, color: 'rgba(255,255,255,0.60)' }}>
          {essay.excerpt}
        </p>

        {essay.fullContent && (
          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: `1px solid ${G5}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '24px', height: '1px', background: G1 }} />
              <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G1, textTransform: 'uppercase' }}>
                Full Essay
              </p>
              <div style={{ width: '24px', height: '1px', background: G1 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {essay.fullContent.map((item, i) => {
                if (typeof item === 'string') {
                  return (
                    <p
                      key={i}
                      style={{
                        ...MONO,
                        fontSize: '13px',
                        lineHeight: 1.95,
                        color: 'rgba(255,255,255,0.70)',
                      }}
                    >
                      {item}
                    </p>
                  );
                } else if (item.type === 'equation') {
                  return (
                    <div
                      key={i}
                      style={{
                        margin: '40px 0',
                        padding: '32px 24px',
                        background: 'rgba(242,212,106,0.04)',
                        border: `1px solid rgba(242,212,106,0.15)`,
                        borderRadius: '4px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          ...MONO,
                          fontSize: '18px',
                          lineHeight: 2.2,
                          color: G1,
                          marginBottom: '16px',
                          fontWeight: 600,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.equation}
                      </div>
                      <p
                        style={{
                          ...MONO,
                          fontSize: '12px',
                          lineHeight: 1.6,
                          color: 'rgba(255,255,255,0.50)',
                          marginTop: '14px',
                          fontStyle: 'italic',
                        }}
                      >
                        {item.explanation}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: '44px', paddingTop: '22px', borderTop: `1px solid ${G5}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ShineText as="p" style={{ ...SERIF, fontSize: '18px', fontStyle: 'italic', color: G1 }}>— Tanner Livingston</ShineText>
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
          <ShineText as="p" style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
            004 / Writing
          </ShineText>

          <ShineText
            as="h2"
            style={{
              ...SERIF,
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: G1,
              lineHeight: 1.2,
              marginBottom: '56px',
              letterSpacing: '-0.5px',
            }}
          >
            Thinking Made<br />
            Visible
          </ShineText>

          <div style={{ marginBottom: '56px', paddingBottom: '40px', borderBottom: `1px solid ${G5}` }}>
            <p style={{ ...MONO, fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.8 }}>
              Each essay documents a moment in my design and development process — where craft intersects with curiosity. They reveal how I think: systematically breaking down complex problems, finding conceptual clarity in confusion, and pushing past convention to discover what actually works. Through code, physics, and philosophy, I'm showing you who I am as a builder and thinker. Read these to understand my approach to problems, my respect for fundamentals, and what it means to work with someone who builds thoughtfully.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            {essays.map((e, i) => (
              <EssayRow key={e.title} essay={e} delay={i * 80} onClick={() => setOpenEssay(e)} />
            ))}
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
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.8px', color: G2, textTransform: 'uppercase', marginBottom: '12px' }}>
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
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('Tanner.Livin@Gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <ShineText as="p" style={{ ...MONO, fontSize: '9px', letterSpacing: '2.5px', color: G4, textTransform: 'uppercase', marginBottom: '56px' }}>
          005 / Contact
        </ShineText>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>
          <div>
            <ShineText as="h2" style={{
                ...SERIF,
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '28px',
              }}>
              Let's think<br />together.
            </ShineText>
            <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
              I bring technical depth and design sensibility to every project — combining full-stack engineering, interactive systems, and polished UX to create experiences that work beautifully at every level.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '20px' }}>
            {[
              { label: 'GitHub', value: 'jinzurei', href: 'https://github.com/jinzurei' },
              { label: '𝕏', value: 'x.com/jinzurei', href: 'https://x.com/jinzurei' },
              { label: 'Email', value: 'Tanner.Livin@gmail.com', href: null, copy: true },
            ].map(({ label, value, href, copy }) => (
              <div key={label} style={{ paddingBottom: '20px', borderBottom: `1px solid ${G5}` }}>
                <p style={{ ...MONO, fontSize: '11px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '8px' }}>
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
                ) : copy ? (
                  <button
                    onClick={copyEmail}
                    style={{
                      ...MONO,
                      fontSize: '13px',
                      color: copied ? G1 : G3,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => !copied && ((e.target as HTMLElement).style.color = GHOVER)}
                    onMouseLeave={(e) => !copied && ((e.target as HTMLElement).style.color = G3)}
                  >
                    {copied ? 'Copied!' : value}
                  </button>
                ) : (
                  <p style={{ ...MONO, fontSize: '13px', color: 'rgba(255,255,255,0.42)' }}>
                    {value}
                  </p>
                )}
              </div>
            ))}

            {/* ── CV / Résumé download — replace href with the real hosted PDF path ── */}
            <div style={{ paddingTop: '4px' }}>
              <p style={{ ...MONO, fontSize: '11px', letterSpacing: '2px', color: G4, textTransform: 'uppercase', marginBottom: '14px' }}>
                Curriculum Vitae
              </p>
              <a
                href="essays/Public Facing Resume(Pre-Interview).pdf"
                download="Tanner_Livingston_Resume.pdf"
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
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '2px', color: G1, textTransform: 'uppercase' }}>
            Tanner Livingston © 2025
          </p>
          <p style={{ ...MONO, fontSize: '9px', letterSpacing: '1.5px', color: G1, textTransform: 'uppercase' }}>
            Philosophy · Code · Design · Writing · Games
          </p>
          <p style={{ ...SERIF, fontSize: '14px', fontStyle: 'italic', color: G1, letterSpacing: '0.5px', fontWeight: 500 }}>
            "The unexamined code is not worth shipping."
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  
  return (
    <div style={{ background: '#030303', color: '#fff', minHeight: '100vh' }}>
      <Nav />
      <div style={{ position: 'relative', width: '100%', height: '100svh', overflow: 'hidden' }}>
        {isMobile ? <PlatoCanvasMobile /> : <PlatoCanvas />}
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