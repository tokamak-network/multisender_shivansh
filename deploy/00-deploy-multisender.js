// Defining bytecode and abi from original contract on mainnet to ensure bytecode matches and it produces the same pair code hash
const hre = require("hardhat");
require("dotenv").config()

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer, proxyAdminOwner } = await getNamedAccounts();
  const owner = deployer

  const Multisender = await deploy("Multisender", {
    from: deployer,
    contract: "Multisender",
    log: true,
    deterministicDeployment: false,
    proxy: {

      proxyContract: "OpenZeppelinTransparentProxy",
    },
  });

  console.log(`Multisender usdt deployed at ${Multisender.address}`);
};

module.exports.tags = ["Multisender"]

