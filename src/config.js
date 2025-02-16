const path = require("path");

module.exports = {
  PORT: 3000,
  DATA_FILE: path.join(__dirname, "../fmarket_data.json"),
  API_URL: "https://api.fmarket.vn/res/products/filter",
};
