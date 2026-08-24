import styled from "styled-components";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

/* ================= CONTAINER ================= */

const Container = styled.section`
  margin: 30px 0;
  contain: layout paint;
`;

/* ================= TITLE ================= */

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;

  margin: 0 25px 16px;

  color: #111;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-left: 16px;
  }
`;

/* ================= ROW ================= */

const RowWrapper = styled.div`
  position: relative;
  contain: layout;
`;

/* ================= WINDOW ================= */

const Window = styled.div`
  overflow: hidden;
  width: 100%;

  padding: 8px 70px;

  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 8px 45px;
  }
`;

/* ================= TRACK ================= */

const Track = styled.div`
  display: flex;
  gap: 18px;

  transform: translate3d(
    calc(-${({ $index }) => $index * 100}%),
    0,
    0
  );

  transition: transform 0.4s ease;

  will-change: transform;
`;

/* ================= CARD ================= */

const CardWrapper = styled.div`
  flex: 0 0
    calc(${({ $cardWidth }) => $cardWidth}% - 14px);

  min-width: 0;

  contain: layout paint;
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
    width: 40px;
    height: 40px;

    font-size: 18px;

    left: ${(props) => props.left && "5px"};
    right: ${(props) => props.right && "5px"};
  }
`;

/* ================= COMPONENT ================= */

const CategoryRow = ({
  title,
  products = [],
}) => {
  /*
   * Only keep the first 6 products.
   * This prevents unnecessarily large DOM.
   */
  const items = products.slice(0, 6);

  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  /* ================= RESPONSIVE ================= */

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setVisibleItems(2);
      } else if (width <= 992) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
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

  /* ================= RESET INDEX ================= */

  useEffect(() => {
    const maxIndex = Math.max(
      0,
      items.length - visibleItems
    );

    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [visibleItems, items.length, index]);

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
        {index > 0 && (
          <Arrow
            type="button"
            aria-label={`Previous ${title} products`}
            left
            onClick={() => move("left")}
          >
            ❮
          </Arrow>
        )}

        <Window>
          <Track $index={index}>
            {items.map(
              (item, itemIndex) => (
                <CardWrapper
                  key={item._id}
                  $cardWidth={cardWidth}
                >
                  <ProductCard
                    product={item}
                    priority={
                      index === 0 &&
                      itemIndex === 0
                    }
                  />
                </CardWrapper>
              )
            )}
          </Track>
        </Window>

        {index < maxIndex && (
          <Arrow
            type="button"
            aria-label={`Next ${title} products`}
            right
            onClick={() => move("right")}
          >
            ❯
          </Arrow>
        )}
      </RowWrapper>
    </Container>
  );
};

export default CategoryRow;