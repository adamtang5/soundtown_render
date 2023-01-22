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
        {imageUrl && <img
          id="upload-image"
          alt=''
          // className={`upload-song-image${imageFile ? '' : ' hidden'}`}
          className="upload-song-image"
          src={imageUrl}
        />}
        <input
          type="file"
          accept="image/*"
          onChange={updateImageFile}
          name="image-url"
          id="image-url"
          hidden
        />
        <button
          className={`cursor-pointer image-button ${newImage || imageUrl ? "replace-image-button" : "upload-image-button flex-row"}`}
          onClick={handleImageButtonClick}
        >
          {newImage || imageUrl ? (
            <span>Replace Image</span>
          ) : (
            <>
              <div className="upload-image-camera" />
              <span>Upload image</span>
            </>
          )}
        </button>
      </div>
      {newImage && <div className="info-text">{newImage.name}</div>}
      {imageMissing && <div className="error-text">Image file is required</div>}
    </>
  );
};

export default ModalFormImage;
