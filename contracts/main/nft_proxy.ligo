(* COI NFT Proxy *)

#include "../partials/nft_proxy/types.ligo"
#include "../partials/nft_proxy/constants.ligo"
#include "../partials/helpers.ligo"
#include "../partials/nft_proxy/minter.ligo"
#include "../partials/nft_proxy/rarity.ligo"
#include "../partials/nft_proxy/nft.ligo"

function main (const action : entryAction; var s : storage) : return is
  block {
    if Tezos.amount > 0tez then
      failwith ("This contract does not accept tokens.");
    else skip;
  } with case action of
    | GrantNft(params) -> grantNft(params, s)
    | SetNft(params) -> setNft(params, s)
    | AddMinter(params) -> addMinter(params, s)
    | RemoveMinter(params) -> removeMinter(params, s)
  end;
