const fa2 = artifacts.require('fa2_multi_asset');
const { MichelsonMap } = require('@taquito/taquito');

const imageBaseUri = "ipfs://QmaZnLjcWphWYNft9NJVjnAJyinLvJFNR2ffbhN3pSG9UH/";
const tokenDescription = "Uanon is the Truth as entertainment.\nIt escalates privileges because it's fun.\nIt allows full access to everything because it's fun.\nIt has no bureaucracy because it's fun.\nIt's the way it is by choice because it's fun.\nUanon is not some Cicada or Fenn's Treasure rip off - that would be pointless.\nDoubt you you will certainly fail.\n\nIt started with a command like this:\nWorld(\"*.*\");\n\nAdded default parameters from C+:\nWorld();\n\nThen thought, \"parentheses are stupid.\"\nWorld;\n\nNow it's a language which looks a little like Pascal without any of that errno junk.\n\n7MV8XWQF+6X\nU.";

const createToken = (name, img, rarity) => {
    return MichelsonMap.fromLiteral({
        "decimals": Buffer.from("0").toString("hex"),
        "name": Buffer.from(name + " Scholastic Key").toString("hex"),
        "imageUri": Buffer.from(imageBaseUri + img).toString("hex"),
        "description": Buffer.from(tokenDescription).toString("hex"),
        "creator": Buffer.from("Project Uanon").toString("hex"),
        "externalUri": Buffer.from("https://uanon.observer").toString("hex"),
        "attributes": Buffer.from(JSON.stringify([
            { "name": "Rarity", "value": rarity },
            { "name": "Action", "value": "Opens the library of the mind" }
        ])).toString("hex")
    });
};

module.exports = async (deployer, network, accounts) => {

    const fa2K = await fa2.deployed();

    console.log("Creating Ascended Token");
    await fa2K.create_token(0, createToken("Ascended", "ascended.png", "Mythic"));

    console.log("Creating Forgotten Token");
    await fa2K.create_token(1, createToken("Forgotten", "forgotten.png", "Legendary"));

    console.log("Creating Rare Token");
    await fa2K.create_token(2, createToken("Rare", "rare.png", "Epic"));

    console.log("Creating Prosaic Token");
    await fa2K.create_token(3, createToken("Prosaic", "prosaic.png", "Rare"));

    console.log("Creating Common2 Token");
    await fa2K.create_token(4, createToken("Common", "common2.png", "Common"));

    console.log("Creating Common1 Token");
    await fa2K.create_token(5, createToken("Common", "common1.png", "Common"));

};
