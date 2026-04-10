import styled from 'styled-components'
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { mobile } from "../responsive";

const Container = styled.div``;

const Title = styled.h1`
    margin: 20px;

    ${mobile`
      font-size: 24px;
    `}
`;

const FilterContainer = styled.div`
    display: flex;
    justify-content: space-between;

    ${mobile`
      flex-direction: column;
    `}
`;

const Filter = styled.div`
    margin: 20px;

    ${mobile`
      margin: 10px 20px;
      display: flex;
      flex-direction: column;
    `}
`;

const FilterText = styled.span`
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;

    ${mobile`
      margin-bottom: 10px;
    `}
`;

const Select = styled.select`
    padding: 10px;
    margin-right: 20px;

    ${mobile`
      margin: 5px 0px;
    `}
`;

const Option = styled.option``;

const ProductList = () => {
  return (
   <Container>
        <Navbar/>
        <Announcement/>

        <Title>Dresses</Title>

        <FilterContainer>
            <Filter>
                <FilterText>Filter Products</FilterText>

                <Select defaultValue="">
                    <Option value="" disabled>Color</Option>
                    <Option>White</Option>
                    <Option>Black</Option>
                    <Option>Red</Option>
                    <Option>Blue</Option>
                    <Option>Yellow</Option> 
                    <Option>Green</Option>
                </Select>

                <Select defaultValue="">
                    <Option value="" disabled>Size</Option>
                    <Option>XS</Option>
                    <Option>S</Option>
                    <Option>M</Option>
                    <Option>L</Option>
                    <Option>XL</Option> 
                    <Option>XXL</Option>
                </Select>
            </Filter>

            <Filter>
                <FilterText>Sort Products</FilterText>

                <Select defaultValue="newest">
                    <Option value="newest">Newest</Option>
                    <Option value="asc">Price (asc)</Option>
                    <Option value="desc">Price (desc)</Option>
                </Select>
            </Filter>
        </FilterContainer>

        <Products/>
        <Newsletter/>
        <Footer/>
   </Container>
  )
}

export default ProductList;