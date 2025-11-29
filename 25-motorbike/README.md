# Ethernaut Motorbike Challenge

This is a solution for the Ethernaut Motorbike challenge, using Hardhat 3 Beta and the viem library.

## Challenge Overview

Motorbike is a UUPS (Universal Upgradeable Proxy Standard) proxy contract challenge. The goal is to destroy the logic contract (Engine).

## Attack Strategy

1. **Discover Logic Contract Address**: Find the logic contract address by reading the EIP-1967 implementation slot from the proxy contract
2. **Initialize Logic Contract**: Directly call the `initialize()` function of the logic contract to become the `upgrader`
3. **Deploy Malicious Contract**: Deploy a `MaliciousEngine` contract containing a `destroy()` function
4. **Execute Upgrade and Self-Destruct**: Directly call `upgradeToAndCall()` on the logic contract to upgrade to `MaliciousEngine` and execute `destroy()`

## Important Discovery: Impact of EIP-6780

### Problem Description

After executing the attack, although the transaction succeeded and `selfdestruct` was called, the logic contract's code was not permanently deleted. The blockchain explorer shows:
- "Contract Self Destruct called" - Confirms `selfdestruct` was executed
- "Contract Self Destructed, but was later reinitalized with new Bytecode" - Contract was reinitialized

### Changes in EIP-6780 (Cancun Hard Fork)

Starting from the Cancun hard fork, the behavior of the `selfdestruct` opcode fundamentally changed:

> "starting from the Cancun hard fork, the underlying opcode no longer deletes the code and data associated with an account and only transfers its Ether to the beneficiary, **unless executed in the same transaction in which the contract was created**"

**Behavior After Cancun:**
- ❌ `selfdestruct` **does not delete contract code** (unless executed in the same transaction in which the contract was created)
- ✅ Only transfers ETH balance to the beneficiary
- ✅ Contract code still exists on the blockchain

### Impact

1. **Attack Logic is Correct**: The attack logic of executing `selfdestruct` through `delegatecall` is correct
2. **Limited Practical Effect**: Due to EIP-6780, contract code cannot be permanently deleted
3. **Challenge Completion Status**: May show as failed on the Ethernaut platform because the contract code still exists

### Technical Details

- **Execution Flow**:
  1. Directly call `upgradeToAndCall()` on `ENGINE_ADDRESS`
  2. `_upgradeToAndCall()` first updates the storage slot, then calls `MaliciousEngine.destroy()` through `delegatecall`
  3. `selfdestruct` executes in the context of `ENGINE_ADDRESS`
  4. Due to EIP-6780, the code is not deleted

- **In Older EVM Versions**: This attack would successfully delete the contract code
- **After Cancun**: The attack logic is correct, but cannot achieve the effect of permanently deleting code

## Project Structure

```
162-ethernaut-motorbike/
├── contracts/
│   ├── Motorbike.sol          # Proxy contract and logic contract
│   ├── MaliciousEngine.sol    # Malicious contract containing destroy() function
│   ├── Initializable.sol     # Initialization protection
│   └── Address.sol           # Address utility functions
├── scripts/
│   └── interact.ts            # Attack script
├── ignition/
│   └── modules/
│       └── MaliciousEngine.ts # Deployment script
└── README.md
```

## Usage

### Deploy MaliciousEngine Contract

```shell
npx hardhat ignition deploy ignition/modules/MaliciousEngine.ts --network optimismSepolia
```

### Execute Attack Script

```shell
npx hardhat run scripts/interact.ts --network optimismSepolia
```

### Environment Variables Configuration

Ensure the `.env` file contains:
- `OP_SEPOLIA_RPC_URL_API_KEY` - Optimism Sepolia RPC URL
- `PRIVATE_KEY` - Private key for sending transactions

## Contract Addresses

- **Proxy Contract (Motorbike)**: `0x34D6eF31626fc904d4aE134C79F36aF3693d5473`
- **Logic Contract (Engine)**: `0xade0bdEcA29eA8Ae377ea5052390c37A2e979DD0`
- **MaliciousEngine**: Update the address in `scripts/interact.ts` after deployment

## References

- [EIP-6780: SELFDESTRUCT only in same transaction](https://eips.ethereum.org/EIPS/eip-6780)
- [EIP-1967: Proxy Storage Slots](https://eips.ethereum.org/EIPS/eip-1967)
- [UUPS Proxies](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#uups-proxies)

## Notes

⚠️ **Important**: Due to the impact of EIP-6780, this attack cannot achieve the effect of permanently deleting contract code on networks after the Cancun hard fork (including Optimism Sepolia). The attack logic itself is correct, but is limited by the EVM upgrade.

---

## 原始項目說明

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```
