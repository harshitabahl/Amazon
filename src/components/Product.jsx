import styled from "styled-components";
import { SearchOutlined, ShoppingCartOutlined, FavoriteBorderOutlined } from "@mui/icons-material";
import { mobile } from "../responsive";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${mobile`
    opacity: 1;   /* mobile pe hover nahi hota */
  `}
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 200px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  position: relative;
  overflow: hidden;

  &:hover ${Info} {
    opacity: 1;
  }

  ${mobile`
    height: 250px;
  `}
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #f5fbfd;
  position: absolute;

  ${mobile`
    width: 150px;
    height: 150px;
  `}
`;

const Image = styled.img`
  height: 75%;
  z-index: 2;
  object-fit: contain;

  ${mobile`
    height: 70%;
  `}
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }

  ${mobile`
    width: 30px;
    height: 30px;
    margin: 5px;
  `}
`;

const Product = ({ item }) => {
  return (
    <Container>
      <Circle />
      <Image src={item.img} />
      <Info>
        <Icon>
          <ShoppingCartOutlined />
        </Icon>
        <Icon>
          <SearchOutlined />
        </Icon>
        <Icon>
          <FavoriteBorderOutlined />
        </Icon>
      </Info>
    </Container>
  );
};

export default Product;