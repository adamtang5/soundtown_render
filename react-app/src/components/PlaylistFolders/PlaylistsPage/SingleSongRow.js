import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loadSong } from "../../../store/player";
import SongRowButtonGroup from "./SongRowButtonGroup";

const SingleSongRow = ({ song, idx }) => {
  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.preventDefault();
    dispatch(loadSong(song.id));
  };

  return (
    <article
      className="song-row flex-row cursor-pointer"
      onClick={handlePlay}
    >
      <div
        className="song-row-content flex-row"
      >
        <div
          className="song-row-thumb"
          style={{ backgroundImage: `url(${song?.image_url})` }}
        />
        <div className="song-row-idx">{idx + 1}</div>
        <div className="song-row-title">
          <Link to={`/songs/${song?.id}`}>{song?.title}</Link>
        </div>
      </div>
      <div
        className="song-row-overlay flex-row"
      >
        <div className="song-row-square flex-row">
          <button
            className="song-row-play cursor-pointer"
          >&#9654;</button>
        </div>
        <SongRowButtonGroup song={song} />
      </div>
    </article>
  );
};

export default SingleSongRow;
