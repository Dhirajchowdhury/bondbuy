
import React, { useState, useEffect, useCallback } from 'react';
import { weilWallet, WeilWallet, WeilTransaction, WEIL_TO_INR_RATE } from './lib/weilWallet';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Portfolio from './components/Portfolio';
import YieldPage from './components/YieldPage';
import SIPPage from './components/SIPPage';
import Faucet from './components/Faucet';
import Education from './components/Education';
import Footer from './components/Footer';
import MintSuccessModal from './components/MintSuccessModal';
import ExecutionReceipt from './components/ExecutionReceipt';
import { saveHolding, fetchHoldings, HoldingRecord } from './lib/supabase';
import { verifyBondMinting } from './lib/weilChain';

// --- Types & Constants ---
export interface Bond {
  id: string;
  name: string;
  apy: number;
  maturityDate: string;
  pricePerUnit: number; // ₹
  risk: string;
  duration: string;
  totalSupply: number;
  remainingSupply: number;
}

export interface Holding {
  id: string; 
  bondId: string;
  bondName: string;
  units: number;
  investedAmount: number; // ₹
  purchaseDate: string;
  apy: number;
  maturityDate: string;
  txHash: string;
}

export type View = 'dashboard' | 'market' | 'portfolio' | 'yield' | 'sip' | 'faucet' | 'education' | 'landing' | 'receipt';

const INDIAN_BONDS: Bond[] = [
  { id: 'in-gs-2030', name: 'India G-Sec 2030 (7.18%)', apy: 7.18, maturityDate: '2030-01-15', pricePerUnit: 100, risk: 'Sovereign', duration: '6 Years', totalSupply: 10000000, remainingSupply: 8400000 },
  { id: 'sdl-mh-2029', name: 'Maharashtra SDL 2029', apy: 7.45, maturityDate: '2029-06-20', pricePerUnit: 100, risk: 'State Sovereign', duration: '5 Years', totalSupply: 5000000, remainingSupply: 2100000 },
  { id: 'nhai-2034', name: 'NHAI Tax-Free 2034', apy: 6.80, maturityDate: '2034-03-10', pricePerUnit: 1000, risk: 'AAA (Govt Backed)', duration: '10 Years', totalSupply: 2000000, remainingSupply: 1500000 },
  { id: 'rbi-float', name: 'RBI Floating Rate Bond', apy: 8.05, maturityDate: '2031-12-01', pricePerUnit: 1000, risk: 'Sovereign', duration: '7 Years', totalSupply: 5000000, remainingSupply: 4800000 },
];

const WEIL_TO_INR_DEMO_RATE = 12500;

const App: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<WeilWallet | null>(null);
  const [weilBalance, setWeilBalance] = useState<number>(0);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentReceiptId, setCurrentReceiptId] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<Holding[]>([]);
  const [marketBonds] = useState<Bond[]>(INDIAN_BONDS);
  const [tick, setTick] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mintSuccessData, setMintSuccessData] = useState<{
    isOpen: boolean;
    bondName: string;
    txSignature: string;
    investedAmount: number;
    units: number;
    certificateId: string;
    receiptId?: string | null;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle hash-based routing for receipts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash.startsWith('receipt/')) {
        const receiptId = hash.replace('receipt/', '');
        setCurrentReceiptId(receiptId);
        setCurrentView('receipt');
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load holdings from Supabase when wallet connects
  const loadHoldings = useCallback(async (walletAddress: string) => {
    console.log('[Supabase] Loading holdings for wallet:', walletAddress);
    const records = await fetchHoldings(walletAddress);
    
    // Convert Supabase records to Holding format
    const holdings: Holding[] = records.map((r: HoldingRecord) => ({
      id: r.id,
      bondId: r.bond_id,
      bondName: r.bond_name,
      units: r.units,
      investedAmount: r.invested_amount,
      purchaseDate: r.purchase_date,
      apy: r.apy,
      maturityDate: r.maturity_date,
      txHash: r.tx_hash
    }));
    
    setPortfolio(holdings);
    console.log('[Supabase] Loaded', holdings.length, 'holdings');
  }, []);

  /**
   * Connects to Weil Chain wallet
   * Simulates wallet connection for demo purposes
   */
  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      console.log('[App] Connecting to Weil Chain wallet...');
      
      const wallet = await weilWallet.connect();
      
      setCurrentWallet(wallet);
      setWalletConnected(true);
      setWeilBalance(wallet.balance);
      
      // Load portfolio for this wallet
      await loadHoldings(wallet.address);
      
      // Auto-transition to dashboard if user is on landing page
      if (currentView === 'landing') {
        setCurrentView('dashboard');
      }
      
      console.log('[App] Weil Chain wallet connected:', wallet.address);
      
    } catch (error) {
      console.error('[App] Wallet connection failed:', error);
      alert('Failed to connect Weil Chain wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    console.log('[Weil Chain] Disconnecting wallet...');
    
    try {
      await weilWallet.disconnect();
    } catch (err) {
      console.error('[Weil Chain] Error during disconnect:', err);
    }
    
    // Reset state
    setWalletConnected(false);
    setCurrentWallet(null);
    setWeilBalance(0);
    setPortfolio([]);
    setCurrentView('landing');
    
    console.log('[Weil Chain] Wallet disconnected successfully');
  };

  // Toggle wallet connection
  const handleWalletClick = () => {
    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const buyBondWithNFT = async (bondId: string, inrAmount: number) => {
    const bond = marketBonds.find(b => b.id === bondId);
    
    if (!bond || !currentWallet) {
      alert("Please ensure your Weil Chain wallet is connected.");
      return;
    }

    setIsMinting(true);
    console.log('[Weil Chain] Initiating transaction for bond:', bondId);

    try {
      // ========================================================================
      // STEP 1: WEIL CHAIN VERIFICATION
      // ========================================================================
      console.log('[Weil Chain] Generating execution receipt...');
      
      const { verifyBondMinting } = await import('./lib/weilChain');
      
      const verificationInput = {
        wallet_address: currentWallet.address,
        bond_id: bond.id,
        bond_name: bond.name,
        units: inrAmount / bond.pricePerUnit,
        invested_amount: inrAmount,
        bond_metadata: {
          active_status: true,
          total_supply: bond.totalSupply,
          issued_supply: bond.totalSupply - bond.remainingSupply,
          apy: bond.apy * 100, // Convert to basis points
          maturity_date: bond.maturityDate
        }
      };
      
      console.log('[Weil Chain] Verification input:', verificationInput);
      console.log('[Weil Chain] Current wallet:', currentWallet);
      
      const verificationResult = await verifyBondMinting(verificationInput);
      
      if (!verificationResult.success || !verificationResult.verified) {
        const errorMsg = verificationResult.errors?.join(', ') || 'Verification failed';
        alert(`Weil Chain verification failed: ${errorMsg}`);
        setIsMinting(false);
        return;
      }
      
      console.log('[Weil Chain] Receipt generated:', verificationResult.receiptId);
      
      // ========================================================================
      // STEP 2: WEIL CHAIN TRANSACTION
      // ========================================================================
      const weilToPay = inrAmount / WEIL_TO_INR_RATE;
      
      if (weilToPay > weilBalance) {
        alert('Insufficient WEIL balance');
        setIsMinting(false);
        return;
      }

      console.log('[Weil Chain] Sending transaction...');
      
      // Simulate Weil Chain transaction
      const transaction = await weilWallet.sendTransaction(
        'weil_treasury_address', // Treasury address
        weilToPay
      );
      
      console.log('[Weil Chain] Transaction confirmed:', transaction.hash);
      
      // Update balance
      setWeilBalance(prev => prev - weilToPay);

      // ========================================================================
      // STEP 3: SAVE HOLDING
      // ========================================================================
      const newHolding: Holding = {
        id: `BOND-${transaction.hash.slice(0, 8)}`.toUpperCase(),
        bondId: bond.id,
        bondName: bond.name,
        units: inrAmount / bond.pricePerUnit,
        investedAmount: inrAmount,
        purchaseDate: new Date().toISOString(),
        apy: bond.apy,
        maturityDate: bond.maturityDate,
        txHash: transaction.hash
      };

      const holdingRecord: HoldingRecord = {
        id: newHolding.id,
        wallet_address: currentWallet.address,
        bond_id: newHolding.bondId,
        bond_name: newHolding.bondName,
        units: newHolding.units,
        invested_amount: newHolding.investedAmount,
        purchase_date: newHolding.purchaseDate,
        apy: newHolding.apy,
        maturity_date: newHolding.maturityDate,
        tx_hash: newHolding.txHash
      };
      
      const { success, error } = await saveHolding(holdingRecord);
      if (!success) {
        console.error('[Supabase] Failed to save holding:', error);
      }

      setPortfolio(prev => [...prev, newHolding]);
      
      setMintSuccessData({
        isOpen: true,
        bondName: bond.name,
        txSignature: transaction.hash,
        investedAmount: inrAmount,
        units: inrAmount / bond.pricePerUnit,
        certificateId: newHolding.id,
        receiptId: verificationResult.receiptId
      });
    } catch (err: any) {
      console.error("[Transaction Error]:", err);
      alert(err.message || "An error occurred during the transaction.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setWeilBalance(newBalance);
  };

  const renderContent = () => {
    if (!walletConnected && !['education', 'landing', 'market'].includes(currentView)) {
      return <LandingPage onConnect={handleWalletClick} isConnected={false} />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard address={currentWallet?.address || ''} portfolio={portfolio} weilBalance={weilBalance} />;
      case 'market': return <Marketplace bonds={marketBonds} balance={weilBalance * WEIL_TO_INR_RATE} weilBalance={weilBalance} onBuy={buyBondWithNFT} isMinting={isMinting} />;
      case 'portfolio': return <Portfolio portfolio={portfolio} tick={tick} />;
      case 'yield': return <YieldPage portfolio={portfolio} balance={weilBalance * WEIL_TO_INR_RATE} tick={tick} />;
      case 'sip': return <SIPPage balance={weilBalance * WEIL_TO_INR_RATE} weilBalance={weilBalance} />;
      case 'faucet': return <Faucet onBalanceUpdate={handleBalanceUpdate} currentBalance={weilBalance} />;
      case 'education': return <Education marketBonds={marketBonds} onNavigate={setCurrentView} />;
      case 'landing': return <LandingPage onConnect={handleWalletClick} isConnected={walletConnected} />;
      case 'receipt': return currentReceiptId ? <ExecutionReceipt receiptId={currentReceiptId} onBack={() => setCurrentView('portfolio')} /> : <LandingPage onConnect={handleWalletClick} isConnected={walletConnected} />;
      default: return <LandingPage onConnect={handleWalletClick} isConnected={walletConnected} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-500 selection:text-black">
      <Navbar 
        onConnect={handleWalletClick} 
        isConnected={walletConnected} 
        address={currentWallet?.address || ''} 
        onNavigate={setCurrentView} 
        currentView={currentView} 
      />
      
      <main className="flex-grow">
        {/* Loading Overlay to signal browser extension is waiting for user action */}
        {isConnecting && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl max-w-sm mx-auto">
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-8"></div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Awaiting Phantom</h3>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Please approve the connection in the extension popup</p>
            </div>
          </div>
        )}
        {renderContent()}
      </main>

      <Footer />

      {mintSuccessData && (
        <MintSuccessModal
          isOpen={mintSuccessData.isOpen}
          onClose={() => setMintSuccessData(null)}
          bondName={mintSuccessData.bondName}
          publicKey={currentWallet?.address || ''}
          txSignature={mintSuccessData.txSignature}
          investedAmount={mintSuccessData.investedAmount}
          units={mintSuccessData.units}
          certificateId={mintSuccessData.certificateId}
          receiptId={mintSuccessData.receiptId}
        />
      )}
    </div>
  );
};

export default App;
