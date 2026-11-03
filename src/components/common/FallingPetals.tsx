import React, { useEffect, useRef, useState } from 'react';

interface Petal {
  id: number;
  x: number;          // Horizontal position in vw (0 to 100)
  y: number;          // Vertical position in vh (-15 to 110)
  speedY: number;     // Fall speed in vh per frame
  swayAmp: number;    // Sway amplitude in vw
  swayFreq: number;   // Sway frequency
  swayPhase: number;  // Phase offset
  rotation: number;   // Current rotation in degrees
  rotSpeed: number;   // Slow rotation speed
  scale: number;      // Size scale
  opacity: number;    // Opacity (0.6 - 0.85)
  colorIndex: number; // Palette color index
  shapeIndex: number; // SVG shape variation index
}

interface MicroParticle {
  id: number;
  x: number;          // Horizontal position in vw
  y: number;          // Vertical position in vh
  speedY: number;     // Slow fall speed
  swayAmp: number;    // Gentle horizontal sway
  swayFreq: number;
  swayPhase: number;
  size: number;       // 2px to 4px
  opacity: number;    // 0.35 to 0.75
  color: string;      // Glow color
}

// Elegant, high-visibility rose and burgundy palette for petals
const PALETTE = [
  { fill: '#C22D43', stroke: '#F45B73' }, // Vibrant Crimson Rose
  { fill: '#E03E57', stroke: '#FFA6B6' }, // Glowing Bright Rose
  { fill: '#A81E32', stroke: '#E03E57' }, // Rich Wine Burgundy
  { fill: '#8B1425', stroke: '#C22D43' }, // Deep Velvet Red
  { fill: '#F47A8C', stroke: '#FFD4DB' }, // Rose Cream Accent
];

const PARTICLE_COLORS = ['#E8C8B8', '#E03E57', '#C22D43', '#F4E2D8', '#A81E32'];

// Helper to generate a petal state
function createPetal(id: number, topOffsetVh?: number): Petal {
  const isAccent = Math.random() < 0.25;
  const colorIndex = isAccent ? 4 : Math.floor(Math.random() * 4);
  const scale = 0.55 + Math.random() * 0.45; // Minimal size (0.55 to 1.0)

  return {
    id,
    x: Math.random() * 95 + 2.5,
    y: topOffsetVh !== undefined ? topOffsetVh : -12 - Math.random() * 15,
    speedY: 0.04 + Math.random() * 0.05, // Slow, elegant, continuous fall
    swayAmp: 0.5 + Math.random() * 1.2,
    swayFreq: 0.0008 + Math.random() * 0.0014,
    swayPhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    scale,
    opacity: isAccent ? 0.6 + Math.random() * 0.25 : 0.7 + Math.random() * 0.2,
    colorIndex,
    shapeIndex: Math.floor(Math.random() * 3),
  };
}

// Helper to generate a micro-particle state
function createParticle(id: number, topOffsetVh?: number): MicroParticle {
  return {
    id,
    x: Math.random() * 96 + 2,
    y: topOffsetVh !== undefined ? topOffsetVh : -8 - Math.random() * 15,
    speedY: 0.025 + Math.random() * 0.045, // Gentle floating speed
    swayAmp: 0.4 + Math.random() * 0.9,
    swayFreq: 0.001 + Math.random() * 0.0018,
    swayPhase: Math.random() * Math.PI * 2,
    size: 2 + Math.random() * 2.5, // 2px to 4.5px
    opacity: 0.35 + Math.random() * 0.4,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  };
}

export const FallingPetals: React.FC = () => {
  const petalsContainerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Minimal pool of 5 petals + 10 micro-particles on desktop (3 + 5 on mobile)
  const [initialPetals] = useState<Petal[]>(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const count = isMobile ? 3 : 5;
    const pool: Petal[] = [];
    for (let i = 0; i < count; i++) {
      const initialY = -12 + (i / count) * 52;
      pool.push(createPetal(i, initialY));
    }
    return pool;
  });

  const [initialParticles] = useState<MicroParticle[]>(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const count = isMobile ? 5 : 10;
    const pool: MicroParticle[] = [];
    for (let i = 0; i < count; i++) {
      const initialY = -8 + (i / count) * 60;
      pool.push(createParticle(i, initialY));
    }
    return pool;
  });

  const petalsRef = useRef<Petal[]>(initialPetals);
  const particlesRef = useRef<MicroParticle[]>(initialParticles);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setIsReducedMotion(true);
      return;
    }

    let animId: number;
    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const petals = petalsRef.current;
      const particles = particlesRef.current;

      const petalDomChildren = petalsContainerRef.current?.children;
      const particleDomChildren = particlesContainerRef.current?.children;

      // 1. Update Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        const sway = Math.sin(elapsed * p.swayFreq + p.swayPhase) * p.swayAmp;
        const currentX = p.x + sway;

        if (p.y > 106) {
          petals[i] = createPetal(p.id, -10 - Math.random() * 12);
        }

        if (petalDomChildren && petalDomChildren[i]) {
          const el = petalDomChildren[i] as HTMLElement;
          el.style.transform = `translate3d(${currentX.toFixed(2)}vw, ${p.y.toFixed(2)}vh, 0) rotate(${p.rotation.toFixed(1)}deg) scale(${p.scale.toFixed(2)})`;
          el.style.opacity = p.opacity.toFixed(3);
        }
      }

      // 2. Update Micro Particles
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        pt.y += pt.speedY;
        const sway = Math.sin(elapsed * pt.swayFreq + pt.swayPhase) * pt.swayAmp;
        const currentX = pt.x + sway;

        if (pt.y > 106) {
          particles[i] = createParticle(pt.id, -8 - Math.random() * 12);
        }

        if (particleDomChildren && particleDomChildren[i]) {
          const el = particleDomChildren[i] as HTMLElement;
          el.style.transform = `translate3d(${currentX.toFixed(2)}vw, ${pt.y.toFixed(2)}vh, 0)`;
          el.style.opacity = pt.opacity.toFixed(3);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden" aria-hidden="true">
      {/* 1. Petals Container */}
      <div ref={petalsContainerRef} className="absolute inset-0 pointer-events-none">
        {initialPetals.map((p) => {
          const colors = PALETTE[p.colorIndex];
          return (
            <div
              key={p.id}
              className="absolute top-0 left-0 will-change-transform pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              style={{
                opacity: p.opacity,
                transform: `translate3d(${p.x}vw, ${p.y}vh, 0) rotate(${p.rotation}deg) scale(${p.scale})`,
              }}
            >
              {p.shapeIndex === 0 && (
                <svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 13 2 C 7 3, 2 10, 2 18 C 2 26, 8 30, 13 30 C 18 30, 24 26, 24 18 C 24 10, 19 3, 13 2 Z"
                    fill={colors.fill}
                    fillOpacity="0.9"
                  />
                  <path
                    d="M 13 28 C 12.5 21, 12.5 14, 13 6"
                    stroke={colors.stroke}
                    strokeWidth="0.85"
                    strokeOpacity="0.5"
                    fill="none"
                  />
                </svg>
              )}

              {p.shapeIndex === 1 && (
                <svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 12 2 C 5 4, 1 13, 3 21 C 5 29, 12 33, 16 32 C 21 29, 23 20, 21 11 C 19 4, 16 1, 12 2 Z"
                    fill={colors.fill}
                    fillOpacity="0.88"
                  />
                  <path
                    d="M 14 31 C 13.5 23, 13 14, 12 6"
                    stroke={colors.stroke}
                    strokeWidth="0.85"
                    strokeOpacity="0.45"
                    fill="none"
                  />
                </svg>
              )}

              {p.shapeIndex === 2 && (
                <svg width="22" height="36" viewBox="0 0 22 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 11 1 C 4 4, 1 13, 3 22 C 5 30, 12 35, 17 33 C 20 29, 21 18, 17 9 C 14 3, 12 0, 11 1 Z"
                    fill={colors.fill}
                    fillOpacity="0.9"
                  />
                  <path
                    d="M 13 33 C 12 24, 11 15, 10 5"
                    stroke={colors.stroke}
                    strokeWidth="0.85"
                    strokeOpacity="0.45"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Micro Particles Container */}
      <div ref={particlesContainerRef} className="absolute inset-0 pointer-events-none">
        {initialParticles.map((pt) => (
          <div
            key={pt.id}
            className="absolute top-0 left-0 rounded-full will-change-transform pointer-events-none drop-shadow-[0_0_6px_rgba(232,200,184,0.4)]"
            style={{
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              backgroundColor: pt.color,
              opacity: pt.opacity,
              transform: `translate3d(${pt.x}vw, ${pt.y}vh, 0)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
