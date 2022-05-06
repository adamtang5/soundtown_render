import React, { useState } from "react";
import { useSelector } from "react-redux";
import PlaylistTile from "../../GalleryCard/playlistTile";
import NewPlaylistForm from "../../PlaylistFolders/CreatePlaylist";

import { Modal } from "../../Context/Modal";

import "./Playlist.css";

const Playlist = () => {
  const user = useSelector((state) => state.session.user);
  const playlistsObj = useSelector((state) => state.playlists);
  const raw_playlists = Object.values(playlistsObj);

  const playlists = raw_playlists?.filter(
    (playlist) => playlist?.user_id === user?.id
  );

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h3>Hear your own playlists</h3>
      <button onClick={() => setShowModal(true)}>make a new playlist</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h1>Make a new playlist</h1>
          <NewPlaylistForm />
        </Modal>
      )}
      <div className="playlist_tile_container flex-row">
        {playlists?.map((playlist) => (
          <PlaylistTile key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
