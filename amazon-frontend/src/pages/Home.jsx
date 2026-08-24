import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import CategoryRow from "../components/CategoryRow";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

const HOME_API =
  "https://amazon-7t4h.onrender.com/api/products/home";

const Home = () => {
  const [homeData, setHomeData] = useState({
    hero: [],
    recommended: [],
    clothing: [],
    shoes: [],
    electronics: [],
    watches: [],
    bags: [],
    homeKitchen: [],
    trending: [],
  });

  const addFallbackImage = (products = []) => {
    if (!Array.isArray(products)) return [];

    return products.map((product) => ({
      ...product,
      img:
        typeof product?.img === "string" &&
        product.img.trim()
          ? product.img
          : getPlaceholderImage(product?.title || ""),
    }));
  };

  useEffect(() => {
    let cancelled = false;

    const fetchHomeData = async () => {
      try {
        const res = await axios.get(HOME_API);

        if (cancelled) return;

        const data = res.data || {};

        setHomeData({
          hero: addFallbackImage(data.hero),
          recommended: addFallbackImage(
            data.recommended
          ),
          clothing: addFallbackImage(
            data.clothing
          ),
          shoes: addFallbackImage(data.shoes),
          electronics: addFallbackImage(
            data.electronics
          ),
          watches: addFallbackImage(
            data.watches
          ),
          bags: addFallbackImage(data.bags),
          homeKitchen: addFallbackImage(
            data.homeKitchen
          ),
          trending: addFallbackImage(
            data.trending
          ),
        });
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Home API error:",
            err
          );
        }
      }
    };

    fetchHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <Slider slides={homeData.hero} />

      {/* CATEGORY ROWS */}

      <CategoryRow
        title="Recommended for You"
        products={homeData.recommended}
      />

      <CategoryRow
        title="Clothing"
        products={homeData.clothing}
      />

      <CategoryRow
        title="Shoes"
        products={homeData.shoes}
      />

      <CategoryRow
        title="Electronics"
        products={homeData.electronics}
      />

      <CategoryRow
        title="Watches"
        products={homeData.watches}
      />

      <CategoryRow
        title="Accessories"
        products={homeData.bags}
      />

      <CategoryRow
        title="Home & Kitchen"
        products={homeData.homeKitchen}
      />

      <CategoryRow
        title="Trending Deals"
        products={homeData.trending}
      />
    </div>
  );
};

export default Home;