import { Link } from "react-router-dom";
import SidebarCollection from "./SidebarCollection";
import AssetCard from "../Modules/AssetCard";
import { useContext } from "react";
import { AudioContext } from "../../context/AudioContext";
import { useDispatch, useSelector } from "react-redux";
import { loadSong } from "../../store/player";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";

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
            />
          ))}
        </ul>
      }
    />
  );
};

export default SidebarSongsCollection;