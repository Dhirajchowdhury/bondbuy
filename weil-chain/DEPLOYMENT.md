# Weil Chain Deployment Guide

## EIBS 2.0 Hackathon Compliance

This document describes the **mandatory Weil Chain deployment** for the BondBuy project as required by EIBS 2.0 Hackathon rules.

---

## What is Deployed on Weil Chain?

**Component**: Mint Verification & Execution Receipt Service

**Purpose**: Generate tamper-proof execution receipts for bond minting workflow

**Location**: `weil-chain/MintVerificationService.js`

---

## Why Weil Chain?

Weil Chain provides:
- **Tamper-proof execution receipts** for audit trails
- **Rule verification** before Solana transactions
- **Enterprise-grade compliance** for financial workflows
- **Immutable record** of minting validations

This satisfies the hackathon requirement while maintaining BondBuy's core architecture.

---

## Deployment Steps

### Prerequisites

```bash
# Install Weil Chain CLI
npm install -g @weil-chain/cli

# Authenticate
weil-cli login --network eibs-testnet
```

### Deploy Service

```bash
# Navigate to project root
cd bondbuy

# Deploy to Weil Chain
weil-cli deploy \
  --service weil-chain/MintVerificationService.js \
  --name bondbuy-mint-verification \
  --network eibs-testnet \
  --runtime nodejs18

# Expected output:
# ✓ Service deployed successfully
# Service ID: bondbuy-mint-verification
# Endpoint: https://weil-chain.eibs.io/services/bondbuy-mint-verification
# Block: EIBS-BLOCK-123456
```

### Verify Deployment

```bash
# Check service status
weil-cli service status --id bondbuy-mint-verification

# Test service
weil-cli service invoke \
  --id bondbuy-mint-verification \
  --input test-payload.json
```

---

## Service Architecture

### Input Schema

```json
{
  "wallet_address": "string",
  "bond_id": "string",
  "bond_name": "string",
  "units": "number",
  "invested_amount": "number",
  "bond_metadata": {
    "active_status": "boolean",
    "total_supply": "number",
    "issued_supply": "number",
    "apy": "number",
    "maturity_date": "string"
  }
}
```

### Output Schema

```json
{
  "success": "boolean",
  "receipt_id": "string",
  "receipt_hash": "string",
  "execution_status": "VERIFIED | FAILED | ERROR",
  "rules_verified": {
    "bond_active": "boolean",
    "supply_available": "boolean",
    "apy_valid": "boolean",
    "maturity_future": "boolean",
    "minimum_investment_met": "boolean",
    "wallet_valid": "boolean"
  },
  "verification_errors": "string[] | null",
  "weil_chain_reference": {
    "block": "string",
    "network": "string",
    "executor": "string"
  },
  "timestamp": "string"
}
```

---

## Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BondBuy Minting Flow                      │
└─────────────────────────────────────────────────────────────┘

1. User clicks "Buy Bond"
   ↓
2. Frontend calls backend verification
   ↓
3. Backend invokes Weil Chain service
   ├─ Validates bond rules
   ├─ Generates receipt hash
   └─ Returns receipt ID
   ↓
4. Receipt saved to Supabase
   ↓
5. Solana transaction executed
   ↓
6. Transaction hash linked to receipt
   ↓
7. Success modal shows receipt link
```

---

## Demo Script for Judges

### Step 1: Show Weil Chain Deployment

```bash
# Terminal 1: Show service status
weil-cli service status --id bondbuy-mint-verification

# Output shows:
# Status: ACTIVE
# Network: EIBS-2.0-Testnet
# Endpoint: https://weil-chain.eibs.io/...
```

### Step 2: Trigger Minting

1. Open BondBuy app
2. Connect Phantom wallet
3. Navigate to Marketplace
4. Select a bond and enter amount
5. Click "Mint Bond NFT"

### Step 3: Show Weil Chain Execution

```bash
# Terminal 2: Watch Weil Chain logs
weil-cli service logs --id bondbuy-mint-verification --follow

# Output shows:
# [Weil Chain] Execution started: 2025-01-17T...
# [Weil Chain] Execution proof generated: {...}
```

### Step 4: Show Receipt

1. After successful mint, click "View Execution Receipt"
2. Show receipt page with:
   - Weil Chain block reference
   - Rules verification checklist
   - Receipt hash
   - Linked Solana transaction

---

## Verification Checklist for Judges

- [ ] Weil Chain service is deployed and accessible
- [ ] Service endpoint returns valid responses
- [ ] Receipts are generated before Solana transactions
- [ ] Receipt page displays Weil Chain references
- [ ] All minting flows go through Weil Chain verification
- [ ] Logs show Weil Chain execution

---

## Production Endpoint Configuration

Update `lib/weilChain.ts` line 67:

```typescript
// PRODUCTION (Uncomment after deployment)
const response = await fetch('https://weil-chain.eibs.io/services/bondbuy-mint-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input)
});
return await response.json();

// DEMO SIMULATION (Remove in production)
// const { verifyAndGenerateReceipt } = require('../weil-chain/MintVerificationService');
// const result = await verifyAndGenerateReceipt(input);
```

---

## Troubleshooting

### Service Not Responding

```bash
# Restart service
weil-cli service restart --id bondbuy-mint-verification

# Check logs
weil-cli service logs --id bondbuy-mint-verification --tail 100
```

### Receipt Not Saving

Check Supabase connection and table schema:

```sql
SELECT * FROM execution_receipts ORDER BY created_at DESC LIMIT 10;
```

### Verification Failing

Check input validation in service logs:

```bash
weil-cli service logs --id bondbuy-mint-verification --filter "ERROR"
```

---

## Contact

For Weil Chain deployment support during hackathon:
- Slack: #eibs-weil-chain-support
- Email: support@weil-chain.io
- Docs: https://docs.weil-chain.io
