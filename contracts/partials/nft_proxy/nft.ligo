(* Helper function to get puzzle nft *)
function getNft (const puzzleId : puzzleId; const s : storage) : nft is
  block {
    var nft : nft :=
      record [
        contract = (Tezos.self_address : address);
        seed = 0n;
        cap = 0n;
      ];
    case s.nfts[puzzleId] of
      None -> skip
    | Some(instance) -> nft := instance
    end;
  } with nft

(* Grant NFT to puzzle solver *)
function grantNft (const input : grantParams; var s : storage) : return is
  block {

    (* Only minters can call this *)
    if isMinter(Tezos.sender, s) = False then
      failwith("NOPERM")
    else skip;

    (* initialize operations *)
    var operations : list (operation) := nil;

    (* Retrieve nft instance from storage *)
    const nftInstance : nft = getNft(input.puzzleId, s);

    if nftInstance.cap > 0n and input.claim <= nftInstance.cap then {
      const r : rarity = calcRarity(nftInstance.seed, input.claim);

      (* Mint NFT *)
      const mintTx : mintTx =
        record [
          owner = input.addr;
          token_id = r;
          amount = 1n;
        ];
      const mintParams : mintParams = list [ mintTx ];
      const mintEntrypoint : contract (mintParams) = get_entrypoint("%mint_tokens", nftInstance.contract);
      const nftOperation : operation = transaction (mintParams, 0tz, mintEntrypoint);
      operations := nftOperation # operations;

    } else skip;

  } with (operations, s)

(* Set puzzle nft *)
function setNft (const input : setParams; var s : storage) : return is
  block {

    (* Only contract owner can do this *)
    if isOwner(s) = False then
      failwith("OperationNotAllowed")
    else skip;

    (* Update storage *)
    s.nfts[input.puzzleId] := input.nft;

  } with (noOperations, s)
