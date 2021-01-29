const nftProxy = artifacts.require('nft_proxy');
const fa2 = artifacts.require('fa2_multi_asset');

module.exports = async (deployer, network, accounts) => {

    const fa2Address = require(`../deployments/${network}/season0_fa2.js`);
    const nftProxyK = await nftProxy.deployed();

    await nftProxyK.setNft(1000, fa2Address, 70529, 6);

};
