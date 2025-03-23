import hre from "hardhat";

async function main() {
    const Delegate = await hre.ethers.getContractFactory("Delegate");
    console.log("Deploying Delegate...");

    const delegate = await Delegate.deploy("0xdb4101e7f5E2cC0e1A749092ff5287e3d36A5df6");
    await delegate.waitForDeployment();
    console.log("Delegate deployed to:", await delegate.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});