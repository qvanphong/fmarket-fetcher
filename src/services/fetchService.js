const axios = require("axios");
const cheerio = require('cheerio');
const { FMARKET_API_URL, ANC_URL, PQ_URL } = require("../config");
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
    let products = [];
    const silverProducts = await Promise.all([fetchAncaratSilverPrice(), fetchSilverPqPrice()]);
    products = [...silverProducts[0], ...silverProducts[1]];

    if (products) {
        writeData('silver', products);
        console.log(`✅ Silver price updated`);
    }
}

const fetchAncaratSilverPrice = async () => {
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

        return products;
    } catch (error) {
        console.error('❌ Error fetching Ancarat silver price:', error.message);
        return [];
    }
};

const fetchSilverPqPrice = async () => {
    const updatedTime = new Date().toISOString();
    console.log('🔄 Fetching silver price from Phu Quy...');

    try {
        const { data } = await axios.get(PQ_URL);
        const $ = cheerio.load(data);

        const table = $('.table');

        const products = [];
        let needToStop = false;

        // Iterate over each row in the table
        table.find('tr').slice(1).each((_, row) => {
            if (needToStop) {
                return;
            }

            const columns = $(row).find('td');
            const productName = $(columns[0]).text().trim();

            if (productName.trim().toLocaleLowerCase().includes('bạc thương hiệu khác')) {
                needToStop = true;
                return;
            }

            if (productName.trim().toLocaleLowerCase().includes('bạc thương hiệu phú quý')) {
                return;
            }

            products.push({
                name: productName,
                sellPrice: $(columns[3]).text().trim().replace(/[\.,]/g, ''),
                buyPrice: $(columns[2]).text().trim().replace(/[\.,]/g, ''),
                updateTime: updatedTime
            });
        });

        return products;
    } catch (error) {
        console.error('❌ Error fetching silver Phu Quy price:', error.message);

        return [];
    }
}

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
