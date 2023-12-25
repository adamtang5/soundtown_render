import { actionGenerator } from "./util";

// constants
const LOAD_SONGS = "song/LOAD_SONGS";
const NEW_SONG = "song/NEW_SONG";
const REMOVE_SONG = "song/REMOVE_SONG";

const loadSongs = (songs) => ({
  type: LOAD_SONGS,
  songs,
});

// for create, edit, and update
export const newSong = (song) => ({
  type: NEW_SONG,
  song,
});

const removeSong = (payload) => {
  return {
    type: REMOVE_SONG,
    payload,
  };
};

// toggle like on a song
export const toggleSongLike = (id, data) => actionGenerator({
  url: `/api/songs/${id}/toggleLike`,
  options: {
    method: "POST",
    body: data,
  },
  action: newSong,
});

// Create songs in the database
export const createSong = (data) => actionGenerator({
  url: "/api/songs/",
  options: {
    method: "POST",
    body: data,
  },
  action: newSong,
});

//! Get Songs from the Database
export const getAllSongs = () => actionGenerator({
  url: "/api/songs/",
  action: loadSongs,
});

// Get One Song from the Database by id
export const getSong = (id) => actionGenerator({
  url: `/api/songs/${id}`,
  action: newSong,
});

//! Edit/Update Songs from the db
export const editSong = (id, data) => actionGenerator({
  url: `/api/songs/${id}`,
  options: {
    method: "PUT",
    body: data,
  },
  action: newSong,
});

//!Delete Song from the db
export const deleteSong = (id) => actionGenerator({
  url: `/api/songs/${id}`,
  options: {
    method: "DELETE",
  },
  action: removeSong,
});

// State shape:
// state.songs --> {
//   [id]: {
//      id, user_id, title, audio_url, description, image_url, created_at, updated_at,
//      user: {},
//      comments: [],
//   },
//   [id]: {
//      id, user_id, title, audio_url, description, image_url, created_at, updated_at,
//      user: {},
//      comments: [],
//   },
// }

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEW_SONG: {
      const newState = {
        ...state,
        [action.song.id]: action.song,
      };
      return newState;
    }
    case LOAD_SONGS: {
      const newState = { ...state };
      action.songs.forEach(song => {
        newState[song.id] = song;
      });
      return newState;
    }
    case REMOVE_SONG: {
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    }
    default:
      return state;
  }
}
