import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const OverlayUI: React.FC = () => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;

    sectionsRef.current.forEach((section) => {
      if (!section) return;
      
      gsap.fromTo(section, 
        { 
          y: 50, 
          opacity: 0,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isHome]);

  return (
    <>
      <div className="lighting-overlay pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-[100] glass-nav flex justify-between items-center px-8 py-5">
        <Link to="/" className="brand text-xl font-bold tracking-widest uppercase">Zenith</Link>
        <div className="hidden md:flex gap-8 text-sm font-medium opacity-80 uppercase tracking-widest">
          <Link to="/philosophy" className="hover:text-[var(--coral-pink)] transition-colors">Philosophy</Link>
          <Link to="/immerse" className="hover:text-[var(--coral-pink)] transition-colors">Immerse</Link>
          <Link to="/connect" className="hover:text-[var(--coral-pink)] transition-colors">Connect</Link>
        </div>
      </nav>

      {/* Content Layers overlaying the scrolly section - Only on Home */}
      {isHome && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-y-auto" style={{ height: '600vh' }}>
        <div className="absolute top-[50vh] left-[10vw] max-w-lg pointer-events-auto filter drop-shadow-2xl"
             ref={el => { sectionsRef.current[0] = el; }}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Embrace the <br/> <span className="text-[var(--coral-pink)]">Stillness</span>
          </h1>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            In a world of constant motion, true luxury is found in moments of pause. 
            Discover entirely new states of tranquility that guide you towards true inner peace.
          </p>
        </div>

        <div className="absolute top-[250vh] right-[10vw] max-w-lg pointer-events-auto filter drop-shadow-2xl text-right"
             ref={el => { sectionsRef.current[1] = el; }}>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Elevate Your <br/> <span className="text-[var(--coral-pink)]">Perspective</span>
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            Like a pagoda suspended among the clouds, lift yourself above the noise.
            Our aesthetic merges ancient architectural wonder with absolute cosmic minimalism.
          </p>
        </div>

        <div className="absolute top-[450vh] left-[50vw] -translate-x-1/2 max-w-xl text-center pointer-events-auto filter drop-shadow-2xl"
             ref={el => { sectionsRef.current[2] = el; }}>
          <div className="glass-panel p-10 md:p-16 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Begin Your <br/> <span className="text-[var(--coral-pink)]">Ascent</span>
            </h2>
            <p className="text-lg opacity-80 leading-relaxed font-light mb-10">
              The journey upwards requires leaving the heaviness behind. Drop your anchors and float into serenity.
            </p>
            <button className="px-10 py-4 bg-white text-black font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-300">
              Enter The Void
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 glass-nav px-8 py-4 flex justify-between items-center text-xs opacity-60 uppercase tracking-widest">
        <span>© 2026 ZENITH</span>
        <span>Aesthetic Scrollytelling Architecture</span>
      </footer>
    </>
  );
};
