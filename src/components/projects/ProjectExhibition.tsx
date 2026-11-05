import React, { useState } from 'react';
import InsidePovCarousel, { type VideoItem } from './InsidePovCarousel';
import { PROJECTS, type Project } from '../../data/portfolioData';
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';

const videos: VideoItem[] = Array.from({ length: 14 }, (_, i) => ({
  src: `/videos/demo-${i + 1}.mp4`,
  poster: `/videos/poster-${i + 1}.jpg`,
  alt: `Project Video ${i + 1}`,
}));

export const ProjectExhibition: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSelectVideo = (index: number) => {
    const proj = PROJECTS[index % PROJECTS.length];
    if (proj) {
      setSelectedProject(proj);
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center">
        
        {/* ── TOP SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 font-mono-tech text-xs tracking-[0.28em] text-[#C4A89C] uppercase mb-3">
            <span className="w-8 h-[1px] bg-[#E8C8B8]/40" />
            <span>MY WORK</span>
            <span className="w-8 h-[1px] bg-[#E8C8B8]/40" />
          </div>

          <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase leading-[0.95] mb-4">
            Featured <em className="not-italic font-bold text-[#E8C8B8]">Projects</em>
          </h2>

          <p className="font-sans-body text-xs sm:text-sm text-[#B8988C] leading-relaxed max-w-xl mx-auto">
            Panoramic InsidePOV 3D video carousel revolving across 14 perspectives. Drag or swipe horizontally to navigate with natural inertia, or hover to pause.
          </p>
        </div>

        {/* ── INSIDE POV 3D VIDEO CAROUSEL CONTAINER ── */}
        <div className="w-full flex justify-center">
          <InsidePovCarousel
            videos={videos}
            autoRotate
            interactive
            onSelectVideo={handleSelectVideo}
          />
        </div>

        {/* ── BOTTOM DIRECT GITHUB LINK ── */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center">
          <a
            href="https://github.com/justusrobin"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-mono-tech text-xs text-[#E8C8B8] font-bold uppercase tracking-widest flex items-center gap-2 px-6 py-3 rounded-full border border-[#E8C8B8]/30 hover:border-[#E8C8B8] hover:bg-[#E8C8B8]/10 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={14} className="text-[#FF7A8E]" />
            <span>EXPLORE ALL REPOSITORIES ON GITHUB</span>
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
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
