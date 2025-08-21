# Ethernaut DEX Challenge

This project is an implementation of the DEX challenge from [Ethernaut](https://ethernaut.openzeppelin.com/), demonstrating a simple decentralized exchange (DEX) and its related security vulnerabilities.

## Project Overview

This project contains two main contracts:
- **Dex**: A simple DEX contract that allows swapping between two tokens
- **SwappableToken**: A swappable ERC20 token contract

## Contract Features

### Dex Contract
- **setTokens**: Set two swappable token addresses (owner only)
- **addLiquidity**: Add liquidity (owner only)
- **swap**: Swap between two tokens
- **getSwapPrice**: Calculate swap price
- **approve**: Approve token spending
- **balanceOf**: Query token balance

### SwappableToken Contract
- Standard ERC20 token implementation
- Integrated with DEX contract
- Contains special approve logic

## Security Considerations

⚠️ **Warning**: This DEX implementation contains known security vulnerabilities and is for educational purposes only. It should not be used in production environments.

Main vulnerabilities include:
1. Flawed price calculation logic that can lead to price manipulation
2. Improper liquidity management
3. Lack of slippage protection

## Installation and Setup

```bash
# Install dependencies
npm install

# or use yarn
yarn install
```

## Usage

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Run Local Node
```bash
npx hardhat node
```

### Deploy Contracts
```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Challenge Objectives

The goals of the Ethernaut DEX challenge typically include:
1. Understand how DEX works
2. Discover vulnerabilities in price calculation
3. Exploit vulnerabilities to manipulate token prices
4. Learn how to protect DEX from such attacks

## Technology Stack

- **Solidity**: Smart contract development language
- **Hardhat**: Ethereum development framework
- **OpenZeppelin**: Secure smart contract library
- **TypeScript**: Scripting and testing language

## File Structure

```
92-ethernaut-dex/
├── contracts/
│   └── Dex.sol              # DEX and token contracts
├── test/                    # Test files
├── ignition/               # Deployment scripts
├── hardhat.config.ts       # Hardhat configuration
└── package.json           # Project dependencies
```

## Learning Resources

- [Ethernaut Official Website](https://ethernaut.openzeppelin.com/)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Contributing

Feel free to submit issues and pull requests to improve this project.

## License

This project is licensed under the MIT License.

---

**Disclaimer**: This code is for educational and learning purposes only. Do not use in production environments as it contains known security vulnerabilities.
