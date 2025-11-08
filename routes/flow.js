const axios = require("axios");
const https = require("https");
const { Factors } = require("../models"); 

async function fetchAndSave() {
  try {
    console.log("FETCH START");

    const response = await axios.post(
      "https://127.0.0.1:8081",
      { DoListAsnad: [""] },
      {
        headers: {
          Authorization:
            "Bearer I8R2C5D1H8H5F7F7N5X8U3A8W5T8H2H3M6G8B3V7L6B8R3O1R8I4J5W4B7V5J3X2E4K1O4X6N4J8F4S4",
          DBName: "db",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }
    );

    const data = Object.values(response.data);

    const filtered = data.filter(
      (item) => item.MCode && item.MCode !== 0 && item.NO && item.NO.startsWith("فروش")
    );

    const uniqueCodes = [...new Set(filtered.map((item) => item.Factor_Code))];

    for (const code of uniqueCodes) {
      const items = filtered.filter((item) => item.Factor_Code === code);

      const details = items.map((i) => ({
        Name: i.No_Kar,
        count: Number(i.Count) || 0,
        weight: Number(i.Vazn) || 0,
        Fi: Number(i.Fi) || 0,
      }));

      const price = details.reduce((sum, i) => sum + i.Fi, 0);
      const weight = details.reduce((sum, i) => sum + i.count * i.weight, 0);

      let mobile = null;
      const mcode = items[0].MCode;
      try {
        const mobileResp = await axios.post(
          "https://127.0.0.1:8081",
          { DoListMoshtari: [mcode] }, 
          {
            headers: {
              Authorization:
                "Bearer I8R2C5D1H8H5F7F7N5X8U3A8W5T8H2H3M6G8B3V7L6B8R3O1R8I4J5W4B7V5J3X2E4K1O4X6N4J8F4S4",
              DBName: "db",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }
        );

        if (mobileResp.data && typeof mobileResp.data === "object") {
          const firstKey = Object.keys(mobileResp.data)[0];
          mobile = mobileResp.data[firstKey]?.Mobile || null;
        }
      } catch (err) {
        console.error(" خطا در گرفتن موبایل برای MCode:", mcode, err.message);
        mobile = null;
      }

      const ZamanSabt = items[0].ZamanSabt;

      await Factors.upsert({
        Factor_Code: code,
        mobile,
        details,
        weight,
        price,
        ZamanSabt,
      });
    }

    console.log(" DONE");
  } catch (err) {
    console.error("خطا در اجرای Flow:", err.message);
  }
}

module.exports = { fetchAndSave };
