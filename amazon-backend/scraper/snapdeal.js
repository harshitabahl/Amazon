const { chromium } = require("playwright");

async function scrapeSnapdeal() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 900,
    },
  });

  const products = [];

  const keywords = ["shirts", "tshirts", "jeans", "shoes"];

  console.log("🚀 Snapdeal scraping started");

  for (const keyword of keywords) {
    const url = `https://www.snapdeal.com/search?keyword=${keyword}`;

    console.log(`Searching ${keyword}`);

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 2);
      });

      await page.waitForTimeout(1500);
    }

    const data = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".product-tuple-listing")
      ).map((el) => {
        const img = el.querySelector("img");

        const image =
          img?.currentSrc ||
          img?.src ||
          img?.getAttribute("data-src") ||
          img?.getAttribute("data-original") ||
          img?.getAttribute("srcset")?.split(",")[0]?.trim().split(" ")[0] ||
          "";

        return {
          title: el.querySelector(".product-title")?.innerText || "",
          price: el.querySelector(".product-price")?.innerText || "",
          image,
          url: el.querySelector("a")?.href || "",
          source: "snapdeal",
        };
      });
    });

    products.push(...data);
  }

  // Remove duplicates
  const unique = [
    ...new Map(products.map((item) => [item.url, item])).values(),
  ];

  console.log(`✅ Snapdeal Products: ${unique.length}`);

  await browser.close();

  return unique;
}

module.exports = scrapeSnapdeal;