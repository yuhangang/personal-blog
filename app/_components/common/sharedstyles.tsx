import React, { ReactNode } from "react";
import styles from "./sharedstyles.module.scss";

interface Props {
  children: ReactNode;
}

// Container component
export const Container: React.FC<Props> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

// Main content area
export const Main: React.FC<Props> = ({ children }) => (
  <main className={styles.main}>{children}</main>
);

interface TitleProps extends Props {
  href?: string;
}

// Title component
export const Title: React.FC<TitleProps> = ({ children, href }) => (
  <h1 className={styles.title}>
    {href ? <a href={href}>{children}</a> : children}
  </h1>
);

// Description component
export const Description: React.FC<Props> = ({ children }) => (
  <p className={styles.description}>{children}</p>
);

// Code tag component
export const CodeTag: React.FC<Props> = ({ children }) => (
  <code className={styles.codeTag}>{children}</code>
);
