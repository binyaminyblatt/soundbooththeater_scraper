import fs from "fs";
import { scrapeProduct } from "./scrapeProduct.js";


export async function scrapeAllProducts() {
    const urls = JSON.parse(fs.readFileSync("./urls.json"));

    const resultsFile = "./results.json";

    let results = [];

    if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile));
    }

    const seen = new Set(results.map(r => r.url));
    const seen_ids = new Set(results.map(r => r.id));

    for (const url of urls) {
    if (seen.has(url)) continue;

    console.log("Scraping:", url);

    try {
        const data = await scrapeProduct(url);

        if (seen_ids.has(data.id)) continue;
        if (!data.title) continue;

        results.push(data);

        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    } catch (err) {
        console.error("Failed:", url, err.message);
    }
    }

    console.log("Done:", results.length);
}
