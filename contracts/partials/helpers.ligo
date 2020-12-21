(* Collection of helper functions for the contract to use *)

(* Helper function to determine if caller is contract owner *)
function isOwner(const s : storage) : bool is
  s.roles.owner = Tezos.sender;
