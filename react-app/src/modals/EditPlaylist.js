import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { loadSong } from "../store/player";
import { editPlaylist } from "../store/playlist";
import ModalForm from "../components/ModalForm/ModalForm";
import ModalFormImage from "../components/ModalForm/ModalFormImage";
import ModalFormInput from "../components/ModalForm/ModalFormInput";
import ModalFormTextarea from "../components/ModalForm/ModalFormTextarea";
import ModalFormFooter from "../components/ModalForm/ModalFormFooter";
import "../components/ModalForm/ModalForm.css";
import "./ModalNav.css";

const BasicInfo = ({ setShowModal, errors, setErrors }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);
  const [title, setTitle] = useState(playlist?.title);
  const [description, setDescription] = useState(playlist?.description || '');
  const [imageUrl, setImageUrl] = useState(playlist?.image_url || '');
  const [newImage, setNewImage] = useState();
  const [songsOrder, setSongsOrder] = useState(playlist?.songs_order);
  const previewId = "form-preview";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image_url", newImage || imageUrl);
    formData.append("id", id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("songs_order", JSON.stringify(songsOrder));

    const res = await dispatch(editPlaylist(id, formData));
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
        // buttonGroupData={buttonGroupData}
      />

    </>
  );
};

const SingleSongRow = ({ song }) => {
  const dispatch = useDispatch();

  const handlePlay = async (e) => {
    e.preventDefault();
    await dispatch(loadSong(song?.id));
  };

  return (
    <article
      className="song-row flex-row cursor-pointer"
      onClick={handlePlay}
    >
      <div className="song-row-content flex-row">
        <div
          className="song-row-thumb"
          style={{ backgroundImage: `url(${song?.image_url})` }}
        />
        <div className="song-row-title">{song?.title}</div>
      </div>
    </article>
  )
};

const AllTracks = ({ songArr }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const statePlaylists = useSelector(state => state.playlists);

  const handleDelist = async (playlistId, songId) => {
    const formData = new FormData();
    const playlist = statePlaylists[playlistId];

    formData.append("title", playlist?.title);
    formData.append("description", playlist?.description || '');
    formData.append(
      "songs_order",
      JSON.stringify(playlist?.songs_order.filter(id => id !== songId))
    );

    const res = await dispatch(editPlaylist(playlistId, formData));
    if (res) return res;
  };

  return (
    <section className="playlist-songs-list">
      <ul>
        {songArr?.map(song => (
          <li key={song?.id} className="flex-row">
            <SingleSongRow song={song} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const EditPlaylist = ({ setShowModal, songArr }) => {
  const [mode, setMode] = useState("basic");
  const [errors, setErrors] = useState([]);

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

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle(playlist?.title);
    setDescription(playlist?.description);
    setImageUrl(playlist?.image_url);
    setNewImage(null);
    setSongsOrder(playlist?.songs_order);
    setShowModal(false);
  };

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
    <div className="combo-form-container">
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
        <BasicInfo
          setShowModal={setShowModal}
          errors={errors}
          setErrors={setErrors} />
      ) : (
        <AllTracks songArr={songArr} />
      )}

      <ModalFormFooter
        errors={errors}
        buttonGroupData={buttonGroupData}
      />
    </div>
  );
};

export default EditPlaylist;
