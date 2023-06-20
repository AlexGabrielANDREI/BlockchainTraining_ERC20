const {
  frontEndContractsFile,
  frontEndAbiFile,
} = require("../helper-hardhat-config");
const fs = require("fs");
const { ethers, network } = require("hardhat");

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...");
    await updateContractAddresses();
    await updateAbi();
    console.log("Front end written!");
  }
};

async function updateAbi() {
  const tokenERC20 = await ethers.getContract("Token");
  fs.writeFileSync(
    frontEndAbiFile,
    tokenERC20.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const tokenERC20 = await ethers.getContract("Token");
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  if (network.config.chainId.toString() in contractAddresses) {
    if (
      !contractAddresses[network.config.chainId.toString()].includes(
        tokenERC20.address
      )
    ) {
      contractAddresses[network.config.chainId.toString()].push(
        tokenERC20.address
      );
    }
  } else {
    contractAddresses[network.config.chainId.toString()] = [tokenERC20.address];
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}
module.exports.tags = ["all", "frontend"];
