import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { Badge } from "@mui/material";
import { mobile } from "../responsive";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/cartContext";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

/* ================= CONTAINER ================= */

const Container = styled.div`
  height: 80px;
  width: 100%;
  background: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  overflow: hidden;

  ${mobile`
    height: 60px;
  `}
`;

/* ================= WRAPPER ================= */

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 40px;

  display: flex;
  align-items: center;

  box-sizing: border-box;

  ${mobile`
    padding: 0 8px;
    gap: 8px;
  `}
`;

/* ================= LEFT ================= */

const Left = styled.div`
  flex: 1;
  min-width: 0;

  display: flex;
  align-items: center;

  ${mobile`
    flex: 0 0 auto;
  `}
`;

const Logo = styled.h1`
  font-family: Arial;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  white-space: nowrap;

  ${mobile`
    font-size: 21px;
  `}
`;

/* ================= CENTER ================= */

const Center = styled.div`
  flex: 2;
  min-width: 0;

  display: flex;
  justify-content: center;

  ${mobile`
    flex: 1;
  `}
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 700px;
  height: 50px;

  border: 1px solid #cfcfcf;
  border-radius: 6px;

  display: flex;
  align-items: center;

  overflow: hidden;
  box-sizing: border-box;

  ${mobile`
    height: 40px;
  `}
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;

  border: none;
  outline: none;

  padding: 14px 16px;
  font-size: 16px;

  box-sizing: border-box;

  ${mobile`
    padding: 8px 9px;
    font-size: 13px;
  `}
`;

const SearchButton = styled.div`
  flex: 0 0 55px;
  height: 50px;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${mobile`
    flex: 0 0 40px;
    height: 40px;
  `}
`;

/* ================= RIGHT ================= */

const Right = styled.div`
  flex: 1.2;
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${mobile`
    flex: 0 0 auto;
  `}
`;

const MenuItem = styled.div`
  font-size: 15px;
  font-weight: 600;

  margin-left: 20px;

  cursor: pointer;

  display: flex;
  align-items: center;

  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  ${mobile`
    margin-left: 0;
    font-size: 11px;
  `}
`;

/* Hide authentication text on mobile */

const AuthItem = styled(MenuItem)`
  ${mobile`
    display: none;
  `}
`;

/* ================= CART ================= */

const CartContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  ${mobile`
    gap: 0;
  `}
`;

const CartText = styled.span`
  ${mobile`
    display: none;
  `}
`;

/* ================= NAVBAR ================= */

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const { quantity } = useCart();

  const cartQuantity = currentUser ? quantity : 0;

  /* ================= SEARCH ================= */

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(
      `/products?search=${encodeURIComponent(search.trim())}`
    );
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <Container>
      <Wrapper>

        {/* ================= LOGO ================= */}

        <Left>
          <StyledLink to="/">
            <Logo>Amazon</Logo>
          </StyledLink>
        </Left>

        {/* ================= SEARCH ================= */}

        <Center>
          <SearchContainer>

            <Input
              placeholder="Search Products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <SearchButton onClick={handleSearch}>
              <SearchIcon />
            </SearchButton>

          </SearchContainer>
        </Center>

        {/* ================= RIGHT ================= */}

        <Right>

          {/* AUTH */}

          {!currentUser ? (
            <>
              <AuthItem>
                <StyledLink to="/login">
                  SIGN IN
                </StyledLink>
              </AuthItem>

              <AuthItem>
                <StyledLink to="/signup">
                  CREATE ACCOUNT
                </StyledLink>
              </AuthItem>
            </>
          ) : (
            <AuthItem onClick={handleLogout}>
              SIGN OUT
            </AuthItem>
          )}

          {/* CART */}

          <MenuItem>
            <StyledLink to="/cart">

              <CartContent>

                <CartText>
                  CART
                </CartText>

                <Badge
                  badgeContent={cartQuantity}
                  color="primary"
                >
                  <ShoppingCartOutlined
                    sx={{
                      fontSize: {
                        xs: 28,
                        sm: 30,
                        md: 32,
                      },
                    }}
                  />
                </Badge>

              </CartContent>

            </StyledLink>
          </MenuItem>

        </Right>

      </Wrapper>
    </Container>
  );
};

export default Navbar;