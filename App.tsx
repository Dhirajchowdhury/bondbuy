
import React, { useState, useEffect, useCallback } from 'react';
import * as web3 from '@solana/web3.js';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Portfolio from './components/Portfolio';
import YieldPage from './components/YieldPage';
import Education from './components/Education';
import Footer from './components/Footer';
import MintSuccessModal from './components/MintSuccessModal';
import ExecutionReceipt from './components/ExecutionReceipt';
import { saveHolding, fetchHoldings, HoldingRecord } from './lib/supabase';

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

export type View = 'dashboard' | 'market' | 'portfolio' | 'yield' | 'education' | 'landing' | 'receipt';

const INDIAN_BONDS: Bond[] = [
  { id: 'in-gs-2030', name: 'India G-Sec 2030 (7.18%)', apy: 7.18, maturityDate: '2030-01-15', pricePerUnit: 100, risk: 'Sovereign', duration: '6 Years', totalSupply: 10000000, remainingSupply: 8400000 },
  { id: 'sdl-mh-2029', name: 'Maharashtra SDL 2029', apy: 7.45, maturityDate: '2029-06-20', pricePerUnit: 100, risk: 'State Sovereign', duration: '5 Years', totalSupply: 5000000, remainingSupply: 2100000 },
  { id: 'nhai-2034', name: 'NHAI Tax-Free 2034', apy: 6.80, maturityDate: '2034-03-10', pricePerUnit: 1000, risk: 'AAA (Govt Backed)', duration: '10 Years', totalSupply: 2000000, remainingSupply: 1500000 },
  { id: 'rbi-float', name: 'RBI Floating Rate Bond', apy: 8.05, maturityDate: '2031-12-01', pricePerUnit: 1000, risk: 'Sovereign', duration: '7 Years', totalSupply: 5000000, remainingSupply: 4800000 },
];

const SOL_TO_INR_DEMO_RATE = 12500;
const TREASURY_PUBKEY = new web3.PublicKey('G787rV6z3V1XN9N7Yy1X6Zz3V1XN9N7Yy1X6Zz3V1XN');

const App: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
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

  // Initialize connection to Devnet
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

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

  const fetchBalance = useCallback(async (publicKey: web3.PublicKey) => {
    try {
      console.log('[Phantom] Fetching SOL balance for:', publicKey.toString());
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / web3.LAMPORTS_PER_SOL);
      console.log('[Phantom] Balance updated:', (balance / web3.LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    } catch (e) {
      console.error("[Phantom] Failed to fetch balance:", e);
    }
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
   * CORRECT PHANTOM CONNECTION IMPLEMENTATION
   * Directly uses window.solana (Phantom Provider).
   * Prevents any redirection by handling the browser extension natively.
   */
  const connectWallet = async () => {
    const { solana } = window as any;
    
    // 1. Detection Phase
    console.log('[Phantom] Checking for window.solana provider...');
    if (!solana || !solana.isPhantom) {
      console.warn('[Phantom] Extension not detected.');
      alert("Phantom Wallet extension not detected. Please install it from https://phantom.app/ (Direct links/redirects are disabled for security).");
      return;
    }

    if (isConnecting) return;
    setIsConnecting(true);

    console.log('[Phantom] Extension detected. Triggering connect() popup...');

    try {
      // Check if already connected
      if (solana.isConnected && solana.publicKey) {
        const publicKey = solana.publicKey.toString();
        console.log('[Phantom] Already connected. Public Key:', publicKey);
        setPubkey(publicKey);
        setWalletConnected(true);
        fetchBalance(solana.publicKey);
        loadHoldings(publicKey);
        if (currentView === 'landing') {
          setCurrentView('dashboard');
        }
        setIsConnecting(false);
        return;
      }

      // 2. Request Connection (Extension Popup)
      // Use eager connect first, then fall back to regular connect
      let response;
      try {
        response = await solana.connect({ onlyIfTrusted: true });
      } catch {
        // If eager connect fails, try regular connect
        response = await solana.connect();
      }
      
      const publicKey = response.publicKey.toString();
      
      console.log('[Phantom] Connection approved. Public Key:', publicKey);
      
      setPubkey(publicKey);
      setWalletConnected(true);
      fetchBalance(response.publicKey);
      loadHoldings(publicKey);
      
      // Auto-transition to dashboard if user is on landing page
      if (currentView === 'landing') {
        setCurrentView('dashboard');
      }
    } catch (err: any) {
      // Handle user cancellation (Error code 4001) or other errors
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        console.warn('[Phantom] Connection request was cancelled by the user.');
        alert("Connection request cancelled.");
      } else {
        console.error("[Phantom] Unexpected error during connection:", err);
        // Try to disconnect and reconnect
        try {
          await solana.disconnect();
        } catch {}
        alert("Connection failed. Please try again or refresh the page.");
      }
      setWalletConnected(false);
      setPubkey(null);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    const { solana } = window as any;
    
    console.log('[Phantom] Disconnecting wallet...');
    
    try {
      if (solana) {
        await solana.disconnect();
      }
    } catch (err) {
      console.error('[Phantom] Error during disconnect:', err);
    }
    
    // Reset state
    setWalletConnected(false);
    setPubkey(null);
    setSolBalance(0);
    setPortfolio([]);
    setCurrentView('landing');
    
    console.log('[Phantom] Wallet disconnected successfully');
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
    const { solana } = window as any;
    
    if (!bond || !pubkey || !solana?.isPhantom) {
      alert("Please ensure your Phantom extension is connected.");
      return;
    }

    setIsMinting(true);
    console.log('[Phantom] Initiating transaction for bond:', bondId);

    try {
      // ========================================================================
      // STEP 1: WEIL CHAIN VERIFICATION (HACKATHON REQUIREMENT)
      // ========================================================================
      console.log('[Weil Chain] Generating execution receipt...');
      
      const { verifyBondMinting, linkSolanaTransaction } = await import('./lib/weilChain');
      
      const verificationInput = {
        wallet_address: pubkey,
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
      
      const verificationResult = await verifyBondMinting(verificationInput);
      
      if (!verificationResult.success || !verificationResult.verified) {
        const errorMsg = verificationResult.errors?.join(', ') || 'Verification failed';
        alert(`Weil Chain verification failed: ${errorMsg}`);
        setIsMinting(false);
        return;
      }
      
      console.log('[Weil Chain] Receipt generated:', verificationResult.receiptId);
      
      // ========================================================================
      // STEP 2: SOLANA TRANSACTION (EXISTING LOGIC)
      // ========================================================================
      const solToPay = inrAmount / SOL_TO_INR_DEMO_RATE;
      const lamports = Math.floor(solToPay * web3.LAMPORTS_PER_SOL);

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: new web3.PublicKey(pubkey),
          toPubkey: TREASURY_PUBKEY,
          lamports,
        })
      );

      transaction.feePayer = new web3.PublicKey(pubkey);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      console.log('[Phantom] Requesting transaction signature from extension...');
      
      const { signature } = await solana.signAndSendTransaction(transaction);
      
      console.log('[Phantom] Transaction signed. Signature:', signature);
      console.log('[Phantom] Waiting for Devnet confirmation...');

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed on-chain.");
      }

      console.log('[Phantom] Transaction confirmed successfully.');

      // ========================================================================
      // STEP 3: LINK SOLANA TX TO WEIL CHAIN RECEIPT
      // ========================================================================
      if (verificationResult.receiptId) {
        await linkSolanaTransaction(verificationResult.receiptId, signature);
        console.log('[Weil Chain] Receipt linked to Solana transaction');
      }

      // ========================================================================
      // STEP 4: SAVE HOLDING (EXISTING LOGIC)
      // ========================================================================
      const newHolding: Holding = {
        id: `BOND-${signature.slice(0, 8)}`.toUpperCase(),
        bondId: bond.id,
        bondName: bond.name,
        units: inrAmount / bond.pricePerUnit,
        investedAmount: inrAmount,
        purchaseDate: new Date().toISOString(),
        apy: bond.apy,
        maturityDate: bond.maturityDate,
        txHash: signature
      };

      const holdingRecord: HoldingRecord = {
        id: newHolding.id,
        wallet_address: pubkey,
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
      fetchBalance(new web3.PublicKey(pubkey));
      
      setMintSuccessData({
        isOpen: true,
        bondName: bond.name,
        txSignature: signature,
        investedAmount: inrAmount,
        units: inrAmount / bond.pricePerUnit,
        certificateId: newHolding.id,
        receiptId: verificationResult.receiptId // Pass receipt ID to modal
      });
    } catch (err: any) {
      console.error("[Transaction Error]:", err);
      if (err.code === 4001) {
        alert("Transaction request was cancelled by the user.");
      } else {
        alert(err.message || "An error occurred during the transaction.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const renderContent = () => {
    if (!walletConnected && !['education', 'landing', 'market'].includes(currentView)) {
      return <LandingPage onConnect={handleWalletClick} isConnected={false} />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard address={pubkey!} portfolio={portfolio} solBalance={solBalance} />;
      case 'market': return <Marketplace bonds={marketBonds} balance={solBalance * SOL_TO_INR_DEMO_RATE} solBalance={solBalance} onBuy={buyBondWithNFT} isMinting={isMinting} />;
      case 'portfolio': return <Portfolio portfolio={portfolio} tick={tick} />;
      case 'yield': return <YieldPage portfolio={portfolio} balance={solBalance * SOL_TO_INR_DEMO_RATE} tick={tick} />;
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
        address={pubkey} 
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
          publicKey={pubkey || ''}
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
