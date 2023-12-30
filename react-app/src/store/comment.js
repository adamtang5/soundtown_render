import { actionGenerator } from "./util";
import { newSong } from "./song";

// constants
const LOAD_COMMENTS = "comment/LOAD_COMMENTS";

export const loadComments = (song) => ({
  type: LOAD_COMMENTS,
  comments: song.comments,
});

// Create comment in DB
export const createComment = (data) => actionGenerator({
  url: "/api/comments/",
  options: {
    method: "POST",
    body: data,
  },
  action: newSong,
  action2: loadComments,
});

// Edit/Update comment from DB
export const editComment = (id, data) => actionGenerator({
  url: `/api/comments/${id}`,
  options: {
    method: "PUT",
    body: data,
  },
  action: newSong,
  action2: loadComments,
});

// Delete comment from DB
export const deleteComment = (id) => actionGenerator({
  url: `/api/comments/${id}`,
  options: {
    method: "DELETE",
  },
  action: newSong,
  action2: loadComments,
});

// toggle like on a comment
export const toggleCommentLike = (id, data) => actionGenerator({
  url: `/api/comments/${id}/toggleLike`,
  options: {
    method: "POST",
    body: data,
  },
  action: newSong,
  action2: loadComments,
});

// State shape:
// state.comments --> {
//   [parent_id]: [
//      {
//        id, user_id, song_id, content, song_timestamp, created_at, updated_at,
//        user: {},
//        song: {},
//      },
//   ],
//   [parent_id]: [
//      {
//        id, user_id, song_id, content, song_timestamp, created_at, updated_at,
//        user: {},
//        song: {},
//      },
//   ],
// }

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_COMMENTS: {
      const newState = {};
      action.comments.forEach(comment => {
        const commentsOfParent = newState[comment.parent_id] || [];
        if (!commentsOfParent.includes(comment)) commentsOfParent.push(comment);
        newState[comment.parent_id] = commentsOfParent;
      });
      return newState;
    }
    default:
      return state;
  }
}
