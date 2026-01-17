
import React, { useMemo } from 'react';
import { Holding } from '../App';

interface DashboardProps {
  address: string;
  portfolio: Holding[];
  solBalance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ address, portfolio, solBalance }) => {
  const SOL_TO_INR = 12500;
  
  const stats = useMemo(() => {
    const totalInvested = portfolio.reduce((sum, h) => sum + h.investedAmount, 0);
    const avgApy = portfolio.length > 0 ? portfolio.reduce((sum, h) => sum + h.apy, 0) / portfolio.length : 0;
    return { totalInvested, avgApy };
  }, [portfolio]);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter">
          COLLECTIVE <span className="text-orange-500 italic">YIELD.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          SOLANA DEVNET: <span className="text-white truncate max-w-[200px]">{address}</span>
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-y border-white/10 mb-20 py-12">
        <div className="flex flex-col gap-2 border-r border-white/5 pr-8">
          <span className="text-orange-500 font-black uppercase tracking-widest text-[10px]">Total Invested</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter">₹{stats.totalInvested.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex flex-col gap-2 border-r border-white/5 px-8">
          <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">SOL Balance</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter">{solBalance.toFixed(3)}</span>
        </div>
        <div className="flex flex-col gap-2 border-r border-white/5 px-8">
          <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Avg APY</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter">{stats.avgApy.toFixed(2)}%</span>
        </div>
        <div className="flex flex-col gap-2 pl-8">
          <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Bond NFTs</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter">{portfolio.length}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-zinc-900/20 p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Asset Liquidity</h2>
            <div className="flex items-end gap-1 h-40">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex-1 bg-zinc-800 hover:bg-orange-500 transition-all duration-300" style={{ height: `${20 + Math.random() * 80}%` }}></div>
              ))}
            </div>
            <div className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Real-time Devnet Pressure</div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-white text-black p-10 rounded-[2.5rem] flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Wallet Liquidity (INR)</h3>
              <div className="text-5xl font-black tracking-tighter">₹{(solBalance * SOL_TO_INR).toLocaleString('en-IN')}</div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-4">
              Funds reside in your Phantom wallet. Every purchase mints a tradeable RWA NFT.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
