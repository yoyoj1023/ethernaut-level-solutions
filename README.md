# Ethernaut Level Solutions

This is a solution repository for [Ethernaut CTF](https://ethernaut.openzeppelin.com/), containing solutions, solving strategies, and related Solidity knowledge for each level. Ethernaut is a smart contract security challenge platform provided by OpenZeppelin, designed to help developers learn and understand smart contract vulnerabilities and attack methods.

## Project Structure

The project directory is organized by level sequence, with each directory corresponding to a specific level containing the following:

- **README.md**: Detailed explanation of solving strategies, knowledge supplements, and challenge process for each level.
- **contracts/**: Smart contracts involved in the level, including original contracts and attack contracts.
- **scripts/**: Scripts for interacting with contracts, used for deployment, attacks, or verification of solutions.
- **hardhat.config.ts**: Hardhat configuration file containing network settings and compiler versions.
- **package.json**: Project dependency management file.

## Level List

Below are the currently completed levels with brief descriptions:

0. **00_HelloEthernaut**: Introduction to basic operations of the Ethernaut platform.
1. **01_Fallback**: Learn the characteristics of fallback functions and claim contract ownership.
2. **02_Fallout**: Understand constructor naming conventions and become the contract owner.
3. **03_CoinFlip**: Predict coin flip results using block hash values, guessing correctly 10 times in a row.
4. **04_Telephone**: Exploit the difference between `tx.origin` and `msg.sender` to claim ownership.
5. **05_Token**: Trigger underflow vulnerability to increase your token balance.
6. **06_Delegation**: Use `delegatecall` attack to claim contract ownership.
7. **07_Force**: Use `selfdestruct` to forcibly send ETH to the target contract.
8. **08_Vault**: Read private variables through storage slots to unlock the vault.
9. **09_King**: Become the king and prevent others from claiming the king position.
10. **10_Reentrance**: Launch a reentrancy attack to withdraw all funds from the contract.
11. **11_Elevator**: Use external contracts to override logic and reach the top floor of the elevator.
12. **12_Privacy**: Read sensitive data through storage slots to unlock the privacy contract.
13. **13_GatekeeperOne**: Pass through 3 gates, requiring precise calculation of `gasleft()` and familiarity with data type conversion.
14. **14_GatekeeperTwo**: Pass through 3 gates, requiring understanding of `extcodesize(caller())` properties and familiarity with XOR operators.
15. **15-naught-coin**: Understand ERC20's `approve()` and `transferFrom()` to transfer tokens out.
16. **16-preservation**: Use `delegatecall` to overwrite library reference addresses.
17. **17-recovery**: Find deployed contract addresses from the contract factory.
18. **18-magic-number**: Use raw low-level EVM opcodes to create tiny contracts.
19. **19-alien-codex**: Exploit dynamic array overflow and storage slot layout to overwrite contract owner variables.
20. **20-denial**: Perform denial-of-service attacks by consuming all gas to prevent contract owners from withdrawing funds.
21. **21-shop**: Exploit external contract state changes to return different price values within the same transaction.
22. **22-dex**: Drain tokens through price manipulation attacks, exploiting imbalances in decentralized exchange liquidity pools.
23. **23-dex2**: Exploit DEX's lack of token whitelist verification by creating malicious tokens and manipulating price calculation formulas to extract all tokens from the liquidity pool.

## Usage

1. Install dependencies:
```bash
npm install
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy contracts:
```bash
npx hardhat run scripts/deploy_<script_name>.js --network <network_name>
```

4. Run interaction scripts:
```bash
npx hardhat run scripts/<script_name>.js --network <network_name>
```

## Requirements

- Node.js 16+
- Hardhat
- Solidity 0.8.x
- Optimism Sepolia testnet (or other supported testnets)

## Contact

If you have any suggestions or questions about this project, feel free to contact me!

---

Ethernaut is an excellent platform for learning smart contract security. Through these challenges, you will gain a deeper understanding of smart contract vulnerabilities and defense techniques. I hope these solutions help you master the relevant knowledge more quickly!