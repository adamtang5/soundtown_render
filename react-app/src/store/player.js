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
export const loadPlaylist = (playlist) => ({
  type: LOAD_PLAYLIST,
  playlist,
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
  const { global, currSongIdx, playlists } = state;
  state.currSongId = global[currSongIdx];
  state.playHistory = global.slice(0, currSongIdx);
  state.queue = global.slice(currSongIdx + 1);
}

// State shape:

// state.player --> {
//   global: [id, id, ...],
//   currSongIdx: idx,
//   playlists: [[startIdx, endIdx, id], [startIdx, endIdx, id], ...],
//   --> currSongId: id = global[currSongIdx],
//   --> currPlaylistId: id = currPlaylistId(global, currSongIdx),
//   --> playHistory: [id, id, ...] = global.slice(0, currSongIdx),
//   --> queue: [id, id, ...] = global.slice(currSongIdx + 1),
// }

const initialState = {
  global: [],
  currSongIdx: -1,
  playlists: [],
  currSongId: null,
  playHistory: [],
  queue: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SONG: {
      const newState = state.playlists.length ? 
        { ...initialState } :
        { ...state };
      const { global, currSongIdx } = newState;
      if (currSongIdx < 0) {
        global.unshift(action.songId);
        newState.currSongIdx = 0;
      } else if (currSongIdx >= global.length) {
        global.push(action.songId);
        newState.currSongIdx = global.length - 1;
      } else {
        global.splice(currSongIdx + 1, 0, action.songId);
        newState.currSongIdx++;
      }
      updateSecondaries(newState);
      return newState;
    }
    case HISTORY_STEPBACK: {
      const newState = { ...state };
      if (newState.currSongIdx > 0) newState.currSongIdx--;
      updateSecondaries(newState);
      return newState;
    }
    case QUEUE_ADVANCE: {
      const newState = { ...state };
      if (newState.currSongIdx < newState.global.length) newState.currSongIdx++;
      updateSecondaries(newState);
      return newState;
    }
    case QUEUE_SONG: {
      const newState = { ...state };
      newState.global.push(action.songId);
      updateSecondaries(newState);
      return newState;
    }
    case QUEUE_PLAYLIST: {
      const newState = { ...state };
      action.playlist.songs_order.forEach(songId => {
        newState.queue = [...newState.queue, songId];
      });
      return newState;
    }
    case LOAD_PLAYLIST: {
      const newState = { ...state };
      if (newState.currSongId) {
        newState.playHistory = [...newState.playHistory, newState.currSongId];
      }
      const firstSong = action.playlist.songs_order[0];
      newState.currSongId = firstSong;
      newState.queue = [];
      for (let i = 1; i < action.playlist.songs_order.length; i++) {
        newState.queue = [...newState.queue, action.playlist.songs_order[i]];
      }
      return newState;
    }
    case CLEAR_PLAYER:
      return initialState;
    default:
      return state;
  }
}
