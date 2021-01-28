const oracle = artifacts.require('oracle');

const puzzles = [
{
    id: 1,
    questions: 1,
    rewards: 0,
    testProof: "6dca8d85358b735f7b0fb4031fa2ba3be75cc4fea9648accd0cfb747092dced7",
    proof: "6dca8d85358b735f7b0fb4031fa2ba3be75cc4fea9648accd0cfb747092dced7",
},
{
    id: 2,
    questions: 1,
    rewards: 0,
    testProof: "9829d4124db86545d13dab7e2d2bab0b2963dc77e8da3f0db59ef84a359182da",
    proof: "9829d4124db86545d13dab7e2d2bab0b2963dc77e8da3f0db59ef84a359182da",
},
{
    id: 3,
    questions: 1,
    rewards: 0,
    testProof: "291bdb6c6701bd10bb64b31d3c31c5544b6878c0df1554db690dc12afa015d4d",
    proof: "291bdb6c6701bd10bb64b31d3c31c5544b6878c0df1554db690dc12afa015d4d",
},
{
    id: 4,
    questions: 1,
    rewards: 0,
    testProof: "e8e48a7160cf88474ef2ad495ea2d5945e0ff9747d7ab7f4b54fd9fb6cd69536",
    proof: "e8e48a7160cf88474ef2ad495ea2d5945e0ff9747d7ab7f4b54fd9fb6cd69536",
},
{
    id: 5,
    questions: 1,
    rewards: 0,
    testProof: "ca3f8947a4cbc7c48f28c40e8ec17dbec4742e3a0fc1fb61f35ce1751c84d2f0",
    proof: "ca3f8947a4cbc7c48f28c40e8ec17dbec4742e3a0fc1fb61f35ce1751c84d2f0",
},
{
    id: 6,
    questions: 9,
    rewards: 1000,
    testProof: "cc5db9adced4615df99f45fdddbb8c4f8bdb3c5b8cf310e2e1ba1fe2ec9a5e4f",
    proof: "6d5a04c001da1ddbf6c659269790fddae9093c04ec3fead4fd1e2d8b93fae889",
}
];

module.exports = async (deployer, network, accounts) => {

    const oracleK = await oracle.deployed();

    for (const puzzle of puzzles) {
        const tx =  await oracleK.create(puzzle.id, puzzle.questions, puzzle.rewards, (network == "mainnet") ? puzzle.proof : puzzle.testProof);
        console.log("Puzzle " + puzzle.id + " op:", tx.tx);
    }

};
