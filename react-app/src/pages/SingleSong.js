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
          className="new-comment-form flex-row"
          onSubmit={handleNewCommentSubmit}
        >
          <input
            type="text"
            onChange={e => setMessage(e.target.value)}
            value={message}
            placeholder="Write a comment"
            name="comment-input"
            id="comment-input"
            className="comment-input"
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
      cond: sessionUser?.id === song?.user_id,
      onClick: () => setShowConfirmModal(true),
      label: "Delete song",
    },
  ];

  return (
    <div className="asset-button-group flex-row">
      {sessionUser?.id !== song?.user_id && (
        <ToggleButton
          condition={song?.likes?.includes(sessionUser?.id)}
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

      {sessionUser?.id === song?.user_id && (
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

const SongComments = ({ loaded }) => {
  const commentsByParentId = useSelector(state => state.comments);
  const rootComments = commentsByParentId[null];

  if (!loaded) return null;
  
  return rootComments && rootComments?.length > 0 ? (
    <section className="song-comments-list flex-column">
      <header className="comments-count flex-row">
        <SpeechBubble classes={['comment-icon', 'small-icon']} />
        <span className="comments-count-text">
          {rootComments !== null && rootComments?.length} comment
          {rootComments?.length > 1 ? "s" : ""}
        </span>
      </header>
      <ul>
        <CommentList comments={rootComments} />
      </ul>
    </section>
  ) : (
    <article className="no-comments flex-column">
      <div className="big-icon">
        <SpeechBubble classes={['comment-icon', 'big-icon']} />
      </div>
      <h3>Seems a little quiet here</h3>
      <h4>Be the first to comment on this track</h4>
    </article>
  );
};

const SingleSong = () => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const { id } = useParams();
  const player = useSelector(state => state.player);
  const song = useSelector(state => state.songs[id]);
  const sessionUser = useSelector(state => state.session.user);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
      setLoaded(true);
    })();
  }, [dispatch]);
  
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
  }

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

  return (
    <>
      <AssetHeader
        entity="song"
        asset={song}
        h3={song?.description}
        handlePlayPause={handlePlayPause}
        condition={isPlaying && song?.id === player?.currSongId}
        updateImage={updateImage}
        isAuthorized={sessionUser.id === song?.user_id}
      />
      <div className="container asset-secondary flex-row">
        <main className="asset-main">
          <NewCommentForm
            handleNewCommentSubmit={handleNewCommentSubmit}
            message={message}
            setMessage={setMessage}
            errors={errors}
          />
          <ButtonGroup song={song} />
          <section className="comment-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={song?.user} isLink />
                <footer>
                  <Link to={`/users/${song?.user_id}`}>
                    {song?.user?.display_name}
                  </Link>
                </footer>
              </article>
            </aside>
            <SongComments loaded={loaded} />
          </section>
        </main>
        <aside>{/* TODO: Sidebar goes here */}</aside>
      </div>
    </>
  );
};

export default SingleSong;
