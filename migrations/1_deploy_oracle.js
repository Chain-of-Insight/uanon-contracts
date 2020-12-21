const oracle = artifacts.require('oracle');
const { alice } = require('./../scripts/sandbox/accounts');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    paused: false,
    roles: {
        owner: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
        author: [ 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' ]
    },
    rewardProxy: 'KT1V4z3AyWh1CqDgAe9gEFnihaPo8mXxVJ4a',
    puzzles: MichelsonMap.fromLiteral({})
};

module.exports = async (deployer, network, accounts) => {

    // TODO format to await instead of .then
    deployer.deploy(oracle, initial_storage)
        .then(contract => saveContractAddress('oracle', contract.address));

};
module.exports.initial_storage = initial_storage;
