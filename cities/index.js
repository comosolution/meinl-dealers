/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFile = path.join(__dirname, "worldcities.csv");
const outputFile = path.join(__dirname, "cities.json");

const results = [];
const seen = new Set();

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    const city = row.city || row.city_ascii;
    const country = row.country;

    if (city && country) {
      const key = `${city.toLowerCase()},${country.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ city, country });
      }
    }
  })
  .on("end", () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Saved ${results.length} unique cities to ${outputFile}`);
  });
