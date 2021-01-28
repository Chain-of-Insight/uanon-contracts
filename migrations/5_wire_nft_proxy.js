const rewardProxy = artifacts.require('reward_proxy');
const nftProxy = artifacts.require('nft_proxy');

module.exports = async (deployer, network, accounts) => {

    const nftProxyK = await nftProxy.deployed();
    const rewardProxyK = await rewardProxy.deployed();

    await nftProxyK.addMinter(rewardProxyK.address);
};
