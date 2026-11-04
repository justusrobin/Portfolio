import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { PERSONAL_INFO } from '../../data/portfolioData';
import {
  Mail,
  Code2,
  Globe,
  Send,
  Check,
  Phone,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

const WHATSAPP_NUMBER = '919486633017';
const OWNER_EMAIL = 'justusrobin2007@gmail.com';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // Validate form fields
  const isValid =
    formData.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.message.trim().length > 0;

  const buildWhatsAppUrl = (name: string, email: string, message: string) => {
    const text = `Hello Justus,\n\n*New Portfolio Enquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Project / Message:*\n${message}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || status === 'submitting') {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    // 1. Generate & open WhatsApp click-to-chat synchronously within user gesture
    const waUrl = buildWhatsAppUrl(trimmedName, trimmedEmail, trimmedMessage);
    setLastWhatsAppUrl(waUrl);

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (popupErr) {
      console.warn('Could not open WhatsApp window automatically:', popupErr);
    }

    // 2. Dispatch EmailJS submission
    setStatus('submitting');
    setErrorMessage('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn(
        'EmailJS environment variables (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) are missing.'
      );
      setStatus('error');
      setErrorMessage(
        'Email delivery configuration is pending setup in .env, but your message has been prepared and opened in WhatsApp! You can send it directly there.'
      );
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: trimmedName,
          from_email: trimmedEmail,
          message: trimmedMessage,
          to_email: OWNER_EMAIL,
          reply_to: trimmedEmail,
          subject: `New Portfolio Enquiry — ${trimmedName}`,
        },
        publicKey
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      console.error('EmailJS send error:', err);
      setStatus('error');
      const errDetail =
        err && typeof err === 'object' && 'text' in err ? String(err.text) : 'Email transmission failed.';
      setErrorMessage(
        `Email transmission encountered an issue (${errDetail}), but WhatsApp was opened so you can send your enquiry directly there!`
      );
    }
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
              {status === 'success' ? (
                <div className="text-center py-10 px-4">
                  <div className="w-14 h-14 rounded-full bg-[#E8C8B8]/10 border border-[#E8C8B8]/40 flex items-center justify-center mx-auto mb-4 text-[#E8C8B8] shadow-[0_0_20px_rgba(232,200,184,0.2)]">
                    <Check size={26} />
                  </div>
                  <h3 className="font-editorial-serif text-3xl font-bold text-[#F4E2D8] uppercase tracking-wide">
                    MESSAGE TRANSMITTED
                  </h3>
                  <p className="font-sans text-xs text-[#C4A89C] mt-3 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out! Your enquiry has been delivered to{' '}
                    <span className="text-[#E8C8B8] font-medium">{OWNER_EMAIL}</span> and WhatsApp has been opened for direct confirmation. I'll get back to you shortly!
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2.5 rounded-full border border-[#F4E2D8]/20 bg-[#1D0509] hover:bg-[#F4E2D8] hover:text-[#140306] text-[#F4E2D8] font-sans text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && errorMessage && (
                    <div className="p-4 rounded-xl bg-[#2B0A11] border border-[#C22D43]/60 text-xs text-[#F4E2D8] flex items-start gap-3">
                      <AlertCircle size={18} className="text-[#E03E57] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="leading-relaxed">{errorMessage}</p>
                        {lastWhatsAppUrl && (
                          <a
                            href={lastWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2.5 text-[#E8C8B8] hover:text-white font-mono-tech text-[11px] underline underline-offset-4"
                          >
                            <MessageSquare size={13} />
                            <span>Open WhatsApp Chat</span>
                            <ArrowRight size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

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
                    disabled={status === 'submitting'}
                    className="px-8 py-4 rounded-full bg-[#F4E2D8] text-[#140306] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E8C8B8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>SEND MESSAGE</span>
                    {status === 'submitting' ? (
                      <Loader2 size={14} className="animate-spin text-[#140306]" />
                    ) : (
                      <Send size={14} />
                    )}
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




