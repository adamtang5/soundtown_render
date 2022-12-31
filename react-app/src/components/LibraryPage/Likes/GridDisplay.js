import React from "react";
import SongTile from "../../GalleryCard/SongTile";

const GridDisplay = ({ likedSongs }) => {
  return (
    <div className="flex-row liked_songs_container">
      {likedSongs.map((song) => (
        <SongTile song={song} key={song.id} />
      ))}
    </div>
  );
};

export default GridDisplay;
