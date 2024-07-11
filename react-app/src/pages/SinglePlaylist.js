import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { FaPlay, FaPause } from "react-icons/fa6";
import { loadPlaylist, queuePlaylist, loadSong, queueSong } from "../store/player";
import { authenticate } from "../store/session";
import { getAllSongs, toggleSongLike } from "../store/song";
import { editPlaylist, deletePlaylist, getPlaylist, togglePlaylistLike } from "../store/playlist";
import { AudioContext } from "../context/AudioContext";
import AssetHeader from "../components/AssetHeader";
import Avatar from "../components/Icons/Avatar";
import SidebarCollection from "../components/SidebarModules/SidebarCollection";
import ToggleButton from "../components/Buttons/ToggleButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import DropdownButton from "../components/Buttons/DropdownButton";
import EditButton from "../components/Buttons/EditButton";
import EditPlaylistForm from "../modals/EditPlaylistForm";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";
import Credits from "../components/SidebarModules/Credits";
import { sortKeyByLikesThenTitle } from "../util";
import SidebarPlaylistsCollection from "../components/SidebarModules/SidebarPlaylistsCollection";
import "./SinglePlaylist.css";
import "../components/SidebarModules/Sidebar.css";

const SingleSongRow = ({ song, idx }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);

  const handlePlayPause = async (e) => {
    if (playlist?.id === player?.currPlaylistId &&
      song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadPlaylist(playlist, idx));
    }
  };

  return (
    <article className="song-row full-box cursor-pointer">
      <div className="song-row-overlay full-box">
        <div className="song-row-content full-box flex-row">
          <div className="song-row-content-left flex-row">
            <div
              className="song-row-thumb"
              style={{ backgroundImage: `url(${song?.image_url})` }}
            />
            <div className="song-row-idx">{idx + 1}</div>
            <div className="song-row-title">
              <Link to={`/songs/${song?.id}`}>{song?.title}</Link>
            </div>
          </div>
          <div className="song-row-content-right">
            <div className="song-meta flex-row">
              <div className="song-meta-tag flex-row">
                <FaPlay />
                <span>{song?.play_count}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handlePlayPause}
          className={`song-row-play ${playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId && 
            isPlaying ? "standout" : ""}`}
        >
          {playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId && isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}
        </button>
        <SongRowButtonGroup song={song} />
      </div>
    </article>
  );
};

const SongRowButtonGroup = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);
  const [showDropdown, setShowDropdown] = useState(false);
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
    if (!player?.currSongId) {
      await dispatch(loadSong(id));
    } else {
      await dispatch(queueSong(id));
    }
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: <div
        className="logo-before flex-row enqueue-label"
      >Add to queue</div>,
    },
  ];

  return (
    <div className="mini-asset-button-group flex-row">
      {sessionUser?.id !== song?.user?.id && (
        <ToggleButton
          condition={sessionUser?.id in song?.likes}
          buttonClasses={[...baseClasses, 'b3']}
          labelClasses={['heart-label']}
          handleToggle={handleSongLikeToggle}
          onLabel=""
          offLabel=""
        />
      )}

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

  const handlePlaylistLikeToggle = async (e) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(togglePlaylistLike(playlist?.id, formData));
  };

  const addPlaylistToQueue = async (playlist) => {
    await dispatch(getPlaylist(playlist?.id));
    await dispatch(queuePlaylist(playlist));
  };

  const removePlaylist = async (e) => {
    e.preventDefault();

    const res = await dispatch(deletePlaylist(playlist?.id));
    if (res) {
      setShowConfirmModal(false);
      await dispatch(authenticate());
      history.push("/");
    }
  };

  return (
    <div className="asset-button-group flex-row">
      {sessionUser?.id !== playlist?.user?.id && (
        <ToggleButton
          condition={sessionUser?.id in playlist?.likes}
          buttonClasses={[...baseClasses, 'b2']}
          labelClasses={['heart-label']}
          handleToggle={handlePlaylistLikeToggle}
          onLabel="Liked"
          offLabel="Like"
        />
      )}

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label="Copy Link"
      />

      {sessionUser?.id === playlist?.user?.id && (
        <EditButton
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={<EditPlaylistForm setShowModal={setShowEditModal} />}
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

      {sessionUser?.id === playlist?.user?.id && (
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

const UserOtherPlaylists = ({ playlist }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const userOtherPlaylists = useSelector(state => playlist?.siblings?.map(pl => {
    return state.playlists[pl?.id];
  }))?.toSorted(sortKeyByLikesThenTitle);

  useEffect(() => {
    (async () => {
      if (playlist) {
        for (const pl of playlist?.siblings) {
          await dispatch(getPlaylist(pl?.id));
        }
        setLoaded(true);
      }
    })();
  }, [dispatch]);

  if (!loaded) return null;

  return (
    <SidebarPlaylistsCollection
      collectionLink={`/users/${playlist?.user?.id}/playlists`}
      styleClasses={['stack-label']}
      h3="Playlists from this user"
      playlists={userOtherPlaylists}
    />
  );
};

const SinglePlaylist = () => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const { id } = useParams();
  const player = useSelector(state => state.player);
  const playlist = useSelector(state => state.playlists[id]);
  const plLikes = playlist?.likes ? Object.values(playlist?.likes) : [];
  const songs = useSelector(state => playlist?.songs_order?.map(id => state.songs[id]));
  const sessionUser = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(getAllSongs());
      await dispatch(getPlaylist(id));
      setLoaded(true);
    })();
  }, [dispatch, id]);

  const handlePlayPause = async (e) => {
    if (playlist?.id === player?.currPlaylistId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadPlaylist(playlist));
    }
  };

  const updateImage = async (e) => {
    const file = e.target.file[0];

    if (file) {
      const formData = new FormData();
      formData.append('image_url', file);
      await dispatch(editPlaylist(playlist?.id, formData));
    }
  };

  document.title = `Listen to ${playlist?.title} playlist online for free on Sound Town`

  if (!loaded) return null;

  return (
    <>
      <AssetHeader
        entity="playlist"
        asset={playlist}
        h3={playlist?.description}
        placeholderImg={playlist?.alt_image_url}
        handlePlayPause={handlePlayPause}
        condition={isPlaying && playlist?.id === player?.currPlaylistId}
        updateImage={updateImage}
        isAuthorized={sessionUser?.id === playlist?.user?.id}
      />
      <div className="container asset-secondary two-columns">
        <main className="asset-main">
          <ButtonGroup playlist={playlist} />
          <section className="playlist-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={playlist?.user} isLink />
                <footer>
                  <Link to={`/users/${playlist?.user?.id}`}>
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
          {playlist?.user_id !== sessionUser?.id && playlist?.siblings?.length > 0 && (
            <UserOtherPlaylists playlist={playlist} />
          )}
          {plLikes?.length > 0 && (
            <SidebarCollection
              collectionLink={`/playlists/${playlist?.id}/likes`}
              styleClasses={['heart-label']}
              h3={`${plLikes?.length} like${plLikes?.length > 1 ? "s" : ""}`}
              collection={
                <ul className="sidebar-list flex-row">
                  {plLikes?.slice(0, 9)?.map(user => (
                    <li key={user?.id}>
                      <Avatar user={user} isLink />
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          <Credits />
        </aside>
      </div>
    </>
  );
};

export default SinglePlaylist;
