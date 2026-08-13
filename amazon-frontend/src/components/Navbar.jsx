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

const Container = styled.div`
  height: 80px;
  background: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);

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

  ${mobile`
    flex: 1;
  `}
`;

const Right = styled.div`
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${mobile`
    flex: 1;
    justify-content: flex-end;
  `}
`;

const Logo = styled.h1`
  font-family: Arial;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 700px;
  border: 1px solid #cfcfcf;
  border-radius: 6px;
  display: flex;
  align-items: center;

  ${mobile`
    max-width: 100%;
  `}
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 16px;
  font-size: 16px;

  ${mobile`
    padding: 10px;
    font-size: 14px;
  `}
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

  ${mobile`
    width: 45px;
    height: 40px;
  `}
`;

const MenuItem = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-left: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #111;
  }

  ${mobile`
    margin-left: 10px;
    font-size: 12px;
  `}
`;

const HideOnMobile = styled.div`
  ${mobile`
    display: none;
  `}
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const { quantity } = useCart();

  const cartQuantity = currentUser ? quantity : 0;

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(
      `/products?search=${encodeURIComponent(search.trim())}`
    );
  };

  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  window.dispatchEvent(new Event("authChange"));

  navigate("/");
};

  return (
    <Container>
      <Wrapper>
        {/* LEFT */}
        <Left>
          <StyledLink to="/">
            <Logo>Amazon</Logo>
          </StyledLink>
        </Left>

        {/* CENTER */}
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

        {/* RIGHT */}
        <Right>
          {!currentUser ? (
            <>
              <MenuItem>
                <StyledLink to="/login">
                  SIGN IN
                </StyledLink>
              </MenuItem>

              <HideOnMobile>
                <MenuItem>
                  <StyledLink to="/signup">
                    CREATE ACCOUNT
                  </StyledLink>
                </MenuItem>
              </HideOnMobile>
            </>
          ) : (
            <MenuItem onClick={handleLogout}>
              SIGN OUT
            </MenuItem>
          )}

          <MenuItem>
            <StyledLink to="/cart">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                CART
                <Badge
                  badgeContent={cartQuantity}
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