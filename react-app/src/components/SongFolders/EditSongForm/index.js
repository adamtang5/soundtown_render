import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteSong, editSong } from "../../../store/song";
import ModalFormImage from "../../ModalForm/ModalFormImage";
import ModalFormInput from "../../ModalForm/ModalFormInput";
import ModalFormTextarea from "../../ModalForm/ModalFormTextarea";
import ModalFormMusic from "../../ModalForm/ModalFormMusic";
import ModalForm from "../../ModalForm/ModalForm";
import LoadingModal from "../../Modules/LoadingModal";
import "./EditSong.css";

const EditSongForm = ({ setShowEditSongModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const song = useSelector(state => state.songs[+id]);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState(song?.title);
  const [audioUrl, setAudioUrl] = useState(song?.audio_url);
  const [audioMissing, setAudioMissing] = useState(false);
  const [description, setDescription] = useState(song?.description);
  const [imageUrl, setImageUrl] = useState(song?.image_url);
  const [imageMissing, setImageMissing] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [newAudio, setNewAudio] = useState();
  const [newImage, setNewImage] = useState();

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle(song?.title);
    setAudioUrl(song?.audio_url);
    setDescription(song?.description);
    setImageUrl(song?.image_url);
    setShowEditSongModal(false);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!newAudio && !audioUrl) {
      setAudioMissing(true);
      return;
    }
    if (!newImage && !imageUrl) {
      setImageMissing(true);
      return;
    }

    const formData = new FormData();
    formData.append("audio_url", newAudio || audioUrl);
    formData.append("id", +id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image_url", newImage || imageUrl);

    if (newAudio) setAudioLoading(true);

    const res = await dispatch(editSong(+id, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setAudioLoading(false);
        setShowEditSongModal(false);
        history.push(`/songs/${id}`);
      }
    } else {
      setAudioLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const res = dispatch(deleteSong(+id));
    if (res) {
      setShowEditSongModal(false);
      history.push("/");
    }
  };

  const updateAudioFile = async (e) => {
    const file = await e.target.files[0];
    if (file) setNewAudio(file);
  };

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewImage(file);
      const img = document.getElementById("preview");
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
      label: "Delete Song",
      onClick: handleDelete,
      type: "delete",
    },
    {
      label: "Save Changes",
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
        h2="Edit Song"
        formLeft={
          <ModalFormImage
            dimension={250}
            entity="song"
            imageUrl={imageUrl}
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

export default EditSongForm;
