import React from 'react';

const Immerse: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 px-8 md:px-20 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-16 text-center">Depth of <span className="text-[var(--coral-pink)]">Immersion</span></h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Visual Flow", desc: "Experience the seamless transitions between states.", color: "rgba(255, 127, 80, 0.2)" },
            { title: "Sonic Bloom", desc: "Aural landscapes that respond to your movement.", color: "rgba(43, 0, 72, 0.4)" },
            { title: "Tactile Scroll", desc: "Feedback that feels weighted and intentional.", color: "rgba(255, 255, 255, 0.1)" }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-3xl group hover:border-[var(--coral-pink)] transition-all duration-500 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: item.color }} />
              <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
              <p className="opacity-70 leading-relaxed relative z-10">{item.desc}</p>
              <div className="mt-8 text-[var(--coral-pink)] flex items-center gap-2 group-hover:translate-x-2 transition-transform relative z-10">
                <span>Explore</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-panel p-12 rounded-[3rem] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Interactive Sensory Hub</h2>
            <p className="opacity-70 leading-relaxed mb-8">
              Dive deeper into our experimental laboratories where we push the boundaries of web graphics and user psychology.
            </p>
            <button className="px-8 py-3 bg-[var(--coral-pink)] rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform">
              Launch Alpha Test
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-[var(--coral-pink)] to-[#2b0048] rounded-2xl opacity-40 blur-sm" />
        </div>
      </div>
    </div>
  );
};

export default Immerse;
