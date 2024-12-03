import styled from "styled-components";

// NavbarSpacer that ensures consistent spacing
export const NavbarSpacer = styled.div<{ height?: number }>`
  height: ${(props) => props.height || 64}px;
  width: 100%;
  flex-shrink: 0; // Prevents spacer from shrinking
`;

// Updated ConstrainedSection that properly handles padding
export const ConstrainedSection = styled.section`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;

  /* Ensure padding is applied to direct children */
  > * {
    width: 100%;
    padding-left: inherit;
    padding-right: inherit;
  }

  /* Optional: Add spacing between sections */
  > * + * {
    margin-top: 24px;
  }
`;

// Layout wrapper to ensure proper structure
export const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const NarrowContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
`;

export const WideContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
`;
