const express = require("express");
const { readData } = require("../../services/dataService");

const router = express.Router();

// GET /silver?name=...
router.get("/", (req, res) => {
  const { name } = req.query;
  const data = readData('silver');

  if (!Array.isArray(data)) {
    return res.status(500).json({ error: "Invalid data format" });
  }

  if (!name) {
    return res.status(400).json({ error: "Missing 'name' query parameter" });
  }

  const silverItem = data.find((item) => item.name.toLowerCase() === name.toLowerCase());

  if (silverItem) {
    res.status(200).json(silverItem);
  } else {
    res.status(404).json({ error: `No silver item found with name: ${name}` });
  }
});

module.exports = router;
