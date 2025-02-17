const fs = require("fs");
const { MUTUAL_FUND_DATA_FILE, PRECIOUS_FUND_GOLD_FILE, PRECIOUS_FUND_SILVER_FILE: PRECIOUS_FUND_ANCARAT_FILE } = require("../config");

// Ensure the data file exists
const ensureDataFileExists = (type) => {
    const dataFile = determineDataFilePath(type);
    if (!fs.existsSync(dataFile)) {
        console.log("⚠️ Data file not found. Creating an empty JSON file.");
        fs.writeFileSync(dataFile, JSON.stringify({}, null, 2), "utf-8");
    }
};

// Read data from file
const readData = (type) => {
    const dataFile = determineDataFilePath(type);
    ensureDataFileExists(type);
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
};

// Write data to file
const writeData = (type, data) => {
    fs.writeFileSync(determineDataFilePath(type), JSON.stringify(data, null, 2), "utf-8");
};

const determineDataFilePath = (type) => {
    switch (type) {
        case 'gold':
            return PRECIOUS_FUND_GOLD_FILE;
        case 'silver':
            return PRECIOUS_FUND_ANCARAT_FILE;
        default:
            return MUTUAL_FUND_DATA_FILE;
    }
}

module.exports = { ensureDataFileExists, readData, writeData };
