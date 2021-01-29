const fa2 = artifacts.require('fa2_multi_asset');
const nftProxy = artifacts.require('nft_proxy');
const { MichelsonMap } = require('@taquito/taquito');
const saveContractAddress = require('./../helpers/saveContractAddress');

const initial_storage = {
    admin: {
        admin: "",
        pending_admin: null,
        paused: false
    },
    assets: {
        ledger: MichelsonMap.fromLiteral({}),
        operators: MichelsonMap.fromLiteral({}),
        token_total_supply: MichelsonMap.fromLiteral({}),
        token_metadata: MichelsonMap.fromLiteral({})
    },
    metadata: MichelsonMap.fromLiteral({
        "": Buffer.from("tezos-storage:content").toString("hex"),
        "content": Buffer.from(JSON.stringify({
            "name": "Project Uanon Season 0 Truth Shards",
            "description": "Tokens for solving Season 0 of Project Uanon",
            "interfaces": ["TZIP-012", "TZIP-016", "TZIP-021"]
        })).toString("hex")
    })
};

module.exports = async (deployer, network, accounts) => {

    const nftProxyK = await nftProxy.deployed();

    initial_storage.admin.admin = [accounts[0], nftProxyK.address];

    await deployer.deploy(fa2, initial_storage);

    const fa2K = await fa2.deployed();
    saveContractAddress('season0_fa2', fa2K.address, network);
};
