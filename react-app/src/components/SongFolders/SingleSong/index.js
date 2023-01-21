import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleSongHeader from "./SingleSongHeader";
import SongComments from "./SongComments";
import "./SingleSong.css";

const SingleSong = () => {
  const { id } = useParams();
  const song = useSelector(state => state.songs[+id]);

  return (
    <>
      <SingleSongHeader song={song} />
      <main className="page-container flex-column">
        <SongComments song={song} />
      </main>
    </>
  );
};

export default SingleSong;
