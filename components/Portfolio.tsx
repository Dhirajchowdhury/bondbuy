
import React from 'react';
import { Holding } from '../App';

interface PortfolioProps {
  portfolio: Holding[];
  tick: number;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, tick }) => {
  const calculateLiveYield = (holding: Holding) => {
    const start = new Date(holding.purchaseDate).getTime();
    const now = Date.now();
    const yearsElapsed = (now - start) / (1000 * 60 * 60 * 24 * 365);
    return holding.investedAmount * (holding.apy / 100) * yearsElapsed;
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in slide-in-from-bottom duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter">
          RWA <span className="text-orange-500 italic">VAULT.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Verified fractional bond ownership via <span className="text-white">Solana NFTs</span>.
        </p>
      </header>

      {portfolio.length === 0 ? (
        <div className="py-40 border border-dashed border-white/10 rounded-[4rem] text-center bg-zinc-900/10">
           <p className="text-zinc-600 font-black uppercase tracking-[0.5em] mb-6 italic">No Bond NFTs Found in Wallet</p>
           <button className="text-orange-500 font-black uppercase tracking-widest border-b border-orange-500 pb-1">Primary Market Mint</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((h) => (
            <div key={h.id} className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-orange-500/30 transition-all">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <span className="bg-orange-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">NFT VALID</span>
                  <a 
                    href={`https://explorer.solana.com/tx/${h.txHash}?cluster=devnet`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                <h3 className="text-3xl font-black uppercase leading-none mb-2 tracking-tighter">{h.bondName}</h3>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">Mint ID: {h.id}</div>
                
                <div className="space-y-4 border-t border-white/5 pt-8">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase text-zinc-500">Invested</span>
                    <span className="text-xl font-black">₹{h.investedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase text-orange-500">Live Return</span>
                    <span className="text-xl font-black text-orange-500">₹{calculateLiveYield(h).toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                 <div className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Maturity: {new Date(h.maturityDate).toLocaleDateString()}</div>
                 <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-1/4 animate-pulse"></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
