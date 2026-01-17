import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
