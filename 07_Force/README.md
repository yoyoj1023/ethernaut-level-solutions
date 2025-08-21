# 07_Force Project

## Challenge: Ethernaut CTF Level 7 - Force

- **Victory condition**: Make the contract balance greater than 0
- **Knowledge required**: Fallback, selfdestruct(), payable

## Solution Strategy:

1. Use the self-destruct function selfdestruct() to forcibly send money to the specified target contract address, even if the target contract does not define receive()

## Solidity Supplement:

- Currently selfdestruct() has been deprecated. It is not recommended for use in new contract deployments.

- After the Cancun upgrade, the underlying bytecode no longer deletes code and data associated with accounts. It only transfers its ether to the beneficiary.

- For more detailed explanations, please refer to EIP-6780
