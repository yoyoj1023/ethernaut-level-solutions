# PuzzleWallet Attack Script

This script is designed to attack the PuzzleWallet contract deployed on Optimism Sepolia at address: `0x762801a5b8496dCDe6aBff8e2420Cc42A0308e12`

## Attack Principle

This attack exploits two main vulnerabilities:

1. **Storage Collision**:
   - `PuzzleProxy.pendingAdmin` (Slot 0) ↔ `PuzzleWallet.owner` (Slot 0)
   - `PuzzleProxy.admin` (Slot 1) ↔ `PuzzleWallet.maxBalance` (Slot 1)

2. **Logic Flaw in multicall Function**:
   - `delegatecall` preserves `msg.value`
   - `depositCalled` flag is not shared during recursive calls

## Attack Steps

### Step 1: Become Owner
- Call `PuzzleProxy.proposeNewAdmin(attacker_address)`
- This sets `pendingAdmin = attacker_address`
- Due to storage collision, `PuzzleWallet.owner` also becomes the attacker's address

### Step 2: Add to Whitelist
- Now as owner, call `PuzzleWallet.addToWhitelist(attacker_address)`
- This satisfies the `onlyWhitelisted` requirement for subsequent functions

### Step 3: Exploit multicall Vulnerability
- Construct two calls:
  1. Direct `deposit()` call
  2. Nested `multicall([deposit()])` call
- Send ETH equal to the contract's current balance
- Result: Internal balance doubles, but actual balance only increases once

### Step 4: Drain Contract Balance
- Use `execute()` function to extract all ETH
- Contract balance becomes 0

### Step 5: Become Admin
- Call `setMaxBalance(attacker_address_as_uint256)`
- Due to storage collision, this sets `PuzzleProxy.admin = attacker_address`

## Usage

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file and set environment variables:
   ```bash
   # Create .env file
   touch .env
   ```
   
   Add the following content to the `.env` file:
   ```env
   # Private key (without 0x prefix)
   PRIVATE_KEY=your_private_key_here
   
   # Sepolia network RPC URL  
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
   
   # Sepolia private key
   SEPOLIA_PRIVATE_KEY=your_sepolia_private_key_here
   
   # Optimism Sepolia RPC URL with API Key
   OP_SEPOLIA_RPC_URL_API_KEY=https://opt-sepolia.g.alchemy.com/v2/your_api_key
   ```

3. Ensure your `.env` file won't be committed to git:
   ```bash
   echo ".env" >> .gitignore
   ```

### Execute Attack

```bash
# Install dependencies
npm install

# Run attack script
npx hardhat run scripts/exploit-puzzle-wallet.ts --network optimismSepolia
```

## Important Notes

⚠️ **Warning**:
- This script is for educational purposes and CTF challenges only
- Do not use on mainnet or other people's contracts
- Ensure you have sufficient ETH to pay for gas fees
- The contract must have a non-zero balance for the attack to work

## Script Output

The script will display detailed execution process, including:
- Initial state checks
- Transaction hashes for each step
- Intermediate state verification
- Final attack results

After a successful attack, you will see:
```
🎊 Attack successful! You are now the admin of the contract!
```

## Troubleshooting

If the attack fails, check:
1. Whether the contract has a balance (must be > 0)
2. Network connection is working properly
3. Private key and RPC URL are correct
4. Gas fees are sufficient
