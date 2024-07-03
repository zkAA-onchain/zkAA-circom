const { expect } = require("chai");
const { ethers } = require("hardhat");
const snarkjs = require("snarkjs");
const fs = require("fs");

const circuit = process.env.circuit;
let directory;
let helper;
if (circuit === "register") {
  directory = "./test/data/register/";
  helper = "RegisterGasHelper";
} else if (circuit === "publish") {
  directory = "./test/data/publish/";
  helper = "PublishGasHelper";
} else {
  throw "circuit=[register|publish] env required.";
}

async function gasCalculation(gasUsed) {
  const numbers = gasUsed.map(Number);

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;

  numbers.sort((a, b) => a - b);
  // const mid = Math.floor(numbers.length / 2);
  // const median = numbers.length % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Log the results
  console.log(`Min: ${min}`);
  console.log(`Max: ${max}`);
  console.log(`Average: ${avg}`);
  // console.log(`Median: ${medianBigInt}`);
  console.log(`Standard Deviation: ${stdDev} (sqrt(${variance}))`);
}

describe("Groth16", function () {
  it("Should return true when proof is correct", async function () {
    const verifier = await ethers.deployContract(helper);
    await verifier.waitForDeployment();

    const proofs = [];
    const prooflist = fs.readdirSync(directory);
    prooflist.forEach(function (f) {
      const calldata = fs.readFileSync(directory + f, "utf-8");
      const validJson = `[${calldata}]`;
      const calldataArray = JSON.parse(validJson);
      proofs.push(calldataArray);
    });

    let gasUsed = [];
    for (let proof of proofs) {
      const [pA, pB, pC, pubSignals] = proof;

      const view = await verifier.verifyProof(pA, pB, pC, pubSignals);
      expect(view).to.equal(true);

      const tx = await verifier.verifyProofBenchmark(pA, pB, pC, pubSignals);
      const res = await tx.wait();
      // console.log(`Gas used: ${await verifier.gasUsed()}`);
      // console.log(res);

      gasUsed.push(await verifier.gasUsed());
    }

    await gasCalculation(gasUsed);
  });
});
