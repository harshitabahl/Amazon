import styled from 'styled-components'
import SearchIcon from "@mui/icons-material/Search";
import { Badge } from '@mui/material';
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { mobile } from "../responsive"
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Container = styled.div`
    height: 60px; 

    ${mobile`
      height: 50px;
    `}
`;

const Wrapper = styled.div`
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${mobile`
      padding: 10px 0px;
    `}
`;

const Left = styled.div`
   flex: 1;
   display: flex;
   align-items: center;
`;

const Language = styled.span`
    font-size: 14px;
    cursor: pointer;

    ${mobile`
      display: none;
    `}
`;

const SearchContainer = styled.div`
    border: 1px solid black;
    display: flex;
    align-items: center;
    margin-left: 20px;
    padding: 1px;
`;

const Input = styled.input`
    border: none;
    outline: none;
    width: 100px;

    ${mobile`
      width: 50px;
    `}
`;

const Centre = styled.div`
    flex: 1;
    text-align: center;
`;   

const Logo = styled.h1`
    font-weight: bold;

    ${mobile`
      font-size: 20px;
    `}
`;

const Right = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ${mobile`
      flex: 2;
      justify-content: center;
    `}
`;

const MenuItem = styled.div`
    font-size: 14px;
    cursor: pointer;
    margin-left: 25px;

    ${mobile`
      font-size: 12px;
      margin-left: 10px;
    `}
`;

const Navbar = () => {
  return (
    <Container>
        <Wrapper>
            <Left>
                <Language>EN</Language>
                <SearchContainer>
                    <Input placeholder="Search"/>
                    <SearchIcon style={{color: "black", fontSize: 16}}/>
                </SearchContainer>
            </Left>

            <Centre>
              <StyledLink to="/">
                <Logo>Amazon</Logo>
              </StyledLink>
            </Centre>

            <Right>

                <MenuItem>
                  <StyledLink to="/register">REGISTER</StyledLink>
                </MenuItem>

                <MenuItem>
                  <StyledLink to="/login">SIGN IN</StyledLink>
                </MenuItem>

                <MenuItem>
                  <StyledLink to="/cart">
                    <Badge badgeContent={4} color="primary">
                        <ShoppingCartOutlined/>
                    </Badge>
                  </StyledLink>
                </MenuItem>

            </Right>
        </Wrapper>
    </Container>
  )
}

export default Navbar;