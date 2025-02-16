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

// API endpoint to serve the local JSON file
app.get("/fmarketMutualFund", (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    res.sendFile(DATA_FILE);
  } else {
    res.status(404).json({ error: "Data not available" });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await fetchAndUpdateData(); // Fetch data once on startup
});

