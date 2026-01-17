-- ============================================================================
-- EXECUTION RECEIPTS TABLE
-- Purpose: Store Weil Chain execution receipts for audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS execution_receipts (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Transaction details
  wallet_address TEXT NOT NULL,
  bond_id TEXT NOT NULL,
  bond_name TEXT NOT NULL,
  units NUMERIC(18, 4) NOT NULL,
  invested_amount NUMERIC(18, 2) NOT NULL,
  
  -- Weil Chain verification data
  rules_verified JSONB NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE,
  receipt_id TEXT NOT NULL UNIQUE,
  
  -- Execution status
  execution_status TEXT NOT NULL CHECK (execution_status IN ('VERIFIED', 'FAILED', 'ERROR')),
  verification_errors JSONB,
  
  -- Weil Chain reference
  weil_chain_block TEXT,
  weil_chain_network TEXT DEFAULT 'EIBS-2.0-Testnet',
  weil_chain_executor TEXT DEFAULT 'BondBuy-MintVerification-v1.0',
  
  -- Solana transaction linkage
  solana_tx_hash TEXT,
  solana_tx_confirmed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for wallet lookups
CREATE INDEX idx_execution_receipts_wallet 
ON execution_receipts(wallet_address);

-- Index for bond lookups
CREATE INDEX idx_execution_receipts_bond 
ON execution_receipts(bond_id);

-- Index for receipt ID lookups
CREATE INDEX idx_execution_receipts_receipt_id 
ON execution_receipts(receipt_id);

-- Index for Solana transaction lookups
CREATE INDEX idx_execution_receipts_solana_tx 
ON execution_receipts(solana_tx_hash) 
WHERE solana_tx_hash IS NOT NULL;

-- Index for status filtering
CREATE INDEX idx_execution_receipts_status 
ON execution_receipts(execution_status);

-- Index for timestamp queries
CREATE INDEX idx_execution_receipts_created 
ON execution_receipts(created_at DESC);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_execution_receipts_updated_at
BEFORE UPDATE ON execution_receipts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (Optional - Enable if needed)
-- ============================================================================

-- Enable RLS
-- ALTER TABLE execution_receipts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own receipts
-- CREATE POLICY "Users can view own receipts"
-- ON execution_receipts FOR SELECT
-- USING (wallet_address = current_setting('app.current_wallet')::TEXT);

-- ============================================================================
-- SAMPLE QUERY PATTERNS
-- ============================================================================

-- Get all receipts for a wallet
-- SELECT * FROM execution_receipts 
-- WHERE wallet_address = 'WALLET_ADDRESS' 
-- ORDER BY created_at DESC;

-- Get receipt by ID
-- SELECT * FROM execution_receipts 
-- WHERE receipt_id = 'WEIL-1234567890-ABCD1234';

-- Get receipts linked to Solana transactions
-- SELECT * FROM execution_receipts 
-- WHERE solana_tx_hash IS NOT NULL 
-- AND solana_tx_confirmed = TRUE;

-- Get failed verifications
-- SELECT * FROM execution_receipts 
-- WHERE execution_status = 'FAILED' 
-- ORDER BY created_at DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE execution_receipts IS 
'Stores Weil Chain execution receipts for bond minting workflow verification';

COMMENT ON COLUMN execution_receipts.rules_verified IS 
'JSONB object containing boolean flags for each verification rule';

COMMENT ON COLUMN execution_receipts.receipt_hash IS 
'SHA-256 hash of receipt data for tamper detection';

COMMENT ON COLUMN execution_receipts.weil_chain_block IS 
'Reference to Weil Chain block where execution was recorded';

COMMENT ON COLUMN execution_receipts.solana_tx_hash IS 
'Solana transaction signature linking receipt to on-chain mint';
