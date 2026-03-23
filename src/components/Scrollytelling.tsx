import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../responsive.css';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 192;

// ─── Frame image loader hook ─────────────────────────────────────────────────
function useFrameLoader() {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const images = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let completed = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${i.toString().padStart(4, '0')}.webp`;
      img.onload = img.onerror = () => {
        completed++;
        setLoaded(completed);
        if (completed === FRAME_COUNT) setReady(true);
      };
      imgs.push(img);
    }
    images.current = imgs;
  }, []);

  return { loaded, ready, images };
}

// ─── Canvas renderer ─────────────────────────────────────────────────────────
function renderFrame(canvas: HTMLCanvasElement | null, images: HTMLImageElement[], index: number) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const safeIdx = Math.min(Math.max(Math.round(index), 0), FRAME_COUNT - 1);
  const img = images[safeIdx];
  if (!img || !img.complete || img.naturalHeight === 0) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const Scrollytelling: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { loaded, ready, images } = useFrameLoader();

  // Refs for scroll-triggered reveals
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const addReveal = (i: number) => (el: HTMLElement | null) => { revealRefs.current[i] = el; };

  // Canvas scrub on scroll
  useEffect(() => {
    if (!ready) return;
    renderFrame(canvasRef.current, images.current, 0);

    const playhead = { frame: 0 };
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      animation: gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: 'none',
        onUpdate: () => renderFrame(canvasRef.current, images.current, playhead.frame),
      }),
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => { st.kill(); window.removeEventListener('resize', onResize); };
  }, [ready]);

  // Section reveal animations
  useEffect(() => {
    if (!ready) return;
    revealRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 60, autoAlpha: 0, filter: 'blur(12px)' },
        {
          y: 0, autoAlpha: 1, filter: 'blur(0px)',
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, [ready]);

  // ── Loader ──────────────────────────────────────────────────────────────────
  if (!ready) {
    const pct = Math.min((loaded / FRAME_COUNT) * 100, 100);
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 9999 }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Defying Gravity
        </p>
        <div style={{ width: 280, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#D89F9C', borderRadius: 4, boxShadow: '0 0 12px #D89F9C', transition: 'width 0.1s linear' }} />
        </div>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: '1rem' }}>
          {Math.floor(pct)}%
        </p>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width: '100%', background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* Fixed Canvas Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        {/* Subtle dark vignette so text is always readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Fixed Nav */}
      <nav className="main-nav" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 2.5rem',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>
          Zenith
        </button>
        {/* nav-links class hides these on mobile via responsive.css */}
        <div className="nav-links">
          {['philosophy', 'immerse', 'connect'].map(id => (
            <button key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {id}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Scroll Content ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* 1. Embrace Stillness */}
        <section className="hero-section" style={{ minHeight: '110vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 2rem 4rem' }}>
          <div ref={addReveal(0)} style={{ textAlign: 'center', maxWidth: 700, width: '100%' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 800, lineHeight: 0.95, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Embrace<br /><span style={{ color: '#D89F9C' }}>Stillness</span>
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', opacity: 0.75, lineHeight: 1.7, fontWeight: 300, maxWidth: 480, margin: '0 auto' }}>
              In a world of constant motion, true luxury is found in moments of pause. Discover entirely new states of tranquility.
            </p>
          </div>
        </section>

        {/* 2. Elevate Your Perspective */}
        {/* elevate-section class: row on desktop, column on mobile */}
        <section className="elevate-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '4rem 8vw', gap: '4rem' }}>
          {/* Left text — elevate-text class resets maxWidth on mobile */}
          <div ref={addReveal(1)} className="elevate-text" style={{ flex: 1, maxWidth: 480 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Elevate Your<br /><span style={{ color: '#D89F9C' }}>Perspective</span>
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', opacity: 0.7, lineHeight: 1.8, fontWeight: 300 }}>
              Like a pagoda suspended among the clouds, lift yourself above the noise. Our aesthetic merges ancient architectural wonder with absolute cosmic minimalism.
            </p>
          </div>
          {/* Right glass card — elevate-card class resets sizing on mobile */}
          <div className="elevate-card" style={{ flex: 1, maxWidth: 440, minHeight: 260, borderRadius: '2rem', background: 'rgba(255,255,255,0.04) url(/contemplation.svg) center/cover no-repeat', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', opacity: 0.8, fontFamily: 'Outfit, sans-serif', background: 'rgba(27,35,53,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', backdropFilter: 'blur(10px)' }}>
              Contemplation
            </p>
          </div>
        </section>

        {/* 3. The Zen Philosophy */}
        {/* philosophy-section class adjusts padding; philosophy-grid class collapses to 1 col */}
        <section id="philosophy" className="philosophy-section" style={{ minHeight: '120vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 8vw' }}>
          <div ref={addReveal(2)} className="philosophy-panel" style={{
            width: '100%', maxWidth: 860, textAlign: 'center',
            borderRadius: '2.5rem', padding: 'clamp(2rem, 5vw, 4rem)',
            background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              The Zen <span style={{ color: '#D89F9C' }}>Philosophy</span>
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)', opacity: 0.8, lineHeight: 1.8, fontWeight: 300, maxWidth: 640, margin: '0 auto 2.5rem' }}>
              We believe in the power of the void. Not as an absence, but as a space for potential. Our design language is rooted in the "Ma" concept—the space between things that gives them meaning.
            </p>
            {/* philosophy-grid class: 2-col desktop → 1-col mobile */}
            <div className="philosophy-grid" style={{ display: 'grid', gap: '2rem', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D89F9C', marginBottom: '0.75rem' }}>Weightlessness</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.65, lineHeight: 1.7, fontWeight: 300 }}>Letting go of digital clutter to find clarity in simplicity and motion.</p>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D89F9C', marginBottom: '0.75rem' }}>Presence</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.65, lineHeight: 1.7, fontWeight: 300 }}>Designing experiences that anchor the user in the present moment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Begin Your Ascent */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <div ref={addReveal(3)} style={{ maxWidth: 700, width: '100%' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 800, lineHeight: 0.95, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Begin Your<br /><span style={{ color: '#D89F9C' }}>Ascent</span>
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', opacity: 0.7, lineHeight: 1.8, fontWeight: 300, maxWidth: 420, margin: '0 auto' }}>
              The journey upwards requires leaving the heaviness behind. Drop your anchors and float into serenity.
            </p>
          </div>
        </section>

        {/* 5. Depth of Immersion */}
        {/* immerse-section class adjusts padding; immerse-grid class collapses columns */}
        <section id="immerse" className="immerse-section" style={{ minHeight: '110vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 8vw' }}>
          <div ref={addReveal(4)} style={{ width: '100%', maxWidth: 1100, textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
              Depth of <span style={{ color: '#D89F9C' }}>Immersion</span>
            </h2>
            {/* immerse-grid class: 3-col → 2-col → 1-col */}
            <div className="immerse-grid" style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                { title: 'Visual Flow', desc: 'Experience the seamless transitions between states of being.' },
                { title: 'Sonic Bloom', desc: 'Aural landscapes that respond to your movement through space.' },
                { title: 'Tactile Scroll', desc: 'Feedback that feels weighted, intentional, and deliberate.' },
              ].map((item, i) => (
                <div key={i} style={{
                  borderRadius: '1.5rem', padding: '2rem',
                  background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', cursor: 'pointer',
                  transition: 'border-color 0.4s, transform 0.4s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(216,159,156,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.6, lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Join the Collective */}
        {/* connect-section class: row on desktop, column on mobile */}
        <section id="connect" className="connect-section" style={{ minHeight: '120vh', display: 'flex', alignItems: 'center', padding: '4rem 8vw', gap: '4rem' }}>
          {/* Left accent card — connect-artwork class goes full-width on mobile */}
          <div className="connect-artwork" style={{
            flex: 1, maxWidth: 360, minHeight: 480, borderRadius: '2rem',
            background: 'rgba(255,255,255,0.04) url(/zenith-collective.svg) center/cover no-repeat', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            padding: '2rem', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            {/* Decorative coral glow */}
            <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 240, height: 240, borderRadius: '50%', background: 'rgba(216,159,156,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', opacity: 0.8, fontFamily: 'Outfit, sans-serif', background: 'rgba(27,35,53,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', backdropFilter: 'blur(10px)', zIndex: 1 }}>Zenith Collective</span>
          </div>

          {/* Right form — connect-form class goes full-width on mobile */}
          <div ref={addReveal(5)} className="connect-form" style={{ flex: 1, maxWidth: 520 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>
              Join the <span style={{ color: '#D89F9C' }}>Collective</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[['Identifier', 'text', 'Your Name'], ['Frequency', 'email', 'Email Address']].map(([label, type, placeholder]) => (
                <div key={label}>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>{label}</p>
                  <input type={type} placeholder={placeholder}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.9rem 1.25rem', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s', fontFamily: 'Inter, sans-serif' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(216,159,156,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
              ))}
              <div>
                <p style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Transmission</p>
                <textarea rows={4} placeholder="Your Message..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.9rem 1.25rem', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.3s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(216,159,156,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <button
                style={{ width: '100%', padding: '1.1rem', background: '#fff', color: '#1B2335', border: 'none', borderRadius: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.4s, color 0.4s, box-shadow 0.4s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#D89F9C'; el.style.color = '#fff'; el.style.boxShadow = '0 0 30px rgba(216,159,156,0.5)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#fff'; el.style.color = '#1B2335'; el.style.boxShadow = 'none'; }}>
                Transmit
              </button>
            </div>
          </div>
        </section>

        {/* Footer — page-footer class stacks on mobile */}
        <footer className="page-footer" style={{
          width: '100%', padding: '2rem 8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.6rem',
          letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.4, fontFamily: 'Outfit, sans-serif', fontWeight: 700,
        }}>
          <span>© 2026 Zenith Collection</span>
          <span style={{ color: '#D89F9C' }}>V.2.0-FINAL</span>
        </footer>

      </div>
    </div>
  );
};







