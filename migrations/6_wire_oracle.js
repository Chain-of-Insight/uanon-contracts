const rewardProxy = artifacts.require('reward_proxy');
const oracle = artifacts.require('oracle');

module.exports = async (deployer, network, accounts) => {

    const oracleK = await oracle.deployed();
    const rewardProxyK = await rewardProxy.deployed();

    await oracleK.setProxy(rewardProxyK.address);
};
