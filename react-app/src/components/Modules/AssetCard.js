import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleButton from "../Buttons/SimpleButton";
import { useDispatch, useSelector } from "react-redux";
import { getSongOnly, toggleSongLike } from "../../store/song";
import { getPlaylist, togglePlaylistLike } from "../../store/playlist";
import { loadSong, queuePlaylist, queueSong } from "../../store/player";
import CopyLinkButton from "../Buttons/CopyLinkButton";
import ToggleButton from "../Buttons/ToggleButton";
import DropdownButton from "../Buttons/DropdownButton";
import { hideAllDropdowns } from "../../store/dropdown";

const AssetCard = ({
  entity,
  asset,
  assetCover,
  assetFooter,
  user,
  buttonGroupData = [],
  overlay = false,
  handlePlayPause,
  playPauseClasses,
  playPauseIcon,
}) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);
  const showing = useSelector(state => state.dropdown.showing);
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

  const handleLikeToggle = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    if (entity === "song") {
      await dispatch(toggleSongLike(asset?.id, formData));
    } else if (entity === "playlist") {
      await dispatch(togglePlaylistLike(asset?.id, formData));
    }
  };

  const addToQueue = async () => {
    if (entity === "song") {
      if (!player?.currSongId) {
        await dispatch(loadSong(asset?.id));
      } else {
        await dispatch(queueSong(asset?.id));
      }
    } else if (entity === "playlist") {
      await dispatch(getPlaylist(asset?.id));
      for (const id of asset?.songs_order) {
        await dispatch(getSongOnly(id));
      }
      await dispatch(queuePlaylist(asset));
    }
  };

  const handleMouseLeave = async (e) => {
    setShowDropdown(false);
    if (showing) {
      await dispatch(hideAllDropdowns());
    }
  }

  const dropdownItems = [
    {
      label: <CopyLinkButton
        label="Copy Link"
        link={`${window.location.origin}/${entity}s/${asset?.id}`}
        isOfDropdown={true}
      />,
    },
    {
      onClick: addToQueue,
      label: <div className="logo-before flex-row enqueue-label">
        Add to queue
      </div>,
    },
  ];

  return overlay ? (
    <li
      className="flex-row full-width"
      onMouseLeave={handleMouseLeave}
    >
      <div className="asset-li-overlay full-box cursor-pointer">
        <div className="asset-li-content full-box flex-row">
          <div className="asset-li-left">
            {assetCover}
          </div>
          <div className="asset-li-right full-width flex-row">
            <div className="asset-li-details full-box flex-column">
              <Link to={`/users/${user?.id}`}>
                <h3>{user?.display_name}</h3>
              </Link>
              <Link to={`/${entity}s/${asset?.id}`}>
                {asset?.title}
              </Link>
              {assetFooter}
            </div>
            <ul className="asset-li-actions flex-row">
              {buttonGroupData.map((data, idx) => (
                <li key={idx}>
                  <SimpleButton
                    label={data.label}
                    onClick={data.onClick}
                    classes={['single-line', 'button-action']}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={handlePlayPause}
          className={playPauseClasses}
        >
          {playPauseIcon}
        </button>
        <div className="mini-asset-button-group flex-row">
          {sessionUser?.id !== asset?.user?.id && (
            <ToggleButton
              condition={sessionUser?.id in asset?.likes}
              buttonClasses={[...baseClasses, "b3"]}
              labelClasses={['heart-label']}
              handleToggle={handleLikeToggle}
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
            dropdownUlClasses={["menu", "button-group-menu", "flex-column"]}
            dropdownItems={dropdownItems}
          />
        </div>
      </div>
    </li>
  ) : (
    <li className="flex-row full-width">
      <div className="asset-li-left">
        {assetCover}
      </div>
      <div className="asset-li-right full-width flex-row">
        <div className="asset-li-details full-box flex-column">
          <Link to={`/users/${user?.id}`}>
            <h3>{user?.display_name}</h3>
          </Link>
          <Link to={`/${entity}s/${asset?.id}`}>
            {asset?.title}
          </Link>
          {assetFooter}
        </div>
        <ul className="asset-li-actions flex-row">
          {buttonGroupData.map((data, idx) => (
            <li key={idx}>
              <SimpleButton
                label={data.label}
                onClick={data.onClick}
                classes={['single-line', 'button-action']}
              />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default AssetCard;
