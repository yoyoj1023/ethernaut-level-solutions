# 12_Privacy Project

## Challenge: Ethernaut CTF Level 12 - Privacy

- **Victory condition**: Unlock the lock
- **Knowledge required**: storageSlot, storage packing

## Solution Strategy:

1. Use getStorage to investigate slots, find the key, and then process the data

## Solidity:

```solidity
bytes32[3] private data;

function unlock(bytes16 _key) public {
        require(_key == bytes16(data[2]));
        locked = false;
    }
```

1. When type casting, Solidity uses right-side zero padding or right-side truncation to handle data