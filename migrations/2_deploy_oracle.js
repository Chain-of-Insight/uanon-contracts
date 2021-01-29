const oracle = artifacts.require('oracle');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    paused: false,
    roles: {
        owner: '',
        author: [ ]
    },
    rewardProxy: '',
    puzzles: MichelsonMap.fromLiteral({})
};

module.exports = async (deployer, network, accounts) => {

    initial_storage.roles.owner = accounts[0];
    initial_storage.roles.author = [ accounts[0] ];
    initial_storage.rewardProxy = accounts[0];

    // TODO format to await instead of .then
    deployer.deploy(oracle, initial_storage)
        .then(contract => saveContractAddress('oracle', contract.address, network));

};
