import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeSong, unlikeSong } from "../../../store/song";
import { loadSong, queueSong } from "../../../store/player";
import { Modal } from "../../Context/Modal";
import AddToPlaylist from "../../PlaylistFolders/AddToPlaylist";
import LikeButton from "../../Buttons/LikeButton";
import CopyLinkButton from "../../Buttons/CopyLinkButton";
import EditButton from "../../Buttons/EditButton";
import DropdownButton from "../../Buttons/DropdownButton";
import EditSongForm from "../EditSongForm";

const SongButtonGroup = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showEditSongModal, setShowEditSongModal] = useState(false);

  useEffect(() => {
    if (!showNotification) return;

    const closeNotification = () => {
      if (!showNotification) return;
      setShowNotification(false);
    };

    document.addEventListener("click", closeNotification);

    return () => document.removeEventListener("click", closeNotification);
  }, [showNotification]);

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  const handleLike = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(likeSong(formData));
  };

  const handleUnlike = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(unlikeSong(formData));
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: "Add to queue",
    },
    {
      onClick: () => setShowPlaylistModal(true),
      label: "Add to playlist",
    },
  ];

  const addSongToQueue = (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
    }
  };

  const addToClipBoard = () => {
    if (showNotification) return;
    navigator.clipboard.writeText(window.location.href);
    setShowNotification(true);
  };

  return (
    <div className="song-button-group flex-row">
      <LikeButton
        isLiked={song?.likes.includes(sessionUser.id)}
        handleUnlike={handleUnlike}
        handleLike={handleLike}
      />

      <CopyLinkButton
        handleCopy={addToClipBoard}
        showNotification={showNotification}
      />

      {sessionUser?.id === song?.user_id && (
        <EditButton
          showModal={showEditSongModal}
          setShowModal={setShowEditSongModal}
          buttonClasses={['song-button', 'cursor-pointer']}
          modalForm={<EditSongForm setShowEditSongModal={setShowEditSongModal} />}
        />
      )}

      <DropdownButton
        toggleLabel="More"
        toggleClasses={['song-button', 'cursor-pointer']}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        dropdownUlClasses={['menu', 'button-group-menu']}
        dropdownItems={dropdownItems}
      />
      {showPlaylistModal && (
        <Modal
          onClose={() => setShowPlaylistModal(false)}
          position="center"
        >
          <div className="add_to_playlist_modal_container">
            <AddToPlaylist song={song} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SongButtonGroup;
