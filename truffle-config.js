const { mnemonic, secret, password, email } = require("./faucet.json");
const { alice } = require('./scripts/sandbox/accounts');
module.exports = {
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  contracts_directory: "./contracts/main",
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos"
    },
    testnet: {
      host: "https://testnet-tezos.giganode.io",
      network_id: "*",
      secret,
      mnemonic,
      password,
      email,
      type: "tezos"
    },
    edonet: {
      host: "https://edonet-tezos.giganode.io",
      network_id: "*",
      secret,
      mnemonic,
      password,
      email,
      type: "tezos"
    },
  },
  compilers: {
      ligo: {
          version: "next"
      }
  }
};

