const axios = require("axios");
const cheerio = require('cheerio');
const { FMARKET_API_URL, ANC_URL } = require("../config");
const { writeData } = require("./dataService");

const fetchAndUpdateMutualFundData = async () => {
    console.log("🔄 Fetching data from fmarket.vn API...");
    try {
        const response = await axios.post(
            FMARKET_API_URL,
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

        writeData('mutual_fund', response.data);
        console.log("✅ Data updated successfully!");
    } catch (error) {
        console.error("❌ Error fetching data:", error.message);
    }
};

const fetchSilverPrice = async () => {
    const updatedTime = new Date().toISOString();
    console.log('🔄 Fetching silver price from Ancarat...');

    try {
        const { data } = await axios.get(ANC_URL);
        const $ = cheerio.load(data);

        // Locate the table with class 'acr-price-table-silver'
        const table = $('.acr-price-table-silver');

        const products = [];
        let nextRoundIsPrice = false;
        let currentProductName = null;

        // Iterate over each row in the table
        table.find('tr').slice(2).each((_, row) => {
            const columns = $(row).find('td');
            const productName = $(columns[0]).text().trim();

            // ignore if the product name does not contain 'bạc miếng'
            if (!productName.trim().toLocaleLowerCase().includes('bạc miếng') && !nextRoundIsPrice) {
                return;
            }

            if (!nextRoundIsPrice && productName) {
                nextRoundIsPrice = true;
                currentProductName = productName;
                return;
            }

            if (nextRoundIsPrice) {
                nextRoundIsPrice = false;
                products.push({
                    name: currentProductName,
                    sellPrice: $(columns[1]).text().trim().replace(/[\.,]/g, ''),
                    buyPrice: $(columns[2]).text().trim().replace(/[\.,]/g, ''),
                    updateTime: updatedTime
                });

                currentProductName = null;
            }
        });

        if (products) {
            writeData('silver', products);
            console.log(`✅ Silver price updated`);
        } else {
            console.error('❌ Error: Could not find the silver price.');
        }
    } catch (error) {
        console.error('❌ Error fetching silver price:', error.message);
    }
};

const fetchGoldPrice = async () => {
    console.log("🔄 Fetching gold price from Fmarket...");
  
    try {
      const response = await axios.post(
        FMARKET_API_URL,
        {
          types: ["GOLD"],
          issuerIds: [],
          page: 1,
          pageSize: 100,
          fundAssetTypes: [],
          bondRemainPeriods: [],
          searchField: "",
        },
        {
          headers: {
            "accept-language": "vi",
            "content-type": "application/json",
          },
        }
      );
  
      writeData('gold', response.data);
      console.log("✅ Gold price updated successfully!");
    } catch (error) {
      console.error("❌ Error fetching gold price:", error.message);
    }
  };

module.exports = { fetchAndUpdateMutualFundData, fetchSilverPrice, fetchGoldPrice };
