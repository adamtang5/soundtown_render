import React from 'react'
import SongTile from '../../GalleryCard/SongTile';

const ShowcaseSongs = ({ songs, h3 }) => {
  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {songs.map(song => <SongTile song={song} key={song.id} />)}
      </div>
    </>
  );
};

export default ShowcaseSongs;
