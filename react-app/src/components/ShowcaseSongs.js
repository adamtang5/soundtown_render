import SongTile from './GalleryCard/SongTile';

const ShowcaseSongs = ({ songs, h3, setShowModal }) => {
  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {songs?.map(song => (
          <SongTile
            song={song}
            setShowModal={setShowModal}
            key={song?.id}
          />
        ))}
      </div>
    </>
  );
};

export default ShowcaseSongs;
