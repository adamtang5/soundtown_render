import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createComment } from "../../store/comment";
import Avatar from "../Icons/Avatar";

const ReplyCommentForm = ({ parent, setIsReplying }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const handleReply = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    formData.append("song_id", id);
    formData.append("parent_id", parent?.id);
    formData.append("message", message);

    const data = await dispatch(createComment(formData));
    if (data.errors) {
      setErrors(data.errors);
    } else {
      setIsReplying(false);
    }
  }

  const handleEscape = e => {
    if (e.key === "Escape") {
      setMessage("");
      setIsReplying(false);
    }
  };

  return (
    <ul className="nested-comment">
      <li className="comment-card flex-row">
        <aside className="comment-avatar">
          <Avatar user={sessionUser} />
        </aside>
        <form
          onSubmit={handleReply}
          style={{ width: "100%" }}
        >
          <input
            autoFocus
            className="reply-field"
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleEscape}
            value={message}
            title="Enter to submit; Hit Esc to cancel."
            required
          />
        </form>
      </li>
      <div className="form-errors">
        {errors.map((error, idx) => (
          <div key={idx}>{error}</div>
        ))}
      </div>
    </ul>
  )
};

export default ReplyCommentForm;