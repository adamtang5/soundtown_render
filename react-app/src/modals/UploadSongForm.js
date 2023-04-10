import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSong } from "../store/song";
import ModalFormTextarea from "../components/ModalForm/ModalFormTextarea";
import ModalFormImage from "../components/ModalForm/ModalFormImage";
import ModalFormMusic from "../components/ModalForm/ModalFormMusic";
import ModalFormInput from "../components/ModalForm/ModalFormInput";
import ModalForm from "../components/ModalForm/ModalForm";
import LoadingModal from "../components/Modules/LoadingModal";

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
  const previewId = "form-preview";

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

    const res = await dispatch(createSong(formData));
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
      const img = document.getElementById(previewId);
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

  const buttonGroupData = [
    {
      label: "Upload",
      type: "submit",
    },
    {
      label: "Cancel",
      onClick: handleCancel,
      type: "cancel",
    },
  ]
  return (
    <>
      <ModalForm
        entity="song"
        handleSubmit={handleSubmit}
        h2="Upload Song"
        formLeft={
          <ModalFormImage
            dimension={250}
            entity="song"
            imageUrl={imageUrl}
            previewId={previewId}
            updateImageFile={updateImageFile}
            newImage={newImage}
            handleImageButtonClick={handleImageButtonClick}
            imageMissing={imageMissing}
          />
        }
        formRight={
          <>
            <ModalFormInput
              label="Title"
              value={title}
              setValue={setTitle}
            />

            <ModalFormTextarea
              label="Description"
              value={description}
              setValue={setDescription}
            />

            <ModalFormMusic
              audioUrl={audioUrl}
              updateAudioFile={updateAudioFile}
              newAudio={newAudio}
              handleAudioButtonClick={handleAudioButtonClick}
              audioMissing={audioMissing}
            />
          </>
        }
        errors={errors}
        buttonGroupData={buttonGroupData}
      />

      <LoadingModal showModal={audioLoading} />
    </>
  );
};

export default UploadSongForm;
