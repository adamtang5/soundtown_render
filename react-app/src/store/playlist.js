import { actionGenerator } from "./util";

// constants
const LOAD_PLAYLISTS = "playlist/LOAD_PLAYLISTS";
const NEW_PLAYLIST = "playlist/NEW_PLAYLIST";
const REMOVE_PLAYLIST = "playlsit/REMOVE_PLAYLIST";

const loadPlaylists = (playlists) => ({
  type: LOAD_PLAYLISTS,
  playlists,
});

// for create, edit, and update
const newPlaylist = (playlist) => ({
  type: NEW_PLAYLIST,
  playlist,
});

const removePlaylist = (payload) => ({
  type: REMOVE_PLAYLIST,
  payload,
});

// toggle like on a playlist
export const togglePlaylistLike = (id, data) => actionGenerator({
  url: `/api/playlists/${id}/toggleLike`,
  options: {
    method: "POST",
    body: data,
  },
  action: newPlaylist,
});

// like a playlist
export const likePlaylist = (data) => actionGenerator({
  url: "/api/likes/playlist",
  options: {
    method: 'POST',
    body: data,
  },
  action: newPlaylist,
});

// unlike a playlist
export const unlikePlaylist = (data) => actionGenerator({
  url: "/api/likes/playlist",
  options: {
    method: 'DELETE',
    body: data,
  },
  action: newPlaylist,
});

export const addSongToPlaylist = (data) => actionGenerator({
  url: "/api/playlistsongs/",
  options: {
    method: "POST",
    body: data,
  },
  action: newPlaylist,
});

export const removeSongFromPlaylist = (data) => actionGenerator({
  url: "/api/playlistsongs/",
  options: {
    method: "DELETE",
    body: data,
  },
  action: newPlaylist,
});

// Create playlist in the database
export const createPlaylist = (playlist) => actionGenerator({
  url: "/api/playlists/",
  options: {
    method: "POST",
    body: playlist,
  },
  action: newPlaylist,
});

//!Get Songs from the Database
export const getAllPlaylists = () => actionGenerator({
  url: "/api/playlists/",
  action: loadPlaylists,
});

// Get One Playlist from the Database by id
export const getPlaylist = (id) => actionGenerator({
  url: `/api/playlists/${id}`,
  action: newPlaylist,
});

//!Edit playlist in the database
export const editPlaylist = (id, data) => actionGenerator({
  url: `/api/playlists/${id}`,
  options: {
    method: "PUT",
    body: data,
  },
  action: newPlaylist,
});

//!Delete Playlist from the database
export const deletePlaylist = (playlistId) => actionGenerator({
  url: `/api/playlists/${playlistId}`,
  options: {
    method: "DELETE",
  },
  action: removePlaylist,
});

// State shape:
// state.playlist --> {
//   [id]: {
//      id, user_id, title, audio_url, songs_order, image_url, description, created_at, updated_at,
//      songs:[1,2,3,4]
//   },
//   [id]: {
//      id, user_id, title, audio_url, songs_order, image_url, description, created_at, updated_at,
//      songs:[]
//   },
// }

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEW_PLAYLIST: {
      const newState = {
        ...state,
        [action.playlist.id]: action.playlist,
      };
      return newState;
    }
    case LOAD_PLAYLISTS: {
      const newState = { ...state };
      Object.values(action.playlists).forEach((playlist) => {
        newState[playlist.id] = playlist;
      });
      return newState;
    }
    case REMOVE_PLAYLIST: {
      const newState = { ...state };
      delete newState[action.payload.playlistId];
      return newState;
    }
    default:
      return state;
  }
}
