(* Helper function *)
function isPaused(const s : storage) : bool is
  s.paused;

(* Pause contract *)
function pause (var s : storage) : return is
  block {
    (* Check for permissions *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    s.paused := True;

  } with (noOperations, s)

(* Unpause contract *)
function unpause (var s : storage) : return is
  block {
    (* Check for permissions *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    s.paused := False;

  } with (noOperations, s)
