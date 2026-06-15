const fs = require("fs");
const path = require("path");

const IMAGE_CATEGORY_MAP = {
  Electronics: "ELECTRONICS",
  Fashion: "CLOTHING_ACCESSORIES_JEWELLERY",
  Accessories: "CLOTHING_ACCESSORIES_JEWELLERY",
  "Home & Kitchen": "HOME_KITCHEN_TOOLS",
  Beauty: "BEAUTY_HEALTH",
  Sports: "SPORTS_OUTDOOR",
  Books: "HOBBY_ARTS_STATIONERY",
  Toys: "BABY_PRODUCTS",
  Gadgets: "ELECTRONICS",
};

const IMAGE_POOLS = {};

for (const [category, folder] of Object.entries(IMAGE_CATEGORY_MAP)) {
  const folderPath = path.join(
    __dirname,
    "../public/product-images",
    folder
  );

  IMAGE_POOLS[category] = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".jpeg"))
    .map(
      (file) =>
        `/product-images/${folder}/${file}`
    );
}

module.exports = IMAGE_POOLS;