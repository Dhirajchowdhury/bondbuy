import React, { useState } from 'react';
import { weilWallet } from '../lib/weilWallet';

interface FaucetProps {
  onBalanceUpdate: (newBalance: number) => void;
  currentBalance: number;
}

const Faucet: React.FC<FaucetProps> = ({ onBalanceUpdate, currentBalance }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const requestTokens = async () => {
    setIsRequesting(true);
    setLastResult(null);

    try {
      const result = await weilWallet.requestFaucetTokens();
      
      if (result.success) {
        setLastResult({
          success: true,
          message: `Successfully received ${result.amount} WEIL tokens!`
        });
        
        // Update balance in parent component
        const wallet = weilWallet.getWallet();
        if (wallet) {
          onBalanceUpdate(wallet.balance);
        }
      } else {
        setLastResult({
          success: false,
          message: result.error || 'Failed to get tokens from faucet'
        });
      }
    } catch (error) {
      setLastResult({
        success: false,
        message: 'Error connecting to faucet'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 lg:px-12 py-8">
        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-4">
          WEIL Faucet
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Get test <span className="text-white">WEIL tokens</span> for bond investments.
          <br />
          <span className="text-orange-500 text-xs">Free testnet tokens • 10 WEIL per request • Once in a day</span>
        </p>
      </header>

      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Current Balance */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Current Balance</h2>
            <div className="text-6xl font-black mb-4">
              {currentBalance.toFixed(4)} <span className="text-orange-500">WEIL</span>
            </div>
            <div className="text-zinc-400">
              ≈ ₹{(currentBalance * 12500).toLocaleString('en-IN')} INR
            </div>
          </div>

          {/* Faucet Request */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 mb-8">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Request Test Tokens</h2>
            
            <div className="space-y-6">
              <div className="bg-black/30 rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold">Testnet Faucet</div>
                    <div className="text-sm text-zinc-400">Get 10 WEIL tokens for testing</div>
                  </div>
                  <div className="text-2xl font-black text-orange-500">10 WEIL</div>
                </div>
                
                <div className="text-xs text-zinc-500 space-y-1">
                  <div>• Free testnet tokens for development</div>
                  <div>• Rate limited: 1 request per 24 hours per address</div>
                  <div>• Tokens have no real value</div>
                </div>
              </div>

              <button
                onClick={requestTokens}
                disabled={isRequesting}
                className="w-full bg-orange-500 text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Requesting Tokens...
                  </div>
                ) : (
                  'Request 10 WEIL Tokens'
                )}
              </button>

              {/* Result Message */}
              {lastResult && (
                <div className={`p-4 rounded-xl border ${
                  lastResult.success 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  <div className="font-bold text-sm">
                    {lastResult.success ? '✅ Success!' : '❌ Error'}
                  </div>
                  <div className="text-xs mt-1">{lastResult.message}</div>
                </div>
              )}
            </div>
          </div>

          {/* How to Get More WEIL */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8">
            <h2 className="text-lg font-black uppercase tracking-tighter mb-6">How to Get WEIL Tokens</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xs flex-shrink-0">1</div>
                <div>
                  <div className="font-bold">Testnet Faucet (Current)</div>
                  <div className="text-zinc-400">Free tokens for testing and development</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">2</div>
                <div>
                  <div className="font-bold">Weil Chain Bridge (Coming Soon)</div>
                  <div className="text-zinc-400">Bridge tokens from other networks</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">3</div>
                <div>
                  <div className="font-bold">WEIL DEX (Coming Soon)</div>
                  <div className="text-zinc-400">Trade other cryptocurrencies for WEIL</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">4</div>
                <div>
                  <div className="font-bold">Staking Rewards (Coming Soon)</div>
                  <div className="text-zinc-400">Earn WEIL by staking and validating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faucet;