import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSong, queueSong } from "../../../store/player";
import { likeSong, unlikeSong } from "../../../store/song";
import CopyLinkButton from "../../Buttons/CopyLinkButton";
import DropdownButton from "../../Buttons/DropdownButton";
import ToggleButton from "../../Buttons/ToggleButton";

const SongRowButtonGroup = ({
  song,
}) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b3'];

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
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    await dispatch(likeSong(formData));
  };

  const handleUnlike = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    await dispatch(unlikeSong(formData));
  };

  const addSongToQueue = async (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
    }
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: <div
        className="logo-before flex-row enqueue-label"
      >Add to queue</div>,
    },
    // {
    //   onClick: () => setShowPlaylistModal(true),
    //   label: <div
    //     className="logo-before flex-row enlist-label"
    //   >Add to playlist</div>,
    // },
  ];

  return (
    <div className="mini-asset-button-group flex-row">
      <ToggleButton
        condition={song?.likes.includes(sessionUser.id)}
        buttonClasses={[...baseClasses, 'b3']}
        labelClasses={['heart-label']}
        handleOff={handleUnlike}
        onLabel=""
        handleOn={handleLike}
        offLabel=""
      />

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label=""
        link={`${window.location.origin}/songs/${song?.id}`}
      />

      <DropdownButton
        toggleLabel=""
        toggleClasses={styleClasses}
        beforeLabel="ellipses-label"
        labelSize="l3"
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        dropdownUlClasses={['menu', 'button-group-menu', 'flex-column']}
        dropdownItems={dropdownItems}
      />
    </div>
  );
};

export default SongRowButtonGroup;
