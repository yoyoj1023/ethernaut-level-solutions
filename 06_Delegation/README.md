# 06_Delegation Project

## Challenge: Ethernaut CTF Level 6 - Delegate

- **Victory condition**: Gain ownership of the contract instance
- **Knowledge required**: Function selectors, delegatecall() and contract state, global variables (msg.data), keccak256(toUtf8Bytes(sig)), transaction structure

## Solution Strategy:

1. Calculate the function selector value of pwn() (first four bytes of the Keccak-256 hash of the function signature)

2. When the EVM receives a function call, it uses the function selector to find the function to execute

## Solidity Supplement:

- `.delegatecall()` is a very dangerous function that calls the execution content of external functions but changes the state of the current contract.