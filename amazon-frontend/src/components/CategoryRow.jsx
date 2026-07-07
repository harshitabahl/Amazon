import styled from "styled-components";
import { useEffect, useState } from "react";

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
  padding: 0 60px;
  box-sizing: border-box;
`;

const Track = styled.div`
  display: flex;
  gap: 18px;
  transition: transform 0.45s ease;
  transform: translateX(calc(-${({ $index }) => $index * 100}%));
`;

const Card = styled.div`
  flex: 0 0 calc(${({ $cardWidth }) => $cardWidth}% - 14px);
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: 0.25s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 220px;
  object-fit: contain;
`;

const Name = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 14px 0 8px;
  height: 42px;
  overflow: hidden;
  color: #222;
`;

const Price = styled.h3`
  color: #b12704;
  margin: 0;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
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
`;

const CategoryRow = ({ title, products = [] }) => {
  const items = products.slice(0, 10);

  const [index, setIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 768) setVisibleItems(2);
      else if (window.innerWidth <= 992) setVisibleItems(3);
      else setVisibleItems(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardWidth = 100 / visibleItems;
  const maxIndex = Math.max(0, items.length - visibleItems);

  const move = (dir) => {
    setIndex((prev) =>
      dir === "left"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, maxIndex)
    );
  };

  return (
    <Container>
      <Title>{title}</Title>

      <RowWrapper>
        {index > 0 && (
          <Arrow left onClick={() => move("left")}>
            ❮
          </Arrow>
        )}

        <Window>
          <Track $index={index}>
            {items.map((item) => (
              <Card key={item._id} $cardWidth={cardWidth}>
                <Img
                  src={item.img || "/placeholder.png"}
                  alt={item.title}
                />

                <Name>
                  {item.title?.length > 55
                    ? item.title.slice(0, 55) + "..."
                    : item.title}
                </Name>

                <Price>₹{item.price?.toLocaleString("en-IN")}</Price>
              </Card>
            ))}
          </Track>
        </Window>

        {index < maxIndex && (
          <Arrow right onClick={() => move("right")}>
            ❯
          </Arrow>
        )}
      </RowWrapper>
    </Container>
  );
};

export default CategoryRow;