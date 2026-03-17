import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 px-8 md:px-20 pb-20 relative z-10 flex flex-col items-center justify-center text-center">
      <div className="glass-panel p-12 md:p-24 rounded-[4rem] max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-white">The Zen <span className="text-[var(--coral-pink)]">Philosophy</span></h1>
        <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light mb-8">
          We believe in the power of the void. Not as an absence, but as a space for potential. 
          Our design language is rooted in the "Ma" concept—the space between things that gives them meaning.
        </p>
        <div className="grid md:grid-cols-2 gap-12 mt-16 text-left">
          <div>
            <h3 className="text-[var(--coral-pink)] text-xl font-bold mb-4 uppercase tracking-widest">Weightlessness</h3>
            <p className="opacity-70 leading-relaxed">Letting go of digital clutter to find clarity in simplicity and motion.</p>
          </div>
          <div>
            <h3 className="text-[var(--coral-pink)] text-xl font-bold mb-4 uppercase tracking-widest">Presence</h3>
            <p className="opacity-70 leading-relaxed">Designing experiences that anchor the user in the present moment through deliberate interaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Philosophy;
