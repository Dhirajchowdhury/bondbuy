import React, { useState } from 'react';
import { Bond } from '../App';

interface MarketplaceProps {
  bonds: Bond[];
  balance: number;
  solBalance: number;
  onBuy: (id: string, amount: number) => void;
  isMinting: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ bonds, balance, solBalance, onBuy, isMinting }) => {
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [buyAmountInr, setBuyAmountInr] = useState('');
  const SOL_TO_INR_RATE = 12500;

  const handleConfirm = () => {
    if (selectedBond && Number(buyAmountInr) > 0) {
      onBuy(selectedBond.id, Number(buyAmountInr));
      setSelectedBond(null);
      setBuyAmountInr('');
    }
  };

  const solRequired = Number(buyAmountInr) / SOL_TO_INR_RATE;
  const insufficientFunds = solRequired > solBalance;

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase mb-3 tracking-tighter">
              Primary <span className="text-orange-500 italic">Mint</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-white">Devnet Live</span>
              </span>
              <span className="text-zinc-700">•</span>
              <span>1 SOL ≈ ₹12,500</span>
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Your Balance</p>
            <p className="text-2xl font-black text-white">{solBalance.toFixed(4)} <span className="text-orange-500">SOL</span></p>
          </div>
        </div>
      </header>

      {/* Bond Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bonds.map((bond) => (
          <div 
            key={bond.id} 
            className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{bond.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">{bond.duration}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">{bond.risk}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-orange-500">{bond.apy}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fixed APY</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Maturity</p>
                <p className="text-sm font-bold text-white">{new Date(bond.maturityDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Min. Investment</p>
                <p className="text-sm font-bold text-white">₹{bond.pricePerUnit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Available</p>
                <p className="text-sm font-bold text-green-500">{((bond.remainingSupply / bond.totalSupply) * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Supply Bar */}
            <div className="mb-6">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                  style={{ width: `${((bond.totalSupply - bond.remainingSupply) / bond.totalSupply) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-2">
                {((bond.totalSupply - bond.remainingSupply) / 1000000).toFixed(1)}M / {(bond.totalSupply / 1000000).toFixed(0)}M Minted
              </p>
            </div>

            <button 
              onClick={() => setSelectedBond(bond)}
              className="w-full bg-orange-500 text-black py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-400 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
            >
              Mint Bond NFT
            </button>
          </div>
        ))}
      </div>

      {/* Minting Overlay */}
      {isMinting && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mt-8 mb-2">Minting Your Bond...</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Confirm transaction in Phantom</p>
          <div className="flex items-center gap-2 mt-6 text-zinc-600">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Awaiting signature</span>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {selectedBond && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-lg w-full relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5">
              <button 
                onClick={() => setSelectedBond(null)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mint Bond NFT</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight pr-12">{selectedBond.name}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* APY Highlight */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Fixed APY</span>
                <span className="text-3xl font-black text-orange-500">{selectedBond.apy}%</span>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Investment Amount (₹)</label>
                  <span className="text-[10px] font-black uppercase text-zinc-600">Min: ₹100</span>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-600">₹</span>
                  <input 
                    type="number" 
                    value={buyAmountInr}
                    onChange={(e) => setBuyAmountInr(e.target.value)}
                    placeholder="100"
                    className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-3xl font-black focus:outline-none focus:border-orange-500 text-white placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBuyAmountInr(String(amt))}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-bold text-white transition-all"
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-black/50 rounded-2xl p-5 space-y-4 border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">You Pay</span>
                  <span className={`text-xl font-black ${insufficientFunds ? 'text-red-500' : 'text-white'}`}>
                    {solRequired.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">You Receive</span>
                  <span className="text-xl font-black text-orange-500">
                    {(Number(buyAmountInr) / selectedBond.pricePerUnit).toFixed(2)} Units
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Wallet Balance</span>
                  <span className="text-sm font-bold text-zinc-400">{solBalance.toFixed(4)} SOL</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button 
                onClick={handleConfirm}
                disabled={!buyAmountInr || insufficientFunds || Number(buyAmountInr) < 100}
                className="w-full bg-orange-500 text-black py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-orange-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] shadow-xl shadow-orange-500/20"
              >
                {insufficientFunds ? 'Insufficient SOL Balance' : 'Confirm & Mint'}
              </button>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Transaction will be processed on Solana Devnet
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
