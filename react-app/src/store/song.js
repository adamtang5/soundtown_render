import { GENERIC_ERROR } from "../util";

// constants
const LOAD_SONGS = "song/LOAD_SONGS";
const NEW_SONG = "song/NEW_SONG";
const REMOVE_SONG = "song/REMOVE_SONG";

const loadSongs = (songs) => ({
  type: LOAD_SONGS,
  songs,
});

// for create and edit
export const newSong = (song) => ({
  type: NEW_SONG,
  song,
});

const removeSong = (songId) => {
  return {
    type: REMOVE_SONG,
    songId,
  };
};

// like a song
export const likeSong = (data) => async (dispatch) => {
  const response = await fetch("/api/likes/song", {
    method: "POST",
    body: data,
  });

  if (response.ok) {
    const song = await response.json();
    dispatch(newSong(song));
    return song;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return GENERIC_ERROR;
  }
};

// unlike a song
export const unlikeSong = (data) => async (dispatch) => {
  const response = await fetch("/api/likes/song", {
    method: "DELETE",
    body: data,
  });

  if (response.ok) {
    const song = await response.json();
    dispatch(newSong(song));
    return song;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return GENERIC_ERROR;
  }
};

//! Create songs in the database
export const createSong = (data) => async (dispatch) => {
  const response = await fetch("/api/songs/", {
    method: "POST",
    body: data,
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(newSong(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return GENERIC_ERROR;
  }
};

//! Get Songs from the Database
export const getAllSongs = () => async (dispatch) => {
  const response = await fetch("/api/songs/");
  if (response.ok) {
    const songs = await response.json();
    dispatch(loadSongs(songs));
  }
};

// Get One Song from the Database by id
export const getSong = (id) => async (dispatch) => {
  const response = await fetch(`/api/songs/${id}`);
  if (response.ok) {
    const song = await response.json();
    dispatch(newSong(song));
    return song;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return GENERIC_ERROR;
  }
};

//! Edit/Update Songs from the db
export const editSong = (id, data) => async (dispatch) => {
  const response = await fetch(`/api/songs/${id}`, {
    method: "PUT",
    body: data,
  });
  if (response.ok) {
    const song = await response.json();
    dispatch(newSong(song));
    return song;
  }
};

//!Delete Song from the db
export const deleteSong = (songId) => async (dispatch) => {
  const response = await fetch(`/api/songs/${songId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await response.json();
    dispatch(removeSong(songId));
    return songId;
  }
};

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
      action.songs.forEach((song) => {
        newState[song.id] = song;
      });
      return newState;
    }
    case REMOVE_SONG: {
      const newState = { ...state };
      delete newState[action.songId];
      return newState;
    }
    default:
      return state;
  }
}
