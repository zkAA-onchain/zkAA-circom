#!/bin/bash

rm -rf circuit/zkaa_register/data
rm -rf circuit/zkaa_register/witnesses
rm -rf circuit/zkaa_register/proofs
rm -rf circuit/zkaa_register/register_cpp
rm -rf circuit/zkaa_register/register_js
rm circuit/zkaa_register/register.r1cs
rm circuit/zkaa_register/register.sym

rm contracts/verifier_register.sol
rm contracts/RegisterGasHelper.sol

rm setup/verification_key.json
rm setup/zkaa_final_14.zkey

rm -rf test/data/register
rm -rf test/data/register_time_proof
rm -rf test/data/register_time_witness
