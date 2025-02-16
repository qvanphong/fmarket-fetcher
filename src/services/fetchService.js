const axios = require("axios");
const { API_URL } = require("../config");
const { writeData } = require("./dataService");

const fetchAndUpdateData = async () => {
  console.log("🔄 Fetching data from fmarket.vn API...");
  try {
    const response = await axios.post(
      API_URL,
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

    writeData(response.data);
    console.log("✅ Data updated successfully!");
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
};

module.exports = { fetchAndUpdateData };
