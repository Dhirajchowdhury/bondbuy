/**
 * WEIL CHAIN DEPLOYMENT - MANDATORY HACKATHON COMPONENT
 * 
 * Mint Verification & Execution Receipt Service
 * Deployed on: Weil Chain (EIBS 2.0 Hackathon Requirement)
 * 
 * Purpose: Generate tamper-proof execution receipts for bond minting workflow
 * This service validates minting rules BEFORE Solana transaction execution
 * 
 * IMPORTANT: This does NOT mint NFTs or handle payments
 * Role: Audit trail and rule verification only
 */

const crypto = require('crypto');

// ============================================================================
//                         WEIL CHAIN SERVICE HANDLER
// ============================================================================

/**
 * Main entry point for Weil Chain serverless execution
 * This function is deployed and executed on Weil Chain infrastructure
 */
exports.verifyAndGenerateReceipt = async (input) => {
  console.log('[Weil Chain] Execution started:', new Date().toISOString());
  
  try {
    // Extract input parameters
    const {
      wallet_address,
      bond_id,
      bond_name,
      units,
      invested_amount,
      bond_metadata
    } = input;

    // ========================================================================
    //                         RULE VERIFICATION LOGIC
    // ========================================================================
    
    const rules_verified = {
      bond_active: false,
      supply_available: false,
      apy_valid: false,
      maturity_future: false,
      minimum_investment_met: false,
      wallet_valid: false
    };

    const verification_errors = [];

    // Rule 1: Bond must be active
    if (bond_metadata.active_status === true) {
      rules_verified.bond_active = true;
    } else {
      verification_errors.push('Bond is not active');
    }

    // Rule 2: Supply must be available
    const remaining_supply = bond_metadata.total_supply - bond_metadata.issued_supply;
    if (remaining_supply >= units) {
      rules_verified.supply_available = true;
    } else {
      verification_errors.push(`Insufficient supply: ${remaining_supply} units remaining`);
    }

    // Rule 3: APY must be within valid bounds (0.01% to 20%)
    if (bond_metadata.apy >= 1 && bond_metadata.apy <= 2000) {
      rules_verified.apy_valid = true;
    } else {
      verification_errors.push(`Invalid APY: ${bond_metadata.apy} basis points`);
    }

    // Rule 4: Maturity date must be in the future
    const maturity_timestamp = new Date(bond_metadata.maturity_date).getTime();
    const now = Date.now();
    if (maturity_timestamp > now) {
      rules_verified.maturity_future = true;
    } else {
      verification_errors.push('Bond maturity date has passed');
    }

    // Rule 5: Minimum investment (₹100)
    if (invested_amount >= 100) {
      rules_verified.minimum_investment_met = true;
    } else {
      verification_errors.push(`Investment below minimum: ₹${invested_amount}`);
    }

    // Rule 6: Valid Solana wallet address
    if (wallet_address && wallet_address.length >= 32) {
      rules_verified.wallet_valid = true;
    } else {
      verification_errors.push('Invalid wallet address');
    }

    // ========================================================================
    //                    EXECUTION RECEIPT GENERATION
    // ========================================================================

    const all_rules_passed = Object.values(rules_verified).every(v => v === true);
    const execution_status = all_rules_passed ? 'VERIFIED' : 'FAILED';

    // Generate deterministic receipt hash
    const receipt_data = {
      wallet_address,
      bond_id,
      bond_name,
      units,
      invested_amount,
      rules_verified,
      execution_status,
      timestamp: new Date().toISOString(),
      weil_chain_executor: 'BondBuy-MintVerification-v1.0'
    };

    const receipt_hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(receipt_data))
      .digest('hex');

    // Generate unique receipt ID
    const receipt_id = `WEIL-${Date.now()}-${receipt_hash.substring(0, 8).toUpperCase()}`;

    // ========================================================================
    //                    WEIL CHAIN PERSISTENCE (DEMO)
    // ========================================================================
    
    // In production, this would write to Weil Chain's distributed ledger
    // For hackathon demo, we log the execution proof
    const execution_proof = {
      receipt_id,
      receipt_hash,
      execution_status,
      rules_verified,
      verification_errors: verification_errors.length > 0 ? verification_errors : null,
      executed_at: new Date().toISOString(),
      weil_chain_block: `DEMO-BLOCK-${Math.floor(Math.random() * 1000000)}`, // Simulated
      weil_chain_network: 'EIBS-2.0-Testnet'
    };

    console.log('[Weil Chain] Execution proof generated:', execution_proof);

    // ========================================================================
    //                         RETURN RECEIPT METADATA
    // ========================================================================

    return {
      success: all_rules_passed,
      receipt_id,
      receipt_hash,
      execution_status,
      rules_verified,
      verification_errors: verification_errors.length > 0 ? verification_errors : null,
      weil_chain_reference: {
        block: execution_proof.weil_chain_block,
        network: execution_proof.weil_chain_network,
        executor: receipt_data.weil_chain_executor
      },
      timestamp: receipt_data.timestamp
    };

  } catch (error) {
    console.error('[Weil Chain] Execution failed:', error);
    
    return {
      success: false,
      receipt_id: null,
      receipt_hash: null,
      execution_status: 'ERROR',
      error_message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ============================================================================
//                         DEPLOYMENT CONFIGURATION
// ============================================================================

/**
 * Weil Chain Deployment Metadata
 * 
 * Service Name: BondBuy-MintVerification
 * Version: 1.0.0
 * Network: EIBS 2.0 Testnet
 * Endpoint: https://weil-chain.eibs.io/services/bondbuy-mint-verification
 * 
 * Deployment Command:
 * weil-cli deploy --service MintVerificationService.js --network eibs-testnet
 * 
 * Verification:
 * weil-cli service status --id bondbuy-mint-verification
 */

module.exports = {
  verifyAndGenerateReceipt: exports.verifyAndGenerateReceipt,
  serviceMetadata: {
    name: 'BondBuy-MintVerification',
    version: '1.0.0',
    network: 'EIBS-2.0-Testnet',
    description: 'Tamper-proof execution receipt generation for bond minting workflow'
  }
};
