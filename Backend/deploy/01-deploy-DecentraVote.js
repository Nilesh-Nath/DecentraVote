const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { interval, nameOfElection } = require("../helper.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  const args = [nameOfElection, interval];

  log("Deploying....");
  const contract = await deploy("DecentraVote", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(contract.address, args);
  }
};

module.exports.tags = ["all"];
