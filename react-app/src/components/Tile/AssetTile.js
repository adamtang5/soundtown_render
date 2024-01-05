import { NavLink } from "react-router-dom";
import { FaCirclePlay, FaCirclePause, FaHeart } from "react-icons/fa6";
import "./Tile.css";

const AssetTile = ({
  entity,
  asset,
  isLoggedIn,
  handlePlayPause,
  canPause,
  handleLikeToggle,
  coverStyle,
  dropdown,
  canLike,
  liked,
  handleShowLoginModal,
}) => {
  return (
    <article className="tile">
      <div
        className="tile-cover"
        style={coverStyle}
        alt={asset?.title}
      >
        {isLoggedIn ? (
          <div className="overlay-group">
            <div className="overlay-layer full-box">
              <button
                onClick={handlePlayPause}
                className="overlay-play"
              >
                {canPause ? <FaCirclePause /> : <FaCirclePlay />}
              </button>
            </div>
            {dropdown}
            {canLike && (
              <div className="overlay-like">
                <button
                  onClick={handleLikeToggle}
                  className={liked ? "liked" : "not-liked"}
                >
                  <FaHeart />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overlay-single flex-row">
            <button
              onClick={handleShowLoginModal}
              className="overlay-play"
            >
              <FaCirclePlay />
            </button>
          </div>
        )}
      </div>
      <footer className="tile-info">
        <NavLink to={`/${entity}s/${asset?.id}`}>
          <h3>{asset?.title}</h3>
        </NavLink>
        <span>{asset?.description}</span>
      </footer>
    </article>
  );
};

export default AssetTile;