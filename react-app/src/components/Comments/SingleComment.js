import Moment from "react-moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteComment, editComment, toggleCommentLike } from "../../store/comment";
import Avatar from "../Icons/Avatar";
import EditCommentButton from "./EditCommentButton";
import DeleteCommentButton from "./DeleteCommentButton";
import ReplyCommentButton from "./ReplyCommentButton";
import ReplyCommentForm from "./ReplyCommentForm";
import CommentList from "./CommentList";
import "./Comments.css";

const SingleComment = ({ comment }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const childComments = useSelector(state => state.comments[comment?.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [message, setMessage] = useState(comment?.message);
  const [errors, setErrors] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const replyButtonClasses = [
    'cursor-pointer',
    'button-action',
    'composite-button',
    'b3',
  ];

  const editButtonClasses = [
    'cursor-pointer',
    'button-action',
    'composite-button',
    'b3',
  ];

  const deleteButtonClasses = [
    'cursor-pointer',
    'button-attention',
    'composite-button',
    'b3',
  ];

  const commentCardMouseOver = (e) => {
    if (!isEditing) {
      setShowActions(true);
    }
  };

  const commentCardMouseOut = (e) => {
    if (!isEditing && !showConfirmDelete) {
      setShowActions(false);
    }
  };

  const clickReply = () => {
    setIsReplying(true);
  };

  const clickEdit = (e) => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleEdit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("id", comment?.id);
    formData.append("message", message);
    formData.append("parent_id", null);

    const data = await dispatch(editComment(comment?.id, formData));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setIsEditing(false);
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setMessage(comment?.message);
    }
  };

  const cancelDelete = (e) => {
    setShowConfirmDelete(false);
  };

  const confirmDelete = async (ev) => {
    const data = await dispatch(deleteComment(comment?.id));
    if (data.errors) setErrors(data.errors);
  };

  const handleCommentLikeToggle = async (e) => {
    e.stopPropagation();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    await dispatch(toggleCommentLike(comment?.id, formData));
  };

  return (
    <li
      onMouseOver={commentCardMouseOver}
      onMouseOut={commentCardMouseOut}
    >
      <article className="comment-card full-width flex-row">
        <aside className="comment-avatar">
          <Avatar user={comment?.user} isLink />
        </aside>
        <div className="comment-body full-width flex-column">
          <header className="full-width flex-row">
            <div className="comment-info">
              {comment?.user?.id === sessionUser?.id ? (
                <span className="commenter-name">You</span>
              ) : (
                <a className="commenter-name" href={`/users/${comment?.user?.id}`}>
                  {comment?.user?.display_name}
                </a>
              )}
              {comment?.song_timestamp ? (
                <span>
                  at{" "}
                  <span className="comment-timestamp">
                    {comment?.song_timestamp}
                  </span>
                </span>
              ) : null}
            </div>
            <Moment fromNow>{comment?.updated_at}</Moment>
          </header>
          <div className="comment-main full-width flex-row">
            <div className="comment-content full-width">
              {isEditing ? (
                <form
                  onSubmit={handleEdit}
                  className="content-edit full-width"
                >
                  <input
                    className="content-field full-width"
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleEscape}
                    value={message}
                    title="Enter to submit; Hit Esc to cancel."
                    required
                  />
                </form>
              ) : (
                <div className="content-display">
                  {comment?.message}
                </div>
              )}
              <div className="form-errors">
                {errors.map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </div>
            </div>
            <div
              className={`comment-actions flex-row${showActions ? "" : " hidden"}`}
            >
              <ReplyCommentButton
                onClick={clickReply}
                buttonClasses={replyButtonClasses}
              />
              {comment?.user?.id === sessionUser?.id && (
                <>
                  <EditCommentButton
                    handleClick={clickEdit}
                    buttonClasses={editButtonClasses}
                  />

                  <DeleteCommentButton
                    handleClick={() => setShowConfirmDelete(true)}
                    buttonClasses={deleteButtonClasses}
                    showConfirm={showConfirmDelete}
                    cancelDelete={cancelDelete}
                    confirmDelete={confirmDelete}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="comment-like flex-column">
          <button
            onClick={handleCommentLikeToggle}
            className="cursor-pointer simple-button b2"
            aria-label={comment?.likes?.includes(sessionUser?.id) ? 'Unlike': 'Like'}
          >
            <span className={comment?.likes?.includes(sessionUser?.id) ? 'like-button-on' : ''}>
              {comment?.likes?.includes(sessionUser?.id) ? <FaHeart /> : <FaRegHeart />}
            </span>
          </button>
          <div className="like-count">{comment?.likes?.length}</div>
        </div>
      </article>
      {isReplying && (
        <ReplyCommentForm
          parent={comment}
          setIsReplying={setIsReplying}
        />
      )}
      {childComments?.length > 0 && (
        <ul className="nested-comment">
          <CommentList comments={childComments} />
        </ul>
      )}
    </li>
  );
};

export default SingleComment;
