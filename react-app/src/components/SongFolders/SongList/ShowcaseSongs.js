import React from 'react'
import { useSelector } from "react-redux";
import SongTile from '../../GalleryCard/SongTile';

const ShowcaseSongs = () => {
  const songsArr = useSelector(state => Object.values(state.songs));

  return (
    <>
      <h3>Every song from every user!</h3>
      <div className="showcase-grid flex-row">
        {songsArr.map(song => <SongTile song={song} key={song.id} />)}
      </div>
    </>
  );
};

export default ShowcaseSongs;
