import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../../store/comment";
import { likeSong, unlikeSong } from "../../../store/song";
import { loadSong, queueSong } from "../../../store/player";
import Avatar from "../../Icons/Avatar";
import SpeechBubble from "../../Icons/SpeechBubble";
import SingleComment from "./Comments/SingleComment";
import EditSongForm from "../EditSongForm";

import { Modal } from "../../Context/Modal";
import AddToPlaylist from "../../PlaylistFolders/AddToPlaylist";
import NewCommentForm from "./Comments/NewCommentForm";
import LikeButton from "../../Buttons/LikeButton";
import CopyLinkButton from "../../Buttons/CopyLinkButton";
import EditButton from "../../Buttons/EditButton";
import DropdownButton from "../../Buttons/DropdownButton";

const SongComments = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const songs = useSelector(state => state.songs);
  const playingId = useSelector(state => state.player.playingId);
  const [errors, setErrors] = useState([]);
  const [content, setContent] = useState("");
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [clipboardMenu, setClipboardMenu] = useState(false);
  const [showEditSongModal, setShowEditSongModal] = useState(false);

  useEffect(() => {
    if (!clipboardMenu) return;

    const closeClipboardDropdown = () => {
      if (!clipboardMenu) return;
      setClipboardMenu(false);
    };

    document.addEventListener("click", closeClipboardDropdown);

    return () => document.removeEventListener("click", closeClipboardDropdown);
  }, [clipboardMenu]);

  useEffect(() => {
    if (!showMoreDropdown) return;

    const closeEditDropdown = () => {
      if (!showMoreDropdown) return;
      setShowMoreDropdown(false);
    };

    document.addEventListener("click", closeEditDropdown);

    return () => document.removeEventListener("click", closeEditDropdown);
  }, [showMoreDropdown]);

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

  const dropdownItems = [
    {
      onClick: () => addSongToQueue(song.id),
      label: "Add to queue",
    },
    {
      onClick: () => setShowPlaylistModal(true),
      label: "Add to playlist",
    },
  ];

  const addSongToQueue = (id) => {
    if (!playingId) {
      dispatch(loadSong(id));
    } else {
      dispatch(queueSong(id));
    }
  };

  const addToClipBoard = () => {
    if (clipboardMenu) return;
    navigator.clipboard.writeText(window.location.href);
    setClipboardMenu(true);
  };

  return (
    <>
      <div className="song_mainfeed_top">
        <NewCommentForm
          handleNewCommentSubmit={handleNewCommentSubmit}
          content={content}
          setContent={setContent}
          errors={errors}
        />

        <div className="song-button-group flex-row">
          <LikeButton
            isLiked={song?.likes.includes(sessionUser.id)}
            handleUnlike={handleUnlike}
            handleLike={handleLike}
          />

          <CopyLinkButton
            handleCopy={addToClipBoard}
            showNotification={clipboardMenu}
          />

          {sessionUser?.id === song?.user_id && (
            <EditButton
              showModal={showEditSongModal}
              setShowModal={setShowEditSongModal}
              buttonClasses={['song-button', 'cursor-pointer']}
              modalForm={<EditSongForm setShowEditSongModal={setShowEditSongModal} />}
            />
          )}

          <DropdownButton
            toggleLabel="More"
            toggleClasses={['song-button', 'cursor-pointer']}
            showDropdown={showMoreDropdown}
            setShowDropdown={setShowMoreDropdown}
            dropdownUlClasses={['menu', 'button-group-menu']}
            dropdownItems={dropdownItems}
          />
          {showPlaylistModal && (
            <Modal onClose={() => setShowPlaylistModal(false)}>
              <div className="add_to_playlist_modal_container">
                <AddToPlaylist song={song} />
              </div>
            </Modal>
          )}

        </div>
      </div>
      <div className="comment-section flex-row">
        <div className="user-badge flex-column">
          <Avatar user={song?.user} />
          <p>{song?.user?.display_name}</p>
        </div>
        <div className="song-details flex-column">
          <div className="song-comments-list flex-column">
            <div className="comments-count flex-row">
              <SpeechBubble />
              <div className="comments-count-text">
                {song?.comments?.length}
                {song?.comments?.length > 1 ? " comments" : " comment"}
              </div>
            </div>
            <div className="comment-cards-list">
              {songs[song?.id]?.comments.map((comment) => (
                <div key={comment.id}>
                  <SingleComment comment={comment} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongComments;
