import './ModalForm.css';

const ModalFormImage = ({
  imageUrl,
  updateImageFile,
  newImage,
  handleImageButtonClick,
  imageMissing,
}) => {
  return (
    <>
      <label className="label-required">Image</label>
      <div className="upload-song-placeholder">
        <img
          id="upload-image"
          alt=''
          className="upload-song-image"
          src={imageUrl}
        />
        <div className="modal-image-overlay">
          <input
            type="file"
            accept="image/*"
            onChange={updateImageFile}
            name="image-url"
            id="image-url"
            hidden
          />
          {newImage || imageUrl ? (
            <button
              className={`cursor-pointer image-button replace-image-button`}
              onClick={handleImageButtonClick}
            >
              <span>Replace Image</span>
            </button>
          ) : (
            <button
              className={`cursor-pointer image-button upload-image-button flex-row`}
              onClick={handleImageButtonClick}
            >
              <div className="upload-image-camera" />
              <span>Upload image</span>
            </button>
          )}
        </div>
      </div>
      {newImage && <div className="info-text">{newImage.name}</div>}
      {imageMissing && <div className="error-text">Image file is required</div>}
    </>
  );
};

export default ModalFormImage;
