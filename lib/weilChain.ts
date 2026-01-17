/**
 * WEIL CHAIN INTEGRATION LIBRARY
 * 
 * Handles communication with Weil Chain verification service
 * and execution receipt management
 */

import { supabase } from './supabase';

// ============================================================================
//                         TYPE DEFINITIONS
// ============================================================================

export interface BondMetadata {
  active_status: boolean;
  total_supply: number;
  issued_supply: number;
  apy: number;
  maturity_date: string;
}

export interface VerificationInput {
  wallet_address: string;
  bond_id: string;
  bond_name: string;
  units: number;
  invested_amount: number;
  bond_metadata: BondMetadata;
}

export interface RulesVerified {
  bond_active: boolean;
  supply_available: boolean;
  apy_valid: boolean;
  maturity_future: boolean;
  minimum_investment_met: boolean;
  wallet_valid: boolean;
}

export interface WeilChainReference {
  block: string;
  network: string;
  executor: string;
}

export interface VerificationResponse {
  success: boolean;
  receipt_id: string | null;
  receipt_hash: string | null;
  execution_status: 'VERIFIED' | 'FAILED' | 'ERROR';
  rules_verified: RulesVerified;
  verification_errors: string[] | null;
  weil_chain_reference: WeilChainReference;
  timestamp: string;
}

export interface ExecutionReceipt {
  id: string;
  wallet_address: string;
  bond_id: string;
  bond_name: string;
  units: number;
  invested_amount: number;
  rules_verified: RulesVerified;
  receipt_hash: string;
  receipt_id: string;
  execution_status: string;
  verification_errors: string[] | null;
  weil_chain_block: string;
  weil_chain_network: string;
  weil_chain_executor: string;
  solana_tx_hash: string | null;
  solana_tx_confirmed: boolean;
  created_at: string;
}

// ============================================================================
//                    WEIL CHAIN SERVICE COMMUNICATION
// ============================================================================

/**
 * Calls Weil Chain verification service
 * 
 * HACKATHON NOTE: In production, this would make an HTTP request to
 * the deployed Weil Chain endpoint. For demo purposes, we simulate
 * the service call with local execution.
 */
export async function callWeilChainVerification(
  input: VerificationInput
): Promise<VerificationResponse> {
  console.log('[Weil Chain] Calling verification service...');
  
  try {
    // PRODUCTION ENDPOINT (Uncomment when deployed):
    // const response = await fetch('https://weil-chain.eibs.io/services/bondbuy-mint-verification', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(input)
    // });
    // return await response.json();

    // DEMO SIMULATION - Inline verification logic
    const result = simulateWeilChainVerification(input);
    
    console.log('[Weil Chain] Verification complete:', result.execution_status);
    return result;
    
  } catch (error) {
    console.error('[Weil Chain] Service call failed:', error);
    throw new Error('Weil Chain verification service unavailable');
  }
}

/**
 * Simulates Weil Chain verification service
 * This replicates the logic that would run on Weil Chain
 */
function simulateWeilChainVerification(input: VerificationInput): VerificationResponse {
  const rules_verified: RulesVerified = {
    bond_active: false,
    supply_available: false,
    apy_valid: false,
    maturity_future: false,
    minimum_investment_met: false,
    wallet_valid: false
  };

  const verification_errors: string[] = [];

  // Rule 1: Bond must be active
  if (input.bond_metadata.active_status === true) {
    rules_verified.bond_active = true;
  } else {
    verification_errors.push('Bond is not active');
  }

  // Rule 2: Supply must be available
  const remaining_supply = input.bond_metadata.total_supply - input.bond_metadata.issued_supply;
  if (remaining_supply >= input.units) {
    rules_verified.supply_available = true;
  } else {
    verification_errors.push(`Insufficient supply: ${remaining_supply} units remaining`);
  }

  // Rule 3: APY must be within valid bounds (0.01% to 20%)
  if (input.bond_metadata.apy >= 1 && input.bond_metadata.apy <= 2000) {
    rules_verified.apy_valid = true;
  } else {
    verification_errors.push(`Invalid APY: ${input.bond_metadata.apy} basis points`);
  }

  // Rule 4: Maturity date must be in the future
  const maturity_timestamp = new Date(input.bond_metadata.maturity_date).getTime();
  const now = Date.now();
  if (maturity_timestamp > now) {
    rules_verified.maturity_future = true;
  } else {
    verification_errors.push('Bond maturity date has passed');
  }

  // Rule 5: Minimum investment (₹100)
  if (input.invested_amount >= 100) {
    rules_verified.minimum_investment_met = true;
  } else {
    verification_errors.push(`Investment below minimum: ₹${input.invested_amount}`);
  }

  // Rule 6: Valid Solana wallet address
  if (input.wallet_address && input.wallet_address.length >= 32) {
    rules_verified.wallet_valid = true;
  } else {
    verification_errors.push('Invalid wallet address');
  }

  // Determine execution status
  const all_rules_passed = Object.values(rules_verified).every(v => v === true);
  const execution_status = all_rules_passed ? 'VERIFIED' : 'FAILED';

  // Generate deterministic receipt hash
  const receipt_data = {
    wallet_address: input.wallet_address,
    bond_id: input.bond_id,
    bond_name: input.bond_name,
    units: input.units,
    invested_amount: input.invested_amount,
    rules_verified,
    execution_status,
    timestamp: new Date().toISOString(),
    weil_chain_executor: 'BondBuy-MintVerification-v1.0'
  };

  // Simple hash generation (in production, use crypto library)
  const hashString = JSON.stringify(receipt_data);
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const receipt_hash = Math.abs(hash).toString(16).padStart(16, '0').toUpperCase();

  // Generate unique receipt ID
  const receipt_id = `WEIL-${Date.now()}-${receipt_hash.substring(0, 8).toUpperCase()}`;

  return {
    success: all_rules_passed,
    receipt_id,
    receipt_hash,
    execution_status: execution_status as 'VERIFIED' | 'FAILED' | 'ERROR',
    rules_verified,
    verification_errors: verification_errors.length > 0 ? verification_errors : null,
    weil_chain_reference: {
      block: `DEMO-BLOCK-${Math.floor(Math.random() * 1000000)}`,
      network: 'EIBS-2.0-Testnet',
      executor: 'BondBuy-MintVerification-v1.0'
    },
    timestamp: receipt_data.timestamp
  };
}

// ============================================================================
//                    EXECUTION RECEIPT MANAGEMENT
// ============================================================================

/**
 * Stores execution receipt in Supabase
 */
export async function saveExecutionReceipt(
  input: VerificationInput,
  weilResponse: VerificationResponse
): Promise<{ success: boolean; receiptId: string | null; error?: string }> {
  
  if (!weilResponse.receipt_id || !weilResponse.receipt_hash) {
    return { 
      success: false, 
      receiptId: null, 
      error: 'Invalid Weil Chain response' 
    };
  }

  const receiptData = {
    wallet_address: input.wallet_address,
    bond_id: input.bond_id,
    bond_name: input.bond_name,
    units: input.units,
    invested_amount: input.invested_amount,
    rules_verified: weilResponse.rules_verified,
    receipt_hash: weilResponse.receipt_hash,
    receipt_id: weilResponse.receipt_id,
    execution_status: weilResponse.execution_status,
    verification_errors: weilResponse.verification_errors,
    weil_chain_block: weilResponse.weil_chain_reference.block,
    weil_chain_network: weilResponse.weil_chain_reference.network,
    weil_chain_executor: weilResponse.weil_chain_reference.executor,
    solana_tx_hash: null,
    solana_tx_confirmed: false
  };

  const { data, error } = await supabase
    .from('execution_receipts')
    .insert(receiptData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to save receipt:', error);
    return { success: false, receiptId: null, error: error.message };
  }

  console.log('[Supabase] Receipt saved:', data.receipt_id);
  return { success: true, receiptId: data.receipt_id };
}

/**
 * Links Solana transaction to execution receipt
 */
export async function linkSolanaTransaction(
  receiptId: string,
  solanaTxHash: string
): Promise<{ success: boolean; error?: string }> {
  
  const { error } = await supabase
    .from('execution_receipts')
    .update({
      solana_tx_hash: solanaTxHash,
      solana_tx_confirmed: true
    })
    .eq('receipt_id', receiptId);

  if (error) {
    console.error('[Supabase] Failed to link transaction:', error);
    return { success: false, error: error.message };
  }

  console.log('[Supabase] Transaction linked:', solanaTxHash);
  return { success: true };
}

/**
 * Fetches execution receipt by ID
 */
export async function getExecutionReceipt(
  receiptId: string
): Promise<ExecutionReceipt | null> {
  
  const { data, error } = await supabase
    .from('execution_receipts')
    .select('*')
    .eq('receipt_id', receiptId)
    .single();

  if (error) {
    console.error('[Supabase] Failed to fetch receipt:', error);
    return null;
  }

  return data as ExecutionReceipt;
}

/**
 * Fetches all receipts for a wallet
 */
export async function getWalletReceipts(
  walletAddress: string
): Promise<ExecutionReceipt[]> {
  
  const { data, error } = await supabase
    .from('execution_receipts')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to fetch wallet receipts:', error);
    return [];
  }

  return data as ExecutionReceipt[];
}

// ============================================================================
//                    INTEGRATED VERIFICATION WORKFLOW
// ============================================================================

/**
 * Complete verification workflow:
 * 1. Call Weil Chain service
 * 2. Save receipt to Supabase
 * 3. Return receipt ID for frontend
 */
export async function verifyBondMinting(
  input: VerificationInput
): Promise<{
  success: boolean;
  receiptId: string | null;
  verified: boolean;
  errors: string[] | null;
}> {
  
  console.log('[Weil Chain Workflow] Starting verification...');
  
  // Step 1: Call Weil Chain verification service
  const weilResponse = await callWeilChainVerification(input);
  
  // Step 2: Save receipt to database
  const { success, receiptId, error } = await saveExecutionReceipt(input, weilResponse);
  
  if (!success) {
    return {
      success: false,
      receiptId: null,
      verified: false,
      errors: [error || 'Failed to save receipt']
    };
  }
  
  console.log('[Weil Chain Workflow] Verification complete');
  
  return {
    success: true,
    receiptId,
    verified: weilResponse.execution_status === 'VERIFIED',
    errors: weilResponse.verification_errors
  };
}
