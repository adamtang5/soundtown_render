const MiniTile = ({
  dimension,
  asset,
  handlePlay,
}) => {
  const coverStyle = {
    backgroundImage: `url(${asset.image_url})`,
    backgroundSize: "cover",
    position: "relative",
    height: "100%",
    width: "100%",
  };

  return (
    <article style={{
      height: `${dimension}px`,
      width: `${dimension}px`,
    }}>
      <div className="mini" style={coverStyle} alt={asset?.title}>
        <div className="overlay-single flex-row">
          <button
            className="overlay-play"
            onClick={handlePlay}
          >&#9654;</button>
        </div>
      </div>
    </article>
  );
};

export default MiniTile;
