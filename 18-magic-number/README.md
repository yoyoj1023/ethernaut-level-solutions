# Ethernaut Challenge - Magic Number Solution Guide

## Challenge Objective

This challenge requires us to create a tiny contract (Solver) that returns the number 42 when calling the `whatIsTheMeaningOfLife()` function, and the contract size must not exceed 10 opcodes.

## Key Solution Points

1. **Understanding Low-Level EVM Operations**: This challenge requires us to deeply understand the low-level operating principles of the EVM (Ethereum Virtual Machine), and we must use raw EVM bytecode to create contracts rather than using Solidity or other high-level languages.
2. **Contract Creation Bytecode**: We need to understand the two main parts of the contract creation process:
   - Initialization code: Used for execution during contract deployment
   - Runtime code: Actually stored on the blockchain and responds to function calls

## Solution Steps

### 1. Analyze the MagicNum Contract

```solidity
contract MagicNum {
    address public solver;

    function setSolver(address _solver) public {
        solver = _solver;
    }
}
```

This contract has only one function: storing the solver contract address. We need to create a tiny contract that can return 42 and set its address as the solver.

### 2. Write Runtime Bytecode

Operations the runtime code needs to complete:
- Put the value 42 (hexadecimal 0x2a) on the stack
- Store this value in memory
- Return the value from memory

Corresponding opcodes:
```
PUSH1 0x2a  // Push 42 onto the stack
PUSH1 0x00  // Push 0 onto the stack
MSTORE      // Store 42 at memory position 0
PUSH1 0x20  // Push 32 (hexadecimal 0x20) onto the stack (32-byte data length)
PUSH1 0x00  // Push 0 onto the stack (memory start position)
RETURN      // Return 32 bytes of data starting from position 0
```

Converted to bytecode: `602a60005260206000f3` (total 10 bytes, exactly meeting the requirement)

### 3. Write Initialization Bytecode

The initialization code needs to perform the following operations:
- Copy the runtime code to memory
- Return the runtime code to the EVM

Corresponding opcodes:
```
PUSH10 0x602a60005260206000f3  // Push runtime code onto the stack
PUSH1 0x00                     // Push 0 onto the stack
MSTORE                         // Store runtime code at memory position 0
PUSH1 0x0a                     // Push 10 onto the stack (length of runtime code)
PUSH1 0x16                     // Push 22 onto the stack (start position of runtime code in memory)
RETURN                         // Return runtime code
```

Complete deployment bytecode: `69602a60005260206000f3600052600a6016f3`

### 4. Deploy Contract

Deploy contract using Web3.js:

```javascript
const tx = await web3.eth.sendTransaction({
    from: player,
    data: '0x69602a60005260206000f3600052600a6016f3'
});

const solverAddress = tx.contractAddress;
```

### 5. Set Solver

```javascript
await contract.setSolver(solverAddress);
```

## Solution Insights

This challenge gave me a deep understanding of the EVM's low-level operating mechanisms, particularly the contract deployment process and how opcodes are converted to bytecode. This understanding is very useful for optimizing smart contracts or conducting security audits. In Web3 development, even though we mostly use high-level languages like Solidity, understanding the underlying principles helps write more efficient and secure code.

## 參考資源

- [EVM Opcodes 參考](https://www.evm.codes/)
- [Ethereum 黃皮書](https://ethereum.github.io/yellowpaper/paper.pdf)
- [Understanding Ethereum Smart Contract Storage](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/)
