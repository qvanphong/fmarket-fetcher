const express = require("express");
const { readData } = require("../../services/dataService");

const router = express.Router();

// Get all funds
router.get("/", (req, res) => {
  res.status(200).json(readData());
});

// Get fund by code
router.get("/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const data = readData();

  if (!data.data || !data.data.rows) {
    return res.status(500).json({ error: "Invalid data format" });
  }

  const fund = data.data.rows.find((item) => item.code === code);

  if (fund) {
    res.status(200).json(fund);
  } else {
    res.status(404).json({ error: `No mutual fund found with code: ${code}` });
  }
});

module.exports = router;
