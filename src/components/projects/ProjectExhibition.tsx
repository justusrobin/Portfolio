import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

export const ProjectExhibition: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Responsive visible count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, PROJECTS.length - visibleCount);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Autoplay functionality (pauses when hovered or modal is open)
  useEffect(() => {
    if (isPaused || selectedProject !== null) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, selectedProject, handleNext]);

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

  // Touch Swipe handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  return (
    <section
      id="work"
      className="py-24 sm:py-32 lg:py-36 bg-[#140306] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden select-none"
    >
      {/* Deep Burgundy Atmosphere Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(107, 26, 36, 0.18) 0%, rgba(20, 3, 7, 0.95) 70%, #0E0205 100%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── TOP HEADER & CONTROLS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-3">
              <span>MY WORK</span>
              <span className="w-12 h-[1px] bg-[#E8C8B8]/40" />
              <span className="text-[#E8C8B8]">CURATED PORTFOLIO</span>
            </div>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase leading-[0.95]">
              Featured <em className="not-italic font-bold text-[#E8C8B8]">Projects</em>
            </h2>
            <p className="font-sans-body text-xs sm:text-sm text-[#B8988C] max-w-lg mt-3 leading-relaxed">
              Explore production applications, private offline AI engines, hardware telemetry systems, and distributed food-tech architectures engineered by Justus Robin.
            </p>
          </div>

          {/* Carousel Control Toolbar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start md:self-end">
            {/* Slide Index Counter */}
            <div className="font-mono-tech text-xs tracking-[0.2em] text-[#C4A89C] bg-[#1F050B]/80 px-3.5 py-1.5 rounded-full border border-[#E8C8B8]/15 flex items-center gap-2">
              <span className="text-[#F4E2D8] font-bold">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span>/</span>
              <span>{String(PROJECTS.length).padStart(2, '0')}</span>
            </div>

            {/* Prev / Next Circular Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Project"
                className="w-10 h-10 rounded-full border border-[#E8C8B8]/20 bg-[#1A0408]/80 hover:bg-[#C22D43]/25 hover:border-[#E8C8B8]/60 text-[#F4E2D8] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Project"
                className="w-10 h-10 rounded-full border border-[#E8C8B8]/20 bg-[#1A0408]/80 hover:bg-[#C22D43]/25 hover:border-[#E8C8B8]/60 text-[#F4E2D8] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Direct GitHub Profile Link */}
            <a
              href="https://github.com/justusrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-mono-tech text-xs text-[#E8C8B8] font-bold uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8C8B8]/30 hover:border-[#E8C8B8] hover:bg-[#E8C8B8]/10 transition-all cursor-pointer"
            >
              <span>ALL ON GITHUB</span>
              <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* ── CAROUSEL TRACK VIEWPORT ── */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing pb-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
            }}
          >
            {PROJECTS.map((proj) => {
              const isLive = Boolean(proj.liveUrl);

              return (
                <div
                  key={proj.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="card-wine-editorial h-full rounded-2xl flex flex-col justify-between group transition-all duration-500 border border-[#F4E2D8]/15 hover:border-[#E8C8B8]/50 bg-[#180407]/90 hover:bg-[#20050B]/95 p-5 sm:p-6 relative shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(194,45,67,0.25)]">
                    
                    {/* Top Content Area */}
                    <div>
                      {/* Image Frame with Live Status Pin */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-[#F4E2D8]/15 bg-[#120205]">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140306] via-transparent to-transparent opacity-60" />

                        {/* Top-Right Badge: Live or Open Source */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-tech tracking-wider uppercase backdrop-blur-md border border-[#F4E2D8]/20 bg-[#140306]/85 text-[#F4E2D8]">
                          {isLive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                              <span className="text-[#E8C8B8]">LIVE APP</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A8E] shadow-[0_0_8px_#FF7A8E]" />
                              <span className="text-[#FFB3BF]">OPEN SOURCE</span>
                            </>
                          )}
                        </div>

                        {/* Bottom-Left Number Overlay */}
                        <div className="absolute bottom-3 left-3 font-mono-tech text-[11px] font-bold text-[#E8C8B8] bg-[#140306]/80 px-2.5 py-0.5 rounded border border-[#E8C8B8]/20 backdrop-blur-sm">
                          {proj.number} // {proj.year}
                        </div>
                      </div>

                      {/* Category & Title */}
                      <div className="font-mono-tech text-[10px] tracking-[0.2em] text-[#C4A89C] uppercase mb-1">
                        {proj.category}
                      </div>

                      <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#F4E2D8] uppercase tracking-wide mb-2 group-hover:text-white transition-colors">
                        {proj.title}
                      </h3>

                      <p className="font-sans-body text-xs text-[#C4A89C] leading-relaxed line-clamp-3 mb-4">
                        {proj.description}
                      </p>
                    </div>

                    {/* Bottom Tech Pills & Actions */}
                    <div>
                      {/* Tech Stacks */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full bg-[#20050B] text-[#D8C2B8] border border-[#F4E2D8]/10 group-hover:border-[#E8C8B8]/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.technologies.length > 4 && (
                          <span className="font-mono-tech text-[9px] px-1.5 py-0.5 rounded-full bg-[#2B0A11] text-[#E8C8B8] border border-[#6B1A24]">
                            +{proj.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F4E2D8]/10 text-xs font-mono-tech">
                        {/* Left: Details Modal Button */}
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="text-[#E8C8B8] hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        >
                          <span>DETAILS</span>
                          <ArrowUpRight size={13} />
                        </button>

                        {/* Right: Live Demo / GitHub Code Links */}
                        <div className="flex items-center gap-2">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-[#C22D43]/20 hover:bg-[#C22D43] text-[#F4E2D8] border border-[#C22D43]/50 flex items-center gap-1 text-[11px] font-bold transition-all shadow-sm"
                            >
                              <span>DEMO</span>
                              <ExternalLink size={11} />
                            </a>
                          )}

                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${proj.title} source code on GitHub`}
                              className="p-1.5 rounded-full bg-[#20050B] text-[#F4E2D8] border border-[#F4E2D8]/15 hover:bg-[#F4E2D8] hover:text-[#140306] transition-all"
                            >
                              <Code2 size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM CAROUSEL PROGRESS DOTS & CONTROLS ── */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#F4E2D8]/10">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === dotIdx
                    ? 'w-8 bg-[#E8C8B8] shadow-[0_0_8px_#E8C8B8]'
                    : 'w-2 bg-[#F4E2D8]/20 hover:bg-[#F4E2D8]/50'
                }`}
              />
            ))}
          </div>

          {/* Autoplay Pause / Play Hint */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-2 font-mono-tech text-[10px] tracking-widest text-[#C4A89C] hover:text-[#F4E2D8] transition-colors cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play size={11} />
                <span>RESUME AUTOPLAY</span>
              </>
            ) : (
              <>
                <Pause size={11} />
                <span>PAUSE CAROUSEL</span>
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
