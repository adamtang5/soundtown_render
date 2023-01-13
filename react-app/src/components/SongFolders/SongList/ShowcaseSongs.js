import React from 'react'
import SongTile from '../../GalleryCard/SongTile';

const ShowcaseSongs = ({ songs, h3, setShowLoginModal }) => {
  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {songs.map(song => (
          <SongTile
            song={song}
            setShowLoginModal={setShowLoginModal}
            key={song.id}
          />
        ))}
      </div>
    </>
  );
};

export default ShowcaseSongs;
