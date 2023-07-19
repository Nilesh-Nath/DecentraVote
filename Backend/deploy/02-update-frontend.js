const fs = require("fs");
const { ethers, network } = require("hardhat");
const { abiPath, addressPath } = require("../helper.config.js");

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating Frontend....");
    await updateAddress();
  }
};

async function updateAddress() {
  const decentraVote = await ethers.getContract("DecentraVote");

  const currentAddress = JSON.parse(fs.readFileSync(addressPath, "utf-8"));

  if (network.config.chainId.toString() in currentAddress) {
    if (
      !currentAddress[network.config.chainId.toString()].includes(
        await decentraVote.getAddress()
      )
    ) {
      currentAddress[network.config.chainId.toString()].push(
        await decentraVote.getAddress()
      );
    }
  } else {
    currentAddress[network.config.chainId.toString()] = [
      await decentraVote.getAddress(),
    ];
  }

  fs.writeFileSync(addressPath, JSON.stringify(currentAddress));
}

module.exports.tags = ["all", "frontend"];
