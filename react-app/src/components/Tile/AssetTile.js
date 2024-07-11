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
  if (!isLoggedIn) return (
    <article
      className="tile cursor-pointer"
      onClick={handleShowLoginModal}
    >
      <div
        className="tile-cover"
        style={coverStyle}
        alt={asset?.title}
      >
        <div className="overlay-single full-box flex-row">
          <button
            className="overlay-play"
          >
            <FaCirclePlay />
          </button>
        </div>
      </div>
      <footer className="tile-info">
        <h3>{asset?.title}</h3>
        <span>{asset?.description}</span>
      </footer>
    </article>
  );

  return (
    <article className="tile">
      <div className="overlay-group">
        <NavLink to={`/${entity}s/${asset?.id}`}>
          <div
            className="tile-cover full-box"
            style={coverStyle}
            alt={asset?.title}
          />
        </NavLink>
        <button
          onClick={handlePlayPause}
          className={`overlay-play ${canPause ? "standout" : ""}`}
        >
          {canPause ? <FaCirclePause /> : <FaCirclePlay />}
        </button>
        <div className="overlay-shaded full-width">
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