(* Helper functions *)
function hasCurrentSolver (const p : puzzle) : bool is
  p.solver.1 > Tezos.now;

function isCurrentSolver (const p : puzzle) : bool is
  p.solver.0 = Tezos.sender and hasCurrentSolver(p) = True

(* Raise your hand to solve the puzzle *)
function raiseHand (const id : puzzleId; var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

    (* Retrieve puzzle from storage or fail *)
    const puzzle_instance : puzzle =
      case s.puzzles[id] of
        Some (instance) -> instance
      | None -> (failwith ("UnknownPuzzle") : puzzle)
      end;

    (* Address already claimed *)
    case puzzle_instance.claimed[Tezos.sender] of
        Some (claimed) -> failwith ("AlreadyClaimed")
      | None -> skip
      end;

    (* Already raised your hand *)
    if isCurrentSolver(puzzle_instance) = True then
      failwith("HandAlreadyRaised")
    else skip;

    (* Someone else raised their hand *)
    if hasCurrentSolver(puzzle_instance) = True then
      failwith("WaitYourTurn")
    else skip;

    (* Add to puzzle as the current solver *)
    puzzle_instance.solver := (Tezos.sender, (Tezos.now + 600));

    (* Update puzzle storage *)
    s.puzzles[puzzle_instance.id] := puzzle_instance;

  } with (noOperations, s)

(* Puzzle author may whitelist solvers *)
function allowSolver (const input : allowSolverParams; var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

    (* Retrieve puzzle from storage or fail *)
    const puzzle_instance : puzzle =
      case s.puzzles[input.id] of
        Some (instance) -> instance
      | None -> (failwith ("UnknownPuzzle") : puzzle)
      end;

    (* Only author can call this method *)
    if Tezos.sender =/= puzzle_instance.author then
      failwith("OperationNotAllowed");
    else skip;

    (* Someone else raised their hand *)
    if hasCurrentSolver(puzzle_instance) = True then
      failwith("WaitYourTurn")
    else skip;

    (* Address already claimed *)
    case puzzle_instance.claimed[input.addr] of
        Some (claimed) -> failwith ("AlreadyClaimed")
      | None -> skip
      end;

    (* Add to puzzle as the current solver with 10 minute expiration *)
    puzzle_instance.solver := (input.addr, (Tezos.now + 600));

    (* Update puzzle storage *)
    s.puzzles[puzzle_instance.id] := puzzle_instance;

  } with (noOperations, s)
