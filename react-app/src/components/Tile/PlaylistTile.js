import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgPlayList } from "react-icons/cg";
import { ImMenu3 } from "react-icons/im";
import { AudioContext } from "../../context/AudioContext";
import { loadPlaylist, queuePlaylist } from "../../store/player";
import { getPlaylist, togglePlaylistLike } from "../../store/playlist";
import AssetTile from "./AssetTile";
import './Tile.css';

const Dropdown = ({ playlist }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

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

  const addPlaylistToQueue = async (playlist) => {
    await dispatch(getPlaylist(playlist?.id));
    await dispatch(queuePlaylist(playlist));
  };

  const dropdownItems = [
    {
      onClick: () => addPlaylistToQueue(playlist),
      leftIcon: <CgPlayList className="cg-icon" />,
      label: "Add to Queue",
    },
  ];

  return (
    <div className="overlay-actions">
      <div className="dropdown-hamburger" onClick={openMenu}>
        <ImMenu3 className="hamburger-icon cursor-pointer" />
      </div>
      <div className="dropdown-container">
        {showMenu && (
          <ul className="dropdown-list full-box flex-column">
            {dropdownItems.map((item, idx) => (
              <li
                key={idx}
                className="full-box flex-row cursor-pointer"
                onClick={item.onClick}
              >
                {item.leftIcon}{item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
};

const PlaylistTile = ({ playlist }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);

  const handlePlayPause = async (e) => {
    if (playlist?.id === player?.currPlaylistId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(getPlaylist(playlist?.id));
      await dispatch(loadPlaylist(playlist));
    }
  };

  const handlePlaylistLikeToggle = async (e) => {
    e.stopPropagation();
    
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const coverStyle = {
    backgroundImage: `url(${playlist?.image_url || playlist?.alt_image_url})`,
    backgroundSize: "cover",
  }

  return (
    <AssetTile
      entity="playlist"
      asset={playlist}
      isLoggedIn={sessionUser !== null}
      handlePlayPause={handlePlayPause}
      canPause={playlist?.id === player?.currPlaylistId && isPlaying}
      handleLikeToggle={handlePlaylistLikeToggle}
      coverStyle={coverStyle}
      dropdown={<Dropdown playlist={playlist} />}
      canLike={sessionUser?.id !== playlist?.user?.id}
      liked={sessionUser?.id in playlist?.likes}
    />
  );
};

export default PlaylistTile;
