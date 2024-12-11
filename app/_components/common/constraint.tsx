import React from "react";
import styles from "./constraint.module.scss"; // Import the Sass file

// Replace styled components with regular divs/sections using className
export const NavbarSpacer: React.FC<{ height?: number }> = ({ height }) => (
  <div
    className={styles.navbarSpacer}
    style={{ height: height ? `${height}px` : undefined }}
  />
);

export const ConstrainedSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <section className={styles.constrainedSection}>{children}</section>;

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.pageLayout}>{children}</div>;

export const Container: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.container}>{children}</div>;

export const NarrowContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.narrowContent}>{children}</div>;

export const WideContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.wideContent}>{children}</div>;
