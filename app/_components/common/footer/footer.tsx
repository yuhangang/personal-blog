import React from "react";
import { Metadata } from "next";
import styles from "./footer.module.scss";
import { socialLinks } from "./footer.config";
import SocialLinkItem from "./socialLink";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <h2 className={styles.footerTitle}>Work in Progress ...</h2>

      <hr className={styles.divider} />

      <div className={styles.socialLinks}>
        {socialLinks.map((link) => (
          <SocialLinkItem key={link.name} link={link} location="Footer" />
        ))}
      </div>

      <p className={styles.footerText}>
        © {new Date().getFullYear()} Yu Hang Ang. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
