import React from 'react';
import { PROJECTS } from '../../data/portfolioData';
import { ArrowUpRight, Code2, ExternalLink } from 'lucide-react';

export const ProjectExhibition: React.FC = () => {
  return (
    <section
      id="work"
      className="py-28 md:py-36 bg-[#180407] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-4">
              <span>MY WORK</span>
              <span className="w-12 h-[1px] bg-[#E8C8B8]" />
            </div>
            <h2 className="font-editorial-serif text-5xl sm:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase">
              Featured <em className="not-italic font-bold text-[#E8C8B8]">Projects</em>
            </h2>
          </div>

          <div className="font-mono-tech text-xs text-[#E8C8B8] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span>VIEW ALL PROJECTS</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Top Row: 3 Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {PROJECTS.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              className="card-wine-editorial p-6 rounded-2xl flex flex-col justify-between group transition-all duration-500"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-[#F4E2D8]/15 bg-[#140306]">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140306] via-transparent to-transparent opacity-50" />
                </div>

                <div className="font-sans font-bold text-base text-[#F4E2D8] uppercase mb-1 flex items-center justify-between">
                  <span>{proj.title}</span>
                </div>

                <p className="font-sans text-xs text-[#C4A89C] leading-relaxed line-clamp-2 mb-4">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full bg-[#1D0509] text-[#C4A89C] border border-[#F4E2D8]/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F4E2D8]/10 text-xs font-mono-tech">
                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E8C8B8] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Live App</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-[#C4A89C]">{proj.year}</span>
                  )}

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-[#1D0509] text-[#F4E2D8] border border-[#F4E2D8]/15 hover:bg-[#F4E2D8] hover:text-[#140306] transition-all"
                    >
                      <Code2 size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row: 2 Wide Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.slice(3).map((proj) => (
            <div
              key={proj.id}
              className="card-wine-editorial p-6 rounded-2xl flex flex-col justify-between group transition-all duration-500"
            >
              <div>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-5 border border-[#F4E2D8]/15 bg-[#140306]">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140306] via-transparent to-transparent opacity-50" />
                </div>

                <div className="font-sans font-bold text-base text-[#F4E2D8] uppercase mb-1">
                  {proj.title}
                </div>

                <p className="font-sans text-xs text-[#C4A89C] leading-relaxed line-clamp-2 mb-4">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full bg-[#1D0509] text-[#C4A89C] border border-[#F4E2D8]/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F4E2D8]/10 text-xs font-mono-tech">
                  <span className="text-[#C4A89C]">{proj.year} • {proj.status}</span>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full bg-[#1D0509] text-[#F4E2D8] border border-[#F4E2D8]/15 hover:bg-[#F4E2D8] hover:text-[#140306] transition-all"
                    >
                      <Code2 size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
