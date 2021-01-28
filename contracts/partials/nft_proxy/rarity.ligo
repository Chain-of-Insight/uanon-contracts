function calcSeed(var seed : nat; const depth : nat) : nat is
  block {
    for i := 1 to int(depth) block {
      seed := (134775813n * seed + 1n) mod 4294967296n;
    }
  } with seed

function prng(var seed : nat; const depth : nat) : nat is
  block {
    seed := calcSeed(seed, depth);
    const final : nat = (seed mod 10000n) / 1000n;
  } with final

(* *)
function calcRarity(const seed : nat; const depth : nat) : rarity is
  block {
    var r : rarity := rarityCommon1;
    if depth <= 3n then {
      r := abs(depth - 1n);
    } else {
      const roll : nat = prng(seed, depth);
      if roll >= 700n then r := rarityCommon1 else {
        if roll >= 400n then r := rarityCommon2 else {
          if roll >= 200n then r := rarityRare else {
            if roll >= 50n then r := rarityEpic else {
              r := rarityLegendary;
            }
          }
        }
      }
    }
  } with r
