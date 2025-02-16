const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "fmarket_data.json");

// Function to fetch data from API and update local file
const fetchAndUpdateData = async () => {
  console.log("Fetching data from fmarket.vn API...");
  try {
    const response = await axios.post(
      "https://api.fmarket.vn/res/products/filter",
      {
        types: ["NEW_FUND", "TRADING_FUND"],
        issuerIds: [],
        sortOrder: "DESC",
        sortField: "navTo12Months",
        page: 1,
        pageSize: 100,
        isIpo: false,
        fundAssetTypes: [],
        bondRemainPeriods: [],
        searchField: "",
        isBuyByReward: false,
        thirdAppIds: [],
      },
      {
        headers: {
          "accept-language": "vi",
          "content-type": "application/json",
        },
      }
    );

    fs.writeFileSync(DATA_FILE, JSON.stringify(response.data, null, 2), "utf-8");
    console.log("Data updated successfully!");
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

// Schedule the background task to run every hour
cron.schedule("0 * * * *", fetchAndUpdateData); // Runs at the start of every hour

// API endpoint to serve the full JSON data
app.get("/fmarketMutualFund", (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    res.sendFile(DATA_FILE);
  } else {
    res.status(404).json({ error: "Data not available" });
  }
});

// API endpoint to fetch a specific mutual fund by code
app.get("/fmarketMutualFund/:code", (req, res) => {
  const code = req.params.code.toUpperCase(); // Ensure case-insensitive search

  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).json({ error: "Data not available" });
  }

  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    const jsonData = JSON.parse(rawData);

    if (!jsonData.data || !jsonData.data.rows) {
      return res.status(500).json({ error: "Invalid data format" });
    }

    const fund = jsonData.data.rows.find((item) => item.code === code);

    if (fund) {
      res.json(fund);
    } else {
      res.status(404).json({ error: `No mutual fund found with code: ${code}` });
    }
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await fetchAndUpdateData(); // Fetch data once on startup
});

