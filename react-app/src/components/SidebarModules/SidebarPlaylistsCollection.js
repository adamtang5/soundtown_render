import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AudioContext } from "../../context/AudioContext";
import SidebarCollection from "./SidebarCollection";
import { getPlaylist, togglePlaylistLike } from "../../store/playlist";
import { loadPlaylist, queuePlaylist } from "../../store/player";
import AssetCard from "../Modules/AssetCard";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import CopyLinkButton from "../Buttons/CopyLinkButton";
import ToggleButton from "../Buttons/ToggleButton";
import DropdownButton from "../Buttons/DropdownButton";

const SidebarPlaylistButtonGroup = ({ playlist }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handlePlaylistLikeToggle = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const addPlaylistToQueue = async (pl) => {
    await dispatch(getPlaylist(pl?.id));
    await dispatch(queuePlaylist(pl));
  };

  const dropdownItems = [
    {
      label: <CopyLinkButton
        label="Copy Link"
        link={`${window.location.origin}/playlists/${playlist?.id}`}
        isOfDropdown={true}
      />,
    },
    {
      onClick: () => addPlaylistToQueue(playlist?.id),
      label: <div className="logo-before flex-row enqueue-label">
        Add to queue
      </div>,
    },
  ];

  return (
    <div className="mini-asset-button-group flex-row">
      {sessionUser?.id !== playlist?.user?.id && (
        <ToggleButton
          condition={sessionUser?.id in playlist?.likes}
          buttonClasses={[...baseClasses, 'b3']}
          labelClasses={['heart-label']}
          handleToggle={handlePlaylistLikeToggle}
          onLabel=""
          offLabel=""
        />
      )}
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
  )
};

const SidebarPlaylistsCollection = ({
  collectionLink,
  styleClasses,
  h3,
  playlists,
}) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);

  const handlePlayPause = async (playlist) => {
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

  return (
    <SidebarCollection
      collectionLink={collectionLink}
      styleClasses={styleClasses}
      h3={h3}
      collection={
        <ul className="sidebar-list">
          {playlists?.slice(0, 3)?.map(pl => (
            <AssetCard
              key={pl?.id}
              entity="playlist"
              asset={pl}
              assetCover={
                <Link to={`/playlists/${pl?.id}`}>
                  <div className="sidebar-cover-bg">
                    <img
                      src={pl?.image_url || pl?.alt_image_url}
                      className="sidebar-cover"
                      alt={pl?.title}
                    />
                  </div>
                </Link>
              }
              assetFooter={
                <footer className="flex-row">
                  {Object.values(pl?.likes)?.length > 0 && (
                    <Link to={`/playlists/${pl?.id}/likes`}>
                      <div className="logo-before heart-label">
                        {Object.values(pl?.likes)?.length}
                      </div>
                    </Link>
                  )}
                </footer>
              }
              user={pl?.user}
              overlay={true}
              handlePlayPause={e => handlePlayPause(pl)}
              playPauseClasses={`asset-li-play ${pl?.id === player?.currPlaylistId && isPlaying ? "standout" : ""}`}
              playPauseIcon={pl?.id === player?.currPlaylistId && isPlaying ? (
                <FaCirclePause />
              ) : (
                <FaCirclePlay />
              )}
              hoverButtonGroup={<SidebarPlaylistButtonGroup playlist={pl} />}
            />
          ))}
        </ul>
      }
    />
  );
};

export default SidebarPlaylistsCollection;