import React from "react";
import { NavLink } from "react-router-dom";
import { loadPlaylist } from "../../store/player";
import { useDispatch } from "react-redux";
import './Tile.css';

const PlaylistTile = ({ playlist }) => {
  const dispatch = useDispatch();
  const handlePlay = (e) => {
    dispatch(loadPlaylist(playlist));
  };

  const coverStyle = {
    backgroundImage: `url(${playlist.image_url})`,
    backgroundSize: "cover",
  }

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={playlist.title}
      >
        <div className="overlay-single flex-row">
          <div
            onClick={handlePlay}
            className="overlay-play"
          >
            &#9654;
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
