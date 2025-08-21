# Ethernaut #19 - Recovery

This is the solution for the "Recovery" challenge, Level 19 in the Ethernaut game.

## Challenge Description

In this level, we need to recover a lost contract address. Someone used the `Recovery` contract to create a `SimpleToken` token and sent some ether to it, but forgot the contract address. We need to find this contract and recover the funds from it.

## Strategy Points

### Core Problem
1. Find the lost `SimpleToken` contract address
2. Use the `destroy` function in the contract to recover the funds

### Solution Approach

#### 1. Finding the Contract Address
Contract addresses on Ethereum are deterministic, calculated from the creator address and nonce. When a contract creates another contract, the new contract's address is determined by the creating contract's address and its nonce.

Contract address calculation formula:
```
address = rightmost_20_bytes(keccak256(RLP(creator_address, creator_nonce)))
```

For the `SimpleToken` contract, it was created by the `Recovery` contract through the `generateToken` function, so we can calculate the `SimpleToken` address based on the `Recovery` contract address and nonce.

#### 2. Execute destroy Function
Once the `SimpleToken` address is found, we can call its `destroy` function, which uses `selfdestruct` to send all funds in the contract to a specified address.

```solidity
function destroy(address payable _to) public {
    selfdestruct(_to);
}
```

### Implementation Steps
1. Use the `scripts/interact.ts` script, providing the correct `SimpleToken` address
2. Call the `destroy` function to transfer funds to our address
3. Verify that the `SimpleToken` contract balance is 0, indicating successful attack

## Learning Insights
1. Contract addresses are deterministic and can be calculated from creator address and nonce
2. `selfdestruct` operation destroys the contract and sends funds to a specified address
3. Even if the contract address is forgotten, the contract can still be found as long as the creation transaction is known

## Prevention Measures
1. Don't rely on `selfdestruct` as a feature in contracts unless absolutely necessary
2. Add appropriate access controls for critical operations
3. Properly manage contract addresses and related information to avoid loss
