(* Helper function *)
function isAuthor (const acct : address; const s : storage) : bool is
  s.roles.author contains acct;

(* Add an author *)
function addAuthor (const acct : trusted; var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

    (* Only contract owner can add authors *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Only non-existing authors can be added *)
    if isAuthor(acct, s) = True then
      failwith("AuthorExists")
    else skip;

    (* Add author *)
    s.roles.author := Set.add (acct, s.roles.author);
  } with (noOperations, s)

(* Remove an author *)
function removeAuthor (const acct : trusted; var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

    (* Only contract owner can do this *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Only existing authors can be removed *)
    if isAuthor(acct, s) = False then
      failwith("AuthorNotExists")
    else skip;

    (* Remove author *)
    s.roles.author := Set.remove (acct, s.roles.author);

  } with (noOperations, s)

(* Remove yourself as an author *)
function renounceAuthorship (var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

    (* Only author themselves can remove *)
    if isAuthor(Tezos.sender, s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Remove self as author *)
    s.roles.author := Set.remove (Tezos.sender, s.roles.author);

  } with (noOperations, s)
