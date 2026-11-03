import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { Mail, Code2, Globe, Send, Check, Phone, FileText, Download, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="py-28 md:py-36 bg-[#140306] text-[#F4E2D8] border-t border-[#F4E2D8]/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Flower Accent Peeking on Bottom Left Edge - Rotated 180deg & Shifted slightly right */}
        <div className="absolute -left-16 -bottom-20 w-[300px] opacity-80 animate-float-flower-reverse pointer-events-none z-0">
          <img
            src="/assets/dark_wine_rose_corner.png"
            alt="Flower Accent"
            className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-180 scale-x-[-1]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Direct Info & Social Links */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 font-mono-tech text-xs tracking-[0.25em] text-[#C4A89C] uppercase mb-4">
              <span>GET IN TOUCH</span>
              <span className="w-12 h-[1px] bg-[#E8C8B8]" />
            </div>

            <h2 className="font-editorial-serif text-5xl sm:text-6xl font-normal text-[#F4E2D8] leading-[1.05] tracking-tight uppercase mb-6">
              Let's build something <br />
              <span className="italic font-light text-[#E8C8B8]">extraordinary.</span>
            </h2>

            <p className="font-sans text-sm text-[#C4A89C] leading-relaxed mb-8">
              Have a project in mind, a collaboration, or just want to say hi? I'd love to hear from you.
            </p>

            <div className="space-y-4 font-mono-tech text-xs text-[#F4E2D8] mb-8">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1D0509] border border-[#F4E2D8]/15 hover:border-[#F4E2D8]/40 transition-all text-[#E8C8B8]"
              >
                <Mail size={16} />
                <span>{PERSONAL_INFO.email}</span>
              </a>

              <a
                href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1D0509] border border-[#F4E2D8]/15 hover:border-[#F4E2D8]/40 transition-all text-[#E8C8B8]"
              >
                <Phone size={16} />
                <span>{PERSONAL_INFO.phone}</span>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1D0509] border border-[#F4E2D8]/15 hover:border-[#F4E2D8]/40 transition-all text-[#F4E2D8]"
              >
                <Code2 size={16} />
                <span>github.com/justus-robin</span>
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1D0509] border border-[#F4E2D8]/15 hover:border-[#F4E2D8]/40 transition-all text-[#F4E2D8]"
              >
                <Globe size={16} />
                <span>linkedin.com/in/justus-robin</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form & Resume Box Below standard container */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="card-wine-editorial p-8 sm:p-10 rounded-3xl">
              {sent ? (
                <div className="text-center py-12">
                  <Check size={32} className="text-[#E8C8B8] mx-auto mb-3" />
                  <h3 className="font-editorial-serif text-3xl font-bold text-[#F4E2D8] uppercase">
                    MESSAGE TRANSMITTED
                  </h3>
                  <p className="font-sans text-xs text-[#C4A89C] mt-2">
                    Thank you for reaching out. I'll get back to you shortly!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-sans text-xs font-bold text-[#F4E2D8] mb-2 uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-[#1D0509] border border-[#F4E2D8]/20 rounded-xl px-4 py-3.5 font-sans text-sm text-[#F4E2D8] placeholder-[#C4A89C]/40 focus:outline-none focus:border-[#E8C8B8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-[#F4E2D8] mb-2 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@domain.com"
                      className="w-full bg-[#1D0509] border border-[#F4E2D8]/20 rounded-xl px-4 py-3.5 font-sans text-sm text-[#F4E2D8] placeholder-[#C4A89C]/40 focus:outline-none focus:border-[#E8C8B8] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-[#F4E2D8] mb-2 uppercase tracking-wider">
                      Project / Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      className="w-full bg-[#1D0509] border border-[#F4E2D8]/20 rounded-xl px-4 py-3.5 font-sans text-sm text-[#F4E2D8] placeholder-[#C4A89C]/40 focus:outline-none focus:border-[#E8C8B8] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 rounded-full bg-[#F4E2D8] text-[#140306] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E8C8B8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>SEND MESSAGE</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>

            {/* Minimal Resume Bar directly below the huge box */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1D0509]/80 border border-[#F4E2D8]/15 hover:border-[#E8C8B8]/35 transition-all text-[#F4E2D8]">
              <div className="flex items-center gap-2.5 font-mono-tech text-xs text-[#E8C8B8]">
                <FileText size={14} className="opacity-80" />
                <span className="tracking-wider uppercase text-[11px] font-medium text-[#F4E2D8]">
                  Resume (PDF)
                </span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <a
                  href="/Justus_Robin_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-[#2B0A11] border border-[#F4E2D8]/20 text-[#F4E2D8] hover:bg-[#F4E2D8] hover:text-[#140306] transition-all flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
                  title="View Resume in Browser"
                >
                  <ExternalLink size={12} />
                  <span>View</span>
                </a>
                <a
                  href="/Justus_Robin_Resume.pdf"
                  download="Justus_Robin_Resume.pdf"
                  className="px-3.5 py-1 rounded-lg bg-[#F4E2D8] text-[#140306] hover:bg-[#E8C8B8] transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer shadow-sm"
                  title="Download Resume PDF"
                >
                  <Download size={12} />
                  <span>Download</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};



