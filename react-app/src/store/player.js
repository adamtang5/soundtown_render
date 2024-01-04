// constants
const LOAD_SONG = "player/LOAD_SONG";
const LOAD_PLAYLIST = "player/LOAD_PLAYLIST";
const QUEUE_SONG = "player/QUEUE_SONG";
const QUEUE_PLAYLIST = "player/QUEUE_PLAYLIST";
const QUEUE_ADVANCE = "player/QUEUE_ADVANCE";
const HISTORY_STEPBACK = "player/HISTORY_STEPBACK";
const CLEAR_PLAYER = "player/CLEAR_PLAYER";

// adding song to play now and history
export const loadSong = (songId) => ({
  type: LOAD_SONG,
  songId,
});

// playlist.songs_order
export const loadPlaylist = (playlist, idx=0) => ({
  type: LOAD_PLAYLIST,
  playlist,
  idx,
});

// adding song to future queue
export const queueSong = (songId) => ({
  type: QUEUE_SONG,
  songId,
});

export const queuePlaylist = (playlist) => ({
  type: QUEUE_PLAYLIST,
  playlist,
});

// moving song from future queue into now playing and history
export const queueAdvance = () => ({
  type: QUEUE_ADVANCE,
});

// moving song from history into now playing and move now playing into queue
export const historyStepBack = () => ({
  type: HISTORY_STEPBACK,
});

// clear player when user logs out
export const clearPlayer = () => ({
  type: CLEAR_PLAYER,
});

const currPlaylistId = (currSongIdx, playlists) => {
  for (const [startIdx, endIdx, id] of playlists) {
    if (currSongIdx >= startIdx && currSongIdx < endIdx) return id;
  }
  return null;
};

const updateSecondaries = (state) => {
  const { songs, playlists, currIdx } = state;
  state.currSongId = songs[currIdx];
  state.currPlaylistId = playlists[currIdx];
  state.playHistory = songs.slice(0, currIdx);
  state.queue = songs.slice(currIdx + 1);
}

// State shape:

// state.player --> {
//   songs: [songId, songId, ...],
//   playlists: [playlistId, playlistId, ...],
//   currIdx: idx,
//   --> currSongId: id = songs[currIdx],
//   --> currPlaylistId: id = playlists[currIdx],
//   --> playHistory: [id, id, ...] = songs.slice(0, currIdx),
//   --> queue: [id, id, ...] = playlists.slice(currIdx + 1),
// }

const initialState = {
  songs: [],
  playlists: [],
  currIdx: -1,
  currSongId: null,
  currPlaylistId: null,
  playHistory: [],
  queue: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SONG: {
      const newState = state.playlists.some(id => id !== null) ? 
        { ...initialState } :
        { ...state };
      const { songs, playlists, currIdx } = newState;
      if (currIdx < 0) {
        songs.unshift(action.songId);
        playlists.unshift(null);
        newState.currIdx = 0;
      } else if (currIdx >= songs.length) {
        songs.push(action.songId);
        playlists.push(null);
        newState.currIdx = songs.length - 1;
      } else {
        songs.splice(currIdx + 1, 0, action.songId);
        playlists.splice(currIdx + 1, 0, null);
        newState.currIdx++;
      }
      updateSecondaries(newState);
      return newState;
    }
    case HISTORY_STEPBACK: {
      const newState = { ...state };
      if (newState.currIdx > 0) newState.currIdx--;
      updateSecondaries(newState);
      return newState;
    }
    case QUEUE_ADVANCE: {
      const newState = { ...state };
      if (newState.currIdx < newState.songs.length) newState.currIdx++;
      updateSecondaries(newState);
      return newState;
    }
    case QUEUE_SONG: {
      if (!state.songs.slice(state.currIdx).includes(action.songId)) {
        const newState = { ...state };
        newState.songs.push(action.songId);
        newState.playlists.push(null);
        updateSecondaries(newState);
        return newState;
      } else {
        return state;
      }
    }
    case QUEUE_PLAYLIST: {
      if (!state.playlists.slice(state.currIdx).includes(action.playlist.id)) {
        const newState = { ...state };
        newState.songs = [...newState.songs, ...action.playlist.songs_order];
        newState.playlists = [
          ...newState.playlists,
          ...(new Array(action.playlist.songs_order.length)
            .fill(action.playlist.id))
        ];
        if (newState.currIdx < 0) newState.currIdx = 0;
        updateSecondaries(newState);
        return newState;
      } else {
        return state;
      }
    }
    case LOAD_PLAYLIST: {
      const newState = { ...initialState };
      newState.songs = action.playlist.songs_order;
      newState.playlists = new Array(action.playlist.songs_order.length)
        .fill(action.playlist.id);
      newState.currIdx = action.idx;
      updateSecondaries(newState);
      return newState;
    }
    case CLEAR_PLAYER:
      return initialState;
    default:
      return state;
  }
}
