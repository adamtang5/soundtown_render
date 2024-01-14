import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadPlaylist } from "../store/player";
import { editPlaylist } from "../store/playlist";
import { AudioContext } from "../context/AudioContext";
import { FaPause, FaPlay } from "react-icons/fa6";

const SingleSongRow = ({ song }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);

  const handlePlayPause = async (e) => {
    e.preventDefault();

    if (playlist?.id === player?.currPlaylistId &&
      song?.id === player?.currSongId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(loadPlaylist(
        playlist,
        playlist?.songs_order.indexOf(song?.id)
      ))
    }
  };

  return (
    <article className="song-row cursor-pointer">
      <div className="song-row-overlay full-box">
        <div className="song-row-content full-box flex-row">
          <div
            className="song-row-thumb"
            style={{ backgroundImage: `url(${song?.image_url})` }}
          />
          <div className="song-row-title">{song?.title}</div>
        </div>
        <button
          onClick={handlePlayPause}
          className={`song-row-play ${playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId &&
            isPlaying ? "standout" : ""}`}
        >
          {playlist?.id === player?.currPlaylistId &&
            song?.id === player?.currSongId && isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}
        </button>
      </div>
    </article>
  )
};

const AllTracks = ({ playlistData, setPlaylistData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const statePlaylists = useSelector(state => state.playlists);
  const playlist = useSelector(state => state.playlists[id]);
  const [songsOrder, setSongsOrder] = useState(playlist?.songs_order);
  const playlistSongs = useSelector(state => songsOrder?.map(id => state.songs[id]));

  const handleDelist = async (playlistId, songId) => {
    const formData = new FormData();
    const playlist = statePlaylists[playlistId];

    formData.append("title", playlist?.title);
    formData.append("description", playlist?.description || '');
    formData.append(
      "songs_order",
      JSON.stringify(playlist?.songs_order.filter(id => id !== songId))
    );

    const res = await dispatch(editPlaylist(playlistId, formData));
    if (res) return res;
  };

  return (
    <section className="playlist-songs-list">
      <ul>
        {playlistSongs?.map(song => (
          <li key={song?.id} className="flex-row">
            <SingleSongRow song={song} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AllTracks;