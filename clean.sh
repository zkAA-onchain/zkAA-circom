#!/bin/bash

rm -rf circuit/zkaa_publish/data
rm -rf circuit/zkaa_publish/witnesses
rm -rf circuit/zkaa_publish/proofs
rm -rf circuit/zkaa_publish/publish_cpp
rm -rf circuit/zkaa_publish/publish_js
rm circuit/zkaa_publish/publish.r1cs
rm circuit/zkaa_publish/publish.sym

rm contracts/verifier_publish.sol

rm setup/verification_key.json
rm setup/zkaa_final.zkey

rm -rf test/data/publish
rm -rf test/data/publish_time_proof
rm -rf test/data/publish_time_witness
