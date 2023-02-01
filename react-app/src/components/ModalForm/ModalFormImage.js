import DynamicImage from '../DynamicImage';
import './ModalForm.css';

const ModalFormImage = ({
  dimension,
  entity,
  imageUrl,
  updateImageFile,
  newImage,
  handleImageButtonClick,
  handleDelete,
  imageMissing,
}) => {
  return (
    <>
      <label className="label-required">Image</label>

      <DynamicImage
        dimension={dimension}
        standalone={false}
        entity={entity}
        imageUrl={imageUrl}
        stagedFile={newImage}
        hiddenInput={<input
          type="file"
          accept="image/*"
          onChange={updateImageFile}
          name="image-url"
          id="image-url"
          hidden
        />}
        isAuthorized={true}
        clickHidden={handleImageButtonClick}
        styleClasses={['button-action', 'b2']}
        uploadLabel="Upload image"
        replaceLabel="Replace Image"
        updateLabel="Update image"
        deleteLabel="Delete image"
        beforeLabel="camera-label"
        handleDelete={handleDelete}
      />

      {/* <div className="upload-song-placeholder">
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
      {newImage && <div className="info-text">{newImage.name}</div>} */}

      {imageMissing && <div className="error-text">Image file is required</div>}
    </>
  );
};

export default ModalFormImage;
