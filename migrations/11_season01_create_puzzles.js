const TezosToolkit = require('@taquito/taquito').TezosToolkit;
const importKey = require('@taquito/signer').importKey;
const oracle = artifacts.require('oracle');

const puzzles = [
{
    id: 100,
    questions: 2,
    rewards: 0,
    testProof: "b609a50f4e67801b8084c4de49858f3ade0f96747f9838b18b9cc0c9500b6aed",
    proof: "b609a50f4e67801b8084c4de49858f3ade0f96747f9838b18b9cc0c9500b6aed",
},
{
    id: 101,
    questions: 1,
    rewards: 0,
    testProof: "71c5c7899b4f7d0e0492eaf214e8967a7bc570d931a67864143279ebcae77bf8",
    proof: "71c5c7899b4f7d0e0492eaf214e8967a7bc570d931a67864143279ebcae77bf8",
},
{
    id: 102,
    questions: 1,
    rewards: 0,
    testProof: "b8ae84dc9ba611054012013e647e5551c1a1e712016b6590ee5db836a0d7a347",
    proof: "b8ae84dc9ba611054012013e647e5551c1a1e712016b6590ee5db836a0d7a347",
},
{
    id: 103,
    questions: 1,
    rewards: 0,
    testProof: "7e8389902114b8be3e5bbfebc6f73cd66fba7bb9667da31c3052711fd61f0add",
    proof: "7e8389902114b8be3e5bbfebc6f73cd66fba7bb9667da31c3052711fd61f0add",
},
{
    id: 104,
    questions: 1,
    rewards: 0,
    testProof: "95c7f953d050b7f758c773460f32867bad7036288c00afae8b8bca05515669cc",
    proof: "95c7f953d050b7f758c773460f32867bad7036288c00afae8b8bca05515669cc",
},
{
    id: 105,
    questions: 1,
    rewards: 0,
    testProof: "aec2598bae90c7fb37c30fb0e362903a6ffe1e3f1cb688ccfbf8806de2680396",
    proof: "aec2598bae90c7fb37c30fb0e362903a6ffe1e3f1cb688ccfbf8806de2680396",
},
{
    id: 106,
    questions: 25,
    rewards: 1000,
    testProof: "44810e160e03910202ed1337994aff9e49d2fd789b52543830954663c002f776",
    proof: "50d2c731a22358cf28bd681f18cdddb3983f34884bf943fb13e7b0ae4b973337",
},
{
    id: 107,
    questions: 1,
    rewards: 0,
    testProof: "7a23b88f0443364a4d776962214f654f65075d08743d7b3812d7c0bd7e58c098",
    proof: "7a23b88f0443364a4d776962214f654f65075d08743d7b3812d7c0bd7e58c098",
},
{
    id: 108,
    questions: 1,
    rewards: 0,
    testProof: "87e402405c9c268532ba64e5130476237cfc1289e2e993d62c97f3b14febcbf0",
    proof: "87e402405c9c268532ba64e5130476237cfc1289e2e993d62c97f3b14febcbf0",
},
{
    id: 109,
    questions: 15,
    rewards: 1000,
    testProof: "204adf6578cf7efd184536272c2602357fae567fafeeb2ee9fbe846d4b774021",
    proof: "97d6ea7c97d09793af25b83296bfeff0bada8d49cc23a8ee716c7a82c51cfae5",
}
];

module.exports = async (deployer, network, accounts) => {

  const config = require(`../truffle-config.js`).networks[network];
  const Tezos = new TezosToolkit(config.host);

  await importKey(Tezos, config.secretKey);

  const oracleAddress = require(`../deployments/${network}/oracle.js`);
  const oracle = await Tezos.contract.at(oracleAddress);

  for (const puzzle of puzzles) {
    const tx =  await oracle.methods
      .create(puzzle.id, puzzle.questions, puzzle.rewards, (network == "mainnet") ? puzzle.proof : puzzle.testProof)
      .send();
    await tx.confirmation();
    console.log("Puzzle " + puzzle.id + " op:", tx.hash);
  }

};
