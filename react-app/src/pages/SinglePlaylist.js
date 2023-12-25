import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { loadPlaylist, queuePlaylist, loadSong, queueSong } from "../store/player";
import { authenticate } from "../store/session";
import { getUser } from "../store/user";
import { toggleSongLike } from "../store/song";
import { editPlaylist, deletePlaylist, getPlaylist, togglePlaylistLike } from "../store/playlist";
import AssetHeader from "../components/AssetHeader";
import Avatar from "../components/Icons/Avatar";
import SidebarCollection from "../components/SidebarModules/SidebarCollection";
import AssetCard from "../components/Modules/AssetCard";
import ToggleButton from "../components/Buttons/ToggleButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import DropdownButton from "../components/Buttons/DropdownButton";
import EditButton from "../components/Buttons/EditButton";
import EditPlaylist from "../modals/EditPlaylist";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";
import "./SinglePlaylist.css";
import "../components/SidebarModules/Sidebar.css";

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

const SongRowButtonGroup = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b3'];

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  const handleSongLikeToggle = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(toggleSongLike(song?.id, formData));
  };

  const addSongToQueue = async (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
    }
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: <div
        className="logo-before flex-row enqueue-label"
      >Add to queue</div>,
    },
    // {
    //   onClick: () => setShowPlaylistModal(true),
    //   label: <div
    //     className="logo-before flex-row enlist-label"
    //   >Add to playlist</div>,
    // },
  ];

  return (
    <div className="mini-asset-button-group flex-row">
      <ToggleButton
        condition={song?.likes?.includes(sessionUser?.id)}
        buttonClasses={[...baseClasses, 'b3']}
        labelClasses={['heart-label']}
        handleOff={handleSongLikeToggle}
        onLabel=""
        handleOn={handleSongLikeToggle}
        offLabel=""
      />

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label=""
        link={`${window.location.origin}/songs/${song?.id}`}
      />

      <DropdownButton
        toggleLabel=""
        toggleClasses={styleClasses}
        beforeLabel="ellipses-label"
        labelSize="l3"
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        dropdownUlClasses={['menu', 'button-group-menu', 'flex-column']}
        dropdownItems={dropdownItems}
      />
    </div>
  );
};

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

  const handlePlaylistLikeToggle = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const addPlaylistToQueue = (playlist) => {
    dispatch(getPlaylist(playlist?.id));
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
      setShowConfirmModal(false);
      dispatch(authenticate());
      history.push("/");
    }
  };

  return (
    <div className="asset-button-group flex-row">
      <ToggleButton
        condition={playlist?.likes?.includes(sessionUser?.id)}
        buttonClasses={[...baseClasses, 'b2']}
        labelClasses={['heart-label']}
        handleOff={handlePlaylistLikeToggle}
        onLabel="Liked"
        handleOn={handlePlaylistLikeToggle}
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
            <EditPlaylist
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
  const playlist = useSelector(state => state.playlists[id]);
  const songs = useSelector(state => playlist?.songs_order?.map(id => state.songs[id]));
  const sessionUser = useSelector(state => state.session.user);
  const userPlaylists = useSelector(state => state.users[playlist?.user_id]?.playlists
    .filter(pl => pl.id !== id));

  useEffect(() => {
    (async () => {
      await dispatch(getPlaylist(id));
    })();
  }, [dispatch]);
  
  useEffect(() => {
    (async () => {
      if (!playlist) return;
      await dispatch(getUser(playlist?.user_id));
    })();
  }, [dispatch, playlist?.user_id]);

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(getPlaylist(playlist?.id));
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
        h3={playlist?.description}
        placeholderImg={songs?.at(0)?.image_url}
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
                user={playlist?.user}
              />
            ))}
          />
        </aside>
      </div>
    </>
  );
};

export default SinglePlaylist;
