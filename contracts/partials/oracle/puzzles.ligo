function createPuzzle (const input : createParams; var s : storage) : return is
  block {

#if CONTRACT__PAUSABLE
    (* Contract is paused *)
    if isPaused(s) = True then
      failwith("ContractPaused")
    else skip;
#endif

#if CONTRACT__WHITELIST_AUTHORS
    (* Not an author *)
    if isAuthor(Tezos.sender, s) = False then
      failwith("OperationNotAllowed")
    else skip;
#endif

    (* Make sure puzzle doesn't exist *)
    case s.puzzles[input.id] of
        Some (puzzle) -> failwith ("PuzzleExists")
      | None -> skip
      end;

    (* Create puzzle record *)
    const puzzle : puzzle =
      record [
        id        = input.id;
        author    = Tezos.sender;
        rewards_h = input.rewards_h;
        rewards   = input.rewards;
        questions = input.questions;
        claimed   = (map [] : claim);
#if CONTRACT__WHITELIST_SOLVERS
        solver    = (Tezos.sender, Tezos.now);
#endif
      ];

    (* Update puzzle storage *)
    s.puzzles[input.id] := puzzle;

  } with (noOperations, s)

function updatePuzzle (const input : createParams; var s : storage) : return is
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

    (* Only author can update *)
    if Tezos.sender =/= puzzle_instance.author then
      failwith("OperationNotAllowed");
    else skip;

    (* One caveat; rewards cannot be less than already claimed *)
    if input.rewards < Map.size(puzzle_instance.claimed) then
      failwith("OperationNotAllowed");
    else skip;

    (* Update puzzle *)
    puzzle_instance.rewards_h := input.rewards_h;
    puzzle_instance.rewards   := input.rewards;
    puzzle_instance.questions := input.questions;

    (* Update puzzle storage *)
    s.puzzles[puzzle_instance.id] := puzzle_instance;

  } with (noOperations, s)

function claimReward (const input : solveParams; var s : storage) : return is
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

    (* Contract owner claiming prize? *)
    if isOwner(s) = True then
      failwith("OperationNotAllowed")
    else skip;

    (* Author claiming own prize? *)
    if Tezos.sender = puzzle_instance.author then
      failwith("OperationNotAllowed");
    else skip;

    (* Current depth in hashchain to verify *)
    const atdepth : nat = abs(puzzle_instance.rewards - Map.size(puzzle_instance.claimed));

    (* Puzzle must have claimable rewards remaining *)
    if atdepth < 1n then
      failwith ("NothingClaimable");
    else skip;

    (* Address already claimed *)
    case puzzle_instance.claimed[Tezos.sender] of
        Some (claimed) -> failwith ("AlreadyClaimed")
      | None -> skip
      end;

#if CONTRACT__WHITELIST_SOLVERS
    (* Only current whitelisted solver is allowed for first claim *)
    if Map.size(puzzle_instance.claimed) = 0n and isCurrentSolver(puzzle_instance) = False then
      failwith("WaitYourTurn")
    else skip;
#endif

    (* Verify submitted proof *)
    if verify_proof(input.proof, puzzle_instance.rewards_h, puzzle_instance.rewards + 1n, atdepth) then
      skip;
    else failwith("InvalidProof");

    (* Increase claimed by 1 after distribution *)
    const claim_num : nat = Map.size(puzzle_instance.claimed) + 1n;
    puzzle_instance.claimed[Tezos.sender] := claim_num;

    (* Update puzzle storage *)
    s.puzzles[puzzle_instance.id] := puzzle_instance;

    (* Send claim to reward proxy *)
    const proxy_params : proxyParams =
      record [
        puzzle_id = puzzle_instance.id;
        claim = claim_num;
        addr = Tezos.sender
      ];
    const proxy_entrypoint : contract (proxyParams) = get_entrypoint(
        // which entrypoint we want to call
        "%grantReward", 
        // at which contract address this entrypoint can be found
        s.rewardProxy
    );
    const proxyOperation : operation = transaction (proxy_params, 0tz, proxy_entrypoint);
    const operations : list(operation) = list [proxyOperation]

  } with (operations, s)
