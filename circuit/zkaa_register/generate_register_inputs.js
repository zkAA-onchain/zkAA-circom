const fs = require('fs');
const path = require('path');
// const snarkjs = require('snarkjs');
const wasm_tester = require('circom_tester').wasm;
const { Worker } = require('worker_threads');

let ROUNDS = 100;
let NUM_WORKERS = 8;
const args = process.argv.slice(2);
args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key === '--rounds' && !isNaN(value)) {
        ROUNDS = parseInt(value, 10);
    } else if (key === '--workers' && !isNaN(value)) {
        NUM_WORKERS = parseInt(value, 10);
    }
});

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) { fs.mkdirSync(dataDir); }

async function runWorker(roundStart, roundEnd, threadIndex) {
    return new Promise((resolve, reject) => {
        console.log(`Starting worker for rounds ${roundStart} to ${roundEnd}, threadIndex: ${threadIndex}`);
        const worker = new Worker(
            path.join(__dirname, 'register_worker.js'),
            {
                workerData: { roundStart, roundEnd, threadIndex, totalRounds: ROUNDS }
            }
        );
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

async function main() {
    const tasks = [];
    const roundsPerWorker = Math.ceil(ROUNDS / NUM_WORKERS);

    for (let i = 0; i < NUM_WORKERS; i++) {
        const roundStart = i * roundsPerWorker;
        const roundEnd = Math.min(roundStart + roundsPerWorker, ROUNDS);
        tasks.push(runWorker(roundStart, roundEnd, i));
    }

    try {
        const taskResults = await Promise.all(tasks);

        // Verification
        const circuit = await wasm_tester('register.circom');
        const witnessPromises = taskResults.map(async (inputs) => {
            const inputWitnesses = await Promise.all(inputs.map(async (input) => {
                const witness = await circuit.calculateWitness(input, true);
                return witness;
            }));
            return inputWitnesses;
        });
        const witnesses = await Promise.all(witnessPromises).then(results => results.flat());
        console.log('Generation completed:', witnesses.length);
        // console.log('Generation completed');
    } catch (err) {
        console.error('Error:', err);
    }
}

main().catch(console.error);
