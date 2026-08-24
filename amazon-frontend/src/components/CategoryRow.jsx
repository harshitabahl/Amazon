import styled from "styled-components";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

/* ================= CONTAINER ================= */

const Container = styled.div`
  margin: 35px 0;
`;

/* ================= TITLE ================= */

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 25px 20px;
  color: #111;
`;

/* ================= ROW ================= */

const RowWrapper = styled.div`
  position: relative;
`;

/* ================= WINDOW ================= */

const Window = styled.div`
  overflow: hidden;
  width: 100%;
  padding: 12px 70px;
  box-sizing: border-box;
`;

/* ================= TRACK ================= */

const Track = styled.div`
  display: flex;
  gap: 18px;

  transition: transform 0.45s ease;

  transform: translateX(
    calc(-${({ $index }) => $index * 100}%)
  );
`;

/* ================= CARD ================= */

const CardWrapper = styled.div`
  flex: 0 0
    calc(${({ $cardWidth }) => $cardWidth}% - 14px);

  min-width: 0;
`;

/* ================= ARROW ================= */

const Arrow = styled.button`
  position: absolute;

  top: 50%;
  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  border: none;
  border-radius: 50%;

  background: white;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 24px;

  cursor: pointer;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  z-index: 10;

  left: ${(props) => props.left && "10px"};
  right: ${(props) => props.right && "10px"};

  &:hover {
    transform: translateY(-50%) scale(1.08);
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;

    font-size: 20px;

    left: ${(props) => props.left && "8px"};
    right: ${(props) => props.right && "8px"};
  }
`;

/* ================= COMPONENT ================= */

const CategoryRow = ({
  title,
  products = [],
}) => {
  /*
   * Keep only the first 6 products.
   * This prevents unnecessary DOM nodes.
   */
  const items = products.slice(0, 6);

  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  /* ================= RESPONSIVE ================= */

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth <= 768) {
        setVisibleItems(2);
      } else if (window.innerWidth <= 992) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      };
    };

    updateVisibleItems();

    window.addEventListener(
      "resize",
      updateVisibleItems
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateVisibleItems
      );
    };
  }, []);

  /*
   * Prevent index from becoming invalid
   * when screen size changes.
   */
  useEffect(() => {
    const maxIndex = Math.max(
      0,
      items.length - visibleItems
    );

    setIndex((prev) =>
      Math.min(prev, maxIndex)
    );
  }, [visibleItems, items.length]);

  /* ================= SLIDER ================= */

  const cardWidth =
    100 / visibleItems;

  const maxIndex = Math.max(
    0,
    items.length - visibleItems
  );

  const move = (direction) => {
    setIndex((prev) => {
      if (direction === "left") {
        return Math.max(prev - 1, 0);
      }

      return Math.min(
        prev + 1,
        maxIndex
      );
    });
  };

  /* ================= EMPTY ================= */

  if (!items.length) {
    return null;
  }

  /* ================= UI ================= */

  return (
    <Container>
      <Title>{title}</Title>

      <RowWrapper>
        {/* LEFT */}

        {index > 0 && (
          <Arrow
            type="button"
            left
            aria-label="Previous products"
            onClick={() =>
              move("left")
            }
          >
            ❮
          </Arrow>
        )}

        {/* PRODUCTS */}

        <Window>
          <Track $index={index}>
            {items.map(
              (item, itemIndex) => (
                <CardWrapper
                  key={item._id}
                  $cardWidth={
                    cardWidth
                  }
                >
                  <ProductCard
                    product={item}
                    isPriority={
                      index === 0 &&
                      itemIndex === 0
                    }
                  />
                </CardWrapper>
              )
            )}
          </Track>
        </Window>

        {/* RIGHT */}

        {index < maxIndex && (
          <Arrow
            type="button"
            right
            aria-label="Next products"
            onClick={() =>
              move("right")
            }
          >
            ❯
          </Arrow>
        )}
      </RowWrapper>
    </Container>
  );
};

export default CategoryRow;