# Naught Coin Strategy Guide

This project is based on the [scaffold-eth-2](https://github.com/scaffold-eth/scaffold-eth-2) framework, designed to solve the Naught Coin challenge in [Ethernaut](https://ethernaut.openzeppelin.com/).

## Challenge Overview

Naught Coin is an ERC20 token where the entire initial supply is allocated to the challenger (player). However, the contract implements a `lockTokens` modifier that prevents the player from using the `transfer()` function to move tokens for 10 years.

**Objective**: Bypass the time lock restriction and transfer all tokens out of the player's account.

## Vulnerability Analysis

Looking at the contract source code reveals:

```solidity
contract NaughtCoin is ERC20 {
    uint256 public timeLock = block.timestamp + 10 * 365 days;
    uint256 public INITIAL_SUPPLY;
    address public player;

    constructor(address _player) ERC20("NaughtCoin", "0x0") {
        player = _player;
        INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals()));
        _mint(player, INITIAL_SUPPLY);
        emit Transfer(address(0), player, INITIAL_SUPPLY);
    }

    function transfer(address _to, uint256 _value) public override lockTokens returns (bool) {
        super.transfer(_to, _value);
    }

    // Prevent the initial owner from transferring tokens until the timelock has passed
    modifier lockTokens() {
        if (msg.sender == player) {
            require(block.timestamp > timeLock);
            _;
        } else {
            _;
        }
    }
}
```

Key vulnerability: The contract only overrides and restricts the `transfer()` function, but the ERC20 standard provides other methods for transferring tokens, particularly:
- `approve()`: Allows other addresses to withdraw tokens from your account
- `transferFrom()`: Used to withdraw tokens from approved accounts

## Attack Steps

1. Use the player account to call the `approve()` function, authorizing another address (can be your second account) to use all your tokens
2. From the second account, call the `transferFrom()` function to transfer tokens out of the player account

## Environment Setup

### Prerequisites

- Node.js 16+ and Yarn
- MetaMask wallet
- Some testnet ETH (e.g., Sepolia)

### Installation Steps

1. Clone the project
```bash
git clone https://github.com/your-username/naught-coin.git
cd naught-coin
```

2. Install dependencies
```bash
yarn install
```

3. Start the project in two different terminals
```bash
# Terminal 1: Start local chain
yarn chain

# Terminal 2: Start frontend
yarn start
```

## Using Debug Contracts Page to Solve the Challenge

1. Connect to Ethernaut instance
   - In MetaMask, ensure you're connected to the network containing the Ethernaut challenge instance (e.g., Sepolia)
   - Get the Naught Coin instance contract address from Ethernaut

2. Set up external contract in Scaffold-eth-2
   - Go to `packages/nextjs/scaffold.config.ts` to confirm or modify configuration:
     ```typescript
     export const scaffoldConfig = {
       targetNetwork: chains.sepolia,
       // ... other configurations
     };
     ```
   - On the Debug Contracts page, click the "Add Contract to Debug" button
   - Enter contract name "NaughtCoin", contract address (from Ethernaut), and select appropriate ABI

3. Execute attack
   - Find the NaughtCoin contract on the Debug Contracts page
   - Use the `balanceOf` function to check your token balance
   - Use the `approve` function:
     - address (spender): Enter your second account address
     - amount: Enter the total amount of tokens you own
   - Switch to your second account
   - Use the `transferFrom` function:
     - from: Enter your first account address (player address)
     - to: Enter your second account address
     - amount: Enter the total amount of tokens you want to transfer
   
4. Verify success
   - Use `balanceOf` to check the first account balance, should be 0
   - Use `balanceOf` to check the second account balance, should have all tokens
   - Return to Ethernaut to submit the instance and complete the challenge

## Learning Points

- ERC20 standard provides multiple token transfer mechanisms, requiring comprehensive protection to achieve effective restrictions
- When inheriting from standard contracts, it's important to understand and correctly override all relevant functions
- In security audits, all possible asset transfer pathways should be examined

## Running the Project

```bash
# Install dependencies
yarn install

# Start local chain
yarn chain

# Deploy contracts in another terminal
yarn deploy

# Start frontend
yarn start
```

Browser access: http://localhost:3000
