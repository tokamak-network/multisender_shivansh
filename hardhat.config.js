require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("@nomicfoundation/hardhat-verify")
require("hardhat-contract-sizer")
require("@nomicfoundation/hardhat-verify")
require("hardhat-gas-reporter")
require("@openzeppelin/hardhat-upgrades")
require("@nomicfoundation/hardhat-chai-matchers")
require("dotenv").config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
  // accountsBalance: "990000000000000000000",
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    dev: {
      default: 1,
    },
    proxyAdminOwner: {
      default: 0,
    }
  },
  networks: {
    hardhat: {
      hardfork: "london",
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      evmVersion: "byzantium",
      forking: {
        url: `https://rpc.titan-sepolia.tokamak.network`,
        enabled: true,
        saveDeployments: true,
        blockNumber: 850
      },
      gasPrice: "auto",
      accounts,

    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts,
      chainId: 1,
      live: false,
      saveDeployments: true,
    },
    'sepolia-titan': {
      url: `https://rpc.titan-sepolia.tokamak.network`,
      chainId: 55007,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      live: true,
      saveDeployments: true,
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
    customChains: [
      {
        network: "sepolia-titan",
        chainId: 55007,
        urls: {
          apiURL: "https://explorer.titan-sepolia.tokamak.network/",
          browserURL:"https://explorer.titan-sepolia.tokamak.network/",
        },
      },
    ],
  },
  paths: {
    deploy: "deploy",
    deployments: "deployments",
    sources: "contracts",
    tests: "test",
  },
  mocha: {
    timeout: 300000,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: true
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
