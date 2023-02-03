import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToggleButton from "../../Buttons/ToggleButton";
import { likePlaylist, unlikePlaylist } from "../../../store/playlist";
import { Modal } from "../../Context/Modal";
import CopyLinkButton from "../../Buttons/CopyLinkButton";

const PlaylistButtonGroup = ({ playlist }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
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
  }

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
    </div>
  );
};

export default PlaylistButtonGroup;
