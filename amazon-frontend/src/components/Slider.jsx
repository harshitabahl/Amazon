import styled from "styled-components";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@mui/icons-material";
import { useState } from "react";
import { sliderItems } from "../data";
import { mobile } from "../responsive";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  position: relative;
  overflow: hidden;

  ${mobile`
    height: 400px;
  `}
`;

const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 1;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;

  /* FIX: prevent prop leaking */
  transform: translateX(${({ $index }) => $index * -100}vw);

  transition: all 1.5s ease;
`;

const Slide = styled.div`
  width: 100vw;
  height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* FIX: prevent bg leaking */
  background-color: ${({ $bg }) => $bg || "white"};

  ${mobile`
    flex-direction: column;
    justify-content: center;
  `}
`;

const ImgContainer = styled.div`
  height: 800px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 800px;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;

  ${mobile`
    padding: 10px;
    text-align: center;
  `}
`;

const Title = styled.h1`
  font-size: 70px;

  ${mobile`
    font-size: 30px;
  `}
`;

const Desc = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;

  ${mobile`
    margin: 20px 0px;
    font-size: 14px;
    letter-spacing: 1px;
  `}
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background-color: white;
  color: black;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(
        slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1
      );
    } else {
      setSlideIndex(
        slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0
      );
    }
  };

  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowLeftOutlined />
      </Arrow>

      <Wrapper $index={slideIndex}>
        {sliderItems.map((item) => (
          <Slide key={item.id} $bg={item.bg}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>

            <InfoContainer>
              <Title>{item.title}</Title>
              <Desc>{item.desc}</Desc>
              <Button onClick={() => navigate("/")}>
                Shop Now
              </Button>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>

      <Arrow direction="right" onClick={() => handleClick("right")}>
        <ArrowRightOutlined />
      </Arrow>
    </Container>
  );
};

export default Slider;