import React, { useEffect, useState } from "react";
import "../styles/Alert.css";

const Alert = ({
  message,
  link,
  linkText,
  type, // Types: info, success, error, warning
  duration = 5000,
  onClose,
}) => {
  const [animationClass, setAnimationClass] = useState("slide-in");

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setAnimationClass("fade-out");
    }, duration - 500); // Transition commence avant la suppression

    console.log(type);

    const removeTimer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setAnimationClass("fade-out");
    setTimeout(() => {
      if (onClose) onClose();
    }, 500); // Laisser l'animation de disparition se terminer
  };

  return (
    <div className={`custom-alert custom-alert-${type} ${animationClass}`}>
      <div className="custom-alert-content">
        <span>
          {message}
          {link && (
            <a href={link} className="custom-alert-link">
              {linkText}
            </a>
          )}
        </span>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
