import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import qs from "qs";
import { scrapeAllProducts } from "./scraper.js";
const urlsFile = "./urls.json";

const query = {
  product_cat: "audiobooks",
  taxonomy: "product_cat",
  term: "audiobooks",
  posts_per_page: 16,
  orderby: "menu_order title",
  order: "ASC"
};

async function fetchPage(page) {
  const { data } = await axios.post(
    "https://soundbooththeater.com/wp-admin/admin-ajax.php",
    qs.stringify({
      action: "loadmore",
      query: JSON.stringify(query),
      page,
      first_page_load: page === 0,
      search: ""
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
      }
    }
  );

  return data;
}

async function scrapeAllUrls() {
  const allUrls = new Set();

  let first = await fetchPage(0);

  const maxPages = first.max_pages;
  console.log("Max pages:", maxPages);

  // parse page 0 + extract urls
  extractUrls(first.posts, allUrls);

  for (let page = 1; page < maxPages; page++) {
    console.log(`Page ${page}/${maxPages}`);

    const res = await fetchPage(page);

    if (!res?.posts) break;

    extractUrls(res.posts, allUrls);
  }

  fs.writeFileSync(
    urlsFile,
    JSON.stringify([...allUrls], null, 2)
  );

  console.log(`Done. URLs: ${allUrls.size}`);

  await scrapeAllProducts();
}

function extractUrls(html, set) {
  const $ = cheerio.load(html);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");

    if (href?.includes("/shop/")) {
      set.add(href.split("?")[0]);
    }
  });
}

scrapeAllUrls();
