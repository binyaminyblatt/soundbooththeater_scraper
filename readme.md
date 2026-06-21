# Soundbooth Theater Audiobook Dataset

This dataset is a scraped collection of audiobook metadata from Soundbooth Theater, built using a custom Node.js scraper that extracts structured information from WooCommerce product pages.

---

## 📌 Overview

The scraper collects audiobook data from:

* Public audiobook catalog pages
* Product detail pages
* WordPress/WooCommerce AJAX endpoints (`admin-ajax.php`)

Each audiobook is stored as a structured JSON object for use in media libraries, metadata agents, or Audiobookshelf imports.

---

## 📊 Data Source

* Website: https://soundbooththeater.com
* Catalog endpoint: `/audiobooks/`
* Product system: WooCommerce (WordPress)

Each product is identified by a stable WordPress product ID:

```
https://soundbooththeater.com/?p=227971
```

---

## 🧾 Dataset Structure

Each record follows this schema:

```json
{
  "id": 227971,
  "url": "https://soundbooththeater.com/shop/audiobooks/example-title/",
  "title": "Example Title",
  "author": "Author Name",
  "series": ["Series Name"],
  "narrators": ["Narrator Name"],
  "genres": ["Genre"],
  "releaseDate": "2023-09-01T00:00:00.000Z",
  "cover": "https://...",
  "length": "3 hours and 4 minutes",
  "synopsis": "Book description...",
  "authorBio": "Author biography...",
  "credits": [
    {
      "label": "Narration",
      "text": "Jeff Hays",
      "href": "https://..."
    }
  ]
}
```

---

## ⚙️ How It Works

The scraper:

1. Fetches full catalog pages via WordPress AJAX (`loadmore`)
2. Extracts product URLs
3. Visits each product page
4. Parses HTML using Cheerio
5. Normalizes metadata into structured JSON
6. Deduplicates using WordPress product ID

---

## 🚀 Key Features

* Supports pagination via `max_pages`
* Resume-safe scraping with URL caching
* Deduplication by product ID and URL
* Handles multi-credit fields (cast, narration, music, etc.)

---

## 🧠 Design Notes

* Product ID is the primary stable identifier
* Release dates are normalized to ISO format
* Series and cast fields are stored as arrays
* HTML fragments from AJAX endpoints are parsed directly

---

## 📁 Output Files

* `urls.json` → all discovered product URLs for the ability to stop and resume
* `results.json` → final structured dataset

---

## 📦 Intended Use

This dataset is intended for:

* Audiobook library managers (e.g., Audiobookshelf)
* Metadata enrichment tools
* Personal media indexing systems
* Research and cataloging

---

## ⚠️ Disclaimer

This project is intended for personal and educational use. Respect the source website’s terms of service and rate-limit requests appropriately.

---

## 🤖 Automated Daily Scraping (GitHub Actions)

This project includes a GitHub Actions workflow that automatically runs the scraper once per day.

The workflow:

Executes the full scraping pipeline
Fetches any new or updated audiobook entries
Updates results.json
Commits and pushes changes back to the repository

## 🔄 Live Updating Dataset

The results.json file is continuously maintained and will change over time as:

New audiobooks are released
Existing entries are updated
Metadata is refined or corrected

This means the dataset is not static, but a continuously evolving snapshot of the Soundbooth Theater catalog.

## ⚠️ Notes

Updates run on a scheduled daily interval via GitHub Actions
Changes are automatically committed to the repository
Data freshness depends on scraper execution success and site availability

---

## 📄 License

This codebase (scraper, tooling, and scripts) is licensed under the MIT License.

You are free to use, modify, and distribute the software in accordance with the MIT License terms.

## 📚 Data Ownership Notice

All scraped data (including audiobook metadata, descriptions, cover images, and related content) is the property of their respective owners, including but not limited to Soundbooth Theater and original content creators.

This project does not claim ownership over any of the collected data.

The dataset is provided for:

Personal use
Educational purposes
Research and metadata processing

You are responsible for ensuring your use of the data complies with the original source’s Terms of Service and applicable copyright laws.
