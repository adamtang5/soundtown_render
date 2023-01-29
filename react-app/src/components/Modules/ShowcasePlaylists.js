import PlaylistTile from "../GalleryCard/PlaylistTile"

const ShowcasePlaylists = ({ playlists, h3 }) => {
  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {playlists?.map(playlist => <PlaylistTile key={playlist.id} playlist={playlist} />)}
      </div>
    </>
  );
};

export default ShowcasePlaylists;
