import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";

function cleanText(str) {
  return str ? str.replace(/\s+/g, " ").trim() : null;
}

function extractList($, selector, prefix) {
  const out = [];

  $(`${selector} li`).each((_, el) => {
    const label = cleanText($(el).find("span").first().text());
    const valueLinks = $(el).find("a");

    if (valueLinks.length > 0) {
      valueLinks.each((_, a) => {
        const text = cleanText($(a).text());
        const href = $(a).attr("href");

        out.push({
          label: label?.replace(":", "") || prefix,
          text,
          href
        });
      });
    } else {
      const text = cleanText($(el).text());
      out.push({
        label: label?.replace(":", "") || prefix,
        text
      });
    }
  });

  return out;
}

async function loadPage(url) {
  // Local file support
  if (url.startsWith("file://")) {
    let  path = url.replace("file:///", "").replace("file://", "");
    // IMPORTANT: decode %20 etc
    path = decodeURIComponent(path);
    return fs.readFileSync(path, "utf-8");
  }

  // Normal web request
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
    }
  });

  return data;
}

function parseUSDate(str) {
  const [month, day, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}


export async function scrapeProduct(url) {
  const html = await loadPage(url)
  console.log(`Loaded HTML for ${url} (length: ${html.length})`);
  const $ = cheerio.load(html);

  // TITLE
  const title = cleanText(
    $("h1.entry-title").first().text()
  );

  // AUTHOR (main page author link)
  const author = cleanText(
    $(".summary.entry-summary h3 a").first().text()
  );

  // COVER
  const cover =
    $(".woocommerce-product-gallery__image img").attr("data-large_image") ||
    $(".woocommerce-product-gallery__image img").attr("src") ||
    null;

  // SYNOPSIS
  const synopsis = cleanText(
    $(".synopsis-meta .synopsis > p:nth-child(1)").text()
  );

  // Copyright
  const copyright = cleanText(
    $(".synopsis-meta .synopsis > p:nth-child(2)").text()
  );

  // AUTHOR BIO
  const authorBio = cleanText(
    $(".author-meta .author-short p").text()
  );

  // SERIES / NARRATION / FEATURED / CREDITS / DETAILS
  const productId = $("link[rel='shortlink']").attr("href")?.match(/\?p=(\d+)/)?.[1] || null;

  const meta = extractList($, ".audiobook-meta", "meta");

  const series = meta.filter(m => m.label === "Series");
  const narration = meta.filter(m => m.label === "Narration").concat(meta.filter(m => m.label === "Featuring"));
  const genres = meta.filter(m => m.label === "Genres");
  const releaseDate =  parseUSDate(meta.find(m => m.label === "Release Date")?.text.replace("Release Date:", "").trim());
  const length = meta.find(m => m.label === "Length");

  return {
    id: productId,
    url,
    title,
    author,
    cover,
    synopsis,
    copyright,
    authorBio,

    series: series.map(s => s.text),
    narrators: narration.map(n => n.text),
    genres: genres.map(g => g.text),

    releaseDate: releaseDate || null,
    length: length?.text || null,
  };
}