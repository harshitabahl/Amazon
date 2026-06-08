import styled from "styled-components";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@mui/icons-material";
import { useState } from "react";
import { sliderItems } from "../data";
import { mobile } from "../responsive";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 650px;
  display: flex;
  position: relative;
  overflow: hidden;

  ${mobile`
    height: 400px;
  `}
`;

const Arrow = styled.div`
  width: 45px;
  height: 45px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "15px"};
  right: ${(props) => props.direction === "right" && "15px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.85;
  z-index: 2;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);

  ${mobile`
    width: 35px;
    height: 35px;
  `}
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
  transition: all 1s ease;
`;

const Slide = styled.div`
  width: 100vw;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #f8f9fa 0%,
    #e9ecef 100%
  );

  ${mobile`
    flex-direction: column;
    height: 450px;
  `}
`;

const ImgContainer = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 95%;
  height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.18));

  ${mobile`
    width: 80%;
    height: 60%;
  `}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0 60px;

  ${mobile`
    padding: 10px 20px;
    text-align: center;
  `}
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 800;
  color: #111;
  line-height: 1.1;
  margin-bottom: 20px;

  ${mobile`
    font-size: 32px;
  `}
`;

const Desc = styled.p`
  margin: 20px 0 30px;
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  max-width: 500px;

  ${mobile`
    font-size: 14px;
  `}
`;

const Button = styled.button`
  padding: 14px 30px;
  background: #111;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #000;
  }
`;

const BadgeText = styled.div`
  display: inline-block;
  background: #111;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
  letter-spacing: 1px;
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
    } else {
      setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
    }
  };

  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowLeftOutlined />
      </Arrow>

      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>

            <InfoContainer>
              <BadgeText>NEW ARRIVALS</BadgeText>

              <Title>{item.title}</Title>

              <Desc>{item.desc}</Desc>

              <Button onClick={() => navigate("/products")}>
                SHOP NOW
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