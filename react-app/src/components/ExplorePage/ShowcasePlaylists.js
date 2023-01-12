import React from "react";
import PlaylistTile from "../GalleryCard/PlaylistTile"

const ShowcasePlaylists = ({ playlists }) => {
  return (
    <>
      <h3>Find Playlists from around the town!</h3>
      <div className="showcase-grid flex-row">
        {playlists?.map(playlist => <PlaylistTile key={playlist.id} playlist={playlist} />)}
      </div>
    </>
  );
};

export default ShowcasePlaylists;
