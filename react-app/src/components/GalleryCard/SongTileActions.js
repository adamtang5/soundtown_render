import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../Context/Modal";
import { loadSong, queueSong } from "../../store/player";
import AddToPlaylist from "../PlaylistFolders/AddToPlaylist";
import { ImMenu3 } from 'react-icons/im'
import { CgPlayList } from 'react-icons/cg'
import { MdOutlinePlaylistAdd } from 'react-icons/md'

const SongTileActions = ({ song }) => {
  const playingId = useSelector((state) => state.player.playingId);
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

  return (
    <div className="overlay-actions">
      <div className="dropdown-hamburger" onClick={openMenu}>
        <ImMenu3 className="hamburger-icon cursor-pointer" />
      </div>
      <div className="dropdown-container">
        {showMenu && (
          <ul className="song-tile-action-dropdown flex-column">
            <li
              className='stad flex-row-center'
              onClick={() => addSongToQueue(song.id)}
            ><span className='flex-row-center '>
                <CgPlayList className="cg-icon" />  Add to Queue
              </span>
            </li>
            <li
              className='stad flex-row-center'
              onClick={openPlaylistModal}
            ><span className=' flex-row-center'>
                <MdOutlinePlaylistAdd className="cg-icon" /> Add to Playlist
              </span>
            </li>
          </ul>
        )}
      </div>
      {
        showPlaylistModal && (
          <Modal onClose={() => setShowPlaylistModal(false)}>
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
