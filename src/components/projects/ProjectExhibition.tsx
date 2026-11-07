import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import InsidePovCarousel, {
  type InsidePovCarouselHandle,
  type VideoItem,
} from './InsidePovCarousel';
import { PROJECTS, type Project } from '../../data/portfolioData';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Sparkles,
  Touchpad,
  X,
} from 'lucide-react';

const videos: VideoItem[] = Array.from({ length: 14 }, (_, i) => ({
  src: `/videos/demo-${i + 1}.mp4`,
  poster: `/videos/poster-${i + 1}.jpg`,
  alt: `Project Video ${i + 1}`,
}));

export const ProjectExhibition: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const carouselRef = useRef<InsidePovCarouselHandle | null>(null);

  const handleSelectVideo = (index: number) => {
    const proj = PROJECTS[index % PROJECTS.length];
    if (proj) {
      setSelectedProject(proj);
    }
  };

  const currentProject = PROJECTS[activeVideoIndex % PROJECTS.length];

  return (
    <section
      id="work"
      className="py-14 sm:py-24 lg:py-32 bg-[#120205] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden select-none"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center">
        
        {/* ── TOP SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2.5 font-mono-tech text-[10px] sm:text-xs tracking-[0.26em] text-[#C4A89C] uppercase mb-2.5">
            <span className="w-6 sm:w-8 h-[1px] bg-[#E8C8B8]/40" />
            <span>MY WORK</span>
            <span className="w-6 sm:w-8 h-[1px] bg-[#E8C8B8]/40" />
          </div>

          <h2 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase leading-[1.05] sm:leading-[0.95] mb-3 sm:mb-4">
            Featured <em className="not-italic font-bold text-[#E8C8B8]">Projects</em>
          </h2>

          <p className="font-sans-body text-xs sm:text-sm text-[#B8988C] leading-relaxed max-w-xl mx-auto px-2">
            Panoramic InsidePOV 3D video carousel revolving across 14 perspectives. Swipe horizontally or drag with inertia, or tap any card for architecture details.
          </p>
        </div>

        {/* ── INSIDE POV 3D VIDEO CAROUSEL CONTAINER ── */}
        <div className="w-full flex justify-center">
          <InsidePovCarousel
            ref={carouselRef}
            videos={videos}
            autoRotate
            interactive
            onSelectVideo={handleSelectVideo}
            onActiveIndexChange={setActiveVideoIndex}
          />
        </div>

        {/* ── MOBILE & DESKTOP THUMB CONTROLS & STATUS ── */}
        <div className="w-full max-w-xl mx-auto mt-6 sm:mt-8 flex flex-col items-center gap-4">
          
          {/* Active Project Title Pill & Step Counter */}
          <div className="flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full bg-[#180409]/90 border border-[#E8C8B8]/15 backdrop-blur-sm shadow-md">
            {/* Prev Button */}
            <button
              onClick={() => carouselRef.current?.rotatePrev()}
              aria-label="Previous project"
              className="w-9 h-9 rounded-full bg-[#24060E] hover:bg-[#6B1A24] active:scale-95 text-[#F4E2D8] border border-[#E8C8B8]/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Current Project Info */}
            <div className="flex flex-col items-center text-center px-2 min-w-0">
              <span className="font-mono-tech text-[10px] tracking-widest text-[#C4A89C]">
                {String((activeVideoIndex % 14) + 1).padStart(2, '0')} / 14
              </span>
              <span className="font-editorial-serif text-xs sm:text-sm font-bold text-[#F4E2D8] truncate max-w-[180px] sm:max-w-[240px]">
                {currentProject?.title ?? `PROJECT ${(activeVideoIndex % 14) + 1}`}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => carouselRef.current?.rotateNext()}
              aria-label="Next project"
              className="w-9 h-9 rounded-full bg-[#24060E] hover:bg-[#6B1A24] active:scale-95 text-[#F4E2D8] border border-[#E8C8B8]/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Gesture Hint Pill */}
          <div className="inline-flex items-center gap-2 font-mono-tech text-[10px] sm:text-xs text-[#B8988C]/80 px-3 py-1 rounded-full bg-[#140306]/60 border border-[#F4E2D8]/5">
            <Touchpad size={12} className="text-[#E8C8B8]" />
            <span>Swipe sideways to rotate • Tap card for details</span>
          </div>

          {/* Direct GitHub Link */}
          <div className="mt-2 flex items-center justify-center">
            <a
              href="https://github.com/justusrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-mono-tech text-[11px] sm:text-xs text-[#E8C8B8] font-bold uppercase tracking-wider flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8C8B8]/30 hover:border-[#E8C8B8] hover:bg-[#E8C8B8]/10 transition-all cursor-pointer shadow-sm text-center"
            >
              <Sparkles size={13} className="text-[#FF7A8E] flex-shrink-0" />
              <span>EXPLORE ALL REPOSITORIES ON GITHUB</span>
              <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
            </a>
          </div>

        </div>

      </div>

      {/* ── EXPANDED ARCHITECTURAL DETAILS MODAL (MOBILE-OPTIMIZED) ── */}
      {selectedProject &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#160408] border border-[#E8C8B8]/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-5 sm:p-8 text-[#F4E2D8]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button with generous touch area */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#E8C8B8]/30 bg-[#2B0A11] hover:bg-[#C22D43] text-[#F4E2D8] flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <X size={17} />
              </button>

              {/* Modal Header */}
              <div className="font-mono-tech text-[10px] sm:text-xs tracking-[0.2em] text-[#C4A89C] uppercase mb-1 pr-8">
                {selectedProject.number} // {selectedProject.category}
              </div>

              <h3 className="font-editorial-serif text-xl sm:text-3xl font-bold uppercase text-[#F4E2D8] mb-1 pr-8">
                {selectedProject.title}
              </h3>

              <p className="font-sans-body text-xs text-[#E8C8B8] mb-4">
                {selectedProject.subtitle} • {selectedProject.role} ({selectedProject.year})
              </p>

              {/* Modal Image Frame */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-5 sm:mb-6 border border-[#F4E2D8]/15 bg-[#100204]">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#160408] via-transparent to-transparent opacity-40" />
              </div>

              {/* Full Description */}
              <div className="mb-5 sm:mb-6">
                <h4 className="font-mono-tech text-[11px] sm:text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                  OVERVIEW & ARCHITECTURE
                </h4>
                <p className="font-sans-body text-xs sm:text-sm text-[#D8C2B8] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Engineering Highlights */}
              {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                <div className="mb-5 sm:mb-6">
                  <h4 className="font-mono-tech text-[11px] sm:text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                    KEY ENGINEERING HIGHLIGHTS
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-sans-body text-xs sm:text-sm text-[#F4E2D8]/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C22D43] mt-1.5 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture Nodes (if available) */}
              {selectedProject.architectureNodes && selectedProject.architectureNodes.length > 0 && (
                <div className="mb-5 sm:mb-6">
                  <h4 className="font-mono-tech text-[11px] sm:text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                    SYSTEM TOPOLOGY NODES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
              <div className="mb-5 sm:mb-6">
                <h4 className="font-mono-tech text-[11px] sm:text-xs tracking-widest text-[#C4A89C] uppercase mb-2">
                  TECHNOLOGIES UTILIZED
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="font-mono-tech text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-[#24060E] text-[#E8C8B8] border border-[#E8C8B8]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#F4E2D8]/15">
                <div className="font-mono-tech text-xs text-[#C4A89C] text-center sm:text-left">
                  Status: <span className="text-[#E8C8B8] font-bold">{selectedProject.status}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full border border-[#F4E2D8]/20 bg-[#24060E] hover:bg-[#F4E2D8] hover:text-[#140306] font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5"
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
                      className="px-4 py-2.5 rounded-full bg-[#C22D43] hover:bg-[#e0344d] text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_#C22D43]"
                    >
                      <span>OPEN APPLICATION</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};