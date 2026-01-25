/**
 * WEIL CHAIN WALLET INTEGRATION
 * 
 * Handles wallet connection and transactions on Weil Chain
 */

export interface WeilWallet {
  address: string;
  balance: number;
  network: string;
}

export interface WeilTransaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

// Mock Weil Chain wallet for demo
class WeilChainWallet {
  private connected = false;
  private wallet: WeilWallet | null = null;

  async connect(): Promise<WeilWallet> {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a proper Weil Chain address (ensure it's long enough)
    const randomBytes = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    this.wallet = {
      address: `weil1${randomBytes}`,
      balance: 0, // Start with 0 balance - user needs to get tokens from faucet
      network: 'EIBS-2.0-Testnet'
    };
    
    this.connected = true;
    console.log('[Weil Wallet] Connected:', this.wallet.address);
    console.log('[Weil Wallet] Address length:', this.wallet.address.length);
    console.log('[Weil Wallet] Address starts with weil1:', this.wallet.address.startsWith('weil1'));
    console.log('[Weil Wallet] Address validation test:', this.wallet.address.length >= 15 && this.wallet.address.startsWith('weil1'));
    return this.wallet;
  }

  async requestFaucetTokens(): Promise<{ success: boolean; amount: number; error?: string }> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    // Simulate faucet request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if already received faucet tokens recently (simulate rate limiting)
    const lastFaucetTime = localStorage.getItem(`weil_faucet_${this.wallet.address}`);
    const now = Date.now();
    
    if (lastFaucetTime && (now - parseInt(lastFaucetTime)) < 24 * 60 * 60 * 1000) {
      return {
        success: false,
        amount: 0,
        error: 'Faucet can only be used once per 24 hours per address'
      };
    }
    
    // Give 10 WEIL tokens from faucet
    const faucetAmount = 10;
    this.wallet.balance += faucetAmount;
    
    // Store faucet usage time
    localStorage.setItem(`weil_faucet_${this.wallet.address}`, now.toString());
    
    console.log('[Weil Faucet] Dispensed', faucetAmount, 'WEIL to', this.wallet.address);
    return { success: true, amount: faucetAmount };
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.wallet = null;
    console.log('[Weil Wallet] Disconnected');
  }

  async getBalance(): Promise<number> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    // Simulate balance fetch
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.wallet.balance;
  }

  async sendTransaction(to: string, amount: number): Promise<WeilTransaction> {
    if (!this.wallet) throw new Error('Wallet not connected');
    if (amount > this.wallet.balance) throw new Error('Insufficient balance');
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tx: WeilTransaction = {
      hash: `weil_tx_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      from: this.wallet.address,
      to,
      amount,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };
    
    // Update balance
    this.wallet.balance -= amount;
    
    console.log('[Weil Wallet] Transaction sent:', tx.hash);
    return tx;
  }

  getWallet(): WeilWallet | null {
    return this.wallet;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const weilWallet = new WeilChainWallet();

// Utility functions
export const formatWeilAddress = (address: string, length = 8): string => {
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const WEIL_TO_INR_RATE = 12500;

export const convertWeilToINR = (weil: number): number => {
  return weil * WEIL_TO_INR_RATE;
};

export const convertINRToWeil = (inr: number): number => {
  return inr / WEIL_TO_INR_RATE;
};