import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editPlaylist } from "../store/playlist";
import ModalForm from "../components/ModalForm/ModalForm";
import ModalFormImage from "../components/ModalForm/ModalFormImage";
import ModalFormInput from "../components/ModalForm/ModalFormInput";
import ModalFormTextarea from "../components/ModalForm/ModalFormTextarea";
import AllTracksModal from "../components/PlaylistFolders/EditPlaylistModal/AllTracksModal";
import "../components/ModalForm/ModalForm.css";
import "./ModalNav.css";
// import "./AddEditPlaylist.css";

const BasicInfoForm = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[+id]);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState(playlist?.title);
  const [description, setDescription] = useState(playlist?.description);
  const [imageUrl, setImageUrl] = useState(playlist?.image_url || '');
  const [newImage, setNewImage] = useState();
  const [songsOrder, setSongsOrder] = useState(playlist?.songs_order);
  const previewId = "form-preview";

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle(playlist?.title);
    setDescription(playlist?.description);
    setImageUrl(playlist?.image_url);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image_url", newImage || imageUrl);
    formData.append("id", +id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("songs_order", songsOrder);

    const res = await dispatch(editPlaylist(+id, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setShowModal(false);
        history.push(`/playlists/${id}`);
      }
    }
  };

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewImage(file);
      const img = document.getElementById(previewId);
      fr.onload = () => img.src = fr.result;
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById("image-url").click();
  }

  const buttonGroupData = [
    {
      label: 'Save Changes',
      type: 'submit',
    },
    {
      label: 'Cancel',
      onClick: handleCancel,
      type: "cancel",
    },
  ];

  return (
    <>
      <ModalForm
        entity="playlist"
        handleSubmit={handleSubmit}
        formLeft={
          <ModalFormImage
            dimension={250}
            entity="playlist"
            imageUrl={imageUrl}
            previewId={previewId}
            updateImageFile={updateImageFile}
            newImage={newImage}
            handleImageButtonClick={handleImageButtonClick}
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
          </>
        }
        errors={errors}
        buttonGroupData={buttonGroupData}
      />

    </>
  );
};

const EditPlaylist = ({ setShowModal, songArr }) => {
  const [mode, setMode] = useState("basic");

  const navData = [
    {
      mode: 'basic',
      label: 'Basic info',
    },
    {
      mode: 'tracks',
      label: 'Tracks',
    },
  ];

  return (
    <div className="playlist-form-container">
      <header>
        <nav>
          <ul className="nav-header flex-row">
            {navData.map((data, idx) => (
              <li
                key={idx}
                onClick={() => setMode(data.mode)}
                className={mode === data.mode ? "active" : "cursor-pointer"}
              >{data.label}</li>
            ))}
          </ul>
        </nav>
      </header>

      {mode === "basic" ? (
        <BasicInfoForm setShowModal={setShowModal} />
      ) : (
        <AllTracksModal songArr={songArr} />
      )}
    </div>
  );
};

export default EditPlaylist;
