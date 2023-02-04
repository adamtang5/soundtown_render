import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { loadPlaylist } from "../../../store/player";
import { editPlaylist } from "../../../store/playlist";
import AssetHeader from "../../Banners/AssetHeader";
import PlaylistButtonGroup from "./PlaylistButtonGroup";
import Avatar from "../../Icons/Avatar";
import SingleSongRow from "./SingleSongRow";
import PlaylistSideBar from "./PlaylistSideBar";
import "./PlaylistSongs.css";
import './Playlist.css';

const PlaylistsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[+id]);
  const stateSongs = useSelector(state => state.songs);
  const songs = playlist?.songs?.map(id => stateSongs[+id]);
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
          <section className="playlist-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={playlist?.user} isLink={true} />
                <footer>
                  <Link to={`/users/${playlist?.user_id}`}>
                    {playlist?.user?.display_name}
                  </Link>
                </footer>
              </article>
            </aside>
            <section className="playlist-songs-list">
              <ul>
                {songs?.map((song, idx) => (
                  <li key={idx} className="flex-row">
                    <SingleSongRow song={song} idx={idx} />
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </main>
        <aside>
          <PlaylistSideBar />
        </aside>
      </div>
    </>
  );
};

export default PlaylistsPage;
