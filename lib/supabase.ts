import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define database schema types
export interface Database {
  public: {
    Tables: {
      execution_receipts: {
        Row: {
          id: string;
          wallet_address: string;
          bond_id: string;
          bond_name: string;
          units: number;
          invested_amount: number;
          rules_verified: any;
          receipt_hash: string;
          receipt_id: string;
          execution_status: string;
          verification_errors: any;
          weil_chain_block: string | null;
          weil_chain_network: string;
          weil_chain_executor: string;
          solana_tx_hash: string | null;
          solana_tx_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          bond_id: string;
          bond_name: string;
          units: number;
          invested_amount: number;
          rules_verified: any;
          receipt_hash: string;
          receipt_id: string;
          execution_status: string;
          verification_errors?: any;
          weil_chain_block?: string | null;
          weil_chain_network?: string;
          weil_chain_executor?: string;
          solana_tx_hash?: string | null;
          solana_tx_confirmed?: boolean;
        };
        Update: {
          solana_tx_hash?: string | null;
          solana_tx_confirmed?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

export interface HoldingRecord {
  id: string;
  wallet_address: string;
  bond_id: string;
  bond_name: string;
  units: number;
  invested_amount: number;
  purchase_date: string;
  apy: number;
  maturity_date: string;
  tx_hash: string;
}

export interface ExecutionReceiptRecord {
  id: string;
  wallet_address: string;
  bond_id: string;
  bond_name: string;
  units: number;
  invested_amount: number;
  rules_verified: any;
  receipt_hash: string;
  receipt_id: string;
  execution_status: string;
  verification_errors: any;
  weil_chain_block: string;
  weil_chain_network: string;
  weil_chain_executor: string;
  solana_tx_hash: string | null;
  solana_tx_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

// Test function to verify execution_receipts table
export async function testExecutionReceiptsTable(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[Supabase] Testing execution_receipts table...');
    
    // Try to select from the table
    const { data, error } = await supabase
      .from('execution_receipts')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('[Supabase] Table test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('[Supabase] Table test successful');
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Table test exception:', err);
    return { success: false, error: String(err) };
  }
}

// Save a new holding to Supabase
export async function saveHolding(holding: HoldingRecord): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('holdings').insert(holding);
  
  if (error) {
    console.error('[Supabase] Error saving holding:', error);
    return { success: false, error: error.message };
  }
  
  console.log('[Supabase] Holding saved successfully:', holding.id);
  return { success: true };
}

// Fetch all holdings for a wallet
export async function fetchHoldings(walletAddress: string): Promise<HoldingRecord[]> {
  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('purchase_date', { ascending: false });
  
  if (error) {
    console.error('[Supabase] Error fetching holdings:', error);
    return [];
  }
  
  console.log('[Supabase] Fetched holdings:', data?.length || 0);
  return data || [];
}
