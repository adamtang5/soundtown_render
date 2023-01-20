import Moment from "react-moment";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadSong } from "../../../store/player";
import SongComments from "./SongComments";
import "./SingleSong.css";

const SingleSong = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[+id]);

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadSong(song.id));
  };

  return (
    <main className="page-container flex-column">
      <div className="Pl_S_banner flex-row">
        <div className="left_box_banner flex-column">
          <div className="title_banner flex-row">
            <div className="flex-row banner_title_group_1">
              <div className="banner_play_button">
                <div className="song_page_play" onClick={handlePlayButtonClick} >&#9654;</div>
              </div>
              <div className="flex-column">
                <h3>{song?.title}</h3>
                <p>{song?.description}</p>
              </div>
            </div>
            <Moment fromNow>{song?.created_at}</Moment>
          </div>
        </div>
        <div>
          <img alt='' src={song?.image_url} className="song_image" />
        </div>
      </div>
      <div className="flex-row song_mainfeed_sidebar_conatiner">
        <SongComments song={song} />
      </div>
    </main>
  );
};

export default SingleSong;
