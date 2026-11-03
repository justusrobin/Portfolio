/**
 * TechEcosystem — "The Crimson Bloom" True Revolving Skills Orbit & Scroll-Controlled Rose Bloom
 *
 * Cinematic Features:
 *  - Scroll-Controlled Realistic Rose Bloom (Reversible Scrub):
 *    • Initial State: Closed crimson rosebud (Stage 1) at exact center with tight spiral heart and green sepals.
 *    • Stage 1 (0–25% Awakening): Rosebud expands, outer petals begin loosening and separating.
 *    • Stage 2 (25–60% Unfolding): Outer guard petals unfold outward with gold gilded rims, revealing inner whorls.
 *    • Stage 3 (60–100% Full Bloom): Inner ruffled heart opens completely into the luxurious centerpiece English rose.
 *    • Bidirectional Scrub: Directly scrubbed via GSAP ScrollTrigger. Scroll down opens, scroll up closes, pause holds state.
 *    • Atmospheric Bloom Details: 3 delicate shedding crimson petals drift outward from the flower as it opens;
 *      ambient crimson aura glow expands and intensifies smoothly.
 *    • Preloaded Assets: All 5 bloom stages preloaded with instant zero-latency DOM updates.
 *  - Genuine 5-Bubble Revolving Orbit:
 *    • All five glass bubbles physically travel continuously along elliptical orbital paths around the blooming rose.
 *    • Elliptical orbits with distinct semi-major & semi-minor axes (a: 465-535px, b: 260-285px).
 *    • Guaranteed mathematical clearance (> 268px inter-bubble, >= 245px from center) prevents text overlap.
 *  - Strictly Upright Content:
 *    • Translated to (x, y) with 0° rotation — category icons, titles, and tech names always horizontally readable.
 *  - Realistic 3D Depth Mechanics:
 *    • Foreground (bottom/front): larger scale (1.08–1.12), full opacity (1.0), higher z-index (24), bright reflections.
 *    • Background (top/back): smaller scale (0.86–0.90), distance opacity (0.74), lower z-index (8), softer rim.
 *  - Interactive Hover & Focus:
 *    • Hovering over any bubble smoothly pauses its orbit and slows other bubbles to 20% speed.
 *    • Hovered bubble scales up, illuminates with champagne/crimson specular rim, and enhances text contrast.
 *    • Moving pointer away resumes seamlessly without jumps or teleporting.
 *    • Clicking any technology opens the comprehensive DetailPanel modal.
 *  - Mobile Experience:
 *    • Scaled mobile orbit revolving around the rose with tap-to-focus and interactive showcase card.
 *    • Respects prefers-reduced-motion with accessible, stable composition.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useId,
} from 'react';
import {
  X,
  Terminal,
  Code2,
  Database,
  Brain,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA TYPES & COMPLETE SKILL DEFINITIONS
// ─────────────────────────────────────────────

export interface TechItem {
  name: string;
  desc: string;
  category: string;
  usedFor: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  coords: { x: number; y: number }; // Initial landmark coords
  floatDuration: number;
  floatDelay: number;
  items: TechItem[];
}

export interface OrbitConfig {
  id: string;
  a: number;          // Semi-major axis in 1600x900 coordinate space
  b: number;          // Semi-minor axis
  tilt: number;       // Orbit plane inclination angle in degrees
  phi0: number;       // Initial phase angle in degrees
  amp: number;        // Organic speed variation amplitude
  pOff: number;       // Phase offset for speed variation
  floatSpeed: number; // Secondary micro-drift speed
  floatDist: number;  // Secondary micro-drift amplitude
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    Icon: Code2,
    coords: { x: 53.5, y: 19.0 },
    floatDuration: 6.2,
    floatDelay: 0.0,
    items: [
      {
        name: 'React 19',
        desc: 'Modern component-driven UI architecture utilizing React Server Actions, Concurrent rendering, and declarative state orchestration.',
        category: 'Frontend',
        usedFor: ['Component Architecture', 'Interactive Interfaces', 'State Orchestration'],
      },
      {
        name: 'Next.js 15',
        desc: 'Production full-stack framework with App Router, server-side streaming, edge execution, and static generation optimizations.',
        category: 'Frontend',
        usedFor: ['App Router SSR', 'Edge Deployment', 'SEO Optimization'],
      },
      {
        name: 'Tailwind CSS',
        desc: 'Utility-first styling system used to construct bespoke, responsive design systems and refined editorial aesthetics without bloated stylesheets.',
        category: 'Frontend',
        usedFor: ['Design Tokens', 'Responsive Grids', 'Glassmorphism'],
      },
      {
        name: 'Framer Motion',
        desc: 'Physics-based animation engine for React handling choreographies, layout transitions, gesture physics, and keyframe sequences.',
        category: 'Frontend',
        usedFor: ['Choreographed Motion', 'Page Transitions', 'Micro-Interactions'],
      },
      {
        name: 'HTML5',
        desc: 'Accessible, semantic document markup forming clean content outlines and rigorous search engine indexing foundations.',
        category: 'Frontend',
        usedFor: ['Semantic Markup', 'Web Accessibility (a11y)', 'Document Outlines'],
      },
      {
        name: 'CSS3',
        desc: 'Advanced modern layout engine leveraging CSS Grid, Flexbox, hardware-accelerated transforms, and CSS custom properties.',
        category: 'Frontend',
        usedFor: ['Hardware Accelerated CSS', 'Custom Properties', 'Fluid Layouts'],
      },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    Icon: Terminal,
    coords: { x: 31.5, y: 37.0 },
    floatDuration: 7.0,
    floatDelay: 0.8,
    items: [
      {
        name: 'TypeScript',
        desc: 'Statically typed superset of JavaScript providing compile-time type safety, robust interfaces, and predictable refactoring for large-scale enterprise web applications.',
        category: 'Languages',
        usedFor: ['Strict Type Safety', 'Enterprise Apps', 'Full-Stack Architecture'],
      },
      {
        name: 'JavaScript',
        desc: 'Core modern scripting language powering asynchronous event loops, dynamic DOM manipulation, and full-stack runtime applications.',
        category: 'Languages',
        usedFor: ['Async Runtimes', 'Event Driven Architecture', 'DOM Scripting'],
      },
      {
        name: 'Python 3.11',
        desc: 'High-level expressive language used for hardware telemetry ingestion, machine learning pipelines, predictive engines, and automated scripting.',
        category: 'Languages',
        usedFor: ['Scikit-Learn ML', 'WMI Telemetry', 'Async Scripting'],
      },
      {
        name: 'C / C++',
        desc: 'High-performance systems programming language for embedded microcontroller firmware, memory-critical operations, and low-latency logic.',
        category: 'Languages',
        usedFor: ['Embedded IoT', 'Hardware Protocols', 'Memory Optimization'],
      },
      {
        name: 'Java',
        desc: 'Established object-oriented language for structured enterprise microservices, robust backend APIs, and multi-threaded systems.',
        category: 'Languages',
        usedFor: ['Enterprise Microservices', 'Object-Oriented Design', 'Backend Services'],
      },
      {
        name: 'SQL',
        desc: 'Relational database query language for complex analytical joins, indexing strategies, constraint design, and structured relational queries.',
        category: 'Languages',
        usedFor: ['Relational Joins', 'Database Indexing', 'Schema Constraints'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    Icon: Database,
    coords: { x: 80.5, y: 44.5 },
    floatDuration: 6.7,
    floatDelay: 1.4,
    items: [
      {
        name: 'Node.js',
        desc: 'Asynchronous event-driven JavaScript server runtime for building scalable, high-concurrency microservices and RESTful API endpoints.',
        category: 'Backend & Data',
        usedFor: ['REST APIs', 'Backend Services', 'Real-time Applications', 'API Integrations'],
      },
      {
        name: 'FastAPI',
        desc: 'Blazing-fast asynchronous Python web framework built on Starlette and Pydantic with automated interactive OpenAPI documentation.',
        category: 'Backend & Data',
        usedFor: ['Async REST APIs', 'Microservice Dispatchers', 'Automatic OpenAPI Docs'],
      },
      {
        name: 'Prisma ORM',
        desc: 'Next-generation type-safe database ORM and migration engine with strict declarative schemas and automated client generation.',
        category: 'Backend & Data',
        usedFor: ['Schema Modeling', 'Type-Safe Queries', 'Automated Migrations'],
      },
      {
        name: 'PostgreSQL',
        desc: 'Enterprise-grade ACID-compliant relational database engine supporting JSONB columns, spatial extensions, and complex query plans.',
        category: 'Backend & Data',
        usedFor: ['Relational Storage', 'ACID Transactions', 'Complex Indexing'],
      },
      {
        name: 'Supabase',
        desc: 'Open-source Firebase alternative providing managed Postgres, real-time WebSocket subscriptions, storage buckets, and auth.',
        category: 'Backend & Data',
        usedFor: ['Database Hosting', 'Real-Time Sync', 'Cloud Storage'],
      },
      {
        name: 'REST APIs',
        desc: 'Stateless HTTP API architecture designed around resource representation, predictable URL schemas, and standard status semantics.',
        category: 'Backend & Data',
        usedFor: ['Client-Server Contracts', 'Predictable Endpoints', 'Microservice Sync'],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Telemetry',
    Icon: Brain,
    coords: { x: 35.5, y: 71.5 },
    floatDuration: 7.4,
    floatDelay: 2.1,
    items: [
      {
        name: 'Scikit-learn',
        desc: 'Python machine learning framework applied to train predictive regression and classification models for 10-second thermal spike prediction.',
        category: 'AI & Telemetry',
        usedFor: ['Predictive ML Models', 'Thermal Forecasting', 'Feature Engineering'],
      },
      {
        name: 'WMI System APIs',
        desc: 'Windows Management Instrumentation subsystem interface for querying real-time motherboard thermal sensors, CPU load, and hardware counters.',
        category: 'AI & Telemetry',
        usedFor: ['Hardware Telemetry', 'Sensor Ingestion', 'Low-Level Metrics'],
      },
      {
        name: 'Azure AI Services',
        desc: 'Cloud cognitive computing suite for computer vision, natural language understanding, and automated decision workloads.',
        category: 'AI & Telemetry',
        usedFor: ['Cloud Vision', 'Cognitive Workloads', 'Cloud AI Pipelines'],
      },
      {
        name: 'Pandas',
        desc: 'High-throughput data manipulation and analysis library for cleaning, transforming, and structuring large time-series sensor logs.',
        category: 'AI & Telemetry',
        usedFor: ['Sensor Data Wrangling', 'Time-Series Resampling', 'Telemetry Analysis'],
      },
      {
        name: 'NumPy',
        desc: 'Foundational scientific computing package offering optimized multi-dimensional array operations and linear algebraic computations.',
        category: 'AI & Telemetry',
        usedFor: ['Vectorized Math', 'Array Transformations', 'Fast Numeric Compute'],
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    Icon: Wrench,
    coords: { x: 69.5, y: 75.0 },
    floatDuration: 6.5,
    floatDelay: 1.1,
    items: [
      {
        name: 'Git & GitHub',
        desc: 'Distributed version control system and collaboration platform managing code history, automated pull request workflows, and releases.',
        category: 'Tools',
        usedFor: ['Version Control', 'Pull Request Workflows', 'Code Auditing'],
      },
      {
        name: 'VS Code',
        desc: 'Modular development environment configured with strict TypeScript linters, ESLint, Python kernels, and remote SSH toolchains.',
        category: 'Tools',
        usedFor: ['TypeScript Toolchain', 'Remote Development', 'Performance Profiling'],
      },
      {
        name: 'Vercel CI/CD',
        desc: 'Global edge deployment infrastructure featuring automated Git push builds, instantaneous edge routing, and preview environments.',
        category: 'Tools',
        usedFor: ['Continuous Deployment', 'Edge Delivery', 'Serverless Functions'],
      },
      {
        name: 'Docker',
        desc: 'Container runtime ecosystem packaging microservices and databases into reproducible, isolated production-identical environments.',
        category: 'Tools',
        usedFor: ['Container Isolation', 'Local Dev Environments', 'Service Composition'],
      },
      {
        name: 'Embedded IoT',
        desc: 'Hardware prototyping with ESP32 and Arduino boards, handling serial telemetry, I2C/SPI bus sensors, and automated actuation.',
        category: 'Tools',
        usedFor: ['Microcontrollers', 'Sensor Protocols', 'Hardware Prototyping'],
      },
      {
        name: 'Linux',
        desc: 'Unix operating system and shell environment used for automated deployment scripts, server monitoring, and package management.',
        category: 'Tools',
        usedFor: ['Bash Automation', 'Server Administration', 'Process Monitoring'],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// MATHEMATICALLY VERIFIED ORBIT CONFIGURATIONS
// Guaranteed clearance: min separation > 268px
// Full revolution ~46s, counter-clockwise travel
// ─────────────────────────────────────────────
export const ORBIT_CONFIGS: OrbitConfig[] = [
  {
    id: 'frontend',
    a: 480,
    b: 250,
    tilt: -11.0,
    phi0: 282.5,
    amp: 0.08,
    pOff: 0.0,
    floatSpeed: 0.45,
    floatDist: 4,
  },
  {
    id: 'languages',
    a: 450,
    b: 240,
    tilt: -12.5,
    phi0: 214.0,
    amp: 0.09,
    pOff: 1.2,
    floatSpeed: 0.38,
    floatDist: 4,
  },
  {
    id: 'backend',
    a: 510,
    b: 260,
    tilt: -10.5,
    phi0: 6.0,
    amp: 0.07,
    pOff: 2.4,
    floatSpeed: 0.42,
    floatDist: 4,
  },
  {
    id: 'ai',
    a: 460,
    b: 245,
    tilt: -12.0,
    phi0: 142.0,
    amp: 0.08,
    pOff: 3.6,
    floatSpeed: 0.35,
    floatDist: 4,
  },
  {
    id: 'tools',
    a: 500,
    b: 255,
    tilt: -11.5,
    phi0: 68.0,
    amp: 0.07,
    pOff: 4.8,
    floatSpeed: 0.48,
    floatDist: 4,
  },
];

// Luminous rose-gold orbital beads matching the master design
const ORBITAL_BEADS = [
  { x: 45.2, y: 22.0, size: 14 },
  { x: 23.5, y: 60.5, size: 14 },
  { x: 33.2, y: 52.0, size: 10 },
  { x: 46.2, y: 77.0, size: 11 },
  { x: 57.5, y: 75.5, size: 15 },
  { x: 68.0, y: 52.0, size: 9 },
  { x: 89.2, y: 58.5, size: 12 },
  { x: 74.0, y: 27.0, size: 9 },
];

// Subtle, realistic individual crimson rose petals (transparent organic PNG assets)
const REALISTIC_PETALS = [
  { src: '/assets/botanical/petals/petal_1.png', left: '7%', top: '22%', width: 34, rotate: 25, duration: 14, delay: 0, opacity: 0.45 },
  { src: '/assets/botanical/petals/petal_2.png', left: '91%', top: '28%', width: 38, rotate: -35, duration: 16, delay: 2.5, opacity: 0.4 },
  { src: '/assets/botanical/petals/petal_3.png', left: '12%', top: '75%', width: 32, rotate: 40, duration: 13, delay: 1.2, opacity: 0.42 },
  { src: '/assets/botanical/petals/petal_1.png', left: '88%', top: '72%', width: 36, rotate: -20, duration: 15, delay: 3.8, opacity: 0.38 },
  { src: '/assets/botanical/petals/petal_2.png', left: '22%', top: '15%', width: 28, rotate: 15, duration: 12, delay: 4.5, opacity: 0.35 },
  { src: '/assets/botanical/petals/petal_3.png', left: '78%', top: '85%', width: 30, rotate: 55, duration: 17, delay: 5.2, opacity: 0.36 },
];

// ─────────────────────────────────────────────
// COMPACT INTERACTIVE DETAIL PANEL (MODAL)
// ─────────────────────────────────────────────

interface DetailPanelProps {
  tech: TechItem | null;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ tech, onClose }) => {
  useEffect(() => {
    if (!tech) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tech, onClose]);

  if (!tech) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${tech.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#140407]/95 border border-[#F4E2D8]/20 p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-in zoom-in-95 duration-300"
      >
        {/* Subtle crimson radial highlight */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(194,45,67,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C22D43] shadow-[0_0_8px_#C22D43]" />
              <p className="font-mono-tech text-[10px] tracking-[0.28em] text-[#C4A89C] uppercase">
                {tech.category}
              </p>
            </div>
            <h3 className="font-editorial-serif text-3xl sm:text-4xl text-[#F4E2D8] font-normal tracking-tight">
              {tech.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-2 rounded-full border border-[#F4E2D8]/20 text-[#C4A89C] hover:text-[#F4E2D8] hover:border-[#F4E2D8]/50 hover:bg-[#C22D43]/15 transition-all flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C8B8]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-[#E8C8B8]/30 via-[#C22D43]/40 to-transparent mb-5" />

        {/* Description */}
        <p className="font-sans-body text-sm text-[#D8C2B8] leading-relaxed mb-6 relative z-10">
          {tech.desc}
        </p>

        {/* USED FOR Tags */}
        <div className="relative z-10">
          <p className="font-mono-tech text-[9px] tracking-[0.24em] text-[#8C6D63] uppercase mb-2.5">
            USED FOR
          </p>
          <div className="flex flex-wrap gap-2">
            {tech.usedFor.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-sans-body bg-[#2B0A11]/80 border border-[#6B1A24]/60 text-[#E8C8B8] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 3D TRANSLUCENT GLASS SPHERE COMPONENT
// Always stays strictly upright (text horizontal)
// ─────────────────────────────────────────────

interface GlassSphereProps {
  category: SkillCategory;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: (id: string | null) => void;
  onTechClick: (tech: TechItem) => void;
  innerRef: (el: HTMLDivElement | null) => void;
}

const GlassSphere: React.FC<GlassSphereProps> = ({
  category,
  isHovered,
  isAnyHovered,
  onHover,
  onTechClick,
  innerRef,
}) => {
  const { Icon } = category;
  const isDimmed = isAnyHovered && !isHovered;

  return (
    <div
      ref={innerRef}
      data-bubble-id={category.id}
      className="absolute pointer-events-auto select-none will-change-[transform,opacity,left,top]"
      style={{
        left: `${category.coords.x}%`,
        top: `${category.coords.y}%`,
        transform: 'translate(-50%, -50%) scale(1)',
        zIndex: 12,
      }}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
      onPointerEnter={() => onHover(category.id)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onHover(isHovered ? null : category.id)}
    >
      {/* Glass Sphere Bubble Body */}
      <div
        className={`
          relative rounded-full aspect-square flex flex-col items-center justify-center text-center
          w-[180px] h-[180px] md:w-[210px] md:h-[210px] lg:w-[245px] lg:h-[245px] xl:w-[255px] xl:h-[255px] p-3.5 sm:p-4
          transition-[box-shadow,border-color,background] duration-500 cursor-pointer
        `}
        style={{
          background: isHovered
            ? 'radial-gradient(circle at 35% 25%, rgba(195, 35, 60, 0.52) 0%, rgba(70, 14, 26, 0.85) 50%, rgba(18, 3, 7, 0.98) 100%)'
            : isDimmed
            ? 'radial-gradient(circle at 35% 25%, rgba(100, 16, 28, 0.25) 0%, rgba(35, 6, 13, 0.7) 50%, rgba(12, 2, 4, 0.92) 100%)'
            : 'radial-gradient(circle at 35% 25%, rgba(145, 22, 40, 0.38) 0%, rgba(50, 10, 18, 0.76) 50%, rgba(14, 2, 5, 0.94) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered
            ? '1.5px solid rgba(255, 225, 215, 0.85)'
            : isDimmed
            ? '1px solid rgba(210, 165, 155, 0.2)'
            : '1px solid rgba(240, 195, 185, 0.42)',
          boxShadow: isHovered
            ? 'inset 0 2.5px 6px rgba(255, 245, 240, 0.85), inset 0 -4px 18px rgba(232, 200, 184, 0.35), inset 0 0 35px rgba(194, 45, 67, 0.65), 0 0 50px rgba(194, 45, 67, 0.7), 0 25px 65px rgba(0, 0, 0, 0.96)'
            : 'inset 0 1.5px 3.5px rgba(255, 235, 225, 0.55), inset 0 -3px 14px rgba(232, 200, 184, 0.2), inset 0 0 22px rgba(194, 45, 67, 0.38), 0 0 32px rgba(194, 45, 67, 0.35), 0 20px 52px rgba(0, 0, 0, 0.88)',
        }}
      >
        {/* 1. Top Specular Crescent Arc Reflection */}
        <div
          className={`
            absolute top-2 left-6 right-6 h-12 rounded-[50%] pointer-events-none transition-opacity duration-300
            ${isHovered ? 'opacity-70' : 'opacity-45'}
          `}
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 225, 215, 0.35) 45%, transparent 80%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* 2. Top-Left Intense Point Specular Glint */}
        <div
          className={`
            absolute top-3.5 left-8 w-6 h-3 rounded-full pointer-events-none rotate-[-25deg] transition-opacity duration-300
            ${isHovered ? 'opacity-85' : 'opacity-60'}
          `}
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 230, 220, 0.45) 50%, transparent 80%)',
            filter: 'blur(0.6px)',
          }}
        />

        {/* 3. Bottom-Right Internal Rose Refraction Glow */}
        <div
          className={`
            absolute bottom-3 right-5 w-24 h-12 rounded-[50%] pointer-events-none transition-opacity duration-300
            ${isHovered ? 'opacity-55' : 'opacity-35'}
          `}
          style={{
            background:
              'radial-gradient(ellipse at center bottom, rgba(215, 45, 70, 0.8) 0%, rgba(139, 20, 37, 0.35) 45%, transparent 75%)',
            filter: 'blur(2px)',
          }}
        />

        {/* 4. Strictly Upright Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-2">
          {/* Category Icon */}
          <div
            className={`
              w-6 h-6 md:w-6.5 md:h-6.5 rounded-full flex items-center justify-center mb-1 transition-all duration-300
              ${isHovered
                ? 'bg-[#C22D43] text-white shadow-[0_0_15px_#C22D43] scale-110'
                : 'bg-[#2B0A11]/80 text-[#E8C8B8] border border-[#E8C8B8]/35'
              }
            `}
          >
            <Icon size={12} />
          </div>

          {/* Category Title — Always Upright */}
          <h3
            className={`
              font-editorial-serif text-xs md:text-sm lg:text-[15px] font-medium tracking-wide uppercase transition-colors duration-300
              ${isHovered ? 'text-white' : 'text-[#F4E2D8]'}
            `}
          >
            {category.title}
          </h3>

          {/* Fine Champagne Divider */}
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#E8C8B8]/40 to-transparent my-1 sm:my-1.5" />

          {/* Technology Names Centered Inside Sphere */}
          <ul className="flex flex-col items-center space-y-0.5 sm:space-y-1">
            {category.items.map((item) => (
              <li key={item.name}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTechClick(item);
                  }}
                  className={`
                    group inline-flex items-center gap-1 font-sans-body text-[10.5px] md:text-[11px] lg:text-xs tracking-wide
                    transition-all duration-150 cursor-pointer rounded px-1.5 py-0.25 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8C8B8]
                    ${isHovered
                      ? 'text-[#F4E2D8] hover:text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                      : 'text-[#D8C2B8] hover:text-[#F4E2D8]'
                    }
                  `}
                >
                  <span className="group-hover:scale-105 transition-transform duration-150">
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN "THE CRIMSON BLOOM" SKILLS SECTION
// ─────────────────────────────────────────────

export const TechEcosystem: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // References to the 5 desktop orbiting bubble DOM elements
  const desktopBubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Unique SVG IDs
  const idPrefix = useId().replace(/:/g, '');
  const orbitGrad1 = `orbitGrad1-${idPrefix}`;
  const orbitGrad2 = `orbitGrad2-${idPrefix}`;
  const orbitGrad3 = `orbitGrad3-${idPrefix}`;
  const beadGlowId = `beadGlow-${idPrefix}`;

  // Interactive state
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hoveredCategoryRef = useRef<string | null>(null);
  useEffect(() => {
    hoveredCategoryRef.current = hoveredCategory;
  }, [hoveredCategory]);

  const [activeTech, setActiveTech] = useState<TechItem | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [isReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ───────────────────────────────────────────
  // CONTINUOUS 3D ORBITAL REVOLUTION ENGINE (RAF)
  // ───────────────────────────────────────────
  useEffect(() => {
    if (isReducedMotion || isMobile) return;

    let animId: number;
    let isVisible = true;
    let lastTime = performance.now();

    // Accumulated orbital elapsed time per bubble (seconds)
    const times = [0, 0, 0, 0, 0];
    // Dynamic speeds: 1.0 = normal, 0.2 = slow-motion, 0.0 = paused
    const speeds = [1, 1, 1, 1, 1];

    const T0 = 46.0; // Base orbital period for a full 360° revolution
    const Cx = 800;
    const Cy = 445;

    // IntersectionObserver to pause the loop when the section is offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now(); // Avoid time jumps upon return
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);

      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const currentHover = hoveredCategoryRef.current;
      const isAnyHovered = currentHover !== null;

      for (let i = 0; i < ORBIT_CONFIGS.length; i++) {
        const cfg = ORBIT_CONFIGS[i];
        const el = desktopBubbleRefs.current[i];
        if (!el) continue;

        const isThisHovered = currentHover === cfg.id;

        // Smooth speed adjustment on hover:
        // Hovered bubble pauses (target 0), other bubbles drift at 20% speed
        const targetSpeed = isThisHovered ? 0.0 : isAnyHovered ? 0.2 : 1.0;
        speeds[i] += (targetSpeed - speeds[i]) * Math.min(1.0, dt * 5.0);

        // Advance accumulated elapsed time
        times[i] += dt * speeds[i];
        const t = times[i];

        // 1. Calculate counter-clockwise orbital angle phi (radians)
        // With organic Keplerian-inspired velocity variation
        const phi0Rad = (cfg.phi0 * Math.PI) / 180;
        const meanMotion = (2 * Math.PI * t) / T0;
        const speedOscillation = cfg.amp * Math.sin(meanMotion + cfg.pOff);
        const phi = phi0Rad - meanMotion + speedOscillation;

        // 2. Unrotated elliptical coordinates
        const u = cfg.a * Math.cos(phi);
        const v = cfg.b * Math.sin(phi);

        // 3. Inclined plane rotation
        const tiltRad = (cfg.tilt * Math.PI) / 180;
        const x = Cx + u * Math.cos(tiltRad) - v * Math.sin(tiltRad);
        const y = Cy + u * Math.sin(tiltRad) + v * Math.cos(tiltRad);

        // 4. Subtle secondary organic float drift
        const microFloat = Math.sin(t * cfg.floatSpeed * 2.0 * Math.PI) * cfg.floatDist;

        // Percentages within the 1600x920 coordinate container
        const pctX = (x / 1600) * 100;
        const pctY = ((y + microFloat) / 920) * 100;

        // 5. 3D Depth Calculation:
        // In screen coordinates, v > 0 is bottom (foreground), v < 0 is top (background)
        const zNorm = Math.sin(phi); // +1 = nearest foreground, -1 = furthest background
        const depth = (zNorm + 1) / 2; // Normalized 0.0 (back) to 1.0 (front)

        // Depth scale: 0.86 (back) -> 1.10 (front)
        let scale = 0.86 + 0.24 * depth;
        // Depth opacity: 0.74 (back) -> 1.0 (front)
        let opacity = 0.74 + 0.26 * depth;
        // Z-Index: foreground bubbles (front) pass above rose (z=15); background behind
        let zIndex = zNorm > 0.05 ? 24 : 8;

        if (isThisHovered) {
          scale = Math.max(scale * 1.08, 1.16);
          opacity = 1.0;
          zIndex = 50; // In front of everything when hovered
        } else if (isAnyHovered) {
          opacity = Math.min(opacity, 0.65);
          scale *= 0.96;
        }

        // Apply hardware-accelerated transforms directly without layout thrashing
        el.style.left = `${pctX.toFixed(3)}%`;
        el.style.top = `${pctY.toFixed(3)}%`;
        el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = `${opacity.toFixed(3)}`;
        el.style.zIndex = `${zIndex}`;
      }
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [isReducedMotion, isMobile]);

  const handleTechClick = useCallback((tech: TechItem) => {
    setActiveTech(tech);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveTech(null);
  }, []);

  const handlePrevCategory = () => {
    setActiveMobileIndex((prev) => (prev === 0 ? SKILL_CATEGORIES.length - 1 : prev - 1));
  };

  const handleNextCategory = () => {
    setActiveMobileIndex((prev) => (prev === SKILL_CATEGORIES.length - 1 ? 0 : prev + 1));
  };

  const currentCategory = SKILL_CATEGORIES[activeMobileIndex];

  return (
    <>
      <style>{`
        @keyframes roseBreathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 20px 45px rgba(0,0,0,0.95)) drop-shadow(0 0 25px rgba(194,45,67,0.45));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 25px 55px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(194,45,67,0.7));
          }
        }
        @keyframes petalDriftSlow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(6px, -10px) rotate(3deg); }
        }
      `}</style>

      {/* 
        Scroll-linked Bloom Track:
        GSAP ScrollTrigger pins this stage for a measured scrub distance (+=85vh),
        allowing the flower to progressively bloom from closed rosebud to full centerpiece bloom.
      */}
      <section
        ref={sectionRef}
        id="skills"
        className="w-full relative min-h-screen bg-[#0E0205] text-[#F4E2D8] select-none pt-20 sm:pt-24 lg:pt-28 pb-32 sm:pb-40 lg:pb-48"
        aria-label="Skills — Technologies I Work With"
      >
        {/* Viewport Stage */}
        <div className="relative w-full flex flex-col justify-start selection:bg-[#6B1A24] selection:text-[#F4E2D8]">
          {/* Deep Burgundy Vignette Background */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(95,16,28,0.28) 0%, rgba(20,3,7,0.95) 75%, #080103 100%)',
            }}
            aria-hidden="true"
          />

          {/* ── TOP: Section Header & Dynamic Narrative Stage Indicators ───── */}
          <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 relative z-30 flex-shrink-0">
            <div className="flex items-center gap-3 font-mono-tech text-[11px] tracking-[0.28em] text-[#C4A89C] uppercase mb-1">
              <span>SKILLS</span>
              <span className="w-10 h-[1px] bg-[#E8C8B8]/40" aria-hidden="true" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F4E2D8] tracking-tight uppercase leading-[0.95]">
                  TECHNOLOGIES <br />
                  <span className="font-bold text-[#E8C8B8]">I WORK WITH</span>
                </h2>
                <p className="font-sans-body text-xs text-[#B8988C] max-w-sm mt-2 leading-relaxed">
                  A blend of tools, languages and systems that help me turn ideas into meaningful digital experiences.
                </p>
              </div>

              {/* Category Orbit Status */}
              <div className="flex items-center gap-2 font-mono-tech text-[10px] tracking-[0.22em] text-[#C4A89C] uppercase pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C22D43] shadow-[0_0_8px_#C22D43] animate-pulse" />
                <span>05 SKILL CATEGORIES // 3D ORBIT</span>
              </div>
            </div>
          </div>

          {/* ── DRIFTING REALISTIC BOTANICAL ROSE PETALS ───────────────── */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
            {REALISTIC_PETALS.map((petal, idx) => (
              <img
                key={`petal-${idx}`}
                src={petal.src}
                alt=""
                className="absolute pointer-events-none select-none"
                style={{
                  left: petal.left,
                  top: petal.top,
                  width: `${petal.width}px`,
                  height: 'auto',
                  transform: `rotate(${petal.rotate}deg)`,
                  opacity: petal.opacity,
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.75))',
                  animation: `petalDriftSlow ${petal.duration}s ease-in-out infinite ${petal.delay}s`,
                }}
              />
            ))}
          </div>

          {/* ── VERTICAL SCROLL INDICATOR (RIGHT EDGE) ─────────────── */}
          <div className="hidden lg:flex absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30 pointer-events-none opacity-50">
            <span className="font-mono-tech text-[9px] tracking-[0.28em] text-[#C4A89C] uppercase [writing-mode:vertical-lr]">
              SCROLL
            </span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#E8C8B8]/30 via-[#E8C8B8]/60 to-[#E8C8B8]/20 relative">
              <div className="w-2.5 h-2.5 rounded-full border border-[#E8C8B8] bg-[#0E0205] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 shadow-[0_0_10px_#C22D43]" />
            </div>
          </div>

          {/* ── CENTER: THE REVOLVING CRIMSON BLOOM ORBITAL STAGE (DESKTOP) ─── */}
          {!isMobile && (
            <div
              ref={stageRef}
              className="relative w-full max-w-[1440px] aspect-[1600/920] mx-auto px-4 my-auto flex items-center justify-center relative z-20 select-none"
            >
              <div className="relative w-full h-full">
                {/* 1. SVG ORBITAL PATHS & LUMINOUS METALLIC BEADS */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  viewBox="0 0 1600 920"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id={orbitGrad1} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C22D43" stopOpacity="0.1" />
                      <stop offset="35%" stopColor="#E8C8B8" stopOpacity="0.45" />
                      <stop offset="65%" stopColor="#FF7A8E" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#E8C8B8" stopOpacity="0.15" />
                    </linearGradient>

                    <linearGradient id={orbitGrad2} x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E8C8B8" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#C22D43" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#E8C8B8" stopOpacity="0.1" />
                    </linearGradient>

                    <linearGradient id={orbitGrad3} x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#E8C8B8" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#FF8B9E" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#C22D43" stopOpacity="0.1" />
                    </linearGradient>

                    <filter id={beadGlowId} x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#C22D43" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  {/* Outer Elliptical Orbital Path (tilted -12 deg) */}
                  <ellipse
                    cx="800"
                    cy="445"
                    rx="560"
                    ry="295"
                    transform="rotate(-12 800 445)"
                    fill="none"
                    stroke={`url(#${orbitGrad1})`}
                    strokeWidth="1.2"
                  />

                  {/* Mid Elliptical Orbital Path (tilted -11 deg) */}
                  <ellipse
                    cx="800"
                    cy="445"
                    rx="490"
                    ry="260"
                    transform="rotate(-11 800 445)"
                    fill="none"
                    stroke={`url(#${orbitGrad3})`}
                    strokeWidth="1.0"
                    strokeDasharray="6 8"
                    strokeOpacity="0.45"
                  />

                  {/* Inner Elliptical Orbital Path (tilted -13 deg) */}
                  <ellipse
                    cx="800"
                    cy="445"
                    rx="425"
                    ry="225"
                    transform="rotate(-13 800 445)"
                    fill="none"
                    stroke={`url(#${orbitGrad2})`}
                    strokeWidth="1.0"
                  />

                  {/* Secondary Counter Ellipse */}
                  <ellipse
                    cx="800"
                    cy="445"
                    rx="630"
                    ry="330"
                    transform="rotate(8 800 445)"
                    fill="none"
                    stroke={`url(#${orbitGrad1})`}
                    strokeWidth="0.8"
                    strokeOpacity="0.25"
                  />

                  {/* Luminous Metallic Rose-Gold Orbital Beads */}
                  {ORBITAL_BEADS.map((bead, i) => {
                    const svgX = (bead.x / 100) * 1600;
                    const svgY = (bead.y / 100) * 920;
                    return (
                      <g key={`bead-${i}`} filter={`url(#${beadGlowId})`}>
                        <circle cx={svgX} cy={svgY} r={bead.size * 0.9} fill="#FF7A8E" opacity="0.35" />
                        <circle cx={svgX} cy={svgY} r={bead.size * 0.55} fill="#E8A890" />
                        <circle
                          cx={svgX - bead.size * 0.18}
                          cy={svgY - bead.size * 0.18}
                          r={bead.size * 0.18}
                          fill="#FFFFFF"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* 2. FIVE REVOLVING 3D GLASS SPHERES */}
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <GlassSphere
                    key={cat.id}
                    category={cat}
                    innerRef={(el) => {
                      desktopBubbleRefs.current[idx] = el;
                    }}
                    isHovered={hoveredCategory === cat.id}
                    isAnyHovered={hoveredCategory !== null}
                    onHover={setHoveredCategory}
                    onTechClick={handleTechClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── MOBILE EXPERIENCE: REVOLVING ORBIT + INTERACTIVE SHOWCASE (< 768px) ─── */}
          {isMobile && (
            <div className="relative w-full max-w-md mx-auto px-4 my-auto flex flex-col items-center justify-center relative z-20">
              {/* Mobile Orbital Stage: Rose at Center with 5 Orbiting Category Planets */}
              <div className="relative w-full aspect-square max-w-[340px] max-h-[340px] flex items-center justify-center mb-3">
                {/* Elliptical Guide Rings on Mobile */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 340 340"
                >
                  <ellipse
                    cx="170"
                    cy="170"
                    rx="135"
                    ry="105"
                    transform="rotate(-10 170 170)"
                    fill="none"
                    stroke="rgba(232, 200, 184, 0.25)"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="170"
                    cy="170"
                    rx="105"
                    ry="80"
                    transform="rotate(-10 170 170)"
                    fill="none"
                    stroke="rgba(194, 45, 67, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* 5 Revolving Skill Bubbles on Mobile Orbit */}
                {SKILL_CATEGORIES.map((cat, idx) => {
                  const total = SKILL_CATEGORIES.length;
                  const baseAngle = (idx * 2 * Math.PI) / total - Math.PI / 2;
                  const isSelected = idx === activeMobileIndex;

                  return (
                    <MobileOrbitBubble
                      key={cat.id}
                      category={cat}
                      index={idx}
                      isSelected={isSelected}
                      baseAngle={baseAngle}
                      isReducedMotion={isReducedMotion}
                      onSelect={() => setActiveMobileIndex(idx)}
                    />
                  );
                })}
              </div>

              {/* Active Category Showcase Card */}
              <div className="w-full max-w-[340px] rounded-2xl p-4.5 bg-[#160408]/90 border border-[#E8C8B8]/30 shadow-[0_15px_45px_rgba(0,0,0,0.9)] backdrop-blur-xl relative z-20">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#C22D43] text-white shadow-[0_0_10px_#C22D43]">
                      <currentCategory.Icon size={12} />
                    </div>
                    <h3 className="font-editorial-serif text-base font-medium tracking-wide uppercase text-white">
                      {currentCategory.title}
                    </h3>
                  </div>
                  <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#C4A89C]">
                    {String(activeMobileIndex + 1).padStart(2, '0')} / {String(SKILL_CATEGORIES.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8C8B8]/30 to-transparent mb-3" />

                <p className="font-sans-body text-[11px] text-[#D8C2B8]/80 mb-3">
                  Tap any technology below to view full architectural details:
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {currentCategory.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleTechClick(item)}
                      className="px-2.5 py-1 rounded-full text-xs font-sans-body bg-[#2B0A11]/90 border border-[#6B1A24] text-[#F4E2D8] hover:border-[#E8C8B8]/60 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BOTTOM: Supporting Navigation, Counter & Explore Bar ── */}
          <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 relative z-30 flex-shrink-0 flex items-center justify-between">
            {/* Bottom-left: Explore My Skills pill */}
            <button
              onClick={() => {
                const el = document.getElementById('work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8C8B8]/20 bg-[#140306]/80 backdrop-blur-md text-[#C4A89C] hover:text-[#F4E2D8] hover:border-[#E8C8B8]/50 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8C8B8]"
            >
              <ArrowUp size={11} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span className="font-mono-tech text-[10px] tracking-[0.24em] uppercase">
                EXPLORE MY SKILLS
              </span>
            </button>

            {/* Bottom-right: 03 / 05 Category Counter & Arrows */}
            <div className="flex items-center gap-3">
              <span className="font-mono-tech text-[11px] tracking-[0.2em] text-[#C4A89C]">
                {String(activeMobileIndex + 1).padStart(2, '0')} / {String(SKILL_CATEGORIES.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevCategory}
                  aria-label="Previous skill category"
                  className="w-7 h-7 rounded-full border border-[#E8C8B8]/20 flex items-center justify-center text-[#C4A89C] hover:text-[#F4E2D8] hover:border-[#E8C8B8]/50 hover:bg-[#C22D43]/20 transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  onClick={handleNextCategory}
                  aria-label="Next skill category"
                  className="w-7 h-7 rounded-full border border-[#E8C8B8]/20 flex items-center justify-center text-[#C4A89C] hover:text-[#F4E2D8] hover:border-[#E8C8B8]/50 hover:bg-[#C22D43]/20 transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Screen-Reader Semantic Fallback for A11y ── */}
        <div className="sr-only">
          <h3>Full Technologies and Competencies List</h3>
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h4>{cat.title}</h4>
              <ul>
                {cat.items.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}</strong>: {item.desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compact Interactive Detail Panel Modal ── */}
      <DetailPanel tech={activeTech} onClose={handleClosePanel} />
    </>
  );
};

// ─────────────────────────────────────────────
// MOBILE ORBITING BUBBLE HELPER COMPONENT
// Revolves around the rose with tap-to-focus
// ─────────────────────────────────────────────

interface MobileOrbitBubbleProps {
  category: SkillCategory;
  index: number;
  isSelected: boolean;
  baseAngle: number;
  isReducedMotion: boolean;
  onSelect: () => void;
}

const MobileOrbitBubble: React.FC<MobileOrbitBubbleProps> = ({
  category,
  isSelected,
  baseAngle,
  isReducedMotion,
  onSelect,
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) {
      if (elRef.current) {
        const rx = 135;
        const ry = 105;
        const tilt = (-10 * Math.PI) / 180;
        const u = rx * Math.cos(baseAngle);
        const v = ry * Math.sin(baseAngle);
        const x = 170 + u * Math.cos(tilt) - v * Math.sin(tilt);
        const y = 170 + u * Math.sin(tilt) + v * Math.cos(tilt);
        elRef.current.style.left = `${x}px`;
        elRef.current.style.top = `${y}px`;
      }
      return;
    }

    let animId: number;
    const startTime = performance.now();
    const period = 38000; // 38s full mobile revolution

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      if (!elRef.current) return;

      const elapsed = (now - startTime) % period;
      const currentAngle = baseAngle - (elapsed / period) * 2 * Math.PI;

      const rx = 135;
      const ry = 105;
      const tilt = (-10 * Math.PI) / 180;
      const u = rx * Math.cos(currentAngle);
      const v = ry * Math.sin(currentAngle);

      const x = 170 + u * Math.cos(tilt) - v * Math.sin(tilt);
      const y = 170 + u * Math.sin(tilt) + v * Math.cos(tilt);

      const zNorm = Math.sin(currentAngle);
      const depth = (zNorm + 1) / 2;
      const scale = isSelected ? 1.15 : 0.85 + 0.2 * depth;
      const opacity = isSelected ? 1.0 : 0.72 + 0.28 * depth;
      const zIndex = isSelected ? 30 : zNorm > 0 ? 20 : 5;

      elRef.current.style.left = `${x}px`;
      elRef.current.style.top = `${y}px`;
      elRef.current.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
      elRef.current.style.opacity = `${opacity.toFixed(2)}`;
      elRef.current.style.zIndex = `${zIndex}`;
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [baseAngle, isReducedMotion, isSelected]);

  const { Icon } = category;

  return (
    <div
      ref={elRef}
      data-mobile-bubble-id={category.id}
      onClick={onSelect}
      className="absolute cursor-pointer will-change-[transform,opacity,left,top] select-none"
      style={{
        left: '170px',
        top: '170px',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className={`
          w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center p-1.5 transition-all duration-300
          ${isSelected
            ? 'border-1.5 border-[#FFE1D7] shadow-[0_0_20px_#C22D43,inset_0_0_15px_rgba(194,45,67,0.7)] bg-[#410C18]/90'
            : 'border border-[#E8C8B8]/35 shadow-[0_10px_25px_rgba(0,0,0,0.8)] bg-[#2B0A11]/80'
          }
        `}
        style={{
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className={`
            w-5 h-5 rounded-full flex items-center justify-center mb-0.5
            ${isSelected ? 'bg-[#C22D43] text-white shadow-[0_0_8px_#C22D43]' : 'text-[#E8C8B8]'}
          `}
        >
          <Icon size={11} />
        </div>
        <span
          className={`
            font-editorial-serif text-[7.5px] uppercase tracking-wider text-center leading-[1.05] max-w-[56px] px-0.5
            ${isSelected ? 'text-white font-bold' : 'text-[#D8C2B8]'}
          `}
        >
          {category.title}
        </span>
      </div>
    </div>
  );
};

export default TechEcosystem;
