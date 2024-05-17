import { Link } from "react-router-dom";
import SimpleButton from "../Buttons/SimpleButton";

const AssetCard = ({
  entity,
  asset,
  assetCover,
  assetFooter,
  user,
  buttonGroupData = [],
  overlay = false,
  handlePlayPause,
  playPauseClasses,
  playPauseIcon,
  hoverButtonGroup,
}) => {
  return overlay ? (
    <li className="flex-row full-width">
      <div className="asset-li-overlay full-box cursor-pointer">
        <div className="asset-li-content full-box flex-row">
          <div className="asset-li-left">
            {assetCover}
          </div>
          <div className="asset-li-right full-width flex-row">
            <div className="asset-li-details full-box flex-column">
              <Link to={`/users/${user?.id}`}>
                <h3>{user?.display_name}</h3>
              </Link>
              <Link to={`/${entity}s/${asset?.id}`}>
                {asset?.title}
              </Link>
              {assetFooter}
            </div>
            <ul className="asset-li-actions flex-row">
              {buttonGroupData.map((data, idx) => (
                <li key={idx}>
                  <SimpleButton
                    label={data.label}
                    onClick={data.onClick}
                    classes={['single-line', 'button-action']}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={handlePlayPause}
          className={playPauseClasses}
        >
          {playPauseIcon}
        </button>
        {hoverButtonGroup}
      </div>
    </li>
  ) : (
    <li className="flex-row full-width">
      <div className="asset-li-left">
        {assetCover}
      </div>
      <div className="asset-li-right full-width flex-row">
        <div className="asset-li-details full-box flex-column">
          <Link to={`/users/${user?.id}`}>
            <h3>{user?.display_name}</h3>
          </Link>
          <Link to={`/${entity}s/${asset?.id}`}>
            {asset?.title}
          </Link>
          {assetFooter}
        </div>
        <ul className="asset-li-actions flex-row">
          {buttonGroupData.map((data, idx) => (
            <li key={idx}>
              <SimpleButton
                label={data.label}
                onClick={data.onClick}
                classes={['single-line', 'button-action']}
              />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default AssetCard;
