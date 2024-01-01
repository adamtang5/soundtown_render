import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { ImMenu3 } from "react-icons/im";
import { CgPlayList } from "react-icons/cg";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { Modal } from "../Context/Modal";
import { AudioContext } from "../../context/AudioContext"
import { loadSong, queueSong } from "../../store/player";
import { toggleSongLike } from "../../store/song";
import AddSongToPlaylist from "../../modals/AddSongToPlaylist";
import "./Tile.css";

const Actions = ({ song }) => {
  const dispatch = useDispatch();
  const playingId = useSelector(state => state.player.playingId);
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };  

  const openPlaylistModal = () => {
    if (showPlaylistModal) return;
    setShowPlaylistModal(true);
  };  

  const addSongToQueue = async (id) => {
    if (!playingId) {
      await dispatch(loadSong(id));
    } else {
      await dispatch(queueSong(id));
    }
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song?.id),
      leftIcon: <CgPlayList className="cg-icon" />,
      label: "Add to Queue",
    },
    {
      onClick: openPlaylistModal,
      leftIcon: <MdOutlinePlaylistAdd className="cg-icon" />,
      label: "Add to Playlist",
    },
  ];

  return (
    <div className="overlay-actions">
      <div className="dropdown-hamburger" onClick={openMenu}>
        <ImMenu3 className="hamburger-icon cursor-pointer" />
      </div>
      <div className="dropdown-container">
        {showMenu && (
          <ul className="dropdown-list flex-column">
            {dropdownItems.map((item, idx) => (
              <li
                key={idx}
                className="flex-row cursor-pointer"
                onClick={item.onClick}
              >
                {item.leftIcon}{item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showPlaylistModal && (
        <Modal
          onClose={() => setShowPlaylistModal(false)}
          position="top"
          paddingTop={50}
        >
          <div className="playlist-modal-container">
            <AddSongToPlaylist
              song={song}
              setShowModal={setShowPlaylistModal}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

const SongTile = ({ song, setShowModal }) => {
  const { playerRef } = useContext(AudioContext);
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);

  const handlePlayPause = async (e) => {
    if (song?.id === player?.playingId) {
      if (player?.isPlaying) {
        await playerRef?.current?.audio?.current?.pause();
      } else {
        await playerRef?.current?.audio?.current?.play();
      }
    } else {
      await dispatch(loadSong(song?.id));
    }
  };

  const handleSongLikeToggle = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(toggleSongLike(song?.id, formData));
  };

  const openLoginModal = () => {
    setShowModal(true);
  };

  const coverStyle = {
    backgroundImage: `url(${song?.image_url})`,
    backgroundSize: "cover",
  };

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={song?.title}
      >
        {sessionUser !== null ? (
          <div className="overlay-group">
            <div className="overlay-layer full-box">
              <button
                onClick={handlePlayPause}
                className="overlay-play"
              >
                {player?.isPlaying && song?.id === player?.playingId ? (
                  <FaCirclePause />
                ) : (
                  <FaCirclePlay />
                )}
              </button>
            </div>
            <Actions song={song} />
            {sessionUser?.id !== song?.user_id && (
              <div className="overlay-like">
                <button
                  onClick={handleSongLikeToggle}
                  className={song?.likes?.includes(sessionUser?.id) ? "liked": "not-liked"}
                >
                  <FaHeart />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overlay-single flex-row">
            <div
              onClick={() => setShowModal(true)}
              className="overlay-play"
            >&#9654;</div>
          </div>
        )}
      </div>
      <footer className="tile-info">
        <NavLink to={`/songs/${song?.id}`}>
          <h3>{song?.title}</h3>
        </NavLink>
        <span>{song?.description}</span>
      </footer>
    </article>
  );
};

export default SongTile;
