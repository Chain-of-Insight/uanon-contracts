(* Define types *)
type trusted is address
type claim is map (address, nat)

type puzzle is
  record [
    id          : nat;          // e.g. Creation Time
    author      : address;      // Author address
    rewards_h   : bytes;        // Encrypted bytes output of hashing contract (rewards)
    rewards     : nat;          // Max claimable rewards (default 0)
                                // Suggested max rewards capacity: testnet (10), mainnet (100)
    claimed     : claim;        // Number of rewards claimed
    questions   : nat           // Quantity of questions concatenated in the answer hash (for DApp frontend only)
  ]

type puzzleStorage is big_map (nat, puzzle)

type permissions is
  record [
    owner           : trusted;
#if CONTRACT__WHITELIST_AUTHORS
    author          : set (trusted);
#endif
  ]

type storage is
  record [
    paused          : bool;
    roles           : permissions;
    rewardProxy     : trusted;
    puzzles         : puzzleStorage
  ]

(* define return for readability *)
type return is list (operation) * storage

(* Input for create entry *)
type createParams is
  record [
    id          : nat;          // e.g. Creation Time
    rewards     : nat;          // Max claimable rewards
    rewards_h   : bytes;        // Solution hashchain value at rewards + 1
    questions   : nat
  ]

(* Input for solve entry *)
type solveParams is
  record [
    id          : nat;
    proof       : bytes;        // Solution proof for current depth (rewards - claimed)
  ]

(* Input for proxy call *)
type proxyParams is
  record [
    puzzle_id         : nat;
    claim             : nat;
    addr              : address
  ]

#if CONTRACT__WHITELIST_AUTHORS
type authorParams is trusted
#endif

(* Valid entry points *)
type entry_action is
  | Create of createParams
  | Update of createParams
  | Solve of solveParams

#if CONTRACT__WHITELIST_AUTHORS
  | AddAuthor of authorParams
  | RemoveAuthor of authorParams
  | RenounceAuthorship
#endif

#if CONTRACT__PAUSABLE
  | Pause
  | Unpause
#endif

(* define noop for readability *)
const noOperations: list(operation) = nil;
