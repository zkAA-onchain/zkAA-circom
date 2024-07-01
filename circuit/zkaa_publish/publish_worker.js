const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
    derivePublicKey,
    signMessage,
    verifySignature
} = require("@zk-kit/eddsa-poseidon");
const { poseidon1, poseidon4 } = require('poseidon-lite');
const { parentPort, workerData } = require('worker_threads');

const dataDir = path.join(__dirname, 'data');

function generateRandom127Bits() {
    const buffer = crypto.randomBytes(16);
    buffer[0] = buffer[0] & 0x7F;
    return BigInt('0x' + buffer.toString('hex')).toString();
}

async function processRound(round, threadIndex, totalRounds) {
    const privateKey = `secret${round}`;
    const publicKey = derivePublicKey(privateKey);
    const cert = `${round}`;
    const signature = signMessage(privateKey, cert);

    const response = verifySignature(cert, signature, publicKey);
    if (response !== true) {
        throw new Error("Invalid Signature.");
    }

    const rand = generateRandom127Bits();
    const hash = poseidon4([rand, signature.R8[0], signature.R8[1], signature.S]);

    const message = `${round + totalRounds}`;
    const input = {
        "R": signature.R8,
        "S": signature.S,
        "Rand": rand,
        "h_cert": hash,
        "h_msg": poseidon1([message])
    };
    // console.log(input);

    const dirName = round.toString().padStart(3, '0');
    const dirPath = path.join(dataDir, dirName);
    if (!fs.existsSync(dirPath)) { fs.mkdirSync(dirPath); }
    const filePath = path.join(dirPath, 'input.json');
    fs.writeFileSync(filePath, JSON.stringify({
        "R": [input.R[0].toString(), input.R[1].toString()],
        "S": input.S.toString(),
        "Rand": input.Rand.toString(),
        "h_cert": input.h_cert.toString(),
        "h_msg": input.h_msg.toString()
    }));

    return input;
}

async function main() {
    const { roundStart, roundEnd, threadIndex, totalRounds } = workerData;
    const results = [];

    console.log(`Worker started with data:`, workerData);
    for (let round = roundStart; round < roundEnd; round++) {
        const result = await processRound(round, threadIndex, totalRounds);
        results.push(result);
    }

    parentPort.postMessage(results);
}

main().catch(err => {
    parentPort.postMessage({ error: err.message });
});
