import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSong } from "../../../store/song";
import ModalFormDescription from "../../ModalForm/ModalFormDescription";
import ModalFormImage from "../../ModalForm/ModalFormImage";
import ModalFormMusic from "../../ModalForm/ModalFormMusic";
import ModalFormTitle from "../../ModalForm/ModalFormTitle";

const UploadSongForm = ({ setShowUploadModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState();
  const [audioMissing, setAudioMissing] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const [imageMissing, setImageMissing] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [newAudio, setNewAudio] = useState();
  const [newImage, setNewImage] = useState();

  useEffect(() => {
    console.log(newImage);
  }, [newImage]);

  useEffect(() => {
    console.log(newAudio);
  }, [newAudio]);

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle("");
    setAudioUrl();
    setDescription("");
    setImageUrl();
    setShowUploadModal(false);
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!newAudio || !newImage) {
      if (!newImage) setImageMissing(true);
      if (!newAudio) setAudioMissing(true);
      return;
    }

    const formData = new FormData();
    formData.append("audio_url", newAudio || audioUrl);
    formData.append("user_id", sessionUser.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image_url", newImage || imageUrl);

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
    if (file) {
      setNewAudio(file);
      setAudioMissing(false);
    }
  };

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewImage(file);
      setImageMissing(false);
      const img = document.getElementById("upload-image");
      fr.onload = () => img.src = fr.result;
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
          <ModalFormImage
            imageUrl={imageUrl}
            updateImageFile={updateImageFile}
            newImage={newImage}
            handleImageButtonClick={handleImageButtonClick}
            imageMissing={imageMissing}
          />
        </div>
        <div className="upload-song-right flex-column">
          <ModalFormTitle
            title={title}
            setTitle={setTitle}
          />

          <ModalFormDescription
            description={description}
            setDescription={setDescription}
          />

          <ModalFormMusic
            audioUrl={audioUrl}
            updateAudioFile={updateAudioFile}
            newAudio={newAudio}
            handleAudioButtonClick={handleAudioButtonClick}
            audioMissing={audioMissing}
          />

          {audioLoading && <p>Uploading music file...</p>}

        </div>
      </fieldset>
      <footer>
        <div className="error-block">
          {errors?.map((error, ind) => (
            <div className="error-text" key={ind}>
              {error}
            </div>
          ))}
        </div>
        <div className="form-action flex-row">
          <div className="legend-required">Required fields</div>
          <div className="form-action-buttons flex-row">
            <button
              className="cursor-pointer modal-button button-cancel"
              onClick={handleCancel}
            >Cancel</button>
            <button
              className="cursor-pointer modal-button button-submit"
              type="submit"
            >Submit</button>
          </div>
        </div>
      </footer>
    </form>
  );
};

export default UploadSongForm;
