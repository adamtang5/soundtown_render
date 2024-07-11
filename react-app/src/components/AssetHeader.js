import Moment from "react-moment";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import DynamicImage from "./DynamicImage";

const AssetHeader = ({
  entity,
  asset,
  h3,
  placeholderImg,
  handlePlayPause,
  condition,
  updateImage,
  isAuthorized,
}) => {
  const inputId = "standalone-input";
  const entities = {
    'song': {
      bottomLeft: <div>{/* WaveForms go here */}</div>,
    },
    'playlist': {
      bottomLeft: <div className="playlist-summary flex-column">
        <h1>{asset?.songs?.length || 0}</h1>
        <div>tracks</div>
      </div>,
    },
  };

  return !entities[entity] ? (
    <p>Invalid Entity</p>
  ) : (
    <header className="asset-banner flex-row">
      <div className="asset-banner-left full-box flex-column">
        <div className="asset-banner-top-left full-width flex-row">
          <button
            onClick={handlePlayPause}
            className="asset-banner-play"
          >
            {condition ? <FaCirclePause /> : <FaCirclePlay />}
          </button>
          <div className="asset-banner-info full-width flex-row">
            <div className="asset-banner-ident flex-column">
              <h2>{asset?.title}</h2>
              <h3>{h3}</h3>
            </div>
            <Moment fromNow>{asset?.created_at}</Moment>
          </div>
        </div>
        {entities[entity].bottomLeft}
      </div>

      <DynamicImage
        dimension={340}
        standalone={true}
        entity={entity}
        placeholderImg={placeholderImg}
        imageUrl={asset?.image_url}
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
        isAuthorized={isAuthorized}
        clickHidden={() => document.getElementById(inputId).click()}
        styleClasses={['button-action', 'b1']}
        replaceLabel="Replace image"
        uploadLabel="Upload image"
        beforeLabel="camera-label"
      />
    </header>
  );
};

export default AssetHeader;
