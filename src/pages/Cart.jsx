import styled from 'styled-components'
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { Add, Remove } from "@mui/icons-material";
import { mobile } from "../responsive";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;

  ${mobile`
    padding: 10px;
  `}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;

  ${mobile`
    font-size: 24px;
  `}
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  ${mobile`
    flex-direction: column;
    gap: 10px;
  `}
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600; 
  cursor: pointer;
  border: ${props=>props.type === "filled" && "none"};
  background-color: ${props=>props.type === "filled" ? "black" : "transparent"};
  color: ${(props)=>props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile`
    display: none;
  `}
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;

  ${mobile`
    flex-direction: column;
  `}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;

  ${mobile`
    flex-direction: column;
  `}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;

  ${mobile`
    flex-direction: column;
    align-items: center;
    text-align: center;
  `}
`;

const Image = styled.img`
  width: 200px;

  ${mobile`
    width: 150px;
  `}
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  ${mobile`
    padding: 10px;
    align-items: center;
  `}
`;

const ProductName = styled.span``;
const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props=>props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${mobile`
    margin-top: 10px;
  `}
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 300;
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray; 
  border-radius: 10px;
  padding: 10px;
  height: 40vh;
  margin: 0 auto;  

  ${mobile`
    width: 100%;
    margin-top: 20px;
  `}
`;

const SummaryTitle = styled.h1`
font-weight: 200;
  display: flex;
justify-content: space-between;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${props=> props.type === "total" && "500"};
  font-size: ${props=> props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 80%;
  margin: 0 auto;
  display: block;
  border-radius: 8px;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  return (
    <Container>
      <Navbar/>
      <Announcement/>
      <Wrapper>
        <Title>YOUR BAG</Title>
        

        <Top>
          <TopButton>CONTINUE SHOPPING</TopButton>

          <TopTexts>
            <TopText>Shopping Bag (2)</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
        </Top>

        <Bottom>

          <Info>

            <Product>
              <ProductDetail>
                <Image src="/shoes.png" />
                <Details>
                  <ProductName><b>Product:</b> JESSIE THUNDER SHOES</ProductName>
                  <ProductId><b>ID:</b> 987654321</ProductId>
                  <ProductColor color="#1e3a8a"/>
                  <ProductSize><b>Size:</b>37.5</ProductSize>
                </Details>
              </ProductDetail>

              <PriceDetail>
                <ProductAmountContainer>
                  <Add/>
                  <ProductAmount>2</ProductAmount>
                  <Remove/>
                </ProductAmountContainer>
                <ProductPrice>$30</ProductPrice>
              </PriceDetail>
            </Product>

            <Hr/>

            <Product>
              <ProductDetail>
                <Image src="/pink.png" />
                <Details>
                  <ProductName><b>Product:</b> Hakura T-shirt</ProductName>
                  <ProductId><b>ID:</b> 987654322</ProductId>
                  <ProductColor color="pink"/>
                  <ProductSize><b>Size:</b>XL</ProductSize>
                </Details>
              </ProductDetail>

              <PriceDetail>
                <ProductAmountContainer>
                  <Add/>
                  <ProductAmount>2</ProductAmount>
                  <Remove/>
                </ProductAmountContainer>
                <ProductPrice>$20</ProductPrice>
              </PriceDetail>
            </Product>

          </Info>

          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>

            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ 100</SummaryItemPrice>
            </SummaryItem>

            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>

            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>

            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ 100</SummaryItemPrice>
            </SummaryItem>

            <Button>CHECKOUT NOW</Button>
          </Summary>

        </Bottom>
      </Wrapper>

      <Footer/>
    </Container>
  )
}

export default Cart;