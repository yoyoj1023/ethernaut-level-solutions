# 09_King Project

## Challenge: Ethernaut CTF Level 9 - King

- **Victory condition**: Become King and maintain King status. When submitting the instance, the level will try to claim King, you need to defend it.
- **Knowledge required**: Contract transfer function types and limitations, Fallback, Force, gas, gas consumption for state changes, reentrancy attacks

## Solution Strategy:

1. Use a contract to forward tokens to King and become king. At the same time, do not define `receive()` in the contract

2. After King sends tokens to the former king, if the next challenger tries to become the new king, it will fail because the current king's contract does not define `receive()`, causing the transfer to fail and the transaction to revert.

3. No one will ever be able to become the new king again, effectively permanently locking it.

4. This is a denial-of-service attack. Classic real-world cases: King of the Ether and King of the Ether Postmortem

## Solidity Supplement:

- When using transfer functions in KingAttacker, pay attention to the following method characteristics: transfer(amount), send(amount), call{value: amount}(""), selfdestruct(target address)

- When `transfer` is called, it only allocates 2300 gas to the recipient's fallback or receive function. This value is sufficient for simple operations (such as logging events `emit Event()`), but not enough to modify contract storage or execute more complex logic. For example: `king = msg.sender;` this operation will fail.

- Storage operations require approximately 20,000 gas.

- Transfer internally has a fixed limit of 2300 gas, aimed at preventing recipients from executing too much logic and reducing reentrancy attack risks.

- `call{value: amount}("")` allows custom gas limits to bypass the 2300 gas restriction.

- When `selfdestruct()` sends ETH, this transfer is completed at a lower level of the EVM (Ethereum Virtual Machine) and does not trigger the target address's `receive()` function.

| Transfer Method | Description | Gas Limit |
| :------: | :------: | :------: |
| `transfer` | Safe transfer, automatically reverts on failure | 2300 gas |
| `send` | Returns true/false, does not automatically revert | 2300 gas |
| `call` | High flexibility, customizable gas limit | No fixed limit |

## Others:

 - You can add to hardhat.config.cjs: require("@nomicfoundation/hardhat-ethers");

 - This allows VSCode to query all function definitions within the hardhat-ethers package