const wasm_tester = require('circom_tester').wasm;

async function main() {
    const circuit = await wasm_tester('poseidon.circom');
    const witness = await circuit.calculateWitness({
        "in": [1, 2, 3, 4]
    }, true);
    console.log(witness[1]); // 18821383157269793795438455681495246036402687001665670618754263018637548127333
}

main().catch(err => {
});
