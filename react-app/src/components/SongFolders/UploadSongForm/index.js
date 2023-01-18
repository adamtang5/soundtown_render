import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSong } from "../../../store/song";

const UploadSongForm = ({ setShowUploadModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const [musicFile, setMusicFile] = useState();
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState();
  const [audioLoading, setAudioLoading] = useState(false);

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle("");
    setMusicFile();
    setDescription("");
    setImageFile();
    setShowUploadModal(false);
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!musicFile || !imageFile) {
      let errors = [];
      if (!imageFile) errors.push("Image file is required");
      if (!musicFile) errors.push("Music file is required");
      setErrors(errors);
      return;
    }

    const formData = new FormData();

    formData.append("audio_url", musicFile);
    formData.append("user_id", sessionUser.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image_url", imageFile);

    setAudioLoading(true);

    const res = dispatch(createSong(formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setAudioLoading(false);
        setShowUploadModal(false);
        history.push(`/`);
      }
    } else {
      setAudioLoading(false);
    }
  };

  const updateAudioFile = async (e) => {
    const file = await e.target.files[0];
    if (file) setMusicFile(file);
  };

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      const img = document.getElementById("upload-image");
      fr.readAsDataURL(file);
      fr.onload = () => img.src = fr.result;
      setImageFile(file);
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById("image-url").click();
  };

  const handleAudioButtonClick = e => {
    e.preventDefault();
    document.getElementById("audio-url").click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="upload-song"
      className="modal-form"
    >
      <h2>Upload Song</h2>
      <fieldset className="upload-form-container flex-row">
        <div className="upload-song-left flex-column">
          <img
            id="upload-image"
            alt=''
            className={`upload-song-image${imageFile ? '' : ' hidden'}`}
          />
          <div
            className={`upload-song-placeholder${imageFile ? ' hidden' : ''}`}
          />
          <input
            type="file"
            accept="image/*"
            onChange={updateImageFile}
            name="image-url"
            id="image-url"
            hidden
          />
          <button
            className={`cursor-pointer image-button ${imageFile ? "replace-image-button" : "upload-image-button flex-row"}`}
            onClick={handleImageButtonClick}
          >
            {imageFile ? (
              <span>Replace Image</span>
            ) : (
              <>
                <div className="upload-image-camera" />
                <span>Upload image</span>
              </>
            )}
          </button>
        </div>
        <div className="upload-song-right flex-column">
          <label className="label-required">Title</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />

          <input
            type="file"
            accept="audio/*"
            onChange={updateAudioFile}
            name="audio-url"
            id="audio-url"
            hidden
          />
          <button
            className={`cursor-pointer audio-button ${musicFile ? "replace-audio-button" : "upload-audio-button flex-row"}`}
            onClick={handleAudioButtonClick}
          >
            {musicFile ? (
              <span>Replace Music File</span>
            ) : (
              <>
                <div className="upload-audio-note" />
                <span>Upload Music</span>
              </>
            )}
          </button>

          {audioLoading && <p>Uploading music file...</p>}

        </div>
      </fieldset>
      <div className="form-footer flex-column">
        <div className="error-block">
          {errors?.map((error, ind) => (
            <div className="error-text" key={ind}>
              {error}
            </div>
          ))}
        </div>
        <div className="form-action flex-row">
          <div className="legend">
            <div className="legend-required">Required fields</div>
          </div>
          <div className="form-action-buttons flex-row">
            <button
              className="cursor-pointer modal-button button-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button className="cursor-pointer modal-button button-submit" type="submit">
              Submit
            </button>

          </div>
        </div>
      </div>
    </form>
  );
};

export default UploadSongForm;
