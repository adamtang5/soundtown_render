import React from "react";
import { useSelector } from "react-redux";
import PlaylistTile from "../GalleryCard/PlaylistTile"

const ShowcasePlaylists = () => {
  const playlistsArr = useSelector(state => Object.values(state.playlists));

  return (
    <>
      <h3>Find Playlists from around the town!</h3>
      <div className="showcase-grid flex-row">
        {playlistsArr?.map(playlist => <PlaylistTile key={playlist.id} playlist={playlist} />)}
      </div>
    </>
  );
};

export default ShowcasePlaylists;
