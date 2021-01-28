(* Helper function *)
function isMinter (const acct : address; const s : storage) : bool is
  s.roles.minter contains acct;

(* Add a minter *)
function addMinter (const acct : trusted; var s : storage) : return is
  block {

    (* Only contract owner can add minters *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Only non-existing minters can be added *)
    if isMinter(acct, s) = True then
      failwith("MinterExists")
    else skip;

    (* Add author *)
    s.roles.minter := Set.add (acct, s.roles.minter);
  } with (noOperations, s)

(* Remove a minter *)
function removeMinter (const acct : trusted; var s : storage) : return is
  block {

    (* Only contract owner can do this *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Only existing minters can be removed *)
    if isMinter(acct, s) = False then
      failwith("MinterNotExists")
    else skip;

    (* Remove minter *)
    s.roles.minter := Set.remove (acct, s.roles.minter);

  } with (noOperations, s)
