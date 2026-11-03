import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  isLoaded?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection, isLoaded = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', id: 'hero' },
    { label: 'ABOUT', id: 'about' },
    { label: 'WORK', id: 'work' },
    { label: 'SKILLS', id: 'skills' },
    { label: 'JOURNEY', id: 'journey' },
    { label: 'CONTACT', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[1200ms] ease-out delay-[300ms] ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      } ${
        isScrolled
          ? 'py-4 bg-[#140306]/90 backdrop-blur-xl border-b border-[#F4E2D8]/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-7 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-3"
        >
          <div>
            <span className="font-brand-cinzel text-xl sm:text-2xl font-bold text-[#F4E2D8] tracking-[0.14em] uppercase block leading-none group-hover:text-[#E8C8B8] transition-colors">
              JUSTUS ROBIN
            </span>
            <span className="font-mono-tech text-[9px] tracking-[0.25em] text-[#C4A89C] block mt-1 uppercase opacity-70">
              DEVELOPER & CREATIVE STUDIO
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-[#2B0A11]/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#F4E2D8]/15">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-sans text-xs tracking-[0.18em] uppercase transition-all cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-[#F4E2D8] font-bold'
                    : 'text-[#C4A89C] hover:text-[#F4E2D8]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4E2D8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-full border border-[#F4E2D8]/30 font-sans text-xs tracking-wider uppercase text-[#F4E2D8] hover:bg-[#F4E2D8] hover:text-[#140306] transition-all cursor-pointer flex items-center gap-1.5 font-medium shadow-[0_0_20px_rgba(107,26,36,0.3)]"
          >
            <span>LET'S TALK</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
