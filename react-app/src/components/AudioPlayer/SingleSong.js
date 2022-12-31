import React from "react";
import { useSelector } from "react-redux";

const SingleSong = ({ songId, view }) => {
  const song = useSelector((state) => state.songs[songId]);

  return (
    <div className={`flex-row queue_single_song_details ${view}`}>
      <img src={song?.image_url} alt={song?.title} />
      <p>{song?.title}</p>
    </div>
  );
};

export default SingleSong;
