import { ethers } from "hardhat";

async function main (){
  const PurposeToken = await ethers.getContractFactory("PurposeToken");
  const purposeToken = await PurposeToken.deploy()

  console.log("Token successfully deployed at ", purposeToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })