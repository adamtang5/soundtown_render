const PlayCover = ({
  entity,
  asset,
  dimension,
  isOverlay = true,
  handlePlay,
}) => {
  const entities = ['song', 'playlist'];
  return !entities.includes(entity) ? (
    <p>Invalid Entity</p>
  ) : (
    <div
      style={{
        position: "relative",
        width: `${dimension}px`,
        height: `${dimension}px`,
        backgroundImage: `url(${asset?.image_url})`,
        backgroundSize: 'cover',
      }}
    >
      {isOverlay && (
        <div className="overlay play flex-row">
          <button
            className="play cursor-pointer"
            onClick={handlePlay}
          >&#9654;</button>
        </div>
      )}
    </div>
  );
};

export default PlayCover;
