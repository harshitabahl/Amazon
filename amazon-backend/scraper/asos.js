const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.asos.com/men/shirts/cat/?cid=3602",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }
  );

  await page.waitForTimeout(5000);

  // Print the first 3000 characters of the page HTML
  const html = await page.content();
  console.log(html.substring(0, 3000));

  await page.pause(); // Keeps browser open for inspection

  await browser.close();
})();