import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f4f4f4;
  color: #333;
  text-align: center;
  font-family: "Neue Haas Grotesk", "Inter", sans-serif;
  padding: 4rem 2rem;
`;

const FooterTitle = styled.h2`
  font-weight: 300;
  letter-spacing: -1px;
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1.5rem;

  @media (min-width: 768px) {
    gap: 2.5 rem;
  }

  @media (min-width: 1024px) {
    gap: 3rem;
  }
`;

const SocialLink = styled.a`
  position: relative;
  display: inline-block;
  color: #333;
  text-decoration: none;
  font-weight: 300;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -4px;
    left: 0;
    background-color: #333;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #666;

    &::after {
      transform: scaleX(1);
    }
  }
`;

const SocialIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-family: "Courier New", monospace;
  font-weight: bold;
  font-size: 1rem;

  ${SocialLink}:hover & {
    background-color: #333;
    color: #f4f4f4;
  }
`;

const SocialText = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterText = styled.p`
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #666;
  font-weight: 300;
`;

const Divider = styled.hr`
  width: 50px;
  border: none;
  height: 1px;
  background-color: #333;
  margin: 2rem auto;
`;

export {
  FooterContainer,
  FooterTitle,
  SocialLinks,
  SocialLink,
  SocialIconWrapper,
  IconCircle,
  SocialText,
  FooterText,
  Divider,
};
