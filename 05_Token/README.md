# 05_Token Project

## Challenge: Ethernaut CTF Level 5 - Token

- **Victory condition**: Increase the initial token amount obtained through vulnerabilities
- **Knowledge required**: Overflow, odometer.

## Solution Strategy:

1. Send more tokens than your initial amount to another address, triggering an underflow in my balance

## Solidity Supplement:

- After Solidity 0.8.0, when declaring constructors, you don't need to use the `public` keyword.

---

- Before Solidity 0.8.0, handling overflow issues required great care. For example, a `uint8` variable that exceeds the maximum value of 255 would overflow starting from 256 and wrap back to 0 (wrapping back to minimum). Underflow would wrap back to the maximum value.

- Before Solidity 0.8.0, arithmetic operations that caused overflow or underflow would not throw errors. It was recommended to use OpenZeppelin's SafeMath library.

- After Solidity 0.8.0, by default, arithmetic operations that cause overflow or underflow will automatically throw errors. This means you no longer need to manually use the SafeMath library to prevent overflow and underflow. If overflow or underflow occurs, the transaction will be reverted and an exception will be thrown.