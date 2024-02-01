import PlaylistTile from "./Tile/PlaylistTile";

const ShowcaseSongPlaylists = ({ song }) => {
  return (
    <>
      {song?.playlists?.map((pl, idx) => (
        <PlaylistTile
          key={idx}
          playlist={pl}
        />
      ))}
    </>
  );
};

export default ShowcaseSongPlaylists;