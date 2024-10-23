const crypto = require('crypto');
const fs = require('fs');

let previousHash = '';

export function saveLog(log) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        ...log,
        prevHash: previousHash,
    };
    const logString = JSON.stringify(logEntry);
    const hash = crypto.createHash('sha256').update(logString).digest('hex');
    logEntry.hash = hash;

    // Update previous hash
    previousHash = hash;

    // Append log to file
    fs.appendFileSync('logs.txt', JSON.stringify(logEntry) + '\n', 'utf8');
}
