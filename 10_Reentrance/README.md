# 10_Reentrance Project

## Challenge: Ethernaut CTF Level 10 - Reentrance

- **Victory condition**: Withdraw all tokens from the contract
- **Knowledge required**: Reentrancy attacks, Fallback, single-threaded execution of contract functions

## Solution Strategy:

1. Use an external contract to call donate() to update state.

2. In the external contract's receive() function, call withdraw() again to trigger a reentrancy attack

3. When the external contract calls withdraw() to trigger withdrawal, before Reentrance updates the balance state, the external contract's receive() function is triggered, calling withdraw() again to trigger a reentrancy attack and withdraw again

## Reentrancy Attack Protection:

```solidity
function withdraw(uint256 _amount) public {
    if (balances[msg.sender] >= _amount) {
        (bool result,) = msg.sender.call{value: _amount}("");
        if (result) {
            _amount;
        }
        balances[msg.sender] -= _amount;
    }
}
```

### 1. Change state before executing withdrawal logic:

```solidity
function withdraw(uint256 _amount) public {
    if (balances[msg.sender] >= _amount) {
        balances[msg.sender] -= _amount;
        (bool result,) = msg.sender.call{value: _amount}("");
        if (result) {
            _amount;
        }
    }
}
```

### 2. Reentrancy protection lock:

```solidity
bool private  _locked = false;

function withdraw(uint256 _amount) public {
    require(_locked == false, "Reentrancy attack detected");
    _locked = true;
    if (balances[msg.sender] >= _amount) {
        balances[msg.sender] -= _amount;
        (bool result,) = msg.sender.call{value: _amount}("");
        if (result) {
            _amount;
        }
    }
    _locked = false;
}
```

### 3. Use OpenZeppelin's ReentrancyGuard library:

https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol