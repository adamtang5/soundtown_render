import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeSong, unlikeSong } from "../../../store/song";
import { loadSong, queueSong } from "../../../store/player";
import { Modal } from "../../Context/Modal";
import AddToPlaylist from "../../PlaylistFolders/AddToPlaylist";
import ToggleButton from "../../Buttons/ToggleButton";
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
  const [showEditSongModal, setShowEditSongModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

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
      label: "Add to queue",
    },
    {
      onClick: () => setShowPlaylistModal(true),
      label: "Add to playlist",
    },
  ];

  return (
    <div className="asset-button-group flex-row">
      <ToggleButton
        condition={song?.likes.includes(sessionUser.id)}
        buttonClasses={[...baseClasses, 'b2']}
        labelClasses={['heart-label']}
        handleOff={handleUnlike}
        onLabel="Liked"
        handleOn={handleLike}
        offLabel="Like"
      />

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label="Copy Link"
      />

      {sessionUser?.id === song?.user_id && (
        <EditButton
          showModal={showEditSongModal}
          setShowModal={setShowEditSongModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={<EditSongForm setShowEditSongModal={setShowEditSongModal} />}
        />
      )}

      <DropdownButton
        toggleLabel="More"
        toggleClasses={styleClasses}
        beforeLabel="ellipses-label"
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        dropdownUlClasses={['menu', 'button-group-menu']}
        dropdownItems={dropdownItems}
      />
      {showPlaylistModal && (
        <Modal
          onClose={() => setShowPlaylistModal(false)}
          position="top"
          paddingTop={50}
        >
          <div className="playlist-modal-container">
            <AddToPlaylist song={song} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SongButtonGroup;
