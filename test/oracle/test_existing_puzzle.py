from os.path import dirname, join
import sys, hashlib
import pytest
from pytezos import ContractInterface, pytezos, MichelsonRuntimeError

# Helper functions for proof tests
def hashman(b):
    h = hashlib.blake2b(digest_size=32)
    h.update(b)
    return h.digest()

def generate_proof(message, depth):
    prefix = b'\x05\x01'
    len_bytes = (len(message)).to_bytes(4, byteorder='big')
    b = bytearray()
    b.extend(message.encode())
    proof = prefix + len_bytes + b
    for i in range(0, depth):
        proof = hashman(proof)
    return proof.hex()

# testcases
class TestOracleExistingPuzzle:

    @pytest.fixture(autouse=True)
    def oracle_contract(self):
        self.oracle = ContractInterface.from_file(join(dirname(__file__), '../../build/contracts/oracle.tz')).using(shell="sandboxnet")
        self.alice = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'
        self.bob = 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6'
        self.owner = 'tz1codeYURj5z49HKX9zmLHms2vJN2qDjrtt'
        self.initial_storage = {
                'paused': False,
                'roles': {
                    'owner': self.owner,
                    'author': [ self.alice ]
                },
                'rewardProxy': self.owner,
                'puzzles': {
                    1583093350498: {
                        'author': self.alice,
                        'claimed': {},
                        'questions': 2,
                        'id': 1583093350498,
                        'rewards': 10,
                        'rewards_h': '7b15bb3dee5f8891f60cd181ff424012548a9ed5e26721eb9f6518e9dd409d9e',
                        'solver': (self.alice, 0)
                    }
                }
            }

    # Cannot overwrite existing puzzle on create
    def test_cannot_create_existing_puzzle(self):
        with pytest.raises(MichelsonRuntimeError, match='PuzzleExists'):
            res = self.oracle \
                .create(id=1583093350498, questions=2, rewards=10, rewards_h='7b15bb3dee5f8891f60cd181ff424012548a9ed5e26721eb9f6518e9dd409d9e') \
                .interpret(storage=self.initial_storage, sender=self.alice)


    def test_alice_can_update_own_puzzle(self):
        res = self.oracle \
            .update(id=1583093350498, questions=4, rewards=5, rewards_h='6b2c38e3a7d1bbca95cd302d03d77c1c0c90085f229f35caa0914d7dcd1b44b4') \
            .interpret(storage=self.initial_storage, sender=self.alice)

        expected = {'author': self.alice,
                    'claimed': {},
                    'questions': 4,
                    'id': 1583093350498,
                    'rewards': 5,
                    'rewards_h': '6b2c38e3a7d1bbca95cd302d03d77c1c0c90085f229f35caa0914d7dcd1b44b4',
                    'solver': (self.alice, 0)}

        assert 'puzzles' in res.storage

        assert 1583093350498 in res.storage['puzzles']
        res.storage['puzzles'][1583093350498]['rewards_h'] = res.storage['puzzles'][1583093350498]['rewards_h'].hex()
        assert expected == res.storage['puzzles'][1583093350498]


    def test_alice_can_update_available_rewards(self):
        res = self.oracle \
            .update(id=1583093350498, questions=2, rewards=5, rewards_h='7b15bb3dee5f8891f60cd181ff424012548a9ed5e26721eb9f6518e9dd409d9e') \
            .interpret(storage=self.initial_storage, sender=self.alice)

        expected = {'author': self.alice,
                    'claimed': {},
                    'questions': 2,
                    'id': 1583093350498,
                    'rewards': 5,
                    'rewards_h': '7b15bb3dee5f8891f60cd181ff424012548a9ed5e26721eb9f6518e9dd409d9e',
                    'solver': (self.alice, 0)}

        assert 'puzzles' in res.storage

        assert 1583093350498 in res.storage['puzzles']
        res.storage['puzzles'][1583093350498]['rewards_h'] = res.storage['puzzles'][1583093350498]['rewards_h'].hex()
        assert expected == res.storage['puzzles'][1583093350498]


    def test_alice_can_create_second_puzzle(self):
        res = self.oracle \
            .create(id=1583258505553, questions=3, rewards=5, rewards_h='073897e9678ecd192ce857aaccde7eb698c73e00ec79741eb93326e4a707520c') \
            .interpret(storage=self.initial_storage, sender=self.alice)

        expected = {'author': self.alice,
                    'claimed': {},
                    'questions': 3,
                    'id': 1583258505553,
                    'rewards': 5,
                    'rewards_h': '073897e9678ecd192ce857aaccde7eb698c73e00ec79741eb93326e4a707520c',
                    'solver': (self.alice, 0)}

        assert 'puzzles' in res.storage

        assert 1583093350498 in res.storage['puzzles']
        res.storage['puzzles'][1583093350498]['rewards_h'] = res.storage['puzzles'][1583093350498]['rewards_h'].hex()
        assert self.initial_storage['puzzles'][1583093350498] == res.storage['puzzles'][1583093350498]

        assert 1583258505553 in res.storage['puzzles']
        res.storage['puzzles'][1583258505553]['rewards_h'] = res.storage['puzzles'][1583258505553]['rewards_h'].hex()
        assert expected == res.storage['puzzles'][1583258505553]


    def test_alice_cannot_solve_own_puzzle(self):
        solution = "identify gentle hazard impact boy say rotate fame robot hole dog economy"
        rewards = self.initial_storage['puzzles'][1583093350498]['rewards']
        # rewards_h = HASH^rewards+1(Solution)
        self.initial_storage['puzzles'][1583093350498]['rewards_h'] = generate_proof(solution, rewards + 1)
        proof = generate_proof(solution, rewards)

        with pytest.raises(MichelsonRuntimeError, match='OperationNotAllowed'):
            res = self.oracle \
                .solve(id=1583093350498, proof=proof) \
                .interpret(storage=self.initial_storage, sender=self.alice)
