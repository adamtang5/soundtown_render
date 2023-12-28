import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Modal } from "../Context/Modal";
import { loadSong, queueSong } from "../../store/player";
import { toggleSongLike } from "../../store/song";
import AddSongToPlaylist from "../../modals/AddSongToPlaylist";
import { ImMenu3 } from "react-icons/im";
import { CgPlayList } from "react-icons/cg";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import "./Tile.css";

const Actions = ({ song }) => {
  const playingId = useSelector(state => state.player.playingId);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const openPlaylistModal = () => {
    if (showPlaylistModal) return;
    setShowPlaylistModal(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const addSongToQueue = (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
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
      {
        showPlaylistModal && (
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
        )
      }
    </div>
  );
};

const SongTile = ({ song, setShowModal }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const handlePlay = (e) => {
    dispatch(loadSong(song?.id));
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
    backgroundImage: `url(${song.image_url})`,
    backgroundSize: "cover",
  };

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={song?.title}
      >
        {sessionUser != null ? (
          <div className="overlay-group flex-row">
            <Actions song={song} />
            <div
              onClick={handlePlay}
              className="overlay-play"
            >&#9654;</div>
            <div className="overlay-like">
              {song?.likes?.includes(sessionUser?.id) && (
                <div
                  onClick={handleSongLikeToggle}
                  className="liked"
                >&#10084;</div>
              )}
              {!song?.likes?.includes(sessionUser?.id) && (
                <div
                  onClick={handleSongLikeToggle}
                  className="not-liked"
                >&#10084;</div>
              )}
            </div>
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
          <h3>{song.title}</h3>
        </NavLink>
        <span>{song.description}</span>
      </footer>
    </article>
  );
};

export default SongTile;
