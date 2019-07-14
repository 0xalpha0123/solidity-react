const path = require("path");
const fs = require('fs');
const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config()

const MNEMONIC = process.env.MNEMONIC;
if (!MNEMONIC) {
  console.warn("If you want to deploy on ropsten, please set 'MNEMONIC' environment variable inside .env")
}

const APIKEY = process.env.INFURA_KEY;
if (!APIKEY) {
  console.warn("If you want to deploy on ropsten, please set 'INFURA_KEY' environment variable inside .env")
}

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${APIKEY}`)
      },
      network_id: 3
    }
  }
};
