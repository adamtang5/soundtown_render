import { Link } from "react-router-dom";
import SidebarCollection from "./SidebarCollection";
import AssetCard from "../Modules/AssetCard";
import { useContext, useEffect, useState } from "react";
import { AudioContext } from "../../context/AudioContext";
import { useDispatch, useSelector } from "react-redux";
import { loadSong, queueSong } from "../../store/player";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { toggleSongLike } from "../../store/song";
import ToggleButton from "../Buttons/ToggleButton";
import CopyLinkButton from "../Buttons/CopyLinkButton";
import DropdownButton from "../Buttons/DropdownButton";

const SidebarSongButtonGroup = ({ song }) => {
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

  const handleSongLikeToggle = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(toggleSongLike(song?.id, formData));
  };

  const addSongToQueue = async (id) => {
    if (!player?.currSongId) {
      await dispatch(loadSong(id));
    } else {
      await dispatch(queueSong(id));
    }
  };

  const dropdownItems = [
    {
      label: <CopyLinkButton
        label="Copy Link"
        link={`${window.location.origin}/songs/${song?.id}`}
        isOfDropdown={true}
      />,
    },
    {
      onClick: () => addSongToQueue(song.id),
      label: <div className="logo-before flex-row enqueue-label">
        Add to queue
      </div>,
    },
  ];

  return (
    <div className="mini-asset-button-group flex-row">
      {sessionUser?.id !== song?.user?.id && (
        <ToggleButton
          condition={sessionUser?.id in song?.likes}
          buttonClasses={[...baseClasses, 'b3']}
          labelClasses={['heart-label']}
          handleToggle={handleSongLikeToggle}
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
  );
};

const SidebarSongsCollection = ({
  collectionLink,
  styleClasses,
  h3,
  songs,
}) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);

  const handlePlayPause = async (song) => {
    if (song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadSong(song?.id));
    }
  };

  return (
    <SidebarCollection
      collectionLink={collectionLink}
      styleClasses={styleClasses}
      h3={h3}
      collection={
        <ul className="sidebar-list">
          {songs?.slice(0, 3)?.map(song => (
            <AssetCard
              key={song?.id}
              entity="song"
              asset={song}
              assetCover={
                <Link to={`/songs/${song?.id}`}>
                  <div className="sidebar-cover-bg">
                    <img
                      src={song?.image_url}
                      className="sidebar-cover"
                      alt={song?.title}
                    />
                  </div>
                </Link>
              }
              assetFooter={
                <footer className="flex-row">
                  {Object.values(song?.likes)?.length > 0 && (
                    <Link to={`/songs/${song?.id}/likes`}>
                      <div className="logo-before heart-label">
                        {Object.values(song?.likes)?.length}
                      </div>
                    </Link>
                  )}
                  {song?.comments_count > 0 && (
                    <Link to={`/songs/${song?.id}`}>
                      <div className="logo-before speech-bubble-label">
                        {song?.comments_count}
                      </div>
                    </Link>
                  )}
                </footer>
              }
              user={song?.user}
              overlay={true}
              handlePlayPause={e => handlePlayPause(song)}
              playPauseClasses={`asset-li-play ${isPlaying && song?.id === player?.currSongId ? "standout" : ""}`}
              playPauseIcon={isPlaying && song?.id === player?.currSongId ? (
                <FaCirclePause />
              ) : (
                <FaCirclePlay />
              )}
              hoverButtonGroup={<SidebarSongButtonGroup song={song} />}
            />
          ))}
        </ul>
      }
    />
  );
};

export default SidebarSongsCollection;