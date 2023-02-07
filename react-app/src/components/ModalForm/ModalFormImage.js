import DynamicImage from '../DynamicImage';
import './ModalForm.css';

const ModalFormImage = ({
  dimension,
  entity,
  imageUrl,
  previewId,
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
        previewId={previewId}
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
        styleClasses={['button-action', 'b1']}
        uploadLabel="Upload image"
        replaceLabel="Replace Image"
        updateLabel="Update image"
        deleteLabel="Delete image"
        beforeLabel="camera-label"
        handleDelete={handleDelete}
      />
      {imageMissing && <div className="error-text">Image file is required</div>}
    </>
  );
};

export default ModalFormImage;
