import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadPlaylist } from "../../../store/player";
import Moment from "react-moment";
import "moment-timezone";
import PlaylistMainFeed from "./PlaylistMainFeed";
import PlaylistSideBar from "./PlaylistSideBar";
import { editPlaylist } from "../../../store/playlist";
import AssetHeader from "../../Banners/AssetHeader";
import "./PlaylistSongs.css";
import '../../LibraryPage/Playlist/Playlist.css';
import PlaylistButtonGroup from "./PlaylistButtonGroup";

const PlaylistsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[+id]);
  const sessionUser = useSelector(state => state.session.user);

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadPlaylist(playlist));
  };

  const updateImage = async (e) => {
    const file = e.target.file[0];

    if (file) {
      const formData = new FormData();
      formData.append('image_url', file);
      await dispatch(editPlaylist(playlist?.id, formData));
    }
  };

  return (
    <>
      <AssetHeader
        entity="playlist"
        asset={playlist}
        handlePlayButtonClick={handlePlayButtonClick}
        updateImage={updateImage}
        isAuthorized={sessionUser.id === playlist?.user_id}
      />
      <div className="page-container asset-secondary flex-row">
        <main className="asset-main">
          <PlaylistButtonGroup playlist={playlist} />
        </main>
      </div>


      {/* <div className="playlist_container_main">
      <div className="Pl_S_banner flex-row">
        <div className="left_box_banner flex-column">
          <div className="title_banner flex-row">
            <div className="flex-row banner_title_group_1">
              <div className="banner_play_button">
                <div className="song_page_play" onClick={handlePlayButtonClick} >&#9654;</div>
              </div>
              <div className="flex-column">
                <h3>{playlist?.title}</h3>
                <p>{playlist?.description}</p>
              </div>
            </div>
            <Moment fromNow tz="America/Los_Angeles">
              {playlist?.created_at}
            </Moment>
          </div>
          <div className="banner_circle">
            <div>{playlist?.songs?.length || 0}</div>
            <div>tracks</div>
          </div>
        </div>
        <div>
          <img alt='' src={playlist?.image_url} className="playlist_image" />
        </div>
      </div>
      <div className="flex-row playlist_mainfeed_sidebar_conatiner">
        <PlaylistMainFeed songsId={playlist?.songs} playlist={playlist} />
        <PlaylistSideBar />
      </div>
    </div> */}
    </>
  );
};

export default PlaylistsPage;
