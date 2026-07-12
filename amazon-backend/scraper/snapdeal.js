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
  // ================= MEN'S FASHION =================
  "men tshirt",
  "men shirt",
  "men jeans",
  "men trousers",
  "men joggers",
  "men shorts",
  "men kurta",
  "men jacket",
  "men sweatshirt",
  "men hoodie",

  // ================= WOMEN'S FASHION =================
  "women tshirt",
  "women top",
  "women shirt",
  "women kurti",
  "women kurta",
  "women saree",
  "women lehenga",
  "women dress",
  "women gown",
  "women jeans",
  "women leggings",
  "women palazzo",
  "women skirt",
  "women jacket",
  "women hoodie",

  // ================= FOOTWEAR =================
  "running shoes",
  "casual shoes",
  "sports shoes",
  "formal shoes",
  "heels",
  "sandals",
  "slippers",
  "flip flops",

  // ================= BAGS =================
  "backpack",
  "laptop bag",
  "travel bag",
  "duffle bag",
  "handbag",
  "wallet",

  // ================= WATCHES =================
  "men watch",
  "women watch",
  "smartwatch",

  // ================= ELECTRONICS =================
  "smartphone",
  "iphone",
  "samsung phone",
  "oneplus phone",
  "laptop",
  "gaming laptop",
  "tablet",
  "earbuds",
  "bluetooth earphones",
  "headphones",
  "speaker",
  "power bank",
  "keyboard",
  "mouse",
  "monitor",

  // ================= HOME & KITCHEN =================
  "cookware",
  "non stick pan",
  "pressure cooker",
  "knife set",
  "kitchen utensils",
  "dinner set",
  "water bottle",
  "flask",
  "storage container",
  "bedsheet",
  "blanket",
  "pillow",
  "curtain",

  // ================= BEAUTY =================
  "face wash",
  "shampoo",
  "conditioner",
  "hair oil",
  "body lotion",
  "perfume",
  "lipstick",
  "moisturizer",
  "trimmer",

  // ================= SPORTS =================
  "cricket bat",
  "football",
  "badminton racket",
  "yoga mat",
  "dumbbells",

  // ================= TOYS =================
  "lego",
  "toy car",
  "remote control car",
  "barbie doll",
  "soft toy",
  "puzzle",

  // ================= JEWELLERY =================
  "earrings",
  "necklace",
  "ring",
  "bracelet",
  "bangles"
  ];

  const seen = new Set();

  for (const keyword of keywords) {
    console.log("\n========================");
    console.log(`🔎 Searching: ${keyword}`);
    console.log("========================");

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

        // Scroll to load lazy-loaded products
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
                el.querySelector(".product-price")?.innerText?.trim() || "",

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

              // ⭐ This is the important field
              url: el.querySelector("a")?.href || "",

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

        console.log(`✅ Added: ${added} | Total: ${products.length}`);
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