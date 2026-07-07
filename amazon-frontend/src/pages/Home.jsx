import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import CategoryRow from "../components/CategoryRow";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

const Home = () => {
  const [homeData, setHomeData] = useState({
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
    return products.map((p) => ({
      ...p,
      img: p.img || getPlaceholderImage(p.title),
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products/home")
      .then((res) => {
        console.log("HOME API RESPONSE:", res.data);

        setHomeData({
          recommended: addFallbackImage(res.data.recommended || []),
          clothing: addFallbackImage(res.data.clothing || []),
          shoes: addFallbackImage(res.data.shoes || []),
          electronics: addFallbackImage(res.data.electronics || []),
          watches: addFallbackImage(res.data.watches || []),
          bags: addFallbackImage(res.data.bags || []),
          homeKitchen: addFallbackImage(res.data.homeKitchen || []),
          trending: addFallbackImage(res.data.trending || []),
        });
      })
      .catch((err) => {
        console.log("HOME API ERROR:", err);
      });
  }, []);

  return (
    <div>
      <Navbar />

      <Slider />

      <CategoryRow title="Recommended for You" products={homeData.recommended} />
      <CategoryRow title="Clothing" products={homeData.clothing} />
      <CategoryRow title="Shoes" products={homeData.shoes} />
      <CategoryRow title="Electronics" products={homeData.electronics} />
      <CategoryRow title="Watches" products={homeData.watches} />
      <CategoryRow title="Accessories" products={homeData.bags} />
      <CategoryRow title="Home & Kitchen" products={homeData.homeKitchen} />
      <CategoryRow title="Trending Deals" products={homeData.trending} />
    </div>
  );
};

export default Home;