import React from 'react';
import { GraduationCap, Code, Rocket, Cpu, Briefcase } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const milestones = [
    {
      year: '2024',
      title: 'Started CS-Engineering',
      icon: <GraduationCap size={18} className="text-[#E8C8B8]" />,
    },
    {
      year: '2025',
      title: 'Mastered Modern Web',
      icon: <Code size={18} className="text-[#E8C8B8]" />,
    },
    {
      year: '2025',
      title: 'Shipped to Production',
      icon: <Rocket size={18} className="text-[#E8C8B8]" />,
    },
    {
      year: '2026',
      title: 'Engineered AI Telemetry',
      icon: <Cpu size={18} className="text-[#E8C8B8]" />,
    },
    {
      year: '2026',
      title: 'Freelance Full-Stack',
      icon: <Briefcase size={18} className="text-[#E8C8B8]" />,
    },
  ];

  return (
    <section
      id="journey"
      className="py-28 md:py-36 bg-[#140306] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-4">
          <span>MY JOURNEY</span>
          <span className="w-12 h-[1px] bg-[#E8C8B8]" />
        </div>

        <h2 className="font-editorial-serif text-5xl sm:text-6xl font-normal text-[#F4E2D8] tracking-tight uppercase mb-16">
          Key <em className="not-italic font-bold text-[#E8C8B8]">Milestones</em>
        </h2>

        {/* 5 Milestone Nodes Horizontal Line (Matching Reference Image Key Milestones Section!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 relative">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="card-wine-editorial p-6 rounded-2xl text-center relative group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1D0509] border border-[#F4E2D8]/20 flex items-center justify-center mx-auto mb-4 text-[#E8C8B8] group-hover:scale-110 transition-transform">
                {m.icon}
              </div>

              <div className="font-editorial-serif text-3xl font-extrabold text-[#F4E2D8] mb-1">
                {m.year}
              </div>

              <div className="font-sans text-xs text-[#C4A89C] leading-snug">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        {/* Dark Wine Rose Flower Peeking on Right Edge - Rotated 180deg and shifted left */}
        <div className="absolute -right-20 sm:-right-24 -bottom-32 w-[260px] sm:w-[320px] opacity-95 animate-float-flower pointer-events-none z-0">
          <img
            src="/assets/dark_wine_rose_corner.png"
            alt="Rose Accent"
            className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            style={{ transform: 'rotate(180deg)' }}
          />
        </div>

      </div>
    </section>
  );
};
