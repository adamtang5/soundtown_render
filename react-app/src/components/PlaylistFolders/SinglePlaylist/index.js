import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { loadPlaylist } from "../../../store/player";
import { editPlaylist } from "../../../store/playlist";
import AssetHeader from "../../Banners/AssetHeader";
import PlaylistButtonGroup from "./PlaylistButtonGroup";
import Avatar from "../../Icons/Avatar";
import SingleSongRow from "./SingleSongRow";
import SidebarCollection from "../../SidebarModules/SidebarCollection";
import AssetCard from "../../Modules/AssetCard";
import "./PlaylistSongs.css";
import "./Playlist.css";
import "../../SidebarModules/Sidebar.css";

const SinglePlaylist = () => {
  const dispatch = useDispatch()
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[+id]);
  const stateSongs = useSelector(state => state.songs);
  const songs = playlist?.songs_order?.map(id => stateSongs[+id]);
  const sessionUser = useSelector(state => state.session.user);
  const playlistUser = useSelector(state => state.users[playlist?.user_id]);
  const userPlaylists = useSelector(state => Object.values(state.playlists)
    .filter(pl => pl.user_id === playlist?.user_id)
    .filter(pl => pl.id !== +id));

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
        h3={playlistUser?.display_name}
        placeholderImg={stateSongs[playlist?.songs_order[0]]?.image_url}
        handlePlayButtonClick={handlePlayButtonClick}
        updateImage={updateImage}
        isAuthorized={sessionUser.id === playlist?.user_id}
      />
      <div className="container asset-secondary flex-row">
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
        <aside className="asset-sidebar">
          <SidebarCollection
            collectionLink={`/users/${playlist?.user_id}/playlists`}
            styleClasses={['stack-label']}
            h3="Playlists from this user"
            collection={userPlaylists?.slice(0, 3).map(pl => (
              <AssetCard
                key={pl?.id}
                entity="playlist"
                asset={pl}
                assetCover={
                  <div className="sidebar-cover-bg">
                    <img
                      src={pl?.image_url}
                      className="sidebar-cover"
                      alt=""
                    />
                  </div>}
                assetFooter={
                  <footer className="logo-before heart-label">
                    {pl?.likes?.length}
                  </footer>}
                user={playlistUser}
              />
            ))}
          />
        </aside>
      </div>
    </>
  );
};

export default SinglePlaylist;
