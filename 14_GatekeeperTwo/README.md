# GatekeeperTwo - Ethernaut CTF Challenge

## Project Overview
This project is a self-written solution for the GatekeeperTwo level in Ethernaut CTF. In this challenge, the goal is to bypass multiple defensive check conditions in the contract.

## Key Strategy
- Bypass three different check conditions:
  - gateOne: Exploit the inconsistency between contract calls and transaction initiators.
  - gateTwo: Use contract deployment or special techniques to meet extcodesize check requirements.
  - gateThree: Use bitwise operations and keccak256 hashing to calculate appropriate key values.
- Analyze low-level logic in Solidity and utilize assembly to optimize call options.

## Required Knowledge
- Solidity language and its security best practices
- Ethereum smart contract internal mechanisms (e.g., tx.origin, msg.sender, extcodesize)
- Application of bitwise operations and hash functions (keccak256)
- Basic blockchain and smart contract deployment processes

## Execution Environment
- Node.js and Hardhat (or Truffle) tools
- Solidity compiler version 0.8.0 or above
- Ethereum test network (e.g., Ganache)
