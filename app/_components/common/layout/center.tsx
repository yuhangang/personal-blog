import React from "react";
import styles from "./center.module.scss";

// Center component (full center)
export const Center: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.center}>{children}</div>;

// Vertical centering
export const CenterVertical: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.centerVertical}>{children}</div>;

// Horizontal centering
export const CenterHorizontal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.centerHorizontal}>{children}</div>;

// Column centering
export const CenterColumn: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.centerColumn}>{children}</div>;

// Row layout
export const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.row}>{children}</div>
);

// Spacer component
interface SpacerProps {
  size?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 16 }) => {
  // Use dynamic class generation for custom sizes
  const spacerClass = styles[`spacer${size}`] || styles.spacerDefault;

  return <div className={`${styles.spacer} ${spacerClass}`} />;
};
