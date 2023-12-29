import Moment from "react-moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../store/comment";
import Avatar from "../Icons/Avatar";
import EditCommentButton from "./EditCommentButton";
import DeleteCommentButton from "./DeleteCommentButton";
import "./Comments.css";

const SingleComment = ({ comment }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const childComments = useSelector(state => state.comments[comment?.id]);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showContentDisplay, setShowContentDisplay] = useState(true);
  const [showContentEditForm, setShowContentEditForm] = useState(false);
  const [message, setMessage] = useState(comment?.message);
  const [errors, setErrors] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
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
    const data = dispatch(deleteComment(comment?.id));
    if (data.errors) {
      setErrors(data.errors);
    }
  };

  return (
    <li
      onMouseOver={commentCardMouseOver}
      onMouseOut={commentCardMouseOut}
      className="comment-card flex-row"
    >
      <aside className="comment-avatar">
        <Avatar user={comment?.user} isLink={true} />
      </aside>
      <article className="comment-body flex-column">
        <header
          className="flex-row"
        >
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
        <div
          className="comment-main flex-row"
        >
          <div className="comment-content">
            {isEditing ? (
              <form
                onSubmit={handleEdit}
                className="content-edit"
              >
                <input
                  className="content-field"
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
            {/* <div
              className={`content-display${showContentDisplay ? "" : " hidden"
                }`}
            >
              {comment?.message}
            </div>
            <form
              onSubmit={handleEdit}
              className={`content-edit${showContentEditForm ? "" : " hidden"}`}
            >
              <input
                className="content-field"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEscape}
                value={message}
                title="Enter to submit; Hit Esc to cancel."
                required
              />
            </form> */}
            <div className="form-errors">
              {errors.map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </div>
          </div>
          <div
            className={`comment-actions flex-row${showActions ? "" : " hidden"}`}
          >
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
      </article>
    </li>
  );
};

export default SingleComment;
