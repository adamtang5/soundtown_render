import React, { useEffect } from "react";

const CopyLinkButton = ({
  buttonClasses,
  handleCopy,
  showNotification,
  setShowNotification,
}) => {
  useEffect(() => {
    if (!showNotification) return;

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);

  }, [showNotification]);

  return (
    <>
      <button
        onClick={handleCopy}
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
