import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { Badge } from "@mui/material";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Container = styled.div`
  height: 75px;
  background: white;

  ${mobile`
    height: 60px;
  `}
`;

const Wrapper = styled.div`
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${mobile`
    padding: 0 10px;
  `}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${mobile`
    flex: 1;
  `}
`;

const Logo = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  color: #111;

  ${mobile`
    font-size: 22px;
  `}
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 700px;
  border: 1px solid #cfcfcf;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 16px;
  font-size: 16px;
`;

const SearchButton = styled.div`
  width: 55px;
  height: 50px;
  background: #111;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MenuItem = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  margin-left: 25px;
  display: flex;
  align-items: center;

  &:hover {
    color: #000;
  }

  ${mobile`
    font-size: 12px;
    margin-left: 10px;
  `}
`;

const Navbar = () => {
  const quantity = useSelector((state) => state.cart?.quantity || 0);
  const currentUser = useSelector((state) => state.user?.currentUser);

  return (
    <Container>
      <Wrapper>
        <Left>
          <StyledLink to="/">
            <Logo>amazon</Logo>
          </StyledLink>
        </Left>

        <Center>
          <SearchContainer>
            <Input placeholder="Search Products" />

            <SearchButton>
              <SearchIcon />
            </SearchButton>
          </SearchContainer>
        </Center>

        <Right>
          {!currentUser && (
            <>
              <MenuItem>
                <StyledLink to="/register">
                  REGISTER
                </StyledLink>
              </MenuItem>

              <MenuItem>
                <StyledLink to="/login">
                  SIGN IN
                </StyledLink>
              </MenuItem>
            </>
          )}

          <MenuItem>
            <StyledLink to={currentUser ? "/cart" : "/login"}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                CART

                <Badge
                  badgeContent={currentUser ? quantity : 0}
                  color="primary"
                >
                  <ShoppingCartOutlined />
                </Badge>
              </div>
            </StyledLink>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;