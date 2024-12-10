import React from "react";
import styles from "./RetroList.module.scss";

interface RetroListProps {
  children: React.ReactNode;
  theme?: {
    colors?: {
      textColor?: string;
      focusTextColor?: string;
    };
  };
}

const RetroList: React.FC<RetroListProps> = ({ children, theme = {} }) => {
  const textColor = theme.colors?.textColor || "#000";
  const focusTextColor = theme.colors?.focusTextColor || "#333";

  return (
    <ul
      className={styles.retroList}
      style={{
        color: textColor,
      }}
    >
      {children}
    </ul>
  );
};

export default RetroList;
