import React from "react";
import Image from "next/image";
import styles from "./bio.module.scss";
import { Spacer } from "../../common/layout/center";
import classNames from "classnames";

interface BioProps {
  src: string;
  name: string;
  description: string | JSX.Element;
  size?: "small" | "medium" | "large";
  variant?: "circle" | "square";
}

const Bio: React.FC<BioProps> = ({
  src,
  name,
  description,
  size = "large",
  variant = "circle",
}) => {
  return (
    <div className={styles.avatarContainer}>
      <div
        className={classNames(
          styles.avatarWrapper,
          styles[size],
          styles[variant]
        )}
      >
        <Image
          src={src}
          alt={name || "avatar"}
          width={size === "large" ? 200 : size === "medium" ? 64 : 40}
          height={size === "large" ? 200 : size === "medium" ? 64 : 40}
          style={{ objectFit: "cover" }}
        />
      </div>
      <Spacer size={32} />
      <div className={styles.bioText}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default Bio;
