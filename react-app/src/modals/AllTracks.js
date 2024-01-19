import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { loadPlaylist } from "../store/player";
import { AudioContext } from "../context/AudioContext";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";

const SingleSongRow = ({ song, idx, onDelete }) => {
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
    <Draggable
      draggableId={song?.id}
      index={idx}
    >
      {(provided, snapshot) => (
        <li
          className={`flex-row ${snapshot.isDragging ? "dragging" : "not-dragging"}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <article className="song-row">
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
              <button
                className="song-row-delete"
                onClick={onDelete}
              >
                <IoCloseCircle />
              </button>
            </div>
          </article>
        </li>
      )}
    </Draggable>
  )
};

const AllTracks = ({ playlistData, setPlaylistData }) => {
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);
  const [songsOrder, setSongsOrder] = useState(playlist?.songs_order);
  const playlistSongs = useSelector(state => songsOrder?.map(id => state.songs[id]));

  const handleDelete = idx => {
    const newSongsOrder = [...songsOrder];
    newSongsOrder.splice(idx, 1);

    setSongsOrder(newSongsOrder);

    setPlaylistData({
      ...playlistData,
      songsOrder: newSongsOrder,
    });
  };

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const newSongsOrder = [...songsOrder];
    newSongsOrder.splice(source.index, 1);
    newSongsOrder.splice(destination.index, 0, draggableId);

    setSongsOrder(newSongsOrder);

    setPlaylistData({
      ...playlistData,
      songsOrder: newSongsOrder,
    });
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <section className="playlist-songs-list">
        <Droppable
          droppableId={playlistData?.id}
        >
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {playlistSongs?.map((song, idx) => (
                <SingleSongRow
                  key={song?.id}
                  song={song}
                  idx={idx}
                  onDelete={() => handleDelete(idx)}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </section>
    </DragDropContext>
  );
};

export default AllTracks;