import { useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AudioContext } from "../../context/AudioContext";
import SidebarCollection from "./SidebarCollection";
import { getSongOnly } from "../../store/song";
import { getPlaylist } from "../../store/playlist";
import { loadPlaylist } from "../../store/player";
import AssetCard from "../Modules/AssetCard";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";

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
      for (const id of playlist?.songs_order) {
        await dispatch(getSongOnly(id));
      }
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
              handlePlayPause={() => handlePlayPause(pl)}
              playPauseClasses={`asset-li-play ${pl?.id === player?.currPlaylistId && isPlaying ? "standout" : ""}`}
              playPauseIcon={pl?.id === player?.currPlaylistId && isPlaying ? (
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

export default SidebarPlaylistsCollection;