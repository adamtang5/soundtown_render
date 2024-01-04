import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { loadPlaylist } from "../../store/player";
import { getPlaylist, togglePlaylistLike } from "../../store/playlist";
import { AudioContext } from "../../context/AudioContext";
import './Tile.css';

const PlaylistTile = ({ playlist }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);
  const firstSong = useSelector(state => state.songs[playlist?.songs_order[0]]);

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
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const coverStyle = {
    backgroundImage: `url(${playlist?.image_url || firstSong?.image_url})`,
    backgroundSize: "cover",
  }

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={playlist?.title}
      >
        <div className="overlay-group">
          <div className="overlay-layer full-box">
            <button
              onClick={handlePlayPause}
              className="overlay-play"
            >
              {playlist?.id === player?.currPlaylistId && isPlaying ? (
                <FaCirclePause />
              ) : (
                <FaCirclePlay />
              )}
            </button>
          </div>
          {sessionUser?.id !== playlist?.user_id && (
            <div className="overlay-like">
              <button
                onClick={handlePlaylistLikeToggle}
                className={playlist?.likes?.includes(sessionUser?.id) ? "liked" : "not-liked"}
              >
                <FaHeart />
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="tile-info">
        <NavLink to={`/playlists/${playlist?.id}`}>
          <h3>{playlist.title}</h3>
        </NavLink>
        <span>{playlist.description}</span>
      </footer>
    </article>
  );
};

export default PlaylistTile;
