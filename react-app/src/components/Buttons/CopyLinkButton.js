import React, { useState, useEffect } from "react";

const CopyLinkButton = ({
  buttonClasses,
  label,
  link = window.location.href,
  isOfDropdown = false,
}) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!showNotification) return;

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  }, [showNotification]);

  const addToClipboard = e => {
    e.stopPropagation();

    if (showNotification) return;
    navigator.clipboard.writeText(link);
    setShowNotification(true);
  };

  return (
    <>
      {isOfDropdown ? (
        <div
          onClick={addToClipboard}
          className="logo-before flex-row chain-label"
        >{label}</div>
      ) : (
        <button
          onClick={addToClipboard}
          className={buttonClasses.join(' ')}
        >
          <div
            className="logo-before chain-label"
          >{label}</div>
        </button>
      )}
      {showNotification && (
        <div className="notification top-right">Link has been copied to the clipboard!</div>
      )}
    </>
  );
};

export default CopyLinkButton;
