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

// State shape:

// state.player --> {
//   playingId: id,
//   playHistory: [id, id, ...],
//   queue: [id, id, ...],
// }

const initialState = {
  playingId: null,
  playHistory: [],
  queue: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SONG: {
      const newState = {
        ...state,
      };
      if (newState.playingId !== action.songId) {
        if (newState.playingId) {
          newState.playHistory = [...newState.playHistory, newState.playingId];
        }
        newState.playingId = action.songId;
      }
      return newState;
    }
    case QUEUE_SONG: {
      const newState = {
        ...state,
      };
      newState.queue = [...newState.queue, action.songId];
      return newState;
    }
    case QUEUE_ADVANCE: {
      const newState = { ...state };
      if (newState.playingId) {
        newState.playHistory = [...newState.playHistory, newState.playingId];
      }
      if (newState.queue.length) {
        newState.playingId = newState.queue[0];
        newState.queue = newState.queue.slice(1);
      } else {
        newState.playingId = null;
      }
      return newState;
    }
    case HISTORY_STEPBACK: {
      const newState = { ...state };
      if (newState.playingId) {
        newState.queue = [newState.playingId, ...newState.queue];
      }
      if (newState.playHistory.length) {
        newState.playingId = newState.playHistory.pop();
      } else {
        newState.playingId = null;
      }
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
      if (newState.playingId) {
        newState.playHistory = [...newState.playHistory, newState.playingId];
      }
      const firstSong = action.playlist.songs_order[0];
      newState.playingId = firstSong;
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
