import React from "react";
import {
  FooterContainer,
  FooterTitle,
  Divider,
  SocialLinks,
  SocialLink,
  SocialIconWrapper,
  IconCircle,
  SocialText,
  FooterText,
} from "./footer.style";
import { socialLinks } from "./footer.config";

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterTitle>Work in Progress ...</FooterTitle>

      <Divider />

      <SocialLinks>
        {socialLinks.map((link) => (
          <SocialLink
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIconWrapper>
              <IconCircle>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${link.url}`}
                  alt={`${link.name} favicon`}
                  width="24"
                  height="24"
                  style={{ borderRadius: '50%' }}
                />
              </IconCircle>
              <SocialText>{link.name}</SocialText>
            </SocialLink>
          </SocialLink>
        ))}
      </SocialLinks>

      <FooterText>
        © {new Date().getFullYear()} Yu Hang Ang. All rights reserved.
      </FooterText>
    </FooterContainer>
  );
};
