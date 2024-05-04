import PlaylistTile from "./Tile/PlaylistTile"

const ShowcasePlaylists = ({ playlists, h3 }) => {
  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {playlists?.map((pl, i) => (
          <PlaylistTile
            key={i}
            playlist={pl}
          />
        ))}
      </div>
    </>
  );
};

export default ShowcasePlaylists;
