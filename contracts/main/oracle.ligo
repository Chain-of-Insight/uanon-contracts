(* COI Puzzle Oracle v2 *)

#define CONTRACT__PAUSABLE
#define CONTRACT__WHITELIST_AUTHORS

#include "../partials/oracle/types.ligo"
#include "../partials/oracle/hasher.ligo"

#include "../partials/helpers.ligo"

#if CONTRACT__PAUSABLE
#include "../partials/pausable.ligo"
#endif

#if CONTRACT__WHITELIST_AUTHORS
#include "../partials/oracle/authors.ligo"
#endif

#include "../partials/oracle/puzzles.ligo"
#include "../partials/oracle/proxy.ligo"


function main (const action : entry_action; var s : storage) : return is
  block {
    if Tezos.amount > 0tez then
      failwith ("This contract does not accept tokens.");
    else skip;
  } with case action of
    | Create(params) -> createPuzzle(params, s)
    | Update(params) -> updatePuzzle(params, s)
    | Solve(params)  -> claimReward(params, s)
    | SetProxy(params) -> setProxy(params, s)

#if CONTRACT__WHITELIST_AUTHORS
    | AddAuthor(params) -> addAuthor(params, s)
    | RemoveAuthor(params) -> removeAuthor(params, s)
    | RenounceAuthorship -> renounceAuthorship(s)
#endif

#if CONTRACT__PAUSABLE
    | Pause -> pause(s)
    | Unpause -> unpause(s)
#endif

  end;
