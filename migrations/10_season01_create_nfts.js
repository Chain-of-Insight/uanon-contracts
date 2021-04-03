const fa2 = artifacts.require('fa2_multi_asset');
const { MichelsonMap } = require('@taquito/taquito');

const tokenCids = {
  testnet: {
    ascended: "bafybeigwyr5dm3dgh5k3imu7iw7zecgy3ccuzeaegltoqez7i6ivmsbwji",
    lost: "bafybeicedlztyhqc7qrdo3myfulvydgltvywkvcvugthfxqlgnhhgkcrqi",
    secret: "bafybeif5xc7cbmsancuo7kcxc5wmfqdj55vevq52fml2aegcqj57fhzu54",
    cruel: "bafybeicdep6zz5b27i3iouv2k54db6mjjag7vlexaa3dbjwlvjhhma73da",
    common2: "bafybeih3ay3ggdypqu5nqjdzc6fn6aqz2w3zzb3eyq2gsjrijrbwd6n2na",
    common1: "bafybeiakxgrgzjg7zzah6tddrz4a6v7ciuy2odtkfn435xtmdyjjpt3nye"
  },
  mainnet: {
    ascended: "bafybeihvkgbsfq4d75ksuoct3ee3bpbo6icdiptpju56ccfzx4yemgypb4",
    lost: "bafybeibdlxfwjukm763wchralqizxmjnnf3x5y54j72jwxhxxgjaa6ajim",
    secret: "bafybeieke3gkkzx6yro5smdnksjwaxxlsjr5s4x44mxmw5774i6xcunyca",
    cruel: "bafybeiaiktnmpg5uuonayan7iyfm7ohrtpbq3afb2pg35tsg7p5ps4vnee",
    common2: "bafybeievidyeqmkk66ui24kbor3wognxjteehpznixji6jvf6d4223mrhq",
    common1: "bafybeid6g3vnhfhbzneh4rgkmbpabfk6usm4y7o2jpfc6ndeuwiwwfvcfy"
  }
};

const createToken = (key, network) => {
  return MichelsonMap.fromLiteral({"": Buffer.from("ipfs://" + tokenCids[network][key]).toString("hex")});
};

module.exports = async (deployer, network, accounts) => {

  const fa2K = await fa2.deployed();

  console.log("Creating Ascended Token");
  await fa2K.create_token(0, createToken("ascended", network));

  console.log("Creating Lost Token");
  await fa2K.create_token(1, createToken("lost", network));

  console.log("Creating Secret Token");
  await fa2K.create_token(2, createToken("secret", network));

  console.log("Creating Cruel Token");
  await fa2K.create_token(3, createToken("cruel", network));

  console.log("Creating Common2 Token");
  await fa2K.create_token(4, createToken("common2", network));

  console.log("Creating Common1 Token");
  await fa2K.create_token(5, createToken("common1", network));

};
