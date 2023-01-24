const CopyLinkButton = ({ handleCopy, showNotification }) => {
  return (
    <>
      <button
        onClick={handleCopy}
        className="song-button cursor-pointer"
      >Copy Link</button>
      {showNotification && (
        <div className="dropdown-clipboard">Link has been copied to the clipboard!</div>
      )}
    </>
  );
};

export default CopyLinkButton;
