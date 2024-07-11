const UploadButton = ({ showUploadModal, setShowUploadModal }) => {

  return (
    <button
      onClick={() => setShowUploadModal(true)}
      className="navlinks full-height upload cursor-pointer flex-row-center"
      style={{ background: `${showUploadModal ? '#111' : ''}` }}
    >Upload</button>
  );
};

export default UploadButton;
