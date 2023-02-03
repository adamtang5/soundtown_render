import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ToggleButton from "../../Buttons/ToggleButton";
import { likePlaylist, unlikePlaylist, deletePlaylist } from "../../../store/playlist";
import { loadPlaylist, queuePlaylist } from "../../../store/player";
import CopyLinkButton from "../../Buttons/CopyLinkButton";
import EditButton from "../../Buttons/EditButton";
import AddEditPlaylistModal from "../AddEditPlaylistModal";
import ConfirmDeleteModal from "../../ConfirmModal/ConfirmDeleteModal";

const PlaylistButtonGroup = ({ playlist }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const songsArr = [];
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

  const handleLike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("playlist_id", playlist.id);
    dispatch(likePlaylist(formData));
  };

  const handleUnlike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("playlist_id", playlist.id);
    dispatch(unlikePlaylist(formData));
  };

  const addPlaylistToQueue = (playlist) => {
    if (!playingId) {
      dispatch(loadPlaylist(playlist));
    } else {
      dispatch(queuePlaylist(playlist));
    }
  };

  const removePlaylist = async (e) => {
    e.preventDefault();

    const res = await dispatch(deletePlaylist(playlist?.id));
    if (res) {
      history.push("/library/playlists");
    }
  };

  return (
    <div className="asset-button-group flex-row">
      <ToggleButton
        condition={playlist?.likes.includes(sessionUser.id)}
        buttonClasses={[...baseClasses, 'b2']}
        labelClasses={['heart-label']}
        handleOff={handleUnlike}
        onLabel="Liked"
        handleOn={handleLike}
        offLabel="Like"
      />

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
      />

      {sessionUser?.id === playlist?.user_id && (
        <EditButton
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={
            <AddEditPlaylistModal
              modalMode="edit"
              modalFunction={setShowEditModal}
              songArr={songsArr}
            />
          }
        />
      )}

      <button
        className={[...baseClasses, ...styleClasses].join(' ')}
        onClick={() => addPlaylistToQueue(playlist)}
      >
        <div
          className="logo-before add-to-list-label"
        >Add to Queue</div>
      </button>

      {sessionUser?.id === playlist?.user_id && (
        <>
          <button
            className={[...baseClasses, ...styleClasses].join(' ')}
            onClick={() => setShowConfirmModal(true)}
          >
            <div
              className="logo-before trash-label"
            >Delete Playlist</div>
          </button>
          <ConfirmDeleteModal
            showModal={showConfirmModal}
            setShowModal={setShowConfirmModal}
            handleDelete={removePlaylist}
            entity="playlist"
          />
        </>
      )}
    </div>
  );
};

export default PlaylistButtonGroup;
