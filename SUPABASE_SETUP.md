# Supabase Setup Instructions

## Create Execution Receipts Table

Follow these steps to create the required table in your Supabase project:

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `chzuzdinksazeswzrife`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run This SQL

Copy and paste the following SQL and click "Run":

```sql
-- Create execution_receipts table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_execution_receipts_wallet 
ON execution_receipts(wallet_address);

CREATE INDEX IF NOT EXISTS idx_execution_receipts_bond 
ON execution_receipts(bond_id);

CREATE INDEX IF NOT EXISTS idx_execution_receipts_receipt_id 
ON execution_receipts(receipt_id);

CREATE INDEX IF NOT EXISTS idx_execution_receipts_solana_tx 
ON execution_receipts(solana_tx_hash) 
WHERE solana_tx_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_execution_receipts_status 
ON execution_receipts(execution_status);

CREATE INDEX IF NOT EXISTS idx_execution_receipts_created 
ON execution_receipts(created_at DESC);

-- Create trigger for updated_at
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

-- Add comments
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
```

### Step 3: Verify Table Creation

Run this query to verify the table was created:

```sql
SELECT * FROM execution_receipts LIMIT 1;
```

You should see an empty result (no rows) but no error.

### Step 4: Enable Row Level Security (Optional)

If you want to enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE execution_receipts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for demo purposes)
CREATE POLICY "Allow public read access"
ON execution_receipts FOR SELECT
TO public
USING (true);

-- Allow public insert (for demo purposes)
CREATE POLICY "Allow public insert"
ON execution_receipts FOR INSERT
TO public
WITH CHECK (true);
```

### Step 5: Test the Setup

Try minting a bond again in your application. The error should be gone!

---

## Troubleshooting

### Error: "permission denied for table execution_receipts"

Run this to grant permissions:

```sql
GRANT ALL ON execution_receipts TO postgres, anon, authenticated, service_role;
```

### Error: "function gen_random_uuid() does not exist"

Enable the UUID extension:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Check if table exists

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'execution_receipts';
```

---

## Quick Setup (All-in-One)

If you want to run everything at once:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table
CREATE TABLE IF NOT EXISTS execution_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  bond_id TEXT NOT NULL,
  bond_name TEXT NOT NULL,
  units NUMERIC(18, 4) NOT NULL,
  invested_amount NUMERIC(18, 2) NOT NULL,
  rules_verified JSONB NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE,
  receipt_id TEXT NOT NULL UNIQUE,
  execution_status TEXT NOT NULL CHECK (execution_status IN ('VERIFIED', 'FAILED', 'ERROR')),
  verification_errors JSONB,
  weil_chain_block TEXT,
  weil_chain_network TEXT DEFAULT 'EIBS-2.0-Testnet',
  weil_chain_executor TEXT DEFAULT 'BondBuy-MintVerification-v1.0',
  solana_tx_hash TEXT,
  solana_tx_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_execution_receipts_wallet ON execution_receipts(wallet_address);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_bond ON execution_receipts(bond_id);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_receipt_id ON execution_receipts(receipt_id);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_status ON execution_receipts(execution_status);
CREATE INDEX IF NOT EXISTS idx_execution_receipts_created ON execution_receipts(created_at DESC);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_execution_receipts_updated_at ON execution_receipts;
CREATE TRIGGER update_execution_receipts_updated_at
BEFORE UPDATE ON execution_receipts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON execution_receipts TO postgres, anon, authenticated, service_role;

-- Enable RLS (optional for demo)
ALTER TABLE execution_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON execution_receipts FOR ALL TO public USING (true) WITH CHECK (true);
```

---

## Done!

Your Supabase database is now ready for Weil Chain execution receipts.
