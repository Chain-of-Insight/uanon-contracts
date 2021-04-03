const TezosToolkit = require('@taquito/taquito').TezosToolkit;
const importKey = require('@taquito/signer').importKey;

module.exports = async (deployer, network, accounts) => {

  const config = require(`../truffle-config.js`).networks[network];
  const Tezos = new TezosToolkit(config.host);

  await importKey(Tezos, config.secretKey);

  const rewardProxyAddress = require(`../deployments/${network}/reward_proxy.js`);
  const rewardProxy = await Tezos.contract.at(rewardProxyAddress);

  const tx1 =  await rewardProxy.methods
    .addDeposit(1, 106)
    .send({ amount: (network == "mainnet") ? 577 : 20 });
  await tx1.confirmation();

  const tx2 =  await rewardProxy.methods
    .addDeposit(1, 109)
    .send({ amount: (network == "mainnet") ? 2100 : 247 });
  await tx2.confirmation();
};
