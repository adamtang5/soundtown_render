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
      <div className="page-container single-song-secondary flex-row">
        <main className="single-song-main">
          <SongComments song={song} />
        </main>
        <aside>Sidebar goes here</aside>
      </div>
    </>
  );
};

export default SingleSong;
