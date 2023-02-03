import React, { useState, useEffect } from "react";

const CopyLinkButton = ({
  buttonClasses,
}) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!showNotification) return;

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);

  }, [showNotification]);

  const addToClipBoard = () => {
    if (showNotification) return;
    navigator.clipboard.writeText(window.location.href);
    setShowNotification(true);
  };

  return (
    <>
      <button
        onClick={addToClipBoard}
        className={buttonClasses.join(' ')}
      >
        <div
          className="logo-before chain-label"
        >Copy Link</div>
      </button>
      {showNotification && (
        <div className="notification top-right">Link has been copied to the clipboard!</div>
      )}
    </>
  );
};

export default CopyLinkButton;
