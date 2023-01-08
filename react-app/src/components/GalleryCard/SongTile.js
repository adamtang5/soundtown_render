import React from "react";
import { NavLink } from "react-router-dom";
import { loadSong } from "../../store/player";
import { useDispatch, useSelector } from "react-redux";
import SongTileActions from "./SongTileActions";
import { getAllUsers } from "../../store/user";
import "./SongTile.css";

const SongTile = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadSong(song.id));
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(getAllUsers());
  };
  const handleUnLike = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(getAllUsers());
  };

  const coverStyle = {
    backgroundImage: `url(${song.image_url})`,
    backgroundSize: "cover",
  };

  return (
    <article className="song-tile">
      <div
        className="song-tile-cover"
        style={coverStyle}
        alt={song.title}
      >
        <div className="overlay-group flex-row">
          <SongTileActions song={song} />
          <div
            onClick={handlePlayButtonClick}
            className="overlay-play"
          >
            &#9654;
          </div>
          <div className="overlay-like">
            {song?.likes?.includes(sessionUser.id) && (
              <div
                onClick={handleUnLike}
                className="liked"
              >
                &#10084;
              </div>
            )}
            {!song.likes.includes(sessionUser.id) && (
              <div
                onClick={handleLike}
                className="not-liked"
              >
                &#10084;
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="song-tile-info">
        <NavLink to={`/songs/${song.id}`}>
          <h3>{song.title}</h3>
        </NavLink>
        <span>{song.description}</span>
      </footer>
    </article>
  );
};

export default SongTile;
