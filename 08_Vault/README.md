# 08_Vault Project

## Challenge: Ethernaut CTF Level 8 - Vault

- **Victory condition**: Open the vault
- **Knowledge required**: Public and private properties of variable declarations, bytes32 type variables, storage slots

## Solution Strategy:

1. The `private` keyword for private variables does not mean complete secrecy. Variables stored on the blockchain are completely public

2. You can query variable contents by investigating storage slot positions and getStorage()

3. Looking at the contract's variable declaration order, the first declared variable `locked` will be placed in slot0, and the `password` variable will be placed in slot1

4. Call hre.ethers.provider.getStorage() to query

5. Note that getStorage() was formerly called getStorageAt() which has now been removed

6. For more function usage instructions for ethers.js, refer to the official ethers.js [GitHub repository](https://github.com/ethers-io/ethers.js/blob/main/src.ts/providers/provider.ts)

## Solidity Supplement:

- `private` only means that during programming, other external contracts are not allowed to call it. It does not equal secrecy - if you want secrecy, you need to use cryptography.