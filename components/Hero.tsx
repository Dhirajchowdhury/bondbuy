
import React from 'react';
import BondCard from './BondCard';

interface HeroProps {
  onConnect: () => void;
  isConnected: boolean;
}

const Hero: React.FC<HeroProps> = ({ onConnect, isConnected }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Copy */}
        <div className="flex-1 text-left z-10 animate-slide-up">
          <h1 className="text-huge font-black uppercase mb-8">
            <span className="accent-glow text-orange-500">OWN INDIAN</span> <br />
            <span className="text-white italic">GOVT BONDS.</span> <br />
            <span className="text-green-500">START WITH </span> <span className="text-yellow-400" style={{ textShadow: '0 0 8px #ffd700, 0 0 16px #ffd700' }}>₹100</span> <span className="text-orange-500">.</span>
          </h1>
          
          <p className="max-w-xl text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed mb-10">
            Invest in fractional G-Secs and SDLs using Solana Devnet SOL. <br />
            Built for the <span className="text-white">next generation</span> of Indian retail investors.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onConnect();
              }}
              className="bg-orange-500 text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
            >
              {isConnected ? 'Market Ready' : 'Connect Extension'}
            </button>
            <button className="bg-transparent border-2 border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all active:scale-95">
              Browse G-Secs
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Card */}
        <div className="flex-1 flex items-center justify-center -mt-28 lg:-mt-32 ml-5">
          <BondCard enableTilt={true} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
