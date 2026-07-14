import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useCallback} from "react"


/* ================= CONTAINER ================= */
export const Container = styled.div`
  width: 100%;
  height: 560px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f7f9fc 0%, #edf2f7 100%);

  @media (max-width: 1024px) {
    height: 520px;
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 20px 0;
  }
`;

/* ================= WRAPPER ================= */

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  transform: translateX(${({ $index }) => $index * -100}%);
  transition: transform 0.8s ease;
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
    padding: 40px 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 30px 20px;
    gap: 30px;
  }
`;

/* ================= IMAGE ================= */

export const ImgContainer = styled.div`
  flex: 1.15;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
`;

export const Circle = styled.div`
  width: 430px;
  height: 430px;

  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff, #e9edf3);
  position: absolute;
  box-shadow: inset 0 0 50px rgba(255,255,255,.7);

  @media (max-width: 1024px) {
    width: 350px;
    height: 350px;
  }

  @media (max-width: 768px) {
    width: 260px;
    height: 260px;
  }
`;

export const Image = styled.img`
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 520px;
  max-height: 470px;

  object-fit: contain;

  filter: drop-shadow(0 18px 35px rgba(0,0,0,.18));
  transition: .35s;

  @media (max-width: 768px) {
    max-width: 300px;
    max-height: 260px;
  }

  &:hover {
    transform: scale(1.06);
  }
`;

export const Content = styled.div`
  flex: .95;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 1024px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    margin-top: 0;
    text-align: center;
    align-items: center;
    gap: 12px;
  }
`;

export const Badge = styled.div`
  width: fit-content;

  padding: 8px 16px;

  background: #CC0C39;
  color: white;

  border-radius: 6px;

  font-size: 14px;
  font-weight: 700;
`;

export const Title = styled.h1`
  font-size: 46px;
  font-weight: 800;
  line-height: 1.15;
  color: #111;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 36px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Rating = styled.div`
  color: #FFA41C;
  font-size: 19px;
  font-weight: 600;
`;

export const Desc = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #555;

  max-width: 540px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  overflow: hidden;
`;

export const FeatureRow = styled.div`
  display:flex;
  gap:18px;
  flex-wrap:wrap;

  color:#007600;

  font-size:15px;
  font-weight:600;
`;

export const PriceRow = styled.div`
  display:flex;
  align-items:flex-end;
  gap:16px;
`;

export const Price = styled.h2`
  font-size: 56px;
  color: #B12704;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 42px;
  }

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

export const OldPrice = styled.span`
  font-size:24px;
  color:#777;
  text-decoration:line-through;
`;

export const Discount = styled.span`
  color:#007600;
  font-size:22px;
  font-weight:700;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

export const CartButton = styled.button`
  padding: 15px 34px;
  border: none;
  border-radius: 999px;
  background: #FFD814;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: .25s;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BuyButton = styled.button`
  padding: 15px 34px;
  border: none;
  border-radius: 999px;
  background: #FA8900;
  color: white;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: .25s;

  @media (max-width: 768px) {
    width: 100%;
  }
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

  box-shadow: 0 8px 25px rgba(0,0,0,.15);

  left: ${props => props.left && "25px"};
  right: ${props => props.right && "25px"};

  transition: .25s;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  &:hover {
    background: #FFD814;
    transform: translateY(-50%) scale(1.08);
  }
`;

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/products/hero"
        );

        setSlides(res.data.slice(0, 5));
      } catch (err) {
        console.log(err);
      }
    };

    fetchHero();
  }, []);

  

  const stopAuto = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const startAuto = useCallback(() => {
    if (slides.length <= 1) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  }, [slides.length]);

  useEffect(() => {
  startAuto();
  return () => clearInterval(intervalRef.current);
}, [startAuto]);

  const next = () => {
    stopAuto();

    setIndex((prev) => (prev + 1) % slides.length);

    setTimeout(startAuto, 200);
  };

  const prev = () => {
    stopAuto();

    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

    setTimeout(startAuto, 200);
  };

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

  return (
    <Container
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <Arrow left onClick={prev}>
        ❮
      </Arrow>

      <Wrapper $index={index}>
        {slides.map((item) => (
          <Slide key={item._id}>
            {/* LEFT SIDE IMAGE */}

            <ImgContainer>
              <Circle />
              <Image
                src={item.img}
                alt={item.title}
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: "pointer" }}
              />
            </ImgContainer>

            {/* RIGHT SIDE CONTENT */}

            <Content>
              <Badge>Limited Time Deal</Badge>

              <Title
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: "pointer" }}
              >
                {item.title}
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
                <Price>₹{item.price}</Price>

                <OldPrice>₹999</OldPrice>

                <Discount>60% OFF</Discount>
              </PriceRow>

              <Desc>{item.desc}</Desc>

              <FeatureRow>
                <span>✓ Free Delivery</span>

                <span>✓ Easy Returns</span>

                <span>✓ Cash on Delivery</span>
              </FeatureRow>

              <ButtonRow>
                    <CartButton
                      onClick={async () => {
                        try {
                          await axios.post("http://localhost:5001/api/cart", {
                            userId: "demo-user",
                            productId: item._id,
                          });

                        } catch (err) {
                          console.error(err);
                          alert("Failed to add to cart");
                        }
                      }}
                    >
                      Add to Cart
                    </CartButton>

                  <BuyButton
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    View Details
                  </BuyButton>
              </ButtonRow>
            </Content>
          </Slide>
        ))}
      </Wrapper>

      <Arrow right onClick={next}>
        ❯
      </Arrow>
    </Container>
  );
}