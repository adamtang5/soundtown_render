import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSongToPlaylist, removeSongFromPlaylist } from "../../../store/playlist";
import CreatePlaylistAddSong from "./CreatePlaylistAddSong";
import ExistingPlaylist from "../Forms/ExistingPlaylist";
import "./AddToPlaylist.css";

const AddToPlaylist = ({ song }) => {
  const dispatch = useDispatch();
  const [term, setTerm] = useState("");
  const [mode, setMode] = useState("add");
  const sessionUser = useSelector(state => state.session.user);
  const playlists = useSelector(state => Object.values(state.playlists)
    .filter(pl => pl?.user_id === sessionUser.id));

  const handleEnlist = async (playlistId, songId) => {
    console.log(playlistId, songId);

    const formData = new FormData();
    formData.append("playlist_id", playlistId);
    formData.append("song_id", songId);

    const playlist = await dispatch(addSongToPlaylist(formData));
    if (playlist) return playlist;
  };

  const handleDelist = async (playlistId, songId) => {
    console.log(playlistId, songId);

    const formData = new FormData();
    formData.append("playlist_id", playlistId);
    formData.append("song_id", songId);

    await dispatch(removeSongFromPlaylist(formData));
  };

  const navData = [
    {
      mode: 'add',
      label: 'Add to playlist',
    },
    {
      mode: 'create',
      label: 'Create a playlist',
    },
  ];

  return (
    <>
      <header>
        <nav>
          <ul className="nav-header flex-row">
            {navData.map((data, idx) => (
              <li
                key={idx}
                onClick={() => setMode(data.mode)}
                className={mode === data.mode ? "active" : "cursor-pointer"}
              >{data.label}</li>
            ))}
          </ul>
        </nav>
      </header>

      {mode === "add" ? (
        <ExistingPlaylist
          term={term}
          setTerm={setTerm}
          playlists={playlists}
          song={song}
          handleDelist={handleDelist}
          handleEnlist={handleEnlist}
        />
      ) : (
        <CreatePlaylistAddSong song={song} />
      )}
    </>
  );
};

export default AddToPlaylist;
