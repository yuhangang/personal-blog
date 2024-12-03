import React, { useState } from "react";
import { Wrapper, NavMenu, HamburgerButton } from "./navbar.style";

const Navbar: React.FC = () => {
  const [isopen, setIsopen] = useState("false");

  const toggleMenu = () => {
    setIsopen(isopen === "true" ? "false" : "true");
  };

  return (
    <Wrapper>
      <NavMenu isopen={isopen}>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Services</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </NavMenu>
      <HamburgerButton isopen={isopen} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </HamburgerButton>
    </Wrapper>
  );
};

export default Navbar;
