import React from 'react';

const Connect: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 px-8 md:px-20 pb-20 relative z-10 flex flex-col items-center justify-center">
      <div className="glass-panel p-10 md:p-16 rounded-[3rem] w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">Join the <span className="text-[var(--coral-pink)]">Collective</span></h1>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] opacity-50 ml-2 font-bold">Identifier</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--coral-pink)] transition-colors placeholder:opacity-30" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] opacity-50 ml-2 font-bold">Frequency</label>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--coral-pink)] transition-colors placeholder:opacity-30" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] opacity-50 ml-2 font-bold">Transmission</label>
            <textarea 
              rows={4} 
              placeholder="Your Message..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--coral-pink)] transition-colors placeholder:opacity-30" 
            />
          </div>
          
          <button className="w-full py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-[0.4em] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,127,80,0)] hover:shadow-[0_0_30px_rgba(255,127,80,0.5)]">
            Transmit
          </button>
        </form>

        <div className="mt-12 flex justify-center gap-8 text-xs font-bold uppercase tracking-widest opacity-40">
          <a href="#" className="hover:opacity-100 transition-opacity underline-offset-4 hover:underline">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity underline-offset-4 hover:underline">Twitter</a>
          <a href="#" className="hover:opacity-100 transition-opacity underline-offset-4 hover:underline">Are.na</a>
        </div>
      </div>
    </div>
  );
};

export default Connect;
