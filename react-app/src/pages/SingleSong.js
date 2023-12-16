import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editSong, deleteSong, likeSong, unlikeSong } from "../store/song";
import { loadSong, queueSong } from "../store/player";
import { createComment } from "../store/comment";
import { Modal } from "../components/Context/Modal";
import AssetHeader from "../components/AssetHeader";
import NewCommentForm from "../components/Comments/NewCommentForm";
import Avatar from "../components/Icons/Avatar";
import SongComments from "../components/Comments/SongComments";
import AddSongToPlaylist from "../modals/AddSongToPlaylist";
import ToggleButton from "../components/Buttons/ToggleButton";
import CopyLinkButton from "../components/Buttons/CopyLinkButton";
import EditButton from "../components/Buttons/EditButton";
import DropdownButton from "../components/Buttons/DropdownButton";
import EditSongForm from "../modals/EditSongForm";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";

const ButtonGroup = ({ song }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const playingId = useSelector(state => state.player.playingId);
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

  const handleLike = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(likeSong(formData));
  };

  const handleUnlike = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("song_id", song.id);
    dispatch(unlikeSong(formData));
  };

  const addSongToQueue = (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const res = dispatch(deleteSong(song?.id));
    if (res) {
      setShowConfirmModal(false);
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
      <ToggleButton
        condition={song?.likes.includes(sessionUser.id)}
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

const SingleSong = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[+id]);
  const sessionUser = useSelector(state => state.session.user);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadSong(song?.id));
  };

  const updateImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image_url', file);
      await dispatch(editSong(song?.id, formData));
    }
  };

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();

    const comment = {
      user_id: sessionUser.id,
      song_id: song.id,
      content,
    };
    const data = dispatch(createComment(comment));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setContent("");
    }
  };

  return (
    <>
      <AssetHeader
        entity="song"
        asset={song}
        h3={song?.description}
        handlePlayButtonClick={handlePlayButtonClick}
        updateImage={updateImage}
        isAuthorized={sessionUser.id === song?.user_id}
      />
      <div className="container asset-secondary flex-row">
        <main className="asset-main">
          <NewCommentForm
            handleNewCommentSubmit={handleNewCommentSubmit}
            content={content}
            setContent={setContent}
            errors={errors}
          />
          <ButtonGroup song={song} />
          <section className="comment-two-columns flex-row">
            <aside>
              <article className="user-badge flex-column">
                <Avatar user={song?.user} isLink={true} />
                <footer>
                  <Link to={`/users/${song?.user_id}`}>
                    {song?.user?.display_name}
                  </Link>
                </footer>
              </article>
            </aside>
            <SongComments song={song} />
          </section>
        </main>
        <aside>{/* TODO: Sidebar goes here */}</aside>
      </div>
    </>
  );
};

export default SingleSong;
