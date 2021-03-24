const { alice } = require('./scripts/sandbox/accounts');
const { uanon } = require('./accounts');

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
      host: "https://edonet.smartpy.io",
      network_id: "*",
      secretKey: uanon.sk,
      type: "tezos"
    },
    mainnet: {
      host: "https://mainnet-tezos.giganode.io",
      network_id: "*",
      secretKey: uanon.sk,
      type: "tezos"
    },
  },
  compilers: {
      ligo: {
          version: "next"
      }
  }
};
