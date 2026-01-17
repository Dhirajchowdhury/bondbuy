
import React, { useMemo, useState, useEffect } from 'react';
import { Holding } from '../App';

interface YieldProps {
  portfolio: Holding[];
  balance: number;
  tick: number;
}

const YieldPage: React.FC<YieldProps> = ({ portfolio, balance, tick }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [selectedApy, setSelectedApy] = useState<number>(7.18);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Calculate stats from actual portfolio
  const stats = useMemo(() => {
    const totalYield = portfolio.reduce((sum, h) => {
      const start = new Date(h.purchaseDate).getTime();
      const now = Date.now();
      const yearsElapsed = (now - start) / (1000 * 60 * 60 * 24 * 365);
      return sum + (h.investedAmount * (h.apy / 100) * yearsElapsed);
    }, 0);

    const projectedAnnual = portfolio.reduce((sum, h) => sum + (h.investedAmount * (h.apy / 100)), 0);
    const totalInvested = portfolio.reduce((sum, h) => sum + h.investedAmount, 0);
    const avgApy = portfolio.length > 0 ? portfolio.reduce((sum, h) => sum + h.apy, 0) / portfolio.length : 7.18;

    return { totalYield, projectedAnnual, totalInvested, avgApy };
  }, [portfolio, tick]);

  // Calculate monthly projections for the graph
  const monthlyProjections = useMemo(() => {
    const monthlyRate = selectedApy / 100 / 12;
    const projections = [];
    
    for (let month = 1; month <= 12; month++) {
      // Compound interest formula: A = P(1 + r)^n - P
      const totalValue = investmentAmount * Math.pow(1 + monthlyRate, month);
      const yieldEarned = totalValue - investmentAmount;
      const cumulativeYield = yieldEarned;
      
      projections.push({
        month,
        principal: investmentAmount,
        yield: cumulativeYield,
        total: totalValue,
        monthlyYield: month === 1 ? yieldEarned : yieldEarned - (investmentAmount * Math.pow(1 + monthlyRate, month - 1) - investmentAmount)
      });
    }
    
    return projections;
  }, [investmentAmount, selectedApy]);

  // APY options based on available bonds
  const apyOptions = [
    { label: 'G-Sec 2030', apy: 7.18 },
    { label: 'Maharashtra SDL', apy: 7.45 },
    { label: 'NHAI Tax-Free', apy: 6.80 },
    { label: 'RBI Float', apy: 8.05 },
  ];

  // Quick investment amounts
  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter">
          ₹ YIELD <span className="text-orange-500 italic">REPORT.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Daily accrual metrics for your <span className="text-white">BondBuy ₹ Wallet</span>.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 mb-20">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 p-8 lg:p-12 rounded-[3.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 font-black text-8xl text-white/5 pointer-events-none italic uppercase">INR</div>
          
          {/* Chart Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Return Projection</h2>
            
            {/* APY Selector */}
            <div className="flex flex-wrap gap-2">
              {apyOptions.map((option) => (
                <button
                  key={option.apy}
                  onClick={() => setSelectedApy(option.apy)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedApy === option.apy
                      ? 'bg-orange-500 text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {option.apy}%
                </button>
              ))}
            </div>
          </div>

          {/* Investment Amount Input */}
          <div className="mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
              Simulation Amount (₹)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setInvestmentAmount(amount)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    investmentAmount === amount
                      ? 'bg-orange-500 text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  ₹{amount.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-zinc-600">₹</span>
              <input
                type="number"
                value={investmentAmount || ''}
                onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                onBlur={(e) => {
                  // Set minimum value on blur if empty or too low
                  if (!e.target.value || Number(e.target.value) < 100) {
                    setInvestmentAmount(100);
                  }
                }}
                placeholder="Enter amount"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-4 text-xl font-black focus:outline-none focus:border-orange-500 text-white placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Live Chart */}
          <div className="relative">
            {/* Calculate chart bounds - base starts at 95% of principal to show growth clearly */}
            {(() => {
              const baseValue = investmentAmount * 0.95; // Start Y-axis at 95% of principal
              const maxValue = monthlyProjections[11]?.total || investmentAmount;
              const range = maxValue - baseValue;
              const midValue = baseValue + range / 2;
              
              return (
                <>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-12 w-24 flex flex-col justify-between text-[10px] font-bold text-zinc-500 pr-3 text-right">
                    <span>₹{maxValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span>₹{midValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span>₹{baseValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="ml-24">
                    <div className="flex items-end gap-3 h-[280px] border-b border-l border-white/10 relative bg-black/20 rounded-lg p-4">
                      {/* Grid lines */}
                      <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="border-t border-dashed border-white/5 w-full" />
                        ))}
                      </div>
                      
                      {/* Base line indicator */}
                      <div className="absolute bottom-4 left-4 right-4 border-t-2 border-dashed border-zinc-700" />
                      
                      {/* Bars */}
                      {monthlyProjections.map((projection, i) => {
                        // Calculate bar height relative to the visible range (baseValue to maxValue)
                        const valueAboveBase = projection.total - baseValue;
                        const barHeight = Math.max(5, (valueAboveBase / range) * 100);
                        
                        return (
                          <div 
                            key={i} 
                            className="flex-1 flex flex-col justify-end group relative cursor-pointer h-full"
                            onMouseEnter={() => setHoveredMonth(i)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            {/* Tooltip */}
                            {hoveredMonth === i && (
                              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-white/10 rounded-xl p-4 z-20 min-w-[200px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-3">
                                  Month {projection.month}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between gap-4">
                                    <span className="text-zinc-500">Principal:</span>
                                    <span className="text-white font-bold">₹{projection.principal.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-zinc-500">Yield Earned:</span>
                                    <span className="text-green-500 font-bold">+₹{projection.yield.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 border-t border-white/10 pt-2 mt-2">
                                    <span className="text-zinc-500">Total Value:</span>
                                    <span className="text-orange-500 font-black">₹{projection.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                                {/* Tooltip arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800" />
                              </div>
                            )}
                            
                            {/* Bar Container */}
                            <div className="relative w-full h-full flex flex-col justify-end">
                              {/* Bar */}
                              <div 
                                className={`w-full transition-all duration-500 ease-out rounded-t-lg relative ${
                                  hoveredMonth === i 
                                    ? 'bg-orange-400 shadow-lg shadow-orange-500/50' 
                                    : 'bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400'
                                }`}
                                style={{ 
                                  height: `${barHeight}%`,
                                  minHeight: '24px'
                                }} 
                              >
                                {/* Value label on top of bar */}
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black whitespace-nowrap transition-opacity ${
                                  hoveredMonth === i ? 'opacity-100 text-orange-500' : 'opacity-0'
                                }`}>
                                  +₹{projection.yield.toFixed(0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="flex gap-3 mt-3 px-4">
                      {monthlyProjections.map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 text-center text-[10px] font-black uppercase transition-colors ${
                            hoveredMonth === i ? 'text-orange-500' : 'text-zinc-600'
                          }`}
                        >
                          M{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Chart Summary */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">6-Month Yield</div>
              <div className="text-xl font-black text-white">₹{monthlyProjections[5]?.yield.toFixed(2)}</div>
            </div>
            <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">12-Month Yield</div>
              <div className="text-xl font-black text-orange-500">₹{monthlyProjections[11]?.yield.toFixed(2)}</div>
            </div>
            <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Effective APY</div>
              <div className="text-xl font-black text-white">{selectedApy}%</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="bg-orange-500 p-12 rounded-[3rem] text-black shadow-2xl shadow-orange-500/20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-70">Est. Yearly Income</h3>
            <div className="text-5xl font-black tracking-tighter mb-2">
              ₹{(investmentAmount * selectedApy / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm font-bold opacity-70">
              on ₹{investmentAmount.toLocaleString('en-IN')} @ {selectedApy}%
            </div>
            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed mt-6 opacity-60">Derived from sovereign fixed-rate coupons</p>
          </div>
          
          <div className="bg-zinc-900/60 border border-white/10 p-10 rounded-[3rem]">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-500">Live Payout Pool</h3>
            <div className="flex justify-between items-center mb-8">
              <span className="text-4xl font-black italic tracking-tighter">₹{stats.totalYield.toFixed(4)}</span>
              <span className="text-[10px] font-bold uppercase bg-white/10 px-3 py-1 rounded-full text-white">ON-CHAIN</span>
            </div>
            <button className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-xl">Sweep to Wallet</button>
          </div>

          {/* Portfolio Stats */}
          {portfolio.length > 0 && (
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-zinc-500">Your Portfolio</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Total Invested</span>
                  <span className="text-white font-bold">₹{stats.totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Avg APY</span>
                  <span className="text-orange-500 font-bold">{stats.avgApy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-sm">Annual Yield</span>
                  <span className="text-white font-bold">₹{stats.projectedAnnual.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Section */}
      <section className="p-16 bg-zinc-900/40 rounded-[4rem] border border-white/5 mb-20">
        <h3 className="text-xl font-black uppercase mb-12 italic underline decoration-orange-500 underline-offset-8">Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <span className="text-orange-500 font-black text-xs uppercase tracking-widest mb-3 block">Daily Accrual</span>
            <div className="text-4xl font-black">₹{((investmentAmount * selectedApy / 100) / 365).toFixed(2)}</div>
            <div className="text-zinc-600 text-xs mt-2">per day</div>
          </div>
          <div>
            <span className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-3 block">Weekly Accrual</span>
            <div className="text-4xl font-black">₹{((investmentAmount * selectedApy / 100) / 52).toFixed(2)}</div>
            <div className="text-zinc-600 text-xs mt-2">per week</div>
          </div>
          <div>
            <span className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-3 block">Monthly Accrual</span>
            <div className="text-4xl font-black">₹{((investmentAmount * selectedApy / 100) / 12).toFixed(2)}</div>
            <div className="text-zinc-600 text-xs mt-2">per month</div>
          </div>
          <div>
            <span className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-3 block">Yearly Total</span>
            <div className="text-4xl font-black text-orange-500">₹{(investmentAmount * selectedApy / 100).toFixed(2)}</div>
            <div className="text-zinc-600 text-xs mt-2">per year</div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12">
        <h3 className="text-xl font-black uppercase mb-8">Compare Bond Returns</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Bond Type</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">APY</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Monthly</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">6 Months</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">1 Year</th>
              </tr>
            </thead>
            <tbody>
              {apyOptions.map((option, idx) => {
                const monthly = (investmentAmount * option.apy / 100) / 12;
                const sixMonth = monthly * 6;
                const yearly = investmentAmount * option.apy / 100;
                return (
                  <tr 
                    key={option.apy} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      selectedApy === option.apy ? 'bg-orange-500/10' : ''
                    }`}
                    onClick={() => setSelectedApy(option.apy)}
                  >
                    <td className="py-4 font-bold">{option.label}</td>
                    <td className={`py-4 text-right font-black ${selectedApy === option.apy ? 'text-orange-500' : ''}`}>
                      {option.apy}%
                    </td>
                    <td className="py-4 text-right text-zinc-400">₹{monthly.toFixed(2)}</td>
                    <td className="py-4 text-right text-zinc-400">₹{sixMonth.toFixed(2)}</td>
                    <td className={`py-4 text-right font-bold ${selectedApy === option.apy ? 'text-orange-500' : 'text-white'}`}>
                      ₹{yearly.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default YieldPage;
