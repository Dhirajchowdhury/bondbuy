# BondRegistry Contract

## Overview

Solidity smart contract serving as the canonical on-chain registry for bond metadata in the BondBuy protocol.

**Architecture**: Ethereum (metadata) + Solana (payments)

---

## How Bond IDs Are Generated

```solidity
bondId = ++_bondCount;
```

- Sequential integers starting from **1**
- Counter increments atomically with each `createBond()` call
- No gaps possible - IDs are always contiguous
- Simple, gas-efficient, predictable

---

## Why Bonds Are Append-Only

Bonds **cannot be deleted** - only paused via `setBondActive(id, false)`.

**Reasons:**
1. **Audit trail** - Financial instruments require immutable history
2. **Reference integrity** - External systems (Solana, frontend) may hold bond IDs
3. **Regulatory compliance** - No evidence tampering
4. **Simplicity** - No complex state cleanup or orphan handling

---

## Frontend Integration

### Setup (ethers.js v6)

```typescript
import { ethers } from 'ethers';

const REGISTRY_ADDRESS = '0x...'; // Sepolia address
const ABI = [...]; // Contract ABI

const provider = new ethers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/YOUR_KEY'
);
const registry = new ethers.Contract(REGISTRY_ADDRESS, ABI, provider);
```

### Read All Bonds

```typescript
const bonds = await registry.getAllBonds();

// Transform for UI
const formatted = bonds.map((bond, index) => ({
  id: index + 1,
  name: bond.name,
  apy: Number(bond.apy) / 100,        // 718 → 7.18%
  maturity: new Date(Number(bond.maturity) * 1000),
  totalSupply: Number(bond.totalSupply),
  issuedSupply: Number(bond.issuedSupply),
  remainingSupply: Number(bond.totalSupply - bond.issuedSupply),
  active: bond.active
}));
```

### Read Single Bond

```typescript
const bond = await registry.getBond(1);
```

### Check Bond Exists

```typescript
const exists = await registry.bondExists(1); // true/false
```

### Get Bond Count

```typescript
const count = await registry.bondCount();
```

### Listen for Events

```typescript
registry.on('BondCreated', (bondId, name, apy, maturity, totalSupply) => {
  console.log(`New bond #${bondId}: ${name}`);
});

registry.on('BondStatusUpdated', (bondId, active) => {
  console.log(`Bond #${bondId} ${active ? 'activated' : 'paused'}`);
});
```

---

## APY Format

Stored as **basis points** (1 bp = 0.01%):

| Stored Value | Actual APY |
|--------------|------------|
| 718 | 7.18% |
| 1000 | 10.00% |
| 50 | 0.50% |

```typescript
const displayAPY = bond.apy / 100; // Convert for UI
```

---

## Deployment

### Sepolia Testnet

```bash
# Using Hardhat
npx hardhat run scripts/deploy.js --network sepolia

# Verify
npx hardhat verify --network sepolia <DEPLOYED_ADDRESS>
```

### Sample Deploy Script

```javascript
const { ethers } = require('hardhat');

async function main() {
  const BondRegistry = await ethers.getContractFactory('BondRegistry');
  const registry = await BondRegistry.deploy();
  await registry.waitForDeployment();
  
  console.log('BondRegistry deployed to:', await registry.getAddress());
}

main().catch(console.error);
```

---

## Gas Costs (Estimates)

| Function | Gas |
|----------|-----|
| `createBond()` | ~120,000 |
| `setBondActive()` | ~28,000 |
| `getAllBonds()` | Free (view) |
| `getBond()` | Free (view) |

---

## Security Notes

- **Admin-only writes**: Only deployer can modify state
- **Immutable admin**: Cannot be changed after deployment
- **No upgradeability**: Contract code is permanent
- **No payments**: Reduces attack surface (payments on Solana)
- **Input validation**: All inputs validated with custom errors
