import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SongTileActions from "./SongTileActions";
import { getAllUsers } from "../../store/user";
import { loadSong } from "../../store/player";
import { likeSong, unlikeSong } from "../../store/song";
import "./Tile.css";

const SongTile = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const handlePlay = (e) => {
    dispatch(loadSong(song.id));
  };

  const handleLike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);

    dispatch(likeSong(formData));
    dispatch(getAllUsers());
  };

  const handleUnLike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);

    dispatch(unlikeSong(formData));
    dispatch(getAllUsers());
  };

  const coverStyle = {
    backgroundImage: `url(${song.image_url})`,
    backgroundSize: "cover",
  };

  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={song.title}
      >
        <div className="overlay-group flex-row">
          <SongTileActions song={song} />
          <div onClick={handlePlay} className="overlay-play">&#9654;</div>
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
      <footer className="tile-info">
        <NavLink to={`/songs/${song.id}`}>
          <h3>{song.title}</h3>
        </NavLink>
        <span>{song.description}</span>
      </footer>
    </article>
  );
};

export default SongTile;
