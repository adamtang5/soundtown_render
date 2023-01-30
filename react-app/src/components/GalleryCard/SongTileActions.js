import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../Context/Modal";
import { loadSong, queueSong } from "../../store/player";
import AddToPlaylist from "../PlaylistFolders/AddToPlaylist";
import { ImMenu3 } from 'react-icons/im';
import { CgPlayList } from 'react-icons/cg';
import { MdOutlinePlaylistAdd } from 'react-icons/md';

const SongTileActions = ({ song }) => {
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
      onClick: () => addSongToQueue(song.id),
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
                className="flex-row"
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
            position="center"
          >
            <div className="add_to_playlist_modal_container">
              <AddToPlaylist song={song} />
            </div>
          </Modal>
        )
      }
    </div>
  );
};

export default SongTileActions;
