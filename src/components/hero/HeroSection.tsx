import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  isLoaded?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, isLoaded = true }) => {
  return (
    <section
      id="hero"
      className="min-h-screen bg-[#140306] text-[#F4E2D8] pt-28 lg:pt-36 pb-0 px-6 lg:px-12 flex items-center relative overflow-hidden"
    >
      {/* Background Subtle Wine Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-[650px] h-[650px] bg-[#6B1A24]/20 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Bottom-Left Corner Flower Accent */}
      <div className="absolute left-0 bottom-0 w-[240px] sm:w-[320px] pointer-events-none z-0 animate-float-flower-reverse">
        <img
          src="/assets/dark_wine_flower.png"
          alt="Dark Wine Flower Accent"
          className="w-full h-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 pb-12 lg:pb-0">
        
        {/* Left Column: Headline, Subtitle, & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 py-8 lg:py-16">
          
          {/* Top Descriptor Line */}
          <div
            className={`flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-6 transition-all duration-[1200ms] ease-out delay-[150ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span>FREELANCE DEVELOPER</span>
            <span className="w-12 h-[1px] bg-[#E8C8B8]" />
          </div>

          {/* Enormous Editorial Headline */}
          <h1
            className={`font-editorial-serif uppercase leading-[0.9] tracking-tight mb-6 transition-all duration-[1400ms] ease-out delay-[350ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-4xl sm:text-6xl font-light text-[#F4E2D8]/80 block tracking-widest">
              I BUILD DIGITAL
            </span>
            <span className="text-6xl sm:text-8xl font-extrabold text-[#F4E2D8] block tracking-tighter my-1">
              EXPERIENCES
            </span>
            <span className="text-5xl sm:text-7xl font-normal italic text-[#E8C8B8] block normal-case">
              THAT <em className="not-italic font-bold uppercase text-[#F4E2D8]">STAND OUT.</em>
            </span>
          </h1>

          {/* Subtitle Description */}
          <p
            className={`font-sans text-base sm:text-lg text-[#C4A89C] leading-relaxed max-w-xl mb-8 transition-all duration-[1200ms] ease-out delay-[550ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Freelance Full-Stack Developer specializing in high-performance web applications, AI integration, and workflow automation.
          </p>

          {/* View Work CTA Button */}
          <div
            className={`transition-all duration-[1200ms] ease-out delay-[750ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => onNavigate('work')}
              className="px-8 py-4 rounded-full bg-[#1F0509] border border-[#F4E2D8]/30 font-sans text-xs font-bold tracking-[0.2em] uppercase text-[#F4E2D8] hover:bg-[#F4E2D8] hover:text-[#140306] transition-all shadow-[0_0_30px_rgba(107,26,36,0.3)] flex items-center gap-2 cursor-pointer group"
            >
              <span>VIEW WORK</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Right Column: User Photo & Circular Wine Arch Backdrop */}
        <div className="lg:col-span-5 relative flex justify-center items-end min-h-[500px] sm:min-h-[640px] lg:min-h-[720px] self-end">
          
          {/* Top Right Corner Vertical Text */}
          <div
            className={`hidden sm:flex flex-col items-center gap-2 absolute top-4 right-0 font-mono-tech text-[10px] text-[#C4A89C]/60 tracking-[0.25em] uppercase text-right z-30 transition-all duration-[1200ms] ease-out delay-[650ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="writing-mode-vertical tracking-[0.3em] font-light">Refine</span>
            <span className="w-[1px] h-6 bg-[#E8C8B8]/30 my-1" />
            <span className="writing-mode-vertical tracking-[0.3em] font-light">Code</span>
            <span className="w-[1px] h-6 bg-[#E8C8B8]/30 my-1" />
            <span className="writing-mode-vertical tracking-[0.3em] font-light">Trigger</span>
            <span className="w-[1px] h-6 bg-[#E8C8B8]/30 my-1" />
            <span className="writing-mode-vertical tracking-[0.3em] font-light">Execute</span>
          </div>

          {/* Main Dark Wine Circular Arch Backdrop (Positioned Behind Person) */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[420px] sm:w-[540px] lg:w-[620px] h-[420px] sm:h-[540px] lg:h-[620px] rounded-full bg-gradient-to-b from-[#3A0E17] via-[#2B0A11] to-[#140306] border border-[#E8C8B8]/25 shadow-[0_0_100px_rgba(107,26,36,0.6)] pointer-events-none z-0 transition-all duration-[1500ms] ease-out delay-[250ms] ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            {/* Inner Glowing Ring */}
            <div className="absolute inset-3 rounded-full border border-[#E8C8B8]/15" />
          </div>

          {/* User Photo Cutout (Cropped at Waist, Scaled HUGE to Fill Full Height with ZERO Bottom Gap) */}
          <div
            className={`relative z-20 w-full flex items-end justify-center pointer-events-none h-[520px] sm:h-[660px] lg:h-[740px] xl:h-[780px] transition-all duration-[1500ms] ease-out delay-[450ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <img
              src="/assets/justus_cutout.png"
              alt="Justus Robin"
              className="h-full w-auto object-contain object-bottom filter contrast-[1.04] drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)] transition-transform duration-700 hover:scale-[1.02] pointer-events-auto block"
            />
          </div>

          {/* Dark Crimson Rose Accent Peeking Behind Circle on Far Right Edge */}
          <div className="absolute -right-16 sm:-right-24 bottom-12 w-[300px] sm:w-[400px] opacity-90 z-10 animate-float-flower pointer-events-none">
            <img
              src="/assets/dark_wine_rose_corner.png"
              alt="Dark Wine Rose Accent"
              className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
