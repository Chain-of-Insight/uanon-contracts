const Migrations = artifacts.require("Migrations");
const saveContractAddress = require('./../helpers/saveContractAddress');

module.exports = async(deployer, _network, accounts)  => {
    deployer.deploy(Migrations, { last_completed_migration: 0, owner: accounts[0] })
        .then(contract => saveContractAddress('migrations', contract.address));
};
