const { chromium } = require("playwright");

async function scrapeSnapdeal() {
  console.log("🚀 scrapeSnapdeal() started");

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
  const keywords = [
  // ================= SHOES =================
  "loafers",
  "slippers",
  "flip flops",
  "sandals",

  // ================= ACCESSORIES =================
  "backpack",
  "travel bag",
  "laptop bag",
  "duffle bag",
  "sunglasses",

  // ================= HOME & KITCHEN =================
  "non stick pan",
  "knife set",
  "kitchen utensils",
  "dinner set",
  "water bottle",
  "flask",
  
  // ================= BEAUTY =================
  "shampoo",
  "conditioner",
  "hair oil",
  "trimmer",

  // ================= TOYS =================
  "lego",
  "toy car",
  "remote control car",
  ];



  const seen = new Set();

  for (const keyword of keywords) {
    console.log(`\n========================`);
    console.log(`🔎 Searching: ${keyword}`);
    console.log(`========================`);

    for (let pageNo = 1; pageNo <= 3; pageNo++) {
      try {
        console.log(`📄 Page ${pageNo}`);

        await page.goto(
          `https://www.snapdeal.com/search?keyword=${encodeURIComponent(
            keyword
          )}&page=${pageNo}`,
          {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          }
        );

        try {
          await page.waitForSelector(".product-tuple-listing", {
            timeout: 5000,
          });
        } catch {
          console.log("⚠️ No more products.");
          break;
        }

        for (let s = 0; s < 8; s++) {
          await page.mouse.wheel(0, 3000);
          await page.waitForTimeout(600);
        }

        const data = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll(".product-tuple-listing")
          ).map((el) => {
            const img = el.querySelector("img");

            return {
              title:
                el.querySelector(".product-title")?.innerText?.trim() || "",

              price:
                el.querySelector(".product-price")?.innerText || "",

              image:
                img?.currentSrc ||
                img?.src ||
                img?.getAttribute("data-src") ||
                img?.getAttribute("data-original") ||
                img?.getAttribute("srcset")
                  ?.split(",")[0]
                  ?.trim()
                  ?.split(" ")[0] ||
                "",

              url:
                el.querySelector("a")?.href || "",

              source: "Snapdeal",
            };
          });
        });

        let added = 0;

        for (const p of data) {
          if (!p.title) continue;

          const key = p.url || `${p.title}-${p.price}`;

          if (seen.has(key)) continue;

          seen.add(key);
          products.push(p);
          added++;
        }

        console.log(
          `✅ Added: ${added} | Total: ${products.length}`
        );
      } catch (err) {
        console.log(`❌ ${keyword} Page ${pageNo}: ${err.message}`);
      }
    }
  }

  console.log(`🎉 Total scraped: ${products.length}`);

  await browser.close();

  return products;
}

module.exports = scrapeSnapdeal;