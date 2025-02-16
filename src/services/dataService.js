const fs = require("fs");
const { DATA_FILE } = require("../config");

// Ensure the data file exists
const ensureDataFileExists = () => {
  if (!fs.existsSync(DATA_FILE)) {
    console.log("⚠️ Data file not found. Creating an empty JSON file.");
    fs.writeFileSync(DATA_FILE, JSON.stringify({ data: { rows: [] } }, null, 2), "utf-8");
  }
};

// Read data from file
const readData = () => {
  ensureDataFileExists();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = { ensureDataFileExists, readData, writeData };
