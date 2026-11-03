import React from 'react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#140306] text-[#C4A89C] py-12 border-t border-[#F4E2D8]/10 font-mono-tech text-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div>
          <span className="font-brand-cinzel text-2xl font-bold text-[#F4E2D8] tracking-[0.14em] uppercase block">
            JUSTUS ROBIN
          </span>
          <span className="text-[10px] text-[#C4A89C] opacity-70">
            CREATIVE ENGINEERING STUDIO
          </span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#C4A89C]/80 text-center">
          © {new Date().getFullYear()} {PERSONAL_INFO.fullName}. All rights reserved.
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-[#F4E2D8] hover:text-[#E8C8B8] transition-colors cursor-pointer font-bold uppercase tracking-wider"
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={14} />
        </button>

      </div>
    </footer>
  );
};
