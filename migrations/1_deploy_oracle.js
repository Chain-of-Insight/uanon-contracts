const oracle = artifacts.require('oracle');
const { alice } = require('./../scripts/sandbox/accounts');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    paused: false,
    roles: {
        owner: 'tz1codeYURj5z49HKX9zmLHms2vJN2qDjrtt',
        author: [ 'tz1codeYURj5z49HKX9zmLHms2vJN2qDjrtt' ]
    },
    rewardProxy: 'tz1codeYURj5z49HKX9zmLHms2vJN2qDjrtt',
    puzzles: MichelsonMap.fromLiteral({})
};

module.exports = async (deployer, network, accounts) => {

    // TODO format to await instead of .then
    deployer.deploy(oracle, initial_storage)
        .then(contract => saveContractAddress('oracle', contract.address));

};
module.exports.initial_storage = initial_storage;
