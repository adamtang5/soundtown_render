import Moment from "react-moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../../../store/comment";
import Avatar from "../../../Icons/Avatar";
import EditCommentButton from "./EditCommentButton";
import DeleteCommentButton from "./DeleteCommentButton";
import "./SingleComment.css";

const SingleComment = ({ comment }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [showActions, setShowActions] = useState(false);
  const [showContentDisplay, setShowContentDisplay] = useState(true);
  const [showContentEdit, setShowContentEdit] = useState(false);
  const [content, setContent] = useState(comment?.content);
  const [errors, setErrors] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const commentCardMouseOver = (e) => {
    if (!showContentEdit) {
      setShowActions(true);
    }
  };

  const commentCardMouseOut = (e) => {
    if (!showContentEdit && !showDeleteConfirm) {
      setShowActions(false);
    }
  };

  const clickEdit = (e) => {
    setShowContentDisplay(false);
    setShowContentEdit(true);
    setShowActions(false);
  };

  const handleEdit = async (ev) => {
    ev.preventDefault();
    const newComment = {
      id: comment.id,
      user_id: sessionUser.id,
      content,
    };
    const data = dispatch(editComment(newComment));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setShowContentEdit(false);
      setShowContentDisplay(true);
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      setShowContentDisplay(true);
      setShowContentEdit(false);
      setContent(comment?.content);
    }
  };

  const cancelDelete = (e) => {
    setShowDeleteConfirm(false);
  };

  const confirmDelete = async (ev) => {
    const data = dispatch(deleteComment(comment.id));
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
      <article className="comment-body flex-row">
        <aside className="comment-avatar">
          <Avatar user={comment.user} isLink={true} />
        </aside>
        <div className="comment-text flex-column">
          <div className="comment-info">
            {comment.user_id === sessionUser.id ? (
              <span className="commenter-name">You</span>
            ) : (
              <a className="commenter-name" href={`/users/${comment.user_id}`}>
                {comment?.user.display_name}
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
          <div className="comment-content">
            <div
              className={`content-display${showContentDisplay ? "" : " hidden"
                }`}
            >
              {comment?.content}
            </div>
            <form
              onSubmit={handleEdit}
              className={`content-edit${showContentEdit ? "" : " hidden"}`}
            >
              <input
                className="content-field"
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleEscape}
                value={content}
                title="Enter to submit; Hit Esc to cancel."
                required
              />
            </form>
            <div className="form-errors">
              {errors.map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </div>
          </div>
        </div>
      </article>
      <aside className="comment-meta flex-column">
        <Moment fromNow>{comment?.updated_at}</Moment>
        <div
          className={`comment-actions flex-row${showActions ? "" : " hidden"}`}
        >
          {comment?.user_id === sessionUser?.id && (
            <>
              <div onClick={clickEdit} className="comment-edit-button">
                <EditCommentButton />
              </div>
              <div className="comment-delete-button">
                <div
                  className="delete-confirm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <DeleteCommentButton />
                </div>
                <div className="confirm-delete">
                  {showDeleteConfirm && (
                    <div className="confirm-delete-form">
                      <p>Do you really want to remove this comment?</p>
                      <div className="confirm-delete-buttons flex-row">
                        <div
                          className="cancel-delete button"
                          onClick={cancelDelete}
                        >
                          Cancel
                        </div>
                        <div
                          className="yes-delete button"
                          onClick={confirmDelete}
                        >
                          Yes
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </li>
  );
};

export default SingleComment;
