const nftProxy = artifacts.require('nft_proxy');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    roles: {
        owner: '',
        minter: [ ]
    },
    nfts: MichelsonMap.fromLiteral({})
};

module.exports = async (deployer, network, accounts) => {
    initial_storage.roles.owner = accounts[0];

    await deployer.deploy(nftProxy, initial_storage);

    const contract = await nftProxy.deployed();
    saveContractAddress('nft_proxy', contract.address, network);
};
