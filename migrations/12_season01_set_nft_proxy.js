const nftProxy = artifacts.require('nft_proxy');

module.exports = async (deployer, network, accounts) => {

    const fa2Address = require(`../deployments/${network}/season1_fa2.js`);
    const nftProxyK = await nftProxy.deployed();

    await nftProxyK.setNft(1000, fa2Address, 31991, 109);

};
