"use client";
import React from "react";
import InfiniteGallery from "../gallery";
import styled from "styled-components";

const Main = styled.main`
  width: 100vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px; // Adds consistent spacing between children
  background-color: black;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
`;

const NavBarIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
`;

export default function Gallery(): JSX.Element {
  return (
    <>
      <Main>
        <InfiniteGallery />
        <NavBar>
          <div>Gallery</div>
          <NavBarIcon>🌙</NavBarIcon>
        </NavBar>
      </Main>
    </>
  );
}
