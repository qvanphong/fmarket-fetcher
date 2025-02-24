const path = require("path");

module.exports = {
  PORT: 3000,
  MUTUAL_FUND_DATA_FILE: path.join(__dirname, "../mutual_fund_data.json"),
  PRECIOUS_FUND_GOLD_FILE: path.join(__dirname, "../gold_data.json"),
  PRECIOUS_FUND_SILVER_FILE: path.join(__dirname, "../silver_data.json"),
  FMARKET_API_URL: "https://api.fmarket.vn/res/products/filter",
  ANC_URL: "https://ancarat.com/bac-ancarat",
};
