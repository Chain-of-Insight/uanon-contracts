type trusted is address
type nftContract is address
type puzzleId is nat
type sacredSeed is nat
type rarity is nat
type claimNum is nat

type permissions is
  record [
    owner           : trusted;
    minter          : set (trusted);
  ]

type nft is
  record [
    contract        : nftContract;
    seed            : sacredSeed;
    cap             : nat
  ]

type storage is
  record [
    roles           : permissions;
    nfts            : map (puzzleId, nft)
  ]

(* define return for readability *)
type return is list (operation) * storage

type grantParams is
  record [
    puzzleId        : puzzleId;
    claim           : claimNum;
    addr            : address
  ]

type setParams is
  record [
    puzzleId        : puzzleId;
    nft             : nft
  ]

type mintTx is [@layout:comb]
  record [
    owner           : address;
    token_id        : nat;
    amount          : nat;
  ]

type mintParams is list (mintTx)

(* Valid entry points *)
type entryAction is
  | GrantNft of grantParams
  | SetNft of setParams
  | AddMinter of trusted
  | RemoveMinter of trusted
