const express = require("express");
const cron = require("node-cron");
const { PORT } = require("./config");
const { ensureDataFileExists } = require("./services/dataService");
const { fetchAndUpdateData } = require("./services/fetchService");
const fundsRouter = require("./routes/funds");

const app = express();

// Middleware to set JSON headers
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Ensure data file exists before server starts
ensureDataFileExists();

// Routes
app.use("/fmarketMutualFund", fundsRouter);

// Schedule fetch every hour
cron.schedule("0 * * * *", fetchAndUpdateData); // Runs every hour

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await fetchAndUpdateData(); // Fetch initial data on startup
});
