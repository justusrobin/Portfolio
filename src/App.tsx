import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursor } from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);
(window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { IntroSection } from './components/intro/IntroSection';
import { TechEcosystem } from './components/technology/TechEcosystem';
import { ProjectExhibition } from './components/projects/ProjectExhibition';
import { JourneyTimeline } from './components/journey/JourneyTimeline';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/footer/Footer';
import { ScrollableFlowers } from './components/common/ScrollableFlowers';
import { FallingPetals } from './components/common/FallingPetals';
import { LoadingScreen } from './components/common/LoadingScreen';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [loadingProgress, setLoadingProgress] = useState(() =>
    typeof window !== 'undefined' && window.location.search.includes('debug=loading') ? 0.5 : 0
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Cinematic Loading & Petal-to-Flower Transition Timeline
  useEffect(() => {
    const isDebugLoading = window.location.search.includes('debug=loading');
    if (isDebugLoading) {
      return;
    }

    let animId: number;
    const duration = 3200; // Target total cinematic sequence duration: ~3.2s
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(1.0, elapsed / duration);

      setLoadingProgress(rawProgress);

      // Trigger hero content reveal at 0.80 (~2.56s), AFTER loading wordmark exit finishes
      if (rawProgress >= 0.80 && !isLoaded) {
        setIsLoaded(true);
      }

      if (rawProgress < 1.0) {
        animId = requestAnimationFrame(step);
      } else {
        setIsLoaded(true);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Initialize Lenis smooth inertial scroll synchronized with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);

  // Section navigation helper
  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -70 });
      } else {
        const yOffset = -70;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'work', 'journey', 'contact'];
      const scrollPos = window.scrollY + 220;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-[#F4E2D8] bg-[#140306] overflow-x-hidden selection:bg-[#6B1A24] selection:text-[#F4E2D8]">
      {/* Loading Overlay Title Sequence */}
      <LoadingScreen
        loadingProgress={loadingProgress}
        isLoaded={isLoaded}
        onAnimationComplete={() => setIsLoaded(true)}
      />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Atmospheric Background Falling Petals Layer */}
      <FallingPetals />

      {/* Single Persistent Floral Parallax Container (Handles Petal -> Flower -> Scroll Journey) */}
      <ScrollableFlowers
        loadingProgress={loadingProgress}
        isLoaded={isLoaded}
      />

      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isLoaded={isLoaded}
      />

      {/* Main Content Flow */}
      <main className="relative z-10 w-full">
        {/* HERO SECTION */}
        <HeroSection
          onNavigate={handleNavigate}
          isLoaded={isLoaded}
        />

        {/* ABOUT SECTION */}
        <IntroSection />

        {/* SKILLS SECTION */}
        <TechEcosystem />

        {/* WORK / PROJECTS SECTION */}
        <ProjectExhibition />

        {/* JOURNEY SECTION */}
        <JourneyTimeline />

        {/* CONTACT SECTION */}
        <ContactSection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
