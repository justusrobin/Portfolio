import React from 'react';
import { ArrowUpRight, Code, GraduationCap, BookOpen, Layers } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-28 md:py-36 bg-[#140306] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Top Section Tag */}
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-12">
          <span>ABOUT ME</span>
          <span className="w-12 h-[1px] bg-[#E8C8B8]" />
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Heading & Bio */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-editorial-serif text-5xl sm:text-6xl font-normal text-[#F4E2D8] leading-[1.05] tracking-tight mb-6">
                Strategy meets <br />
                <span className="italic font-light text-[#E8C8B8]">creativity.</span>
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#C4A89C] leading-relaxed mb-8">
                I'm Justus Robin, a Freelance Full-Stack Developer and Computer Science student based in Coimbatore, India. I build web applications and intelligent AI-powered tools that solve real problems and create meaningful impact.
              </p>
            </div>

            <div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#F4E2D8]/30 font-sans text-xs tracking-[0.2em] uppercase text-[#F4E2D8] hover:bg-[#F4E2D8] hover:text-[#140306] transition-all"
              >
                <span>MORE ABOUT ME</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Stat Cards Top + Education & Currently Learning Bottom */}
          <div className="lg:col-span-7 space-y-6 relative">

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-wine-editorial p-5 rounded-2xl text-center">
                <Code size={20} className="text-[#E8C8B8] mx-auto mb-2" />
                <div className="font-editorial-serif text-3xl font-extrabold text-[#F4E2D8]">10+</div>
                <div className="font-sans text-[11px] text-[#C4A89C] mt-1">Projects</div>
              </div>

              <div className="card-wine-editorial p-5 rounded-2xl text-center">
                <GraduationCap size={20} className="text-[#E8C8B8] mx-auto mb-2" />
                <div className="font-editorial-serif text-3xl font-extrabold text-[#F4E2D8]">8.14</div>
                <div className="font-sans text-[11px] text-[#C4A89C] mt-1">CGPA</div>
              </div>

              <div className="card-wine-editorial p-5 rounded-2xl text-center">
                <Layers size={20} className="text-[#E8C8B8] mx-auto mb-2" />
                <div className="font-editorial-serif text-3xl font-extrabold text-[#F4E2D8]">30+</div>
                <div className="font-sans text-[11px] text-[#C4A89C] mt-1">Technologies</div>
              </div>

              <div className="card-wine-editorial p-5 rounded-2xl text-center">
                <BookOpen size={20} className="text-[#E8C8B8] mx-auto mb-2" />
                <div className="font-editorial-serif text-3xl font-extrabold text-[#F4E2D8]">04+</div>
                <div className="font-sans text-[11px] text-[#C4A89C] mt-1">Live Apps</div>
              </div>
            </div>

            {/* Education & Currently Learning Sub-Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-wine-editorial p-6 rounded-2xl">
                <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#E8C8B8] uppercase mb-3">
                  <GraduationCap size={16} />
                  <span>EDUCATION</span>
                </div>
                <div className="font-sans font-bold text-sm text-[#F4E2D8]">
                  B.Tech Computer Science
                </div>
                <div className="font-sans text-xs text-[#C4A89C] mt-1">
                  Coimbatore, Tamil Nadu, India
                </div>
                <div className="flex items-center justify-between mt-2 font-mono-tech text-[10px] text-[#E8C8B8] font-semibold">
                  <span>2025 - 2029</span>

                </div>
              </div>

              <div className="card-wine-editorial p-6 rounded-2xl">
                <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-[#E8C8B8] uppercase mb-3">
                  <BookOpen size={16} />
                  <span>CURRENTLY LEARNING</span>
                </div>
                <ul className="font-sans text-xs text-[#C4A89C] space-y-1">
                  <li>• Data Structures & Algorithms</li>
                  <li>• Next.js 15 App Router Architecture</li>
                  <li>• Artificial Intelligence Telemetry</li>
                  <li>• Machine Learning & Systems</li>
                </ul>
              </div>
            </div>

            {/* Flower Accent Peeking on Right Edge */}
            <div className="absolute -right-20 -bottom-10 w-[240px] opacity-95 animate-float-flower-reverse pointer-events-none z-0">
              <img
                src="/assets/dark_wine_flower.png"
                alt="Flower Accent"
                className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] -rotate-45"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
