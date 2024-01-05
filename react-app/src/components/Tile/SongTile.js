import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImMenu3 } from "react-icons/im";
import { CgPlayList } from "react-icons/cg";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { Modal } from "../Context/Modal";
import { AudioContext } from "../../context/AudioContext"
import { loadSong, queueSong } from "../../store/player";
import { toggleSongLike } from "../../store/song";
import AddSongToPlaylist from "../../modals/AddSongToPlaylist";
import AssetTile from "./AssetTile";
import "./Tile.css";

const Dropdown = ({ song }) => {
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
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
    if (!player?.currSongId) {
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
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);

  const handlePlayPause = async (e) => {
    if (song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
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
    <AssetTile
      entity="song"
      asset={song}
      isLoggedIn={sessionUser !== null}
      handlePlayPause={handlePlayPause}
      canPause={song?.id === player?.currSongId && isPlaying}
      handleLikeToggle={handleSongLikeToggle}
      coverStyle={coverStyle}
      dropdown={<Dropdown song={song} />}
      canLike={sessionUser?.id !== song?.user_id}
      liked={song?.likes?.includes(sessionUser?.id)}
      handleShowLoginModal={openLoginModal}
    />
  );
};

export default SongTile;
