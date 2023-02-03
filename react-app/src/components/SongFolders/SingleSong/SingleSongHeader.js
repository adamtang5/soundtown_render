import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { loadSong } from "../../../store/player";
import { editSong } from "../../../store/song";
import DynamicImage from "../../DynamicImage";

const SingleSongHeader = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const inputId = "standalone-input";

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    dispatch(loadSong(song.id));
  };

  const updateImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image_url', file);
      await dispatch(editSong(song?.id, formData));
    }
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

      <DynamicImage
        dimension={340}
        standalone={true}
        entity="song"
        imageUrl={song?.image_url}
        hiddenInput={
          <input
            type="file"
            accept="image/*"
            onChange={updateImage}
            name={inputId}
            id={inputId}
            hidden
          />
        }
        isAuthorized={sessionUser.id === song?.user_id}
        clickHidden={() => document.getElementById(inputId).click()}
        styleClasses={['button-action', 'b1']}
        replaceLabel="Replace image"
        beforeLabel="camera-label"
      />
    </header>
  );
};

export default SingleSongHeader;
