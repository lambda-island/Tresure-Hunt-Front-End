import hashlib
import requests
import random

import os
import sys


def proof_of_work(last_proof):
    """
    Simple Proof of Work Algorithm
    - Find a number p' such that hash(pp') contains 6 leading
    zeroes, where p is the previous p'
    - p is the previous proof, and p' is the new proof
    """

    print("Searching for next proof")
    proof = 0
    while valid_proof(last_proof, proof) is False:
        proof -= 1

    print("Proof found: " + str(proof))
    return proof


def valid_proof(last_proof, proof):
    """
    Validates the Proof:  Does hash(last_proof, proof) contain n
    leading zeroes?
    """
    guess = f'{last_proof}{proof}'.encode()
    guess_hash = hashlib.sha256(guess).hexdigest()
    # print(guess_hash)
    return guess_hash[:9] == "000000000"


if __name__ == '__main__':
    # What node are we interacting with?
    if len(sys.argv) > 1:
        node = int(sys.argv[1])
    else:
        node = "https://lambda-treasure-hunt.herokuapp.com/api/bc"

    coins_mined = 0
    # Run forever until interrupted

    # uid = str(uuid4()).replace('-', '')
    # print(uid)

    try:
        with open('my_id.txt') as f:
            id = f.readlines()[0]
            f.close()
    except:
        f = open('my_id.txt', 'w')
        f.write(str(uuid4()).replace('-', ''))
        id = f.readlines()[0]
        f.close()

    print(id)

    url = f"{node}/last_proof/"

    print(url)

    headers = {
        "Authorization": f"Token {id}"
    }

    while True:

        # Get the last proof from the server
        r = requests.get(url=url, headers=headers)
        data = r.json()
        print(data.get('proof'))
        new_proof = proof_of_work(data.get('proof'))
        post_data = {
            "proof": new_proof
        }

        r = requests.post(url=node + "/mine", headers=headers, json=post_data)
        data = r.json()
        if data.get('message') == 'New Block Forged':
            coins_mined += 1
            print("Total coins mined: " + str(coins_mined))
        else:
            print(data.get('message'))