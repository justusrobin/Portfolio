import React, { useState } from 'react';

interface LoadingScreenProps {
  loadingProgress: number; // 0.0 to 1.0
  isLoaded: boolean;
  onAnimationComplete?: () => void;
}

// Easing utilities
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

const WORD_1 = ['J', 'U', 'S', 'T', 'U', 'S'];
const WORD_2 = ['R', 'O', 'B', 'I', 'N'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingProgress,
  isLoaded,
}) => {
  const [isReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const p = Math.min(1.0, Math.max(0.0, loadingProgress));

  // Reduced Motion Handler
  if (isReducedMotion) {
    if (isLoaded) return null;
    return (
      <div className="fixed inset-0 z-40 bg-[#140306] flex flex-col justify-center items-center pointer-events-none select-none text-center px-6">
        <h1 className="font-brand-cinzel text-4xl sm:text-6xl text-[#F4E2D8] tracking-[0.12em] uppercase mb-3">
          JUSTUS ROBIN
        </h1>
        <p className="font-mono-tech text-xs tracking-[0.32em] text-[#C4A89C] uppercase">
          DEVELOPER · CREATIVE STUDIO
        </p>
      </div>
    );
  }

  // ==========================================
  // STAGE CALCULATIONS (Progress 0.0 to 1.0, Duration = 3200ms)
  // ==========================================

  // 1. Horizontal Line Reveal (p: 0.00 -> 0.12, Exit: 0.68 -> 0.86)
  let lineScale: number;
  let lineOpacity: number;
  if (p < 0.68) {
    lineScale = easeOutCubic(clamp(p / 0.12, 0, 1));
    lineOpacity = lineScale * 0.8;
  } else {
    const exitLine = clamp((p - 0.68) / 0.18, 0, 1);
    lineScale = 1 - exitLine;
    lineOpacity = (1 - exitLine) * 0.8;
  }

  // 2. Letter Spacing Expansion during Exit (p >= 0.64)
  const exitSpacing = p >= 0.64 ? clamp((p - 0.64) / 0.28, 0, 1) * 0.14 : 0;

  // 3. Highlight Sweep (p: 0.38 -> 0.52)
  let sweepX = -120;
  let sweepOpacity = 0;
  if (p >= 0.38 && p <= 0.54) {
    const sweepT = (p - 0.38) / 0.16;
    sweepX = -120 + sweepT * 380; // Sweeps from -120% to +260%
    sweepOpacity = Math.sin(sweepT * Math.PI) * 0.85;
  }

  // 4. Subtitle 1 ("DEVELOPER · CREATIVE STUDIO") (Entrance: 0.38 -> 0.50, Exit: 0.68 -> 0.84)
  let sub1Y: number;
  let sub1Opacity: number;
  if (p < 0.68) {
    const sub1T = clamp((p - 0.38) / 0.12, 0, 1);
    const easeSub1 = easeOutCubic(sub1T);
    sub1Y = (1 - easeSub1) * 16;
    sub1Opacity = easeSub1;
  } else {
    const exitSub1 = clamp((p - 0.68) / 0.16, 0, 1);
    sub1Y = -exitSub1 * 20;
    sub1Opacity = 1 - exitSub1;
  }

  // 5. Subtitle 2 ("A DIGITAL EXPERIENCE IN THE MAKING") (Entrance: 0.44 -> 0.56, Exit: 0.70 -> 0.86)
  let sub2Y: number;
  let sub2Opacity: number;
  if (p < 0.70) {
    const sub2T = clamp((p - 0.44) / 0.12, 0, 1);
    const easeSub2 = easeOutCubic(sub2T);
    sub2Y = (1 - easeSub2) * 12;
    sub2Opacity = easeSub2 * 0.7;
  } else {
    const exitSub2 = clamp((p - 0.70) / 0.16, 0, 1);
    sub2Y = -exitSub2 * 16;
    sub2Opacity = (1 - exitSub2) * 0.7;
  }

  // 6. Overall Backdrop Overlay Exit (p: 0.72 -> 1.00)
  let overlayOpacity = 1;
  if (p >= 0.72) {
    const pExit = clamp((p - 0.72) / 0.28, 0, 1);
    overlayOpacity = 1 - easeOutCubic(pExit);
  }

  // Unmount cleanly after full transition completes
  if (isLoaded && overlayOpacity <= 0.005) {
    return null;
  }

  // Helper renderer for character arrays with smooth staggered entrance and exit
  const renderWord = (wordChars: string[], globalStartIndex: number) => {
    return (
      <span className="inline-flex items-center">
        {wordChars.map((char, localIdx) => {
          const charGlobalIdx = globalStartIndex + localIdx;

          // Entrance (p: 0.10 + idx*0.022 -> +0.14)
          const startP = 0.10 + charGlobalIdx * 0.022;
          const enterT = clamp((p - startP) / 0.14, 0, 1);
          const enterEase = easeOutCubic(enterT);

          // Exit (p: 0.64 + idx*0.016 -> +0.16)
          const exitStartP = 0.64 + charGlobalIdx * 0.016;
          const exitT = clamp((p - exitStartP) / 0.16, 0, 1);
          const exitEase = exitT < 0.5 ? 2 * exitT * exitT : 1 - Math.pow(-2 * exitT + 2, 2) / 2;

          const charY = p < exitStartP ? (1 - enterEase) * 115 : -exitEase * 125;
          const charOpacity = p < exitStartP ? enterEase : 1 - Math.pow(exitT, 2.2);

          return (
            <span
              key={localIdx}
              className="relative inline-block overflow-visible py-1 px-[0.02em] align-bottom select-none"
            >
              {/* Metallic Champagne-Wine Gradient Letterface */}
              <span
                className="inline-block will-change-transform font-bold relative bg-gradient-to-b from-[#FFF5F0] via-[#E8C8B8] to-[#961729] bg-clip-text text-transparent"
                style={{
                  transform: `translate3d(0, ${charY.toFixed(2)}%, 0)`,
                  opacity: Math.max(0, Math.min(1, charOpacity)),
                  transition: 'letter-spacing 0.1s linear',
                }}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-[#140306] flex flex-col justify-center items-center pointer-events-none select-none transition-opacity duration-300 px-4 overflow-hidden"
      style={{
        opacity: overlayOpacity,
        willChange: 'opacity',
      }}
      aria-hidden={isLoaded ? 'true' : 'false'}
    >
      {/* Ambient Red Backlight Glow behind Wordmark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1100px] h-[320px] bg-gradient-to-r from-[#8B0D1E]/40 via-[#C22D43]/25 to-[#8B0D1E]/40 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Signature Title & Editorial Subtitles Composition */}
      <div className="flex flex-col items-center text-center max-w-7xl w-full z-50 relative">

        {/* 1. HERO WORDMARK: "JUSTUS ROBIN" */}
        <h1
          className="font-brand-cinzel text-[clamp(2.4rem,7.2vw,7.4rem)] font-bold uppercase leading-[0.95] tracking-[0.10em] sm:tracking-[0.14em] relative flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-[0.42em] gap-y-1 mb-6 sm:mb-8 drop-shadow-[0_4px_14px_rgba(255,240,230,0.35)] drop-shadow-[0_16px_40px_rgba(139,13,30,0.85)]"
          style={{
            letterSpacing: `${(0.12 + exitSpacing).toFixed(3)}em`,
          }}
        >
          {renderWord(WORD_1, 0)}
          {renderWord(WORD_2, WORD_1.length)}

          {/* Champagne Highlight Sweep Light Beam */}
          {sweepOpacity > 0.01 && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-color-dodge z-20"
              style={{ opacity: sweepOpacity }}
            >
              <div
                className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FFF0E6]/95 to-transparent transform -skew-x-12 will-change-transform"
                style={{
                  transform: `translate3d(${sweepX.toFixed(1)}%, 0, 0) skewX(-20deg)`,
                }}
              />
            </div>
          )}
        </h1>

        {/* 2. THIN HORIZONTAL CHAMPAGNE DIVIDER LINE WITH GLOWING CENTER POINT */}
        <div
          className="w-32 sm:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#F4E2D8] to-transparent my-3 sm:my-4 relative flex items-center justify-center will-change-transform"
          style={{
            transform: `scaleX(${lineScale.toFixed(3)})`,
            opacity: lineOpacity,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4E2D8] shadow-[0_0_10px_#F4E2D8]" />
        </div>

        {/* 3. SUPPORTING TEXT 1: "DEVELOPER · CREATIVE STUDIO" */}
        <p
          className="font-mono-tech text-[10px] sm:text-xs md:text-sm tracking-[0.32em] sm:tracking-[0.38em] text-[#C4A89C] uppercase font-medium mb-2.5 sm:mb-3 will-change-transform drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          style={{
            transform: `translate3d(0, ${sub1Y.toFixed(2)}px, 0)`,
            opacity: sub1Opacity,
          }}
        >
          DEVELOPER · CREATIVE STUDIO
        </p>

        {/* 4. SUPPORTING TEXT 2: "A DIGITAL EXPERIENCE IN THE MAKING" */}
        <p
          className="font-sans text-[9px] sm:text-[11px] tracking-[0.38em] sm:tracking-[0.44em] text-[#C4A89C]/60 uppercase font-light will-change-transform"
          style={{
            transform: `translate3d(0, ${sub2Y.toFixed(2)}px, 0)`,
            opacity: sub2Opacity,
          }}
        >
          A DIGITAL EXPERIENCE IN THE MAKING
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;
