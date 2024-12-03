import styled, { css } from "styled-components";

const Wrapper = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  background-color: transparent;
  color: #fff;
  position: fixed;
  z-index: 2;
  width: 100%;

  @media (min-width: 768px) {
    justify-content: space-between;
  }
`;

const HamburgerButton = styled.button<{ isopen: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  height: 21px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1;

  span {
    width: 100%;
    height: 1px;
    background-color: white;
    transition: all 0.3s ease-in-out;

    ${({ isopen }) =>
      isopen === "true" &&
      css`
        &:first-child {
          transform: translateY(9px) rotate(45deg);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:last-child {
          transform: translateY(-9px) rotate(-45deg);
        }
      `}
  }
`;

const NavMenu = styled.ul<{ isopen: string }>`
  display: ${({ isopen }) => (isopen === "true" ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: transparent;
  padding: 1rem 0;
  list-style-type: none;
  margin: 0;
  z-index: 0;

  @media (min-width: 768px) {
    display: flex;
    position: static;
    flex-direction: row;
    background-color: transparent;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;

    @media (min-width: 768px) {
      margin: 0 1rem;
    }

    a {
      color: #fff;
      text-decoration: none;
      font-size: 1.2rem;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }
  }
`;

export { Wrapper, HamburgerButton, NavMenu };
