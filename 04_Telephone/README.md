# 04_Telephone Project

## Challenge: Ethernaut CTF Level 4 - Telephone

 - **Victory condition**: Gain contract ownership
 - **Knowledge required**: Solidity global variables, Solidity interfaces and type casting and techniques for calling external contract functions

## Solution Strategy:

1. Understand the difference between `tx.origin` and `msg.sender`. Prepare a contract to interact with this contract
2. Write a TelephoneCaller contract to call Telephone's changeOwner()

## Introduction to Common Solidity Global Variables:

### Block and Transaction Properties:
- blockhash(uint blockNumber) returns (bytes32): Hash of the specified block, only applies to the 256 most recent blocks, excluding the current block. Returns 0 if the requested block number is outside this range.
- block.chainid returns (uint): ID of the current chain.
- block.coinbase returns (address payable): Address of the current block miner.
- block.difficulty returns (uint): Difficulty of the current block.
- block.gaslimit returns (uint): Gas limit of the current block.
- block.number returns (uint): Block number of the current block.
- block.timestamp returns (uint): Timestamp of the current block, represented as seconds since Unix epoch (1970-01-01 00:00:00 UTC).
- gasleft() returns (uint256): Remaining gas.
- msg.data returns (bytes): Complete calldata.
- msg.sender returns (address payable): Address of the transaction sender.
- msg.sig returns (bytes4): First four bytes of calldata (function identifier).
- msg.value returns (uint): Amount of wei sent with the transaction.
- tx.gasprice returns (uint): Gas price of the transaction.
- tx.origin returns (address payable): Original sender address of the transaction (starting point of the complete call chain).

### Contract Related:
 - this returns (address): Address of the current contract.
 - selfdestruct(address payable recipient): Destroys the current contract and sends remaining ether to the specified address.

### Mathematical and Cryptographic Functions:
- abi.decode(bytes memory encodedData, (...)) returns (...): Decodes ABI-encoded data.
- abi.encode(...) returns (bytes): ABI encodes the given parameters.
- abi.encodePacked(...) returns (bytes): Performs tight packing encoding on the given parameters.
- abi.encodeWithSelector(bytes4 selector, ...) returns (bytes): ABI encodes the given parameters with function selector.
- abi.encodeWithSignature(string signature, ...) returns (bytes): ABI encodes the given parameters with function signature.
- bytes.concat(...) returns (bytes): Concatenates variable number of byte arrays into one byte array.
- string.concat(...) returns (string): Concatenates variable number of strings into one string.
- block.basefee returns (uint): Base fee of the current block (EIP-3198 and EIP-1559).
- block.prevrandao returns (uint): Random number provided by the beacon chain (EIP-4399).
- keccak256(bytes memory) returns (bytes32): Computes Keccak-256 hash of the input.
- ripemd160(bytes memory) returns (bytes20): Computes RIPEMD-160 hash of the input.
- sha256(bytes memory) returns (bytes32): Computes SHA-256 hash of the input.
- ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address): Recovers the address associated with the public key from elliptic curve signature.

### Others:
- assert(bool condition): Aborts execution and reverts state changes if condition is false. Used for checking internal errors.
- require(bool condition, string memory message): Aborts execution and reverts state changes if condition is false. Used for checking input or external component errors.
- revert(string memory message): Aborts execution and reverts state changes with error message.
- revert(): Aborts execution and reverts state changes.
- block.timestamp: Returns timestamp of the current block in Unix time (seconds elapsed since midnight January 1, 1970).
- type(T).name: Returns the string name of type T.
- type(T).creationCode: Returns the byte array of creation code for type T. Only applicable to contract types.
- type(T).runtimeCode: Returns the byte array of runtime code for type T. Only applicable to contract types.