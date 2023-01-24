const LikeButton = ({
  isLiked,
  handleUnlike,
  handleLike,
}) => {
  return isLiked ? (
    <button
      onClick={handleUnlike}
      className="song-button highlighted cursor-pointer"
    >&#10084; Liked</button>
  ) : (
    <button
      onClick={handleLike}
      className="song-button cursor-pointer"
    >&#10084; Like</button>
  );
};

export default LikeButton;
