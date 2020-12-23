(* Set the reward proxy contract *)
function setProxy(const addr : trusted; var s : storage) : return is
  block {
    (* Can only be called by contract owner *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Update storage *)
    s.rewardProxy := addr;

  } with (noOperations, s)
