import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

/* =========================================================
   IMPORTANT LCP PRELOAD
   ========================================================= */

/*
 * This is the current first hero image returned by your
 * /api/products/hero endpoint.
 *
 * We preload it immediately instead of waiting for the
 * Hero API response.
 */
const FIRST_HERO_IMAGE =
  "https://g.sdlcdn.com/imgs/l/d/i/Nexra-Creation-Cotton-Blend-Regular-SDL820192292-1-00da6.jpg?w=220&h=258&sharp=7";

/*
 * Add preload only once.
 *
 * This runs as soon as this module is evaluated,
 * instead of waiting for useEffect + API response.
 */
if (
  typeof document !== "undefined" &&
  !document.querySelector(
    `link[rel="preload"][href="${FIRST_HERO_IMAGE}"]`
  )
) {
  const preload = document.createElement("link");

  preload.rel = "preload";
  preload.as = "image";
  preload.href = FIRST_HERO_IMAGE;
  preload.fetchPriority = "high";

  document.head.appendChild(preload);
}

/* ================= CONTAINER ================= */

export const Container = styled.div`
  width: 100%;
  height: 560px;
  position: relative;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #f7f9fc 0%,
    #edf2f7 100%
  );

  @media (max-width: 1024px) {
    height: 520px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 650px;
    padding: 20px 0;
  }
`;

/* ================= WRAPPER ================= */

export const Wrapper = styled.div`
  display: flex;
  height: 100%;

  transform: translate3d(
    ${({ $index }) => $index * -100}%,
    0,
    0
  );

  transition: transform 0.8s ease;

  will-change: transform;
`;

/* ================= SLIDE ================= */

export const Slide = styled.div`
  min-width: 100%;
  height: 560px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 50px 90px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 40px;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    height: auto;
    min-height: 650px;

    flex-direction: column;
    justify-content: flex-start;

    padding: 25px 20px 40px;
    gap: 20px;
  }
`;

/* ================= IMAGE ================= */

export const ImgContainer = styled.div`
  flex: 1.15;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
    flex: none;
  }
`;

export const Circle = styled.div`
  width: 430px;
  height: 430px;

  border-radius: 50%;

  background: linear-gradient(
    135deg,
    #ffffff,
    #e9edf3
  );

  position: absolute;

  box-shadow: inset 0 0 50px
    rgba(255, 255, 255, 0.7);

  @media (max-width: 1024px) {
    width: 360px;
    height: 360px;
  }

  @media (max-width: 768px) {
    width: 230px;
    height: 230px;
  }
`;

/*
 * Removed CSS filter from the LCP image.
 *
 * drop-shadow can add extra paint/compositing work.
 */
export const Image = styled.img`
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 420px;

  height: 420px;

  object-fit: contain;

  @media (max-width: 768px) {
    width: 220px;
    max-width: 220px;
    height: 220px;
  }
`;

/* ================= CONTENT ================= */

export const Content = styled.div`
  flex: 0.95;

  display: flex;
  flex-direction: column;

  gap: 18px;

  min-width: 0;

  @media (max-width: 1024px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;

    flex: none;

    padding: 0 10px;

    box-sizing: border-box;

    text-align: center;
    align-items: center;

    gap: 12px;
  }
`;

/* ================= BADGE ================= */

export const Badge = styled.div`
  width: fit-content;

  padding: 8px 16px;

  background: #cc0c39;
  color: white;

  border-radius: 6px;

  font-size: 14px;
  font-weight: 700;
`;

/* ================= TITLE ================= */

export const Title = styled.h1`
  width: 100%;

  font-size: 42px;
  font-weight: 800;

  line-height: 1.2;

  color: #111;

  margin: 0;

  height: 110px;

  overflow: hidden;

  display: -webkit-box;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    height: auto;

    font-size: 25px;

    line-height: 1.25;

    -webkit-line-clamp: 3;

    overflow-wrap: anywhere;
  }
`;

/* ================= RATING ================= */

export const Rating = styled.div`
  color: #ffa41c;

  font-size: 19px;

  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

/* ================= DESCRIPTION ================= */

export const Desc = styled.p`
  width: 100%;

  font-size: 18px;

  line-height: 1.7;

  color: #555;

  height: 90px;

  overflow: hidden;

  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  margin: 0;

  @media (max-width: 768px) {
    height: auto;

    font-size: 15px;

    line-height: 1.5;

    -webkit-line-clamp: 3;
  }
`;

/* ================= FEATURES ================= */

export const FeatureRow = styled.div`
  width: 100%;

  display: flex;

  gap: 18px;

  flex-wrap: wrap;

  color: #007600;

  font-size: 15px;

  font-weight: 600;

  @media (max-width: 768px) {
    justify-content: center;

    gap: 8px 14px;

    font-size: 13px;
  }
`;

/* ================= PRICE ================= */

export const PriceRow = styled.div`
  display: flex;

  align-items: flex-end;

  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;

    justify-content: center;

    align-items: center;

    flex-wrap: wrap;

    gap: 6px 12px;
  }
`;

export const Price = styled.h2`
  font-size: 56px;

  color: #b12704;

  margin: 0;

  @media (max-width: 1024px) {
    font-size: 42px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const OldPrice = styled.span`
  font-size: 24px;

  color: #777;

  text-decoration: line-through;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const Discount = styled.span`
  color: #007600;

  font-size: 22px;

  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

/* ================= BUTTONS ================= */

export const ButtonRow = styled.div`
  display: flex;

  gap: 18px;

  margin-top: auto;

  padding-top: 20px;

  @media (max-width: 768px) {
    width: 100%;

    flex-direction: column;

    align-items: center;

    gap: 10px;

    margin-top: 0;

    padding-top: 10px;
  }
`;

export const CartButton = styled.button`
  padding: 15px 34px;

  border: none;

  border-radius: 999px;

  background: #ffd814;

  font-size: 17px;

  font-weight: 700;

  cursor: pointer;
`;

export const BuyButton = styled.button`
  padding: 15px 34px;

  border: none;

  border-radius: 999px;

  background: #fa8900;

  color: white;

  font-size: 17px;

  font-weight: 700;

  cursor: pointer;
`;

/* ================= ARROWS ================= */

export const Arrow = styled.div`
  width: 60px;
  height: 60px;

  border-radius: 50%;

  background: white;

  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  display: flex;

  justify-content: center;
  align-items: center;

  font-size: 30px;

  cursor: pointer;

  z-index: 20;

  box-shadow: 0 8px 25px
    rgba(0, 0, 0, 0.15);

  left: ${(props) =>
    props.left && "25px"};

  right: ${(props) =>
    props.right && "25px"};

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;

    font-size: 20px;

    left: ${(props) =>
      props.left && "8px"};

    right: ${(props) =>
      props.right && "8px"};
  }
`;

/* =========================================================
   SLIDER
   ========================================================= */

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const intervalRef = useRef(null);

  const HERO_API =
    "https://amazon-7t4h.onrender.com/api/products/hero";

  /* ================= USER ================= */

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId =
    currentUser?._id ||
    currentUser?.id;

  /* ================= FETCH HERO ================= */

  useEffect(() => {
    let cancelled = false;

    const fetchHero = async () => {
      try {
        const res = await axios.get(
          HERO_API
        );

        if (cancelled) return;

        const heroSlides =
          Array.isArray(res.data)
            ? res.data.slice(0, 5)
            : [];

        setSlides(heroSlides);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Hero products error:",
            err
          );
        }
      }
    };

    fetchHero();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     PRELOAD REMAINING SLIDES
     ========================================================= */

  useEffect(() => {
    if (slides.length <= 1) return;

    /*
     * Don't preload immediately.
     *
     * The first image has priority.
     * Other images are only prepared after
     * the initial page has had time to render.
     */
    const timer = setTimeout(() => {
      slides
        .slice(1)
        .forEach((slide) => {
          if (!slide.img) return;

          const img =
            new window.Image();

          img.src = slide.img;
        });
    }, 1500);

    return () =>
      clearTimeout(timer);
  }, [slides]);

  /* ================= AUTO SLIDER ================= */

  const stopAuto = useCallback(() => {
    clearInterval(
      intervalRef.current
    );
  }, []);

  const startAuto = useCallback(() => {
    if (slides.length <= 1) return;

    clearInterval(
      intervalRef.current
    );

    intervalRef.current =
      setInterval(() => {
        setIndex(
          (prev) =>
            (prev + 1) %
            slides.length
        );
      }, 4000);
  }, [slides.length]);

  useEffect(() => {
    startAuto();

    return () => {
      clearInterval(
        intervalRef.current
      );
    };
  }, [startAuto]);

  /* ================= NEXT ================= */

  const next = () => {
    if (!slides.length) return;

    stopAuto();

    setIndex(
      (prev) =>
        (prev + 1) %
        slides.length
    );

    setTimeout(
      startAuto,
      200
    );
  };

  /* ================= PREVIOUS ================= */

  const prev = () => {
    if (!slides.length) return;

    stopAuto();

    setIndex((prev) =>
      prev === 0
        ? slides.length - 1
        : prev - 1
    );

    setTimeout(
      startAuto,
      200
    );
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async (
    e,
    productId
  ) => {
    e.stopPropagation();

    if (
      !currentUser ||
      !userId
    ) {
      alert(
        "Please sign in to add items to your cart."
      );

      navigate("/login");

      return;
    }

    try {
      const res =
        await axios.post(
          "https://amazon-7t4h.onrender.com/api/cart",
          {
            userId,
            productId,
          }
        );

      await fetchCart();

      console.log(
        "Slider item added:",
        res.data
      );

      alert(
        "Added to Cart 🛒"
      );
    } catch (err) {
      console.error(
        "Slider Add to Cart error:",
        err
      );

      alert(
        "Failed to add item to cart"
      );
    }
  };

  /* ================= LOADING ================= */

  if (!slides.length) {
    return (
      <Container>
        <div
          style={{
            margin: "auto",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Loading...
        </div>
      </Container>
    );
  }

  /* ================= CURRENT SLIDE ================= */

  const currentSlide =
    slides[index];

  const imageSrc =
    currentSlide?.img &&
    currentSlide.img.trim()
      ? currentSlide.img
      : getPlaceholderImage(
          currentSlide?.title
        );

  /* ================= UI ================= */

  return (
    <Container
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <Arrow
        left
        onClick={prev}
      >
        ❮
      </Arrow>

      <Wrapper $index={index}>
        {/* =================================================
            ONLY RENDER CURRENT SLIDE

            This is important for initial rendering.
            ================================================= */}

        <Slide>
          <ImgContainer>
            <Circle />

          <Image
            width={420}
            height={420}
            src={imageSrc}
            alt={item.title || "Product"}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          </ImgContainer>

          <Content>
            <Badge>
              Limited Time Deal
            </Badge>

            <Title
              onClick={() =>
                navigate(
                  `/product/${currentSlide._id}`
                )
              }
              style={{
                cursor: "pointer",
              }}
            >
              {currentSlide.title}
            </Title>

            <Rating>
              ⭐⭐⭐⭐⭐{" "}
              <span
                style={{
                  color: "#007185",
                }}
              >
                4.5 (128 Reviews)
              </span>
            </Rating>

            <PriceRow>
              <Price>
                ₹{currentSlide.price}
              </Price>

              <OldPrice>
                ₹999
              </OldPrice>

              <Discount>
                60% OFF
              </Discount>
            </PriceRow>

            <Desc>
              {currentSlide.desc}
            </Desc>

            <FeatureRow>
              <span>
                ✓ Free Delivery
              </span>

              <span>
                ✓ Easy Returns
              </span>

              <span>
                ✓ Cash on Delivery
              </span>
            </FeatureRow>

            <ButtonRow>
              <CartButton
                onClick={(e) =>
                  addToCart(
                    e,
                    currentSlide._id
                  )
                }
              >
                Add to Cart
              </CartButton>

              <BuyButton
                onClick={() =>
                  navigate(
                    `/product/${currentSlide._id}`
                  )
                }
              >
                View Details
              </BuyButton>
            </ButtonRow>
          </Content>
        </Slide>
      </Wrapper>

      <Arrow
        right
        onClick={next}
      >
        ❯
      </Arrow>
    </Container>
  );
}