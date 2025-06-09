# Ethernaut Level Solutions

這是一個針對 [Ethernaut CTF](https://ethernaut.openzeppelin.com/) 的解題專案，包含每個關卡的解答、解題思路以及相關的 Solidity 知識補充。Ethernaut 是由 OpenZeppelin 提供的智能合約安全挑戰平台，旨在幫助開發者學習和理解智能合約的漏洞與攻擊手法。

## 專案結構

專案目錄按照關卡順序進行劃分，每個目錄對應一個關卡，包含以下內容：

- **README.md**：每個關卡的解題思路、知識補充以及挑戰過程的詳細說明。
- **contracts/**：關卡中涉及的智能合約，包括原始合約和攻擊合約。
- **scripts/**：與合約互動的腳本，用於部署、攻擊或驗證解題結果。
- **hardhat.config.ts**：Hardhat 的配置檔案，包含網路設定與編譯器版本。
- **package.json**：專案的依賴管理檔案。

## 關卡列表

以下是目前已完成的關卡及其簡要說明：

0. **00_HelloEthernaut**：介紹 Ethernaut 平台的基本操作。
1. **01_Fallback**：學習 Fallback 函數的特性，並奪取合約所有權。
2. **02_Fallout**：理解建構子的命名規則，並成為合約的所有者。
3. **03_CoinFlip**：利用區塊哈希值預測硬幣結果，連續猜中 10 次。
4. **04_Telephone**：利用 `tx.origin` 與 `msg.sender` 的差異奪取所有權。
5. **05_Token**：觸發下溢漏洞，增加自己的代幣餘額。
6. **06_Delegation**：利用 `delegatecall` 攻擊，奪取合約所有權。
7. **07_Force**：使用 `selfdestruct` 強制將 ETH 傳送到目標合約。
8. **08_Vault**：透過存儲槽（storage slot）讀取私有變數，解鎖金庫。
9. **09_King**：成為國王並阻止其他人奪取國王位置。
10. **10_Reentrance**：發動重入攻擊，提領合約的所有資金。
11. **11_Elevator**：利用外部合約覆寫邏輯，到達電梯頂樓。
12. **12_Privacy**：透過存儲槽讀取敏感資料，解鎖隱私合約。
13. **13_GatekeeperOne**：跨越3個障礙，需精算```gasleft()```與熟悉資料型別轉換。
14. **14_GatekeeperTwo**：跨越3個障礙，需理解```extcodesize(caller())```性質，以及熟悉XOR運算子。
15. **15-naught-coin**：理解 ERC20 的 `approve()` 與 `transferFrom()` 將代幣轉移出去。
16. **16-preservation**：利用 `delegatecall` 覆寫 Library 的參考地址。
17. **17-recovery**：從合約生成工廠的合約中，找出被部屬的合約地址。
18. **18-magic-number**：使用原始的底層 EVM opcodes 來創建微型合約。
19. **19-alien-codex**：利用動態陣列溢出和存儲槽(storage slot)佈局，覆蓋合約的所有者變數。
20. **20-denial**：透過消耗所有 gas 進行拒絕服務攻擊，阻止合約所有者提領資金。
21. **21-shop**：利用外部合約的狀態變化，在同一個交易中返回不同的價格值。
22. **22-dex**：透過價格操縱攻擊，利用去中心化交易所流動性池的不平衡來榨乾代幣。

## 使用方式

1. 安裝依賴：
```bash
npm install
```

2. 編譯合約：
 ```bash
npx hardhat compile
```

3. 部屬合約：
```bash
npx hardhat run scripts/deploy_<script_name>.js --network <network_name>
```

4. 執行互動腳本：
```bash
npx hardhat run scripts/<script_name>.js --network <network_name>
```

## 環境需求

- Node.js 16+
- Hardhat
- Solidity 0.8.x
- Optimism Sepolia 測試網路（或其他支持的測試網）

## 聯繫方式

如果你對此專案有任何建議或問題，歡迎聯繫我！

#

Ethernaut 是學習智能合約安全的絕佳平台，透過這些挑戰，你將能更深入地理解智能合約的漏洞與防禦技巧。希望這些解答能幫助你更快地掌握相關知識！