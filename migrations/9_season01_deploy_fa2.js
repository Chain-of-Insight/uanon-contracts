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
            "name": "Project Uanon Season 1 Truth Shards",
            "description": `Things we've done to this chile
Can never be doneun
Blueprints of your hard
A map of what would come
We tied you see the welt
Keeping the Dark out
Inviting you to Hell
We gave you maps of it,
But somewhere just outside the fog—
A desert with dead trees, and
Bitter cold black piercing stars
A safe place you could sleep

Somehow you could weigh
The weight of what you knew
A mathematical equation
A Heaven just for U
We Tied you to see the World
In shades of soft Black Night
The Darkest purpose of them all—
A machine to destroy Light
But you have found a seam
A fissure not yet Real
Wehere you went to Lie below
The skies and concrete spring fields

bit.ly/3sto0Oa
577H7FH7+P9
U.`,
            "interfaces": ["TZIP-012", "TZIP-016", "TZIP-021"]
        })).toString("hex")
    })
};

module.exports = async (deployer, network, accounts) => {

    const nftProxyK = await nftProxy.deployed();

    initial_storage.admin.admin = [accounts[0], nftProxyK.address];

    await deployer.deploy(fa2, initial_storage);

    const fa2K = await fa2.deployed();
    saveContractAddress('season1_fa2', fa2K.address, network);
};
