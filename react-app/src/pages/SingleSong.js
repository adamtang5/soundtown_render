import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../store/session";
import { editSong, deleteSong, toggleSongLike, getSong } from "../store/song";
import { loadSong, queueSong } from "../store/player";
import { createComment } from "../store/comment";
import { Modal } from "../components/Context/Modal";
import { AudioContext } from "../context/AudioContext";
import AssetHeader from "../components/AssetHeader";
import Avatar from "../components/Icons/Avatar";
import AddSongToPlaylist from "../modals/AddSongToPlaylist";
import ToggleButton from "../components/Buttons/ToggleButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import EditButton from "../components/Buttons/EditButton";
import DropdownButton from "../components/Buttons/DropdownButton";
import EditSongForm from "../modals/EditSongForm";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";
import SpeechBubble from "../components/Icons/SpeechBubble";
import CommentList from "../components/Comments/CommentList";
import SidebarCollection from "../components/SidebarModules/SidebarCollection";
import Credits from "../components/SidebarModules/Credits";
import { sortKeyByLikesThenTitle } from "../util";
import SidebarPlaylistsCollection from "../components/SidebarModules/SidebarPlaylistsCollection";
import { getPlaylist } from "../store/playlist";
import { FaHeart, FaPlay } from "react-icons/fa6";

const NewCommentForm = ({
  handleNewCommentSubmit,
  message,
  setMessage,
  errors,
}) => {
  return (
    <>
      <div className="new-comment-wrapper flex-row">
        <div className="new-comment-placeholder" />
        <form
          className="new-comment-form full-width flex-row"
          onSubmit={handleNewCommentSubmit}
        >
          <input
            type="text"
            onChange={e => setMessage(e.target.value)}
            value={message}
            placeholder="Write a comment"
            name="comment-input"
            id="comment-input"
            className="comment-input full-box"
            autoComplete="off"
          />
        </form>
      </div>
      <div className="form-errors">
        {errors.map((error, idx) => (
          <div key={idx}>{error}</div>
        ))}
      </div>
    </>
  );
};

const ButtonGroup = ({ song }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const player = useSelector(state => state.player);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showEditSongModal, setShowEditSongModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

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

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await dispatch(deleteSong(song?.id));
    if (res) {
      setShowConfirmModal(false);
      await dispatch(authenticate());
      history.push("/");
    }
  };

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: "Add to queue",
    },
    {
      onClick: () => setShowPlaylistModal(true),
      label: "Add to playlist",
    },
    {
      cond: sessionUser?.id === song?.user?.id,
      onClick: () => setShowConfirmModal(true),
      label: "Delete song",
    },
  ];

  return (
    <div className="asset-button-group flex-row">
      {sessionUser?.id !== song?.user?.id && (
        <ToggleButton
          condition={sessionUser?.id in song?.likes}
          buttonClasses={[...baseClasses, 'b2']}
          labelClasses={['heart-label']}
          handleToggle={handleSongLikeToggle}
          onLabel="Liked"
          offLabel="Like"
        />
      )}

      <CopyLinkButton
        buttonClasses={[...baseClasses, ...styleClasses]}
        label="Copy Link"
      />

      {sessionUser?.id === song?.user?.id && (
        <EditButton
          showModal={showEditSongModal}
          setShowModal={setShowEditSongModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={<EditSongForm setShowEditSongModal={setShowEditSongModal} />}
        />
      )}

      <DropdownButton
        toggleLabel="More"
        toggleClasses={styleClasses}
        beforeLabel="ellipses-label"
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        dropdownUlClasses={['menu', 'button-group-menu']}
        dropdownItems={dropdownItems}
      />
      {showPlaylistModal && (
        <Modal
          onClose={() => setShowPlaylistModal(false)}
          position="top"
          paddingTop={50}
        >
          <AddSongToPlaylist
            song={song}
            setShowModal={setShowPlaylistModal}
          />
        </Modal>
      )}
      <ConfirmDeleteModal
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        handleDelete={handleDelete}
        entity="song"
      />
    </div>
  );
};

const SongMeta = ({ items }) => {
  return (
    <div className="song-meta flex-row">
      {items.map((item, idx) => (
        <div key={idx} className="song-meta-tag flex-row">
          {item.icon}
          {item.text}
        </div>
      ))}
    </div>
  );
};

const SongComments = ({ song, loaded }) => {
  const commentsByParentId = useSelector(state => state.comments);
  const rootComments = commentsByParentId[null];

  if (!loaded) return null;
  
  return rootComments && rootComments?.length > 0 ? (
    <section className="song-comments-list full-width flex-column">
      <header className="comments-count flex-row">
        <SpeechBubble classes={['comment-icon', 'small-icon']} />
        <span className="comments-count-text">
          {song?.comments?.length} comment
          {song?.comments?.length > 1 ? "s" : ""}
        </span>
      </header>
      <ul>
        <CommentList comments={rootComments} />
      </ul>
    </section>
  ) : (
    <article className="no-comments full-width flex-column">
      <div className="big-icon">
        <SpeechBubble classes={['comment-icon', 'big-icon']} />
      </div>
      <h3>Seems a little quiet here</h3>
      <h4>Be the first to comment on this track</h4>
    </article>
  );
};

const SongPlaylists = ({ song }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const songPlaylists = useSelector(state => song?.playlists?.map(pl => {
    return state.playlists[pl?.id];
  }))?.toSorted(sortKeyByLikesThenTitle);
  
  useEffect(() => {
    (async () => {
      if (song) {
        for (const pl of song?.playlists) {
          await dispatch(getPlaylist(pl?.id));
        }
        setLoaded(true);
      }
    })();
  }, [dispatch]);

  if (!loaded) return null;

  return (
    <SidebarPlaylistsCollection
      collectionLink={`/songs/${song?.id}/playlists`}
      styleClasses={['stack-label']}
      h3="In playlists"
      playlists={songPlaylists}
    />
  );
};

const SingleSong = () => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const { id } = useParams();
  const player = useSelector(state => state.player);
  const song = useSelector(state => state.songs[id]);
  const songLikes = song?.likes ? Object.values(song?.likes) : [];
  const sessionUser = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
      setLoaded(true);
    })();
  }, [dispatch, id]);
  
  const handlePlayPause = async (e) => {
    if (song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadSong(song?.id));
    }
  };
  
  const updateImage = async (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const formData = new FormData();
      formData.append('id', song?.id);
      formData.append('title', song?.title);
      formData.append('description', song?.description);
      formData.append('image_url', file);
      formData.append('audio_url', song?.audio_url);
      await dispatch(editSong(song?.id, formData));
    }
  };
  
  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    formData.append("song_id", id);
    formData.append("message", message);
    
    const data = await dispatch(createComment(formData));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setMessage("");
    }
  };
  
  document.title = `Sound Town | ${song?.title}`;
  
  if (!loaded) {
    return null;
  }
  
  const songMetaItems = [];
  if (song?.play_count) {
    songMetaItems.push({
      icon: <FaPlay />,
      text: <span>{song?.play_count}</span>,
    });
  }

  if (Object.keys(song?.likes)?.length) {
    songMetaItems.push({
      icon: <FaHeart />,
      text: <Link to={`/songs/${song?.id}/likes`}>
        {Object.keys(song?.likes)?.length}
      </Link>,
    });
  }

  return (
    <>
      <AssetHeader
        entity="song"
        asset={song}
        h3={song?.description}
        handlePlayPause={handlePlayPause}
        condition={isPlaying && song?.id === player?.currSongId}
        updateImage={updateImage}
        isAuthorized={sessionUser.id === song?.user?.id}
      />
      <div className="container asset-secondary two-columns">
        <main className="asset-main">
          <NewCommentForm
            handleNewCommentSubmit={handleNewCommentSubmit}
            message={message}
            setMessage={setMessage}
            errors={errors}
          />
          <div className="song-info full-width flex-row">
            <ButtonGroup song={song} />
            <SongMeta items={songMetaItems} />
          </div>
          <section className="comment-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={song?.user} isLink />
                <footer>
                  <Link to={`/users/${song?.user?.id}`}>
                    {song?.user?.display_name}
                  </Link>
                </footer>
              </article>
            </aside>
            <SongComments song={song} loaded={loaded} />
          </section>
        </main>
        <aside className="asset-sidebar">
          {song?.playlists?.length > 0 && (
            <SongPlaylists song={song} />
          )}
          {songLikes?.length > 0 && (
            <SidebarCollection
              collectionLink={`/songs/${song?.id}/likes`}
              styleClasses={['heart-label']}
              h3={`${songLikes?.length} like${songLikes?.length > 1 ? "s" : ""}`}
              collection={
                <ul className="sidebar-list flex-row">
                  {songLikes?.slice(0, 9)?.map(user => (
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

export default SingleSong;
