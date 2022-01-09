require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

real_accounts = undefined;
if(process.env.DEPLOYER_KEY) {
  real_accounts = [process.env.DEPLOYER_KEY];
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      // Required for real DNS record tests
      initialDate: "2019-03-15T14:06:45.000+13:00",
      saveDeployments: false,
      tags: ["test", "use_root"],
    },
    localhost: {
      url: "http://127.0.0.1:9545",
      saveDeployments: false,
      tags: ["test", "use_root"],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "use_root"],
      chainId: 3,
      accounts: real_accounts,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "use_root"],
      chainId: 4,
      accounts: real_accounts,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ["test", "use_root"],
      chainId: 42,
      accounts: real_accounts,
    },
    fuse: {
      url: "https://rpc.fuse.io",
      tags: ["use_root"],
      chainId: 122,
      accounts: real_accounts,
      gasPrice: 1000000000,
    },
    spark: {
      url: "https://rpc.fusespark.io",
      tags: ["test", "use_root"],
      chainId: 123,
      accounts: real_accounts,
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  mocha: {
  },
  abiExporter: {
    path: './build/contracts',
    clear: true,
    flat: true,
    spacing: 2
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

