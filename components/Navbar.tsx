
import React from 'react';

interface NavbarProps {
  onConnect: () => void;
  isConnected: boolean;
  address: string | null;
  onNavigate?: (view: any) => void;
  currentView?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onConnect, isConnected, address, onNavigate, currentView }) => {
  const navItems = isConnected 
    ? [
        { label: 'Dashboard', id: 'dashboard' },
        { label: 'Market', id: 'market' },
        { label: 'Portfolio', id: 'portfolio' },
        { label: 'Yield', id: 'yield' },
        { label: 'Education', id: 'education' }
      ]
    : [
        { label: 'Home', id: 'landing' },
        { label: 'Market', id: 'market' },
        { label: 'Education', id: 'education' }
      ];

  const displayAddress = address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : 'Connect Wallet';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => onNavigate?.('landing')}
            className="text-2xl font-black tracking-tighter hover:text-orange-500 transition-colors"
          >
            bondbuy<span className="text-orange-500">.</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => onNavigate?.(item.id)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  currentView === item.id ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Devnet Mode</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Solana Network</span>
            </div>
          )}
          <button 
            onClick={onConnect}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all transform active:scale-95 ${
              isConnected 
              ? 'bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700' 
              : 'bg-orange-500 text-black hover:bg-orange-400'
            }`}
          >
            {isConnected ? displayAddress : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
