
require("dotenv").config();

const OpenAI = require("openai");
const Product = require("../models/Product");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Words that don't help much when searching products
const stopWords = [
  "i", "am", "a", "an", "the", "is", "are", "for",
  "to", "of", "with", "and", "or", "me", "my",
  "want", "need", "looking", "show", "find", "suggest",
  "recommend", "please", "buy", "best", "good", "some",
  "products", "product", "under", "below", "less", "than",
  "within", "upto", "up", "maximum", "max", "budget",
  "rupees", "rs", "in", "on", "can", "you", "get",
  "compare", "comparison", "between", "difference",
  "vs", "versus", "which", "better", "compare", "comparison", "between", "difference",
"vs", "versus", "which", "better", "only", "just"
];

// Map user-friendly words to database categories
const categoryKeywords = {
  shoes: [
    "shoes", "shoe", "footwear", "sneakers",
    "sandals", "slippers", "heels"
  ],
  electronics: [
    "electronics", "mobile", "mobiles", "phone",
    "phones", "smartphone", "smartphones", "laptop",
    "laptops", "headphones", "earphones", "watch"
  ],
  clothing: [
    "clothing", "clothes", "shirt", "shirts",
    "tshirt", "tshirts", "jeans", "dress",
    "dresses", "top", "tops"
  ],
  bags: [
    "bags", "bag", "backpack", "backpacks",
    "handbag", "handbags"
  ],
  beauty: [
    "beauty", "makeup", "cosmetics", "skincare",
    "lipstick", "perfume"
  ],
  "home and kitchen": [
    "home", "kitchen", "furniture", "decor", "appliances"
  ],
  sports: [
    "sports", "fitness", "gym", "cricket", "football"
  ],
  toys: [
    "toys", "toy", "games", "dolls"
  ],
  watches: [
    "watches", "watch", "smartwatch", "smartwatches"
  ]
};

// Specific product intents
const productIntents = {
  phone_accessory: [
  "phone case",
  "phone cases",
  "mobile case",
  "mobile cases",
  "phone cover",
  "phone covers",
  "mobile cover",
  "mobile covers",
  "screen protector",
  "screen protectors",
  "screen guard",
  "mobile holder",
  "phone holder",
  "selfie stick"
],

laptop_bag: [
  "laptop bag",
  "laptop bags"
],
laptop_sleeve: [
  "laptop sleeve",
  "laptop sleeves"
],

laptop_stand: [
  "laptop stand",
  "laptop stands",
  "laptop table",
  "laptop tables"
],

  laptop_accessory: [
  "laptop bag",
  "laptop bags",
  "laptop sleeve",
  "laptop sleeves",
  "laptop stand",
  "laptop stands",
  "laptop charger",
  "laptop chargers",
  "laptop table",
  "laptop tables"
],

  smartphone: [
  "smartphone",
  "smartphones",
  "mobile phone",
  "mobile phones",
  "iphone",
  "phone",
  "phones",
  "mobile",
  "mobiles"
],
  laptop: [
    "laptop",
    "laptops",
    "notebook",
    "chromebook"
  ]
};

// Product keywords that should not appear in device results
const excludedProductKeywords = {
  
  smartphone: [
  "charger",
  "charging",
  "cable",
  "case",
  "cover",
  "protector",
  "holder",
  "stand",
  "dock",
  "gift",
  "hamper",
  "cleaning",
  "kit",
  "mount",
  "adapter",
  "selfie",
  "tripod",
  "pouch",
  "bag",
  "brush",
  "tempered",
  "tempered glass",
  "screen guard",
  "screen film",
  "display guard",
  "glass compatible",
  "compatible for"
],

  
  laptop: [
    // Bags and sleeves
    "laptop bag",
    "laptop sleeve",
    "laptop pouch",
    "laptop backpack",

    // Stands and tables
    "laptop stand",
    "laptop table",
    "laptop riser",
    "laptop holder",

    // Charging and connectivity accessories
    "laptop charger",
    "laptop adapter",
    "laptop cable",
    "laptop charging",
    "laptop extension",
    "laptop hub",
    "laptop dock",
    "laptop converter",

    // Covers and protection
    "laptop cover",
    "laptop skin",
    "laptop decal",
    "laptop sticker",
    "laptop camera cover",
    "laptop webcam cover",
    "laptop keyboard cover",
    "laptop screen guard",
    "laptop protector",

    // Cleaning and miscellaneous
    "laptop cleaning",
    "laptop brush",
    "laptop cloth",
    "laptop cooling pad",
    "laptop fan",
    "laptop accessory",
    "laptop accessories",
        // Generic accessory keywords
    "sticker",
    "decal",
    "vinyl",
    "cable",
    "cloth",
    "microfiber",
    "adapter",
    "adaptor",
    "splitter",
    "extension board",
    "cleaning gel",
    "otg",
    "hdmi",
    "printer",
    "webcam",
    "camera cover",
    "screen guard",
    "protector",
    "mount",
    "cooling pad",
    "mouse",
    // Batteries and repair tools
    "battery",
    "batteries",
    "rechargeable",
    "lithium ion",
    "cell",
    "screwdriver",
    "screwdriver set",
    "repair",
    "repair tool",
    "repair tools",
    "tool kit",
    "tools kit",
    "precision tool",
    "mobile",
    "power bank",
    "bluetooth speaker",
    "torch",
    // Non-laptop products that mention laptop
      "toy",
      "toys",
      "educational",
      "kids",
      "learning computer",
      "steering wheel",
      "car interior",
      "cleaning brush",
      "cleaning brushes",
      "cleaning",
      "brush",
      "brushes",
      "desk",
      "tray",
      "trays",
      "movie",
      "movies",
      "play only",
      "charger",
      "chargers",
      "fast charger",
      "charging"
  ]
};

// Escape special characters before creating regular expressions
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Identify the user's product intent
function extractProductIntent(message) {
  const normalizedMessage = message.toLowerCase();

 const intentPriority = [
  "phone_accessory",
  "laptop_bag",
  "laptop_sleeve",
  "laptop_stand",
  "laptop_accessory",
  "smartphone",
  "laptop"
];
  for (const intent of intentPriority) {
    const keywords = productIntents[intent] || [];

    if (
      keywords.some(keyword =>
        new RegExp(
          `(^|\\W)${escapeRegex(keyword)}($|\\W)`,
          "i"
        ).test(normalizedMessage)
      )
    ) {
      return intent;
    }
  }

  // Generic charger search
  if (/\bchargers?\b/i.test(normalizedMessage)) {
    return "general_accessory";
  }

  return null;
}

// Extract useful search words from the user's message
function extractKeywords(message) {
  const words = message
    .toLowerCase()
    .replace(/[₹,]/g, " ")
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ""))
    .filter(word =>
      word.length > 1 &&
      !stopWords.includes(word) &&
      !/^\d+$/.test(word)
    );

  const matchedCategories = [];

  for (const [category, synonyms] of Object.entries(categoryKeywords)) {
    if (words.some(word => synonyms.includes(word))) {
      matchedCategories.push(category);
    }
  }

  return {
    keywords: words.slice(0, 6),
    categories: matchedCategories
  };
}

// Extract maximum budget
function extractBudget(message) {
  const match = message.match(
    /(?:under|below|less than|within|upto|up to|max(?:imum)?|budget(?: of)?)\s*₹?\s*([\d,]+)/i
  );

  if (!match) return null;

  const budget = Number(match[1].replace(/,/g, ""));

  return Number.isFinite(budget) && budget > 0
    ? budget
    : null;
}

// Build title-based conditions for specific product intents
function getIntentSearchCondition(intent) {
  if (intent === "smartphone") {
  return {
    title: {
      $regex: /smartphone|mobile phone|iphone|samsung|redmi|realme|motorola|oneplus|vivo|oppo|poco|infinix|tecno|nokia/i
    }
  };
  }

  if (intent === "laptop") {
    return {
      title: {
        $regex: /laptop|notebook|chromebook/i
      }
    };
  }

  
 if (intent === "phone_accessory") {
  return {
    title: {
      $regex: /phone cases?|mobile cases?|phone covers?|mobile covers?/i
    },
    $nor: [
      {
      title: {
        $regex: /bike phone mount|phone holder|mobile holder|handlebar mount/i
      }
      }
    ]
  };
}

if (intent === "laptop_bag") {
  return {
    title: {
      $regex: /laptop bags?/i
    }
  };
}

if (intent === "laptop_sleeve") {
  return {
    title: {
      $regex: /laptop sleeves?/i
    }
  };
}

if (intent === "laptop_stand") {
  return {
    title: {
      $regex: /laptop stands?|laptop tables?/i
    }
  };
}

if (intent === "laptop_accessory") {
  return {
    title: {
      $regex: /laptop chargers?|laptop cleaning|laptop keyboard cover|laptop adapters?/i
    }
  };
}

  if (intent === "general_accessory") {
    return {
      title: {
        $regex: /charger|charging cable|usb cable/i
      }
    };
  }

  return null;
}

// Main chatbot controller
const chatWithAI = async (req, res) => {
  try {
    const {
  message,
  conversationHistory = [],
  previousProductIds = []
} = req.body;

// Validate conversation history
if (
  !Array.isArray(conversationHistory) ||
  conversationHistory.length > 10 ||
  !conversationHistory.every(
    item =>
      item &&
      typeof item === "object" &&
      ["user", "assistant"].includes(item.role) &&
      typeof item.content === "string" &&
      item.content.trim().length > 0 &&
      item.content.length <= 1000
  )
) {
  return res.status(400).json({
    message: "Invalid conversation history."
  });
}

// Validate previous product IDs
if (
  !Array.isArray(previousProductIds) ||
  previousProductIds.length > 8 ||
  !previousProductIds.every(
    id => typeof id === "string" && /^[a-f\d]{24}$/i.test(id)
  )
) {
  return res.status(400).json({
    message: "Invalid previous product IDs."
  });
}

    // Validate user input
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a message."
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        message: "Message is too long. Please keep it under 1000 characters."
      });

        // Handle greetings without searching products
    const normalizedMessage = message.trim().toLowerCase();

    const greetings = [
      "hi",
      "hello",
      "hey",
      "hii",
      "hiii",
      "good morning",
      "good afternoon",
      "good evening",
      "thanks",
      "thank you",
      "bye",
      "goodbye"
    ];

    if (greetings.includes(normalizedMessage.replace(/[!.?,]+$/g, ""))) {
      return res.status(200).json({
        reply: "Hi! What can I help you find today?",
        products: [],
        productIds: []
      });
    }
  }

    // Extract shopping requirements
    const { keywords, categories } = extractKeywords(message);

    const productIntent = extractProductIntent(message);

    const budget = extractBudget(message);

    // Base MongoDB query
    const mongoQuery = {
      inStock: true,
      inventory: { $gt: 0 },
      price: { $gt: 0 }
    };

    // Specific product intent search
    const intentCondition = getIntentSearchCondition(productIntent);
      console.log("CHAT DEBUG:", {
        message,
        productIntent,
        budget,
        mongoQuery
      });

    if (intentCondition) {
      mongoQuery.$and = [intentCondition];
      // Respect the requested Samsung brand
      if (
        productIntent === "smartphone" &&
        /\bsamsung\b/i.test(message)
      ) {
        mongoQuery.$and.push({
          $or: [
            { brand: { $regex: "samsung", $options: "i" } },
            { title: { $regex: "samsung", $options: "i" } }
          ]
        });
      }

      // Exclude accessories from actual device searches
      if (excludedProductKeywords[productIntent]) {
        mongoQuery.$nor = excludedProductKeywords[productIntent].map(
          keyword => ({
            title: {
              $regex: escapeRegex(keyword),
              $options: "i"
            }
          })
        );
      }
    } else {
      // General product search

      if (keywords.length > 0) {
        const keywordConditions = keywords.map(keyword => {
          const safeKeyword = escapeRegex(keyword);
          const keywordRegex = new RegExp(
            `(^|\\W)${safeKeyword}($|\\W)`,
            "i"
          );

          return {
            $or: [
              { title: { $regex: keywordRegex } },
              { desc: { $regex: keywordRegex } },
              { brand: { $regex: keywordRegex } },
              { tags: { $regex: keywordRegex } }
            ]
          };
        });

        // Every keyword must match
        mongoQuery.$and = [
          ...(mongoQuery.$and || []),
          ...keywordConditions
        ];

      } else if (categories.length > 0) {
        mongoQuery.$or = categories.map(category => ({
          categories: category
        }));
      }
    }


    // Apply maximum budget
    if (budget) {
      mongoQuery.price.$lte = budget;
    }

    // Retrieve real products from ShopSphere
    let products;

    if (previousProductIds.length > 0) {
      // Apply new search filters to previously shown products
      products = await Product.find({
        ...mongoQuery,
        _id: { $in: previousProductIds }
      })
        .sort({ price: 1 })
        .limit(40)
        .lean();
    } else {
      // Perform a fresh product search
      products = await Product.find(mongoQuery)
        .sort({ price: 1 })
        .limit(40)
        .lean();
    }
    // Remove duplicate products based on their titles
    const uniqueProducts = [];
    const seenTitles = new Set();

    for (const product of products) {
      const normalizedTitle = product.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueProducts.push(product);
      }

      if (uniqueProducts.length === 8) break;
    }

    // Prepare product information for AI
    const productContext = uniqueProducts.map(product => ({
      id: product._id.toString(),
      title: product.title,
      brand: product.brand,
      img: product.img,
      price: product.price,
      discountedPrice: product.discountedPrice,
      description: product.desc,
      categories: product.categories,
      tags: product.tags,
      attributes: product.attributes instanceof Map
        ? Object.fromEntries(product.attributes)
        : product.attributes || {},
      inStock: product.inStock,
      inventory: product.inventory
    }));

    // Ask AI to answer using only retrieved products
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",

      instructions: `
You are ShopSphere's AI shopping assistant.

Your job is to help users discover and understand products.

Rules:
1. Recommend products ONLY from the supplied product data.
2. Never invent product names, prices, specifications, or availability.
3. If no relevant products are available, clearly say so.
4. Respect the user's budget and requirements.
5. Explain recommendations in simple, friendly language.
6. Compare products only using information actually provided.
7. If a specification is missing, say that it is not available.
8. Do not invent product links. The application handles product links.
9. Keep answers concise and useful.
10. Respond in the same language as the user.
11. Never recommend accessories when the user asks for an actual device.
12. If the product list is empty, explain that no matching products are currently available.
13. Use previous conversation messages to understand follow-up questions.

14. For follow-up questions, answer using only the currently supplied ShopSphere products.

15. If previous conversation mentions a product that is not in the supplied product data, do not invent its specifications. Explain that its details are unavailable.
      `,

      input: `

    Previous conversation:

    ${conversationHistory.map(item =>
      `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`
    ).join("\n") || "No previous conversation."}

    Current user's message:

    ${message}

    Detected product intent:

    ${productIntent || "General shopping"}

    Maximum budget:

    ${budget ? `₹${budget}` : "Not specified"}

    Available ShopSphere products:

    ${JSON.stringify(productContext)}

      `,

      max_output_tokens: 500
    });

    return res.status(200).json({
    reply: response.output_text,
    products: productContext,
    productIds: productContext.map(product => product.id)
  });

  } catch (error) {
    console.error("Chatbot Error:", error.message);

    return res.status(500).json({
      message: "Something went wrong with the shopping assistant."
    });
  }
};

module.exports = { chatWithAI };
