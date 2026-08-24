import styled from "styled-components";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const Container = styled.div`
  margin: 35px 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 25px 20px;
  color: #111;
`;

const RowWrapper = styled.div`
  position: relative;
`;

const Window = styled.div`
  overflow: hidden;
  width: 100%;
  padding: 12px 70px;
  box-sizing: border-box;
`;

const Track = styled.div`
  display: flex;
  gap: 18px;
  transition: transform 0.45s ease;
  transform: translateX(-${({ $index }) => $index * 100}%);
`;

const CardWrapper = styled.div`
  flex: 0 0 calc(${({ $cardWidth }) => $cardWidth}% - 14px);
`;

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
  }
`;

const CategoryRow = ({ title, products = [] }) => {
  const items = products.slice(0, 6);

  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth <= 768) {
        setVisibleItems(2);
      } else if (window.innerWidth <= 992) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems();

    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
    };
  }, []);

  useEffect(() => {
    const max = Math.max(0, items.length - visibleItems);

    if (index > max) {
      setIndex(max);
    }
  }, [visibleItems, items.length, index]);

  if (!items.length) {
    return null;
  }

  const cardWidth = 100 / visibleItems;

  const maxIndex = Math.max(
    0,
    items.length - visibleItems
  );

  const move = (direction) => {
    setIndex((prev) => {
      if (direction === "left") {
        return Math.max(prev - 1, 0);
      }

      return Math.min(prev + 1, maxIndex);
    });
  };

  return (
    <Container>
      <Title>{title}</Title>

      <RowWrapper>
        {index > 0 && (
          <Arrow
            type="button"
            aria-label={`Previous ${title}`}
            left
            onClick={() => move("left")}
          >
            ❮
          </Arrow>
        )}

        <Window>
          <Track $index={index}>
            {items.map((item) => (
              <CardWrapper
                key={item._id}
                $cardWidth={cardWidth}
              >
                <ProductCard product={item} />
              </CardWrapper>
            ))}
          </Track>
        </Window>

        {index < maxIndex && (
          <Arrow
            type="button"
            aria-label={`Next ${title}`}
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