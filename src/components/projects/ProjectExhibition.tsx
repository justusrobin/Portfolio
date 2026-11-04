import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PROJECTS, type Project } from '../../data/portfolioData';
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';

export const ProjectExhibition: React.FC = () => {
  // Triple the projects array to create a continuous, infinite arched ribbon
  const duplicatedProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];
  const totalItems = duplicatedProjects.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1400);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartOffset, setDragStartOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Responsive card dimensions
  const [cardDim, setCardDim] = useState({ width: 280, height: 400, gap: 24, arcDip: 60 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCardDim({ width: 220, height: 320, gap: 16, arcDip: 40 });
      } else if (w < 1024) {
        setCardDim({ width: 250, height: 360, gap: 20, arcDip: 50 });
      } else {
        setCardDim({ width: 280, height: 400, gap: 24, arcDip: 62 });
      }

      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 1400);
      } else {
        setContainerWidth(w);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const step = cardDim.width + cardDim.gap;
  const totalTrackWidth = totalItems * step;

  // Initial offset to center the middle set of projects
  useEffect(() => {
    setScrollOffset(PROJECTS.length * step);
  }, [step]);

  // Autoplay gentle drift along the arched ribbon
  useEffect(() => {
    if (isPaused || isDragging || selectedProject !== null) return;

    let animId: number;
    let lastTime = performance.now();

    const drift = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Gentle continuous scroll (32 pixels per second)
      setScrollOffset((prev) => {
        let next = prev + 32 * dt;
        if (next >= totalTrackWidth) next -= totalTrackWidth / 3;
        return next;
      });

      animId = requestAnimationFrame(drift);
    };

    animId = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isDragging, selectedProject, totalTrackWidth]);

  // Manual Previous / Next slide navigation
  const handlePrev = useCallback(() => {
    setScrollOffset((prev) => {
      let next = prev - step;
      if (next < 0) next += totalTrackWidth / 3;
      return next;
    });
  }, [step, totalTrackWidth]);

  const handleNext = useCallback(() => {
    setScrollOffset((prev) => {
      let next = prev + step;
      if (next >= totalTrackWidth) next -= totalTrackWidth / 3;
      return next;
    });
  }, [step, totalTrackWidth]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject !== null) {
        if (e.key === 'Escape') setSelectedProject(null);
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedProject]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartOffset(scrollOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    let newOffset = dragStartOffset - delta;
    if (newOffset < 0) newOffset += totalTrackWidth / 3;
    if (newOffset >= totalTrackWidth) newOffset -= totalTrackWidth / 3;
    setScrollOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.targetTouches[0].clientX);
    setDragStartOffset(scrollOffset);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.targetTouches[0].clientX - dragStartX;
    let newOffset = dragStartOffset - delta;
    if (newOffset < 0) newOffset += totalTrackWidth / 3;
    if (newOffset >= totalTrackWidth) newOffset -= totalTrackWidth / 3;
    setScrollOffset(newOffset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate the currently centered project for the live counter
  const normalizedOffset = ((scrollOffset % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;
  const rawCenterIndex = Math.round(normalizedOffset / step) % PROJECTS.length;
  const activeProjectNumber = (rawCenterIndex + 1);

  return (
    <section
      id="work"
      className="py-24 sm:py-32 lg:py-36 bg-[#120205] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden select-none"
    >
      {/* Background Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 50% 35%, rgba(107, 26, 36, 0.22) 0%, rgba(18, 2, 5, 0.95) 75%, #0A0103 100%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ── TOP SECTION HEADER (Centered Editorial Style) ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 font-mono-tech text-xs tracking-[0.28em] text-[#C4A89C] uppercase mb-3">
            <span className="w-8 h-[1px] bg-[#E8C8B8]/40" />
            <span>MY WORK</span>
            <span className="w-8 h-[1px] bg-[#E8C8B8]/40" />
          </div>

          <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase leading-[0.95] mb-4">
            Featured <em className="not-italic font-bold text-[#E8C8B8]">Projects</em>
          </h2>

          <p className="font-sans-body text-xs sm:text-sm text-[#B8988C] leading-relaxed">
            A panoramic collection of production web platforms, private offline AI engines, hardware telemetry systems, and distributed food-tech architectures engineered by Justus Robin.
          </p>
        </div>

        {/* ── 3D ARCHED / CURVED CAROUSEL STAGE ── */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-10 sm:py-14 cursor-grab active:cursor-grabbing"
          style={{
            perspective: '1300px',
            perspectiveOrigin: '50% 45%',
            minHeight: `${cardDim.height + cardDim.arcDip + 60}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setIsPaused(false);
          }}
          onMouseEnter={() => setIsPaused(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Centered Relative Anchor */}
          <div className="absolute left-1/2 top-10 sm:top-14 -translate-x-1/2 w-0 h-0">
            {duplicatedProjects.map((proj, idx) => {
              // Position along the infinite track
              let pos = idx * step - scrollOffset;

              // Wrap pos into the symmetric window [-totalTrackWidth/2, +totalTrackWidth/2]
              const halfTrack = totalTrackWidth / 2;
              while (pos < -halfTrack) pos += totalTrackWidth;
              while (pos > halfTrack) pos -= totalTrackWidth;

              // Normalized horizontal distance from center: -1.0 (left edge) to +1.0 (right edge)
              const halfViewport = Math.max(containerWidth / 2, 500);
              const u = pos / halfViewport;

              // Only render cards that are in or near the visible viewport
              if (Math.abs(u) > 1.35) return null;

              // ── ARCHED CURVATURE FORMULATION ──
              // Center cards (u = 0) are at crest (y = 0); outer cards dip downwards as u^2
              const yDip = cardDim.arcDip * (u * u);

              // Tangent rotation along the arch:
              // Left cards tilt counter-clockwise (slanted down on left, up to center)
              // Right cards tilt clockwise (slanted down on right, up to center)
              const rotateZ = u * 9.5; // degrees

              // 3D cylindrical wrap (cards angle gently towards the user)
              const rotateY = -u * 14.0; // degrees

              // Scale: Center cards are slightly elevated
              const scale = Math.max(0.86, 1.03 - 0.12 * Math.abs(u));

              // Soft peripheral opacity fade at extreme margins
              const opacity = Math.max(0.25, 1.0 - 0.75 * Math.pow(Math.abs(u), 2.8));

              // Depth stacking: center cards always layer above edge cards
              const zIndex = Math.round(100 - Math.abs(u) * 50);

              const isLive = Boolean(proj.liveUrl);

              return (
                <div
                  key={`${proj.id}-${idx}`}
                  onClick={() => setSelectedProject(proj)}
                  className="absolute group transition-transform duration-100 ease-out cursor-pointer"
                  style={{
                    left: `${pos}px`,
                    top: `${yDip}px`,
                    width: `${cardDim.width}px`,
                    height: `${cardDim.height}px`,
                    transform: `translate(-50%, 0) rotateZ(${rotateZ.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                    opacity: opacity.toFixed(3),
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Card Container with Luxury Wine Border & Shadow */}
                  <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#F4E2D8]/20 group-hover:border-[#E8C8B8]/70 bg-[#160408] shadow-[0_20px_45px_rgba(0,0,0,0.8)] group-hover:shadow-[0_25px_55px_rgba(194,45,67,0.35)] transition-all duration-300">
                    
                    {/* Full-Bleed Image Frame */}
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120205] via-[#120205]/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    {/* ── TOP BADGES ── */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      {/* Project Number */}
                      <span className="font-mono-tech text-[10px] font-bold text-[#E8C8B8] bg-[#140306]/85 px-2.5 py-0.5 rounded-full border border-[#E8C8B8]/25 backdrop-blur-md">
                        {proj.number}
                      </span>

                      {/* Live Status Pill */}
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono-tech tracking-wider uppercase backdrop-blur-md border border-[#F4E2D8]/20 bg-[#140306]/85 text-[#F4E2D8]">
                        {isLive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                            <span className="text-[#E8C8B8] font-bold">LIVE</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A8E] shadow-[0_0_8px_#FF7A8E]" />
                            <span className="text-[#FFB3BF]">OPEN</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ── BOTTOM CONTENT OVERLAY ── */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
                      <div className="font-mono-tech text-[9px] tracking-[0.2em] text-[#C4A89C] uppercase mb-1">
                        {proj.category}
                      </div>

                      <h3 className="font-editorial-serif text-lg sm:text-xl font-normal text-[#F4E2D8] uppercase tracking-wide leading-snug mb-1 group-hover:text-white transition-colors">
                        {proj.title}
                      </h3>

                      <p className="font-sans-body text-[11px] text-[#C4A89C] line-clamp-2 leading-relaxed mb-3">
                        {proj.description}
                      </p>

                      {/* Tech Stacks */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono-tech text-[9px] px-2 py-0.5 rounded-full bg-[#20050B]/90 text-[#D8C2B8] border border-[#F4E2D8]/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Quick Action Hint */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F4E2D8]/10 text-[10px] font-mono-tech">
                        <span className="text-[#E8C8B8] group-hover:underline flex items-center gap-1 font-bold">
                          <span>EXPLORE</span>
                          <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>

                        <span className="text-[#B8988C]">{proj.year}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM CONTROLS & NAVIGATION BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 sm:mt-12 pt-6 border-t border-[#F4E2D8]/10">
          
          {/* Left: Previous / Next Curved Ribbon Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous Project"
              className="w-10 h-10 rounded-full border border-[#E8C8B8]/25 bg-[#1A0408]/80 hover:bg-[#C22D43]/25 hover:border-[#E8C8B8]/60 text-[#F4E2D8] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="font-mono-tech text-xs tracking-[0.2em] text-[#C4A89C] px-3">
              <strong className="text-[#F4E2D8] font-bold">
                {String(activeProjectNumber).padStart(2, '0')}
              </strong>{' '}
              / {String(PROJECTS.length).padStart(2, '0')}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Project"
              className="w-10 h-10 rounded-full border border-[#E8C8B8]/25 bg-[#1A0408]/80 hover:bg-[#C22D43]/25 hover:border-[#E8C8B8]/60 text-[#F4E2D8] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Center: Direct Link to Justus Robin's GitHub */}
          <a
            href="https://github.com/justusrobin"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-mono-tech text-xs text-[#E8C8B8] font-bold uppercase tracking-widest flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8C8B8]/30 hover:border-[#E8C8B8] hover:bg-[#E8C8B8]/10 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={13} className="text-[#FF7A8E]" />
            <span>VIEW ALL PROJECTS ON GITHUB</span>
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Right: Autoplay Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-[#C4A89C] hover:text-[#F4E2D8] transition-colors cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play size={11} />
                <span>RESUME GLIDE</span>
              </>
            ) : (
              <>
                <Pause size={11} />
                <span>PAUSE GLIDE</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ── EXPANDED ARCHITECTURAL DETAILS MODAL ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#160408] border border-[#E8C8B8]/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 text-[#F4E2D8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#E8C8B8]/30 bg-[#2B0A11] hover:bg-[#C22D43] text-[#F4E2D8] flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="font-mono-tech text-xs tracking-[0.2em] text-[#C4A89C] uppercase mb-1">
              {selectedProject.number} // {selectedProject.category}
            </div>

            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold uppercase text-[#F4E2D8] mb-1">
              {selectedProject.title}
            </h3>

            <p className="font-sans-body text-xs text-[#E8C8B8] mb-4">
              {selectedProject.subtitle} • {selectedProject.role} ({selectedProject.year})
            </p>

            {/* Modal Image Frame */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 border border-[#F4E2D8]/15 bg-[#100204]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160408] via-transparent to-transparent opacity-40" />
            </div>

            {/* Full Description */}
            <div className="mb-6">
              <h4 className="font-mono-tech text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                OVERVIEW & ARCHITECTURE
              </h4>
              <p className="font-sans-body text-sm text-[#D8C2B8] leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Engineering Highlights */}
            {selectedProject.highlights && selectedProject.highlights.length > 0 && (
              <div className="mb-6">
                <h4 className="font-mono-tech text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                  KEY ENGINEERING HIGHLIGHTS
                </h4>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 font-sans-body text-xs sm:text-sm text-[#F4E2D8]/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C22D43] mt-2 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Architecture Nodes (if available) */}
            {selectedProject.architectureNodes && selectedProject.architectureNodes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-mono-tech text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                  SYSTEM TOPOLOGY NODES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.architectureNodes.map((node, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#24060E] border border-[#6B1A24]/60 text-xs"
                    >
                      <div className="font-mono-tech font-bold text-[#E8C8B8]">{node.label}</div>
                      <div className="text-[#C4A89C] text-[11px] mt-0.5">{node.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="mb-6">
              <h4 className="font-mono-tech text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                TECHNOLOGIES UTILIZED
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="font-mono-tech text-xs px-3 py-1 rounded-full bg-[#24060E] text-[#E8C8B8] border border-[#E8C8B8]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F4E2D8]/15">
              <div className="font-mono-tech text-xs text-[#C4A89C]">
                Status: <span className="text-[#E8C8B8] font-bold">{selectedProject.status}</span>
              </div>

              <div className="flex items-center gap-3">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-[#F4E2D8]/20 bg-[#24060E] hover:bg-[#F4E2D8] hover:text-[#140306] font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Code2 size={14} />
                    <span>VIEW REPOSITORY</span>
                  </a>
                )}

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#C22D43] hover:bg-[#e0344d] text-white font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_#C22D43]"
                  >
                    <span>OPEN APPLICATION</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
