import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { loadPlaylist, queuePlaylist } from "../store/player";
import { editPlaylist, likePlaylist, unlikePlaylist, deletePlaylist } from "../store/playlist";
import AssetHeader from "../components/AssetHeader";
import Avatar from "../components/Icons/Avatar";
import SingleSongRow from "../components/PlaylistFolders/SinglePlaylist/SingleSongRow";
import SidebarCollection from "../components/SidebarModules/SidebarCollection";
import AssetCard from "../components/Modules/AssetCard";
import ToggleButton from "../components/Buttons/ToggleButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import EditButton from "../components/Buttons/EditButton";
import EditPlaylistModal from "../components/PlaylistFolders/EditPlaylistModal";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";
import "../components/PlaylistFolders/SinglePlaylist/Songs.css";
import "../components/SidebarModules/Sidebar.css";

const ButtonGroup = ({ playlist }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const songsArr = [];
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

  const handleLike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("playlist_id", playlist.id);
    dispatch(likePlaylist(formData));
  };

  const handleUnlike = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("playlist_id", playlist.id);
    dispatch(unlikePlaylist(formData));
  };

  const addPlaylistToQueue = (playlist) => {
    if (!playingId) {
      dispatch(loadPlaylist(playlist));
    } else {
      dispatch(queuePlaylist(playlist));
    }
  };

  const removePlaylist = async (e) => {
    e.preventDefault();

    const res = await dispatch(deletePlaylist(playlist?.id));
    if (res) {
      history.push("/library/playlists");
    }
  };

  return (
    <div className="asset-button-group flex-row">
      <ToggleButton
        condition={playlist?.likes.includes(sessionUser.id)}
        buttonClasses={[...baseClasses, 'b2']}
        labelClasses={['heart-label']}
        handleOff={handleUnlike}
        onLabel="Liked"
        handleOn={handleLike}
        offLabel="Like"
      />

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label="Copy Link"
      />

      {sessionUser?.id === playlist?.user_id && (
        <EditButton
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={
            <EditPlaylistModal
              setShowModal={setShowEditModal}
              songArr={songsArr}
            />
          }
        />
      )}

      <button
        className={[...baseClasses, ...styleClasses].join(' ')}
        onClick={() => addPlaylistToQueue(playlist)}
      >
        <div
          className="logo-before enqueue-label"
        >Add to Queue</div>
      </button>

      {sessionUser?.id === playlist?.user_id && (
        <>
          <button
            className={[...baseClasses, ...styleClasses].join(' ')}
            onClick={() => setShowConfirmModal(true)}
          >
            <div
              className="logo-before trash-label"
            >Delete Playlist</div>
          </button>
          <ConfirmDeleteModal
            showModal={showConfirmModal}
            setShowModal={setShowConfirmModal}
            handleDelete={removePlaylist}
            entity="playlist"
          />
        </>
      )}
    </div>
  );
};

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
          <ButtonGroup playlist={playlist} />
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
