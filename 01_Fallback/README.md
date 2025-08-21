# 01_Fallback Project

## Challenge: Ethernaut CTF Level 1 - Fallback

```
1. Victory conditions: Gain ownership of the contract and reduce the contract balance to zero
2. Key techniques: Send ether through ABI interaction, how to send ether outside of ABI
3. Knowledge required: Converting wei/ether units, fallback methods
```

## Solution and Insights:

### Execution Environment
```
1. Modified package.json configuration, added "type": "module" to convert to ES Module
2. Changed hardhat.config.cjs file extension because it uses CommonJS (CJS) syntax
3. Added timeout: 60000 in hardhat.config.cjs because contract interaction response times are always longer
4. Added OP_SEPOLIA_RPC_URL_API_KEY in hardhat.config.cjs because L2 testnets are faster
5. Ethernaut CTF supports OP Sepolia network, which is not only faster but also cheaper
6. Recommend using private test node RPC, as public networks like "https://sepolia.optimism.io" limit some features
7. Recommend using hardhat ethers.js to create instances, send, and call - it's concise, readable, and can bypass some limitations
```

### Attack Script: scripts/interct_hre_etherjs.js
```
1. The challenge contract Fallback.sol must first be compiled to get Fallback.json
2. Copy the abi tag description from Fallback.json and save it in the script for creating instances
```


## Solidity Syntax Explanation: payable

```
1. In Solidity, payable is a modifier used to indicate that functions or addresses can receive Ether.
2. payable can be applied in the following two scenarios:
```

### 1. Using on Functions

```solidity
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```

```
1. Here the payable modifier allows contribute() to receive Ether.
2. msg.value represents the amount of Ether sent by the caller (in wei units).
3. The function logic requires the sent Ether to be less than 0.001 ether and adds that amount to the contributions mapping.
```

```solidity
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```

```
1. receive() is a special function that is automatically triggered when a contract receives Ether without specifying a function to call.
In other words, if you directly send money to the contract address, it will trigger receive()
Conversely, calling contribute() to send money will not trigger it
This contract's contribute() is marked as payable

2. It is marked as external payable, indicating the contract can directly receive Ether (e.g., through pure transfer transactions).
3. The condition requires the sent Ether to be greater than 0, and the caller's contribution record must be greater than 0.
```

### 2. Using on Addresses

When an address is marked as payable, that address can receive Ether. This is typically used to send Ether from a contract to an address.

Example in the contract:
In the withdraw() function:

```solidity
function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
}
```

```
1. payable(owner) converts the owner address to payable type.
2. transfer() is a built-in function in Solidity for sending Ether, only payable type addresses can use it.
3. The logic here is to send the entire balance of this contract (address(this).balance) to the owner address.
```

### Importance of payable
```
1. Receiving Ether: If a function is not marked as payable, attempting to send Ether to it will cause the transaction to fail. For example, if contribute() removes payable, it cannot receive Ether.
2. Sending Ether: Only payable addresses can use methods like .transfer(), .send(), or .call() to send Ether.
3. Flexibility: payable provides the foundation for handling Ether transactions in contracts, especially in crowdfunding, payment, or transfer scenarios.
```