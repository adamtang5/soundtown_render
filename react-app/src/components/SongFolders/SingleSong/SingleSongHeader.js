import Moment from "react-moment";
import { useDispatch } from "react-redux";
import { loadSong } from "../../../store/player";

const SingleSongHeader = ({ song }) => {
  const dispatch = useDispatch();

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadSong(song.id));
  };

  return (
    <header className="single-song-banner flex-row">
      <div className="single-song-banner-left flex-column">
        <div className="single-song-banner-top-left flex-row">
          <div
            className="song-page-play cursor-pointer"
            onClick={handlePlayButtonClick}
          >&#9654;</div>
          <div className="single-song-banner-info flex-row">
            <div className="single-song-banner-ident flex-column">
              <h2>{song?.title}</h2>
              <p>{song?.description}</p>
            </div>
            <Moment fromNow>{song?.created_at}</Moment>
          </div>
        </div>
        <p>{/* WaveForms go here */}</p>
      </div>
      <img
        className="song-image"
        src={song?.image_url}
        alt={song?.title}
      />
    </header>
  );
};

export default SingleSongHeader;
