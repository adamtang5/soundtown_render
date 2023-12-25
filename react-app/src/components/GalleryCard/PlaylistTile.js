import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { loadPlaylist } from "../../store/player";
import { getPlaylist, togglePlaylistLike } from "../../store/playlist";
import './Tile.css';

const PlaylistTile = ({ playlist }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const firstSong = useSelector(state => state.songs[playlist?.songs_order[0]]);

  const handlePlay = async (e) => {
    e.stopPropagation();

    await dispatch(getPlaylist(playlist?.id));
    await dispatch(loadPlaylist(playlist));
  };

  const handlePlaylistLikeToggle = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const coverStyle = {
    backgroundImage: `url(${playlist.image_url || firstSong.image_url})`,
    backgroundSize: "cover",
  }

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={playlist?.title}
      >
        <div className="overlay-group flex-row">
          <div
            onClick={handlePlay}
            className="overlay-play"
          >&#9654;</div>
          <div className="overlay-like">
            <div
              onClick={handlePlaylistLikeToggle}
              className={playlist?.likes?.includes(sessionUser?.id) ? "liked" : "not-liked"}
            >&#10084;</div>
          </div>
        </div>
      </div>
      <footer className="tile-info">
        <NavLink to={`/playlists/${playlist.id}`}>
          <h3>{playlist.title}</h3>
        </NavLink>
        <span>{playlist.description}</span>
      </footer>
    </article>
  );
};

export default PlaylistTile;
