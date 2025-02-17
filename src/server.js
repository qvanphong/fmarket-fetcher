const express = require("express");
const cron = require("node-cron");
const { PORT } = require("./config");
const { ensureDataFileExists } = require("./services/dataService");
const { fetchAndUpdateMutualFundData, fetchSilverPrice, fetchGoldPrice } = require("./services/fetchService");
const mutualFundsRouter = require("./routes/funds/mutualFund");
const silverRouter = require("./routes/preciousMetal/silver");
const goldRouter = require("./routes/preciousMetal/gold");

const app = express();

// Middleware to set JSON headers
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Ensure data file exists before server starts
ensureDataFileExists();

// Routes
app.use("/fmarketMutualFund", mutualFundsRouter);
app.use("/silver", silverRouter);
app.use("/gold", goldRouter);

// Schedule fetch every hour
cron.schedule("0 * * * *", fetchAndUpdateMutualFundData); // Runs every hour
cron.schedule("0 * * * *", fetchSilverPrice); // Runs every hour
cron.schedule("0 * * * *", fetchGoldPrice); // Runs every hour

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  fetchAndUpdateMutualFundData(); // Fetch initial data on startup
  fetchGoldPrice(); // Fetch gold price on startup
  fetchSilverPrice(); // Fetch silver price on startup
});
