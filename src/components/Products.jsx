import styled from "styled-components";
import { PopularProducts } from "../data"; 
import Product from "../components/Product";
import { mobile } from "../responsive";

const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  flex-wrap: wrap;

  ${mobile`
    padding: 10px;
    justify-content: center;
  `}
`;

const Products = () => {
  return (
    <Container>
      {PopularProducts.map((item) => (
        <Product item={item} key={item.id} />  
      ))}
    </Container>
  );
};

export default Products;