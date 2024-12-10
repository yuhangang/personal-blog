import React, { useState } from "react";
import { Camera, Mail, Settings } from "lucide-react";
import style from "./navButton.module.scss";

type FloatingActionButtonItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const menuItems: FloatingActionButtonItem[] = [
  {
    icon: <Camera size={24} />,
    label: "Camera",
    onClick: () => console.log("Camera clicked"),
  },
  {
    icon: <Mail size={24} />,
    label: "Mail",
    onClick: () => console.log("Mail clicked"),
  },
  {
    icon: <Settings size={24} />,
    label: "Settings",
    onClick: () => console.log("Settings clicked"),
  },
];

const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsExpanded(false);
  };

  return (
    <div className={style.fabBaseContainer}>
      <div
        className={`${style.fabContainer} ${isExpanded ? style.expanded : ""}`}
      >
        <button
          className={style.fabMainButton}
          onClick={toggleMenu}
          aria-label={isExpanded ? "Close menu" : "Open menu"}
        >
          <span className={style.fabIcon}>+</span>
        </button>

        <div className={style.fabMenu}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={style.fabMenuItem}
              onClick={() => handleItemClick(item.onClick)}
              aria-label={item.label}
            >
              {item.icon}
              <span className={style.fabMenuItemLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButton;
