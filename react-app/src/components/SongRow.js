import { useDispatch } from "react-redux";
import { loadSong } from "../store/player";

const SongRow = ({
  song,
  thumbStyle,
}) => {
  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.preventDefault();
    dispatch(loadSong(song?.id));
  };

  return (
    <article
      className="song-row flex-row cursor-pointer"
      onClick={handlePlay}
    >
      <div className="song-row-content flex-row">
        <div
          className="song-row-thumb"
          style={{ backgroundImage: `url(${song?.image_url})` }}
        />
      </div>
      <div className="song-row-overlay flex-row">
        <button
          className="song-row-play cursor-pointer"
        >&#9654;</button>
      </div>
    </article>
  );
};

export default SongRow;
