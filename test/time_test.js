const fs = require('fs');
const path = require('path');

let directory;
const args = process.argv.slice(2);
args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key === '--directory') {
        directory = value;
    } else {
        throw "--directory=[value] option required.";
    }
});

// Helper function to convert time strings to seconds
const timeToSeconds = (timeStr) => {
    const [_, minutes, seconds] = timeStr.match(/(\d+)m([\d.]+)s/);
    return parseFloat(minutes) * 60 + parseFloat(seconds);
};

// Helper function to calculate standard deviation
const standardDeviation = (values) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => {
        const diff = value - avg;
        return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
};

// Read and process each .txt file in the directory
const files = fs.readdirSync(directory).filter(file => file.endsWith('.txt'));

const tValues = files.map((file) => {
    const filepath = path.join(directory, file);
    const data = fs.readFileSync(filepath, 'utf8');
    const lines = data.split('\n');

    const realTime = timeToSeconds(lines[1].split('\t')[1]);
    const userTime = timeToSeconds(lines[2].split('\t')[1]);
    const sysTime = timeToSeconds(lines[3].split('\t')[1]);

    return Math.min(realTime, userTime + sysTime);
});

const tMin = Math.min(...tValues);
const tMax = Math.max(...tValues);
const tAvg = tValues.reduce((a, b) => a + b, 0) / tValues.length;
const tSd = standardDeviation(tValues);

// console.log(tValues);
console.log(`Min: ${tMin} seconds`);
console.log(`Max: ${tMax} seconds`);
console.log(`Average: ${tAvg} seconds`);
console.log(`Standard Deviation: ${tSd} seconds`);
