// This file contains intentional security vulnerabilities for testing static analysis tools
// These are NOT recommended practices and should never be used in production code

// Vulnerability 1: Hardcoded credentials
const DB_PASSWORD = 'admin123';
const API_KEY = 'secret-api-key-12345';

// Vulnerability 2: Unsafe use of eval
function processUserInput(input) {
    // This is dangerous - using eval with user input
    return eval(`"Hello " + ${input}`);
}

// Vulnerability 3: Insecure random number generation
function generateToken() {
    // Using Math.random() which is not cryptographically secure
    return Math.random().toString(36).substring(2, 15);
}

// Vulnerability 4: Command injection vulnerability
const { exec } = require('child_process');

function executeCommand(userInput) {
    // This is dangerous - directly using user input in shell commands
    const command = `ls ${userInput}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
}

// Vulnerability 5: Insecure HTTP client
const axios = require('axios');

async function fetchUserData(url) {
    // This disables SSL verification - dangerous in production
    const response = await axios.get(url, {
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    return response.data;
}

// Vulnerability 6: SQL injection vulnerability (simulated)
function getUserById(userId) {
    // This is vulnerable to SQL injection
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    // In a real app, this would execute the query against a database
    return query;
}

// Vulnerability 7: Weak hash function usage
const crypto = require('crypto');

function createHash(data) {
    // Using MD5 which is cryptographically weak
    return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = {
    DB_PASSWORD,
    API_KEY,
    processUserInput,
    generateToken,
    executeCommand,
    fetchUserData,
    getUserById,
    createHash
};
