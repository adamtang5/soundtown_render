import Moment from "react-moment";
import DynamicImage from "../DynamicImage";

const AssetHeader = ({
  entity,
  asset,
  handlePlayButtonClick,
  updateImage,
  isAuthorized,
}) => {
  const inputId = "standalone-input";
  const entities = {
    'song': {
      bottomLeft: <div>{/* WaveForms go here */}</div>,
    },
    'playlist': {
      bottomLeft: <div>{/* Playlist Summary goes here */}</div>,
    },
  };

  return !entities[entity] ? (
    <p>Invalid Entity</p>
  ) : (
    <header className="asset-banner flex-row">
      <div className="asset-banner-left flex-column">
        <div className="asset-banner-top-left flex-row">
          <div
            className="asset-banner-play cursor-pointer"
            onClick={handlePlayButtonClick}
          >&#9654;</div>
          <div className="asset-banner-info flex-row">
            <div className="asset-banner-ident flex-column">
              <h2>{asset?.title}</h2>
              <p>{asset?.description}</p>
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
        beforeLabel="camera-label"
      />
    </header>
  );
};

export default AssetHeader;
