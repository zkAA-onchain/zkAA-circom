#!/bin/bash

NUM_INPUTS=3

# Generate Inputs
cd circuit/zkaa_publish
node generate_publish_inputs.js --rounds=$NUM_INPUTS --workers=8

# Compile the Circuit
circom publish.circom --r1cs --wasm --sym --c
snarkjs r1cs info publish.r1cs

# Setup
snarkjs groth16 setup publish.r1cs ../../setup/powersOfTau28_hez_final_12.ptau ../../setup/zkaa_final_12.zkey
snarkjs zkey export verificationkey ../../setup/zkaa_final_12.zkey ../../setup/verification_key.json
# snarkjs zkey verify publish.r1cs ../../setup/powersOfTau28_hez_final_12.ptau ../../setup/zkaa_final_12.zkey

# Create necessary directories if they do not exist
mkdir -p witnesses
mkdir -p proofs
mkdir -p ../../test/data/publish
mkdir -p ../../test/data/publish_time_witness
mkdir -p ../../test/data/publish_time_proof
for i in $(seq -f "%03g" 0 $((NUM_INPUTS-1)))
do
    mkdir -p proofs/$i
done

# Iterate over all input files
for i in $(seq -f "%03g" 0 $((NUM_INPUTS-1)))
do
    # Calculate the witness
    cd publish_js
    (time (node generate_witness.js publish.wasm ../data/$i/input.json ../witnesses/$i.wtns)) 2> ../../../test/data/publish_time_witness/$i.txt
    cd ..

    # Create the proof
    (time (snarkjs groth16 prove ../../setup/zkaa_final_12.zkey witnesses/$i.wtns proofs/$i/proof.json proofs/$i/public.json)) 2> ../../test/data/publish_time_proof/$i.txt

    # Verify the proof
    # snarkjs groth16 verify ../../setup/verification_key.json proofs/$i/public.json proofs/$i/proof.json

    echo $i done
done

# Export Solidity Verifier
snarkjs zkey export solidityverifier ../../setup/zkaa_final_12.zkey ../../contracts/verifier_publish.sol

# Iterate over all public and proof files
for i in $(seq -f "%03g" 0 $((NUM_INPUTS-1)))
do
    snarkjs zkey export soliditycalldata proofs/$i/public.json proofs/$i/proof.json > ../../test/data/publish/$i.txt
done

# Gas Test
cd ../..
cat <<EOT > contracts/PublishGasHelper.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import {Groth16Verifier as Verifier} from "./verifier_publish.sol";

contract PublishGasHelper is Verifier {
    uint256 public gasUsed;

    function verifyProofBenchmark(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[3] calldata _pubSignals
    ) external {
        uint256 startGas = gasleft();
        // bool res =
        this.verifyProof(_pA, _pB, _pC, _pubSignals);
        gasUsed = startGas - gasleft();

        // require(res, "Fail to verify.");
    }
}
EOT
echo GAS_TEST
circuit="publish" npx hardhat test test/gas_test.js

# Time Test
echo TIME_TEST witness
node test/time_test.js --directory="./test/data/publish_time_witness"
echo TIME_TEST proof
node test/time_test.js --directory="./test/data/publish_time_proof"
