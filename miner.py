import time
import requests
import hashlib

def proof_of_work(last_proof, level):
    print("Searching for next proof")
    proof = 0
    while valid_proof(last_proof, proof, level) is False:
        proof -= 1

    print("Proof found: " + str(proof))
    return proof


def valid_proof(last_proof, proof, level):
    guess = f'{last_proof}{proof}'.encode()
    guess_hash = hashlib.sha256(guess).hexdigest()
    difficulty = [0] * level
    difficulty = ''.join(str(e) for e in difficulty)
    return guess_hash[:level] == difficulty


PROOFURL = "https://lambda-treasure-hunt.herokuapp.com/api/bc/last_proof"
MINEURL = "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine"
Token = "07bd865cf1d2e3c39f850fa619c85db565ff6b18"


cooldown = 0 

while True:
    headers = {'content-type': 'application/json', 'Authorization': 'Token ' + Token }
    r = requests.get(url=PROOFURL, headers=headers)
    data = r.json()
    print(data, "initial")

    proof = proof_of_work(data.get('proof'), data.get('difficulty'))

    req = {"proof": proof}

    r = requests.post(url= MINEURL, json=req, headers=headers)
    data = r.json()

    cooldown = data.get('cooldown')

    print(data, "res")

    if data.get('messages') == 'New Block Forged':
        print("Mine")
        print(data, "in if")
        time.sleep(cooldown)
    else:
        print(data, "in else")
        time.sleep(cooldown)
