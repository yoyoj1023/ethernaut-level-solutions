# 02_Fallout Project

## Challenge: Ethernaut CTF Level 2 - Fallout

 - **Victory condition**: Become the contract owner
 - **Knowledge required**: Constructor

## Solution Strategy:

1. Look closely, directly calling `Fal1out()` will make you the owner

## Solidity Syntax Supplement: About `view`

```solidity
function allocatorBalance(address allocator) public view returns (uint256) {
        return allocations[allocator];
    }
```

`view` is used to declare that a function will not modify the contract's state variables and cannot emit events - it can only be a read-only function.

### Usage:

1. **No State Modification**: `view` functions guarantee they will not change any state variables of the contract. This is very important for reading contract data without affecting its state.

2. **Gas Consumption**: Calling `view` functions typically does not consume gas, unless they are called from another contract function that requires gas consumption. This is because they can be executed on local nodes without needing to execute transactions on the blockchain.

3. **Declaration Method**: You can use the `view` keyword in function declarations, for example: `function getData() public view returns (uint) { ... }`.

4. **Restrictions**: `view` functions cannot call any non-`view` or `pure` functions, as those functions might modify state.

5. **Use Cases**: Common use cases include:

    - Reading state variable values.
    - Performing calculations and returning results without changing contract state.
    - Querying certain properties of the contract.