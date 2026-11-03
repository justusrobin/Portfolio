import React, { useEffect, useState, useRef } from 'react';

// Keyframe structure for physical viewport entry, travel, and exit choreography
interface FlowerKeyframe {
  progress: number; // Normalized scroll progress (0.0 to 1.0)
  x: number;        // Horizontal offset in vw from screen center (-75 to +75)
  y: number;        // Viewport vertical position in vh (-30 to +110)
  scale: number;    // Scale factor (0.50 to 1.10)
  rotate: number;   // Rotation in degrees (-35 to +35)
  opacity: number;  // Opacity (0.85 to 0.98)
}

// Physical viewport entry / exit keyframes across portfolio scroll story
const KEYFRAMES: FlowerKeyframe[] = [
  // 1. HERO (Start): Upside down flower tilted 45° right with stem tucked off-screen; ONLY PETALS visible in top-right corner (0% scroll)
  { progress: 0.00, x: 42, y: -8, scale: 1.05, rotate: 205, opacity: 1.0 },

  // 1.1 HERO EXIT: Physically exits 100% OUTSIDE right viewport edge (10% scroll)
  { progress: 0.10, x: 85, y: 20, scale: 0.85, rotate: 20, opacity: 0 },

  // 2. ABOUT SECTION: REMAINS COMPLETELY OFF-SCREEN & HIDDEN (12% to 32% scroll)
  { progress: 0.28, x: 85, y: 40, scale: 0.70, rotate: -15, opacity: 0 },

  // 3. SKILLS SECTION: REMAINS COMPLETELY OFF-SCREEN & HIDDEN (30% to 56% scroll)
  { progress: 0.56, x: 85, y: 40, scale: 0.75, rotate: -20, opacity: 0 },

  // 4. JOURNEY SECTION: FLOWER RETURNS HERE! Visible during Journey
  { progress: 0.62, x: 36, y: 42, scale: 0.85, rotate: 15, opacity: 1.0 },

  // 4.1 JOURNEY EXIT: Exits off-screen BEFORE Work section starts (62% scroll)
  { progress: 0.62, x: 85, y: 42, scale: 0.80, rotate: -15, opacity: 0 },

  // 5. WORK / PROJECTS SECTION: REMAINS 100% OFF-SCREEN & HIDDEN (63% to 88% scroll)
  { progress: 0.88, x: 85, y: 50, scale: 0.78, rotate: -28, opacity: 0 },

  // 6. CONTACT SECTION & FOOTER: Re-enters AFTER Work section in Contact CTA / Footer (94% to 100% scroll)
  { progress: 0.95, x: 38, y: 56, scale: 1.05, rotate: 5, opacity: 1.0 },
  { progress: 1.00, x: 44, y: 64, scale: 1.08, rotate: 0, opacity: 1.0 },
];

// Linear interpolation helper
function interpolate(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

interface ScrollableFlowersProps {
  loadingProgress?: number; // 0.0 to 1.0
  isLoaded?: boolean;
}

export const ScrollableFlowers: React.FC<ScrollableFlowersProps> = ({
  loadingProgress = 1.0,
  isLoaded = true,
}) => {
  // Target interpolated properties for main flower
  const targetRef = useRef({
    x: 42,
    y: -8,
    scale: 1.05,
    rotate: 205,
    opacity: 1.0,
  });

  // Current smooth physics state (Lerped for inertial smoothness)
  const currentRef = useRef({
    x: 42,
    y: -8,
    scale: 1.05,
    rotate: 205,
    opacity: 1.0,
    mouseX: 0,
    mouseY: 0,
  });

  // Visual state for single main flower element
  const [flowerStyle, setFlowerStyle] = useState<{
    transform: string;
    opacity: number;
    display: string;
  }>({
    transform: 'translate3d(42vw, -8vh, 0) scale(1.05) rotate(205deg)',
    opacity: 1.0,
    display: 'block',
  });

  // State for single central petal, satellite petals, and radial blooming petals
  const [transitionPetalState, setTransitionPetalState] = useState<{
    petalTransform: string;
    petalOpacity: number;
    satelliteOpacity: number;
    bloomProgress: number;
    visible: boolean;
  }>({
    petalTransform: 'translate3d(0vw, 18vh, 0) scale(1) rotate(-22deg)',
    petalOpacity: 0,
    satelliteOpacity: 0,
    bloomProgress: 0,
    visible: false,
  });

  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      // Subtle mouse parallax offset (-8px to +8px)
      const mouseNormX = (e.clientX / window.innerWidth - 0.5) * 16;
      const mouseNormY = (e.clientY / window.innerHeight - 0.5) * 16;
      currentRef.current.mouseX = mouseNormX;
      currentRef.current.mouseY = mouseNormY;
    };

    const updatePosition = (now: number) => {
      const elapsed = now - startTime;
      const isMobile = window.innerWidth < 768;
      const mobileXFactor = isMobile ? 0.65 : 1.0;
      const mobileScaleFactor = isMobile ? 0.75 : 1.0;

      // ==========================================
      // SCENARIO A: CINEMATIC LOADING TRANSITION (isLoaded = false or loadingProgress < 1.0)
      // ==========================================
      if (!isLoaded && loadingProgress < 1.0) {
        const p = Math.min(1.0, Math.max(0.0, loadingProgress));

        let fX = 42;
        let fY = -8;
        let fScale = 1.05;
        let fRotate = 205;
        let fOpacity = 0;

        let pX = 0;
        let pY = 18;
        let pScale = 1.0;
        let pRotate = -22;
        let pOpacity = 0;

        let sOpacity = 0;
        let bloomP = 0;

        // PHASE 1: PETAL ACTIVATION (0.00 <= p <= 0.14) [0.0s - 0.45s]
        if (p <= 0.14) {
          const t1 = p / 0.14;
          const easeT1 = t1 * t1 * (3 - 2 * t1);
          pX = 0;
          pY = 18;
          pScale = 0.92 + easeT1 * 0.12; // Gentle depth/lighting pulse
          pRotate = -22 + easeT1 * 17;   // Gentle -22deg to -5deg rotation
          pOpacity = 0.75 + easeT1 * 0.25; // Gently brightens
          fOpacity = 0;
          sOpacity = 0;
          bloomP = 0;
        }
        // PHASE 2: PETAL TRAVEL (0.14 < p <= 0.42) [0.45s - 1.35s]
        else if (p <= 0.42) {
          const t2 = (p - 0.14) / 0.28;
          const easeT2 = t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2;

          // Curved Bezier Arc from center (0vw, 18vh) -> control (20vw, 22vh) -> target (38vw, -2vh)
          const u = 1 - easeT2;
          pX = u * u * 0 + 2 * u * easeT2 * 20 + easeT2 * easeT2 * 38;
          pY = u * u * 18 + 2 * u * easeT2 * 22 + easeT2 * easeT2 * (-2);

          pRotate = -5 + easeT2 * 80;
          pScale = 1.04 + easeT2 * 0.36;
          pOpacity = 1.0;

          sOpacity = Math.sin(t2 * Math.PI) * (isMobile ? 0.5 : 0.85); // Small petals drift alongside
          fOpacity = 0;
          bloomP = 0;
        }
        // PHASE 3: FLOWER FORMATION / BLOSSOM (0.38 < p <= 0.68) [1.2s - 2.15s]
        else if (p <= 0.68) {
          const t3 = (p - 0.38) / 0.30;
          const easeT3 = 1 - Math.pow(1 - t3, 3);

          pX = 38 + easeT3 * 3;
          pY = -2 + easeT3 * (-5);
          pRotate = 75 + easeT3 * 105;
          pScale = 1.4 - easeT3 * 0.35;

          bloomP = easeT3; // Radial petals blossom outward

          // Main burgundy flower smoothly expands & unfolds from travelling petal center
          fX = pX;
          fY = pY;
          fRotate = pRotate;
          fScale = 0.45 + easeT3 * 0.55;
          fOpacity = easeT3;

          // Single travelling petal & satellites dissolve seamlessly into the blooming flower
          pOpacity = Math.max(0, 1.0 - t3 * 1.5);
          sOpacity = Math.max(0, (1 - t3) * 0.5);
        }
        // PHASE 4 & 5: MOVE INTO HERO POSITION & SETTLE (0.65 < p <= 1.00) [2.0s - 3.2s]
        else {
          const t4 = Math.min(1.0, (p - 0.65) / 0.35);
          const easeT4 = 1 - Math.pow(1 - t4, 4); // Quartic ease-out deceleration

          fX = 41 + easeT4 * 1;        // 41 -> 42vw
          fY = -7 + easeT4 * (-1);      // -7 -> -8vh
          fScale = 1.0 + easeT4 * 0.05; // 1.0 -> 1.05
          fRotate = 180 + easeT4 * 25;  // 180deg -> 205deg
          fOpacity = 1.0;

          pOpacity = 0;
          sOpacity = 0;
          bloomP = Math.max(0, 1.0 - t4 * 2);
        }

        // Apply mobile adjustments
        fX *= mobileXFactor;
        fScale *= mobileScaleFactor;
        pX *= mobileXFactor;
        pScale *= mobileScaleFactor;

        targetRef.current = {
          x: fX,
          y: fY,
          scale: fScale,
          rotate: fRotate,
          opacity: fOpacity,
        };

        const curr = currentRef.current;
        curr.x = fX;
        curr.y = fY;
        curr.scale = fScale;
        curr.rotate = fRotate;
        curr.opacity = fOpacity;

        setFlowerStyle({
          transform: `translate3d(${fX.toFixed(2)}vw, ${fY.toFixed(2)}vh, 0) scale(${fScale.toFixed(3)}) rotate(${fRotate.toFixed(2)}deg)`,
          opacity: Math.max(0, Math.min(1, fOpacity)),
          display: fOpacity > 0.005 ? 'block' : 'none',
        });

        setTransitionPetalState({
          petalTransform: `translate3d(${pX.toFixed(2)}vw, ${pY.toFixed(2)}vh, 0) scale(${pScale.toFixed(3)}) rotate(${pRotate.toFixed(2)}deg)`,
          petalOpacity: pOpacity,
          satelliteOpacity: sOpacity,
          bloomProgress: bloomP,
          visible: pOpacity > 0.01 || sOpacity > 0.01 || bloomP > 0.01,
        });

      } else {
        // ==========================================
        // SCENARIO B: POST-LOAD SCROLL MODE (isLoaded = true)
        // ==========================================
        if (transitionPetalState.visible) {
          setTransitionPetalState((prev) => ({ ...prev, visible: false }));
        }

        // Calculate scroll progress p in [0, 1]
        const scrollTop = window.scrollY;
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ) - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

        // Find current keyframe segment
        let segmentStart = KEYFRAMES[0];
        let segmentEnd = KEYFRAMES[KEYFRAMES.length - 1];

        for (let i = 0; i < KEYFRAMES.length - 1; i++) {
          if (progress >= KEYFRAMES[i].progress && progress <= KEYFRAMES[i + 1].progress) {
            segmentStart = KEYFRAMES[i];
            segmentEnd = KEYFRAMES[i + 1];
            break;
          }
        }

        // Segment interpolation factor t in [0, 1]
        const segSpan = segmentEnd.progress - segmentStart.progress;
        const factor = segSpan > 0 ? (progress - segmentStart.progress) / segSpan : 0;

        // Compute targets from keyframes
        targetRef.current = {
          x: interpolate(segmentStart.x, segmentEnd.x, factor) * mobileXFactor,
          y: interpolate(segmentStart.y, segmentEnd.y, factor),
          scale: interpolate(segmentStart.scale, segmentEnd.scale, factor) * mobileScaleFactor,
          rotate: interpolate(segmentStart.rotate, segmentEnd.rotate, factor),
          opacity: interpolate(segmentStart.opacity, segmentEnd.opacity, factor),
        };

        // Graceful inertia lerp speed (~0.06 for physical, restrained momentum)
        const lerpSpeed = 0.06;
        const curr = currentRef.current;
        const target = targetRef.current;

        curr.x += (target.x - curr.x) * lerpSpeed;
        curr.y += (target.y - curr.y) * lerpSpeed;
        curr.scale += (target.scale - curr.scale) * lerpSpeed;
        curr.rotate += (target.rotate - curr.rotate) * lerpSpeed;
        curr.opacity += (target.opacity - curr.opacity) * lerpSpeed;

        // Subtle organic breathing pulse (very soft swell)
        const bloomPulse = 1 + 0.02 * Math.sin(elapsed * 0.0018);
        const finalScale = (curr.scale * bloomPulse).toFixed(3);

        // Check if user is scrolled inside or near the Work (#work) section
        const workElement = document.getElementById('work');
        let isInsideWorkSection = false;
        if (workElement) {
          const rect = workElement.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            isInsideWorkSection = true;
          }
        }

        const isHidden = isInsideWorkSection || target.opacity === 0 || curr.opacity < 0.02;

        setFlowerStyle({
          transform: `translate3d(calc(${curr.x.toFixed(2)}vw + ${curr.mouseX.toFixed(1)}px), calc(${curr.y.toFixed(2)}vh + ${curr.mouseY.toFixed(1)}px), 0) scale(${finalScale}) rotate(${curr.rotate.toFixed(2)}deg)`,
          opacity: isHidden ? 0 : Math.max(0, Math.min(1, curr.opacity)),
          display: isHidden ? 'none' : 'block',
        });
      }

      animId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [loadingProgress, isLoaded]);

  // Determine container z-index: z-42 during loading sequence (above backdrop z-40, below text card z-50), z-30 during scroll mode
  const containerZIndex = (!isLoaded || loadingProgress < 1.0) ? 'z-42' : 'z-30';

  return (
    <div className={`fixed inset-0 pointer-events-none ${containerZIndex} overflow-hidden`}>

      {/* 1. SINGLE CENTRAL PETAL, SATELLITES, & RADIAL BLOOMING PETALS (Phase 1 to 3) */}
      {transitionPetalState.visible && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none will-change-transform"
          style={{
            transform: transitionPetalState.petalTransform,
          }}
        >
          <div className="relative flex items-center justify-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
            
            {/* Main Central Petal */}
            <div
              style={{
                opacity: transitionPetalState.petalOpacity,
                transition: 'opacity 0.2s linear',
              }}
            >
              <svg width="36" height="46" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="main-petal-grad" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#D2344A" />
                    <stop offset="45%" stopColor="#961729" />
                    <stop offset="100%" stopColor="#3A0E17" />
                  </radialGradient>
                </defs>
                <path
                  d="M 17 2 C 8 4, 2 14, 2 26 C 2 37, 10 42, 17 42 C 24 42, 32 37, 32 26 C 32 14, 26 4, 17 2 Z"
                  fill="url(#main-petal-grad)"
                  fillOpacity="0.95"
                />
                <path
                  d="M 17 38 C 16.5 28, 16.5 17, 17 6"
                  stroke="#F47A8C"
                  strokeWidth="1.1"
                  strokeOpacity="0.6"
                  fill="none"
                />
                <path
                  d="M 17 20 C 13 16, 9 14, 5 13"
                  stroke="#F47A8C"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  fill="none"
                />
                <path
                  d="M 17 24 C 21 20, 25 18, 29 17"
                  stroke="#F47A8C"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  fill="none"
                />
              </svg>
            </div>

            {/* Satellite Petal 1 (Top-Left) */}
            <div
              className="absolute -top-3 -left-5"
              style={{
                opacity: transitionPetalState.satelliteOpacity,
                transform: 'rotate(-25deg) scale(0.75)',
              }}
            >
              <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 9 1 C 4 2, 1 7, 1 14 C 1 20, 5 23, 9 23 C 13 23, 17 20, 17 14 C 17 7, 14 2, 9 1 Z"
                  fill="#A81E32"
                  fillOpacity="0.85"
                />
                <path
                  d="M 9 21 C 8.5 15, 8.5 9, 9 3"
                  stroke="#E03E57"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Satellite Petal 2 (Bottom-Right) */}
            <div
              className="absolute -bottom-2 -right-4"
              style={{
                opacity: transitionPetalState.satelliteOpacity * 0.9,
                transform: 'rotate(45deg) scale(0.7)',
              }}
            >
              <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 9 1 C 4 2, 1 7, 1 14 C 1 20, 5 23, 9 23 C 13 23, 17 20, 17 14 C 17 7, 14 2, 9 1 Z"
                  fill="#C22D43"
                  fillOpacity="0.9"
                />
                <path
                  d="M 9 21 C 8.5 15, 8.5 9, 9 3"
                  stroke="#F47A8C"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Satellite Petal 3 (Top-Right) */}
            <div
              className="absolute -top-4 -right-3"
              style={{
                opacity: transitionPetalState.satelliteOpacity * 0.75,
                transform: 'rotate(110deg) scale(0.65)',
              }}
            >
              <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 9 1 C 4 2, 1 7, 1 14 C 1 20, 5 23, 9 23 C 13 23, 17 20, 17 14 C 17 7, 14 2, 9 1 Z"
                  fill="#8B1425"
                  fillOpacity="0.8"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 2. SINGLE PERSISTENT FLOWER (DESTINATION OF THE TRANSITION & HERO FLOWER) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[380px] md:w-[440px] pointer-events-none transition-opacity duration-300 drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
        style={{
          transform: flowerStyle.transform,
          opacity: flowerStyle.opacity,
          display: flowerStyle.display,
          willChange: 'transform, opacity',
        }}
      >
        <img
          src="/assets/dark_wine_flower.png"
          alt="Editorial Travelling Rose Flower"
          className="w-full h-auto filter contrast-[1.05]"
        />
      </div>
    </div>
  );
};

export default ScrollableFlowers;

