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
