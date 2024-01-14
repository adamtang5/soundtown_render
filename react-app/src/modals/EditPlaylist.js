import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { loadSong, loadPlaylist } from "../store/player";
import { editPlaylist } from "../store/playlist";
import ModalFormImage from "../components/ModalForm/ModalFormImage";
import ModalFormInput from "../components/ModalForm/ModalFormInput";
import ModalFormTextarea from "../components/ModalForm/ModalFormTextarea";
import ModalFormFooter from "../components/ModalForm/ModalFormFooter";
import "../components/ModalForm/ModalForm.css";
import "./ModalNav.css";
import { AudioContext } from "../context/AudioContext";
import { FaPause, FaPlay } from "react-icons/fa6";

const BasicInfo = ({
  playlistData,
  setPlaylistData,
}) => {
  const previewId = "form-preview";

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setPlaylistData({
        ...playlistData,
        newImage: file,
      })
      const img = document.getElementById(previewId);
      fr.onload = () => img.src = fr.result;
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById("image-url").click();
  }

  const handleSetTitle = title => {
    setPlaylistData({
      ...playlistData,
      title,
    });
  };

  const handleSetDescription = description => {
    setPlaylistData({
      ...playlistData,
      description,
    });
  };

  return (
    <>
      <fieldset className="playlist-form-container flex-row">
        <div className="playlist-form-left flex-column">
          <ModalFormImage
            dimension={250}
            entity="playlist"
            imageUrl={playlistData?.imageUrl}
            previewId={previewId}
            updateImageFile={updateImageFile}
            newImage={playlistData?.newImage}
            handleImageButtonClick={handleImageButtonClick}
          />
        </div>
        <div className="playlist-form-right flex-column">
          <ModalFormInput
            label="Title"
            value={playlistData?.title}
            setValue={handleSetTitle}
          />

          <ModalFormTextarea
            label="Description"
            value={playlistData?.description}
            setValue={handleSetDescription}
          />
        </div>
      </fieldset>
    </>
  );
};

const SingleSongRow = ({ song }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);

  const handlePlayPause = async (e) => {
    e.preventDefault();

    if (playlist?.id === player?.currPlaylistId &&
      song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadPlaylist(
        playlist,
        playlist?.songs_order.indexOf(song?.id)
      ))
    }
  };

  return (
    <article className="song-row cursor-pointer">
      <div className="song-row-overlay full-box">
        <div className="song-row-content full-box flex-row">
          <div
            className="song-row-thumb"
            style={{ backgroundImage: `url(${song?.image_url})` }}
          />
          <div className="song-row-title">{song?.title}</div>
        </div>
        <button
          onClick={handlePlayPause}
          className={`song-row-play ${playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId &&
            isPlaying ? "standout" : ""}`}
        >
          {playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId && isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}
        </button>
      </div>
    </article>
  )
};

const AllTracks = ({ playlistData, setPlaylistData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const statePlaylists = useSelector(state => state.playlists);
  const playlist = useSelector(state => state.playlists[id]);
  const [songsOrder, setSongsOrder] = useState(playlist?.songs_order);
  const playlistSongs = useSelector(state => songsOrder?.map(id => state.songs[id]));

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
        {playlistSongs?.map(song => (
          <li key={song?.id} className="flex-row">
            <SingleSongRow song={song} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const EditPlaylist = ({ setShowModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);
  const [mode, setMode] = useState("basic");
  const [errors, setErrors] = useState([]);
  const [playlistData, setPlaylistData] = useState({
    id,
    title: playlist?.title,
    description: playlist?.description || '',
    imageUrl: playlist?.image_url || '',
    newImage: null,
    songsOrder: playlist?.songs_order,
  });

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
    setPlaylistData({
      id,
      title: playlist?.title,
      description: playlist?.description || '',
      imageUrl: playlist?.image_url || '',
      newImage: null,
      songsOrder: playlist?.songs_order,
    });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image_url", playlistData?.newImage || playlistData?.imageUrl);
    formData.append("id", playlistData?.id);
    formData.append("title", playlistData?.title);
    formData.append("description", playlistData?.description);
    formData.append("songs_order", JSON.stringify(playlistData?.songsOrder));

    const res = await dispatch(editPlaylist(playlistData?.id, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setShowModal(false);
        history.push(`/playlists/${playlistData?.id}`);
      }
    }
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

      <form
        onSubmit={handleSubmit}
        className="modal-playlist-form modal-form"
      >
        {mode === "basic" ? (
          <BasicInfo
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />
        ) : (
          <AllTracks
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />
        )}

        <ModalFormFooter
          errors={errors}
          buttonGroupData={buttonGroupData}
        />
      </form>
    </div>
  );
};

export default EditPlaylist;
