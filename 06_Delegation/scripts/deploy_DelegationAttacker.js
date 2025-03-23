import hre from "hardhat";

async function main() {
    const DelegationAttacker = await hre.ethers.getContractFactory("DelegationAttacker");
    console.log("Deploying DelegationAttacker...");

    const delegationAttacker = await DelegationAttacker.deploy("0x1EAe7F62176A46Aef87595aFce9Fd33F6E26507c");
    await delegationAttacker.waitForDeployment();
    console.log("DelegationAttacker deployed to:", await delegationAttacker.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});