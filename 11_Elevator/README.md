# 11_Elevator Project

## Challenge: Ethernaut CTF Level 11 - Elevator

- **Victory condition**: Reach the top floor of the elevator
- **Knowledge required**: Gas calculation, gasleft(), view, changing contract state

## Solution Strategy:

1. Use an external contract to override isLastFloor(uint256 _floor)

2. Change the external contract state based on the number of times isLastFloor() is called within the elevator's goTo() function, making each call return a different bool value.

3. Another approach is to use gasleft() to precisely calculate the remaining gas and trigger different bool return values when conditions are met.

## Solidity:

```solidity
// Don't trust that calling external contract functions results in 1-1 and onto mappings
    if (!building.isLastFloor(_floor)) {
        floor = _floor;
        top = building.isLastFloor(floor);
    }
```

1. Don't trust that calling external contract functions results in 1-1 and onto mappings