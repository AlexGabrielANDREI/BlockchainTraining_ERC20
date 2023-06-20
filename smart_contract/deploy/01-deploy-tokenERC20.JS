const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../helper-hardhat-config");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying SC TokenERC20 and waiting for confirmations...");
  const args = ["200", "Gabriel", "GBL"];
  const createTokenERC20 = await deploy("Token", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`SC TokenERC20 deployed at ${createTokenERC20.address}`);
  ///verifing contract
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(createTokenERC20.address, args);
  }
  log(
    "-------------------------------------------------------------------------------------------"
  );
};
