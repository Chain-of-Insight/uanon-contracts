const rewardProxy = artifacts.require('reward_proxy');
const oracle = artifacts.require('oracle');
const nftProxy = artifacts.require('nft_proxy');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    trustedContracts: [],
    contractOwner: "",
    contractOracle: "",
    contractNft: "",
    deposits: MichelsonMap.fromLiteral({})
};

module.exports = async (deployer, network, accounts) => {

    const nftProxyK = await nftProxy.deployed();
    const oracleK = await oracle.deployed();

    initial_storage.contractOwner = accounts[0];
    initial_storage.trustedContracts = [ nftProxyK.address, oracleK.address ];
    initial_storage.contractOracle = oracleK.address;
    initial_storage.contractNft = nftProxyK.address;

    await deployer.deploy(rewardProxy, initial_storage);

    const rewardProxyK = await rewardProxy.deployed();
    saveContractAddress('reward_proxy', rewardProxyK.address);
};
