import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { createPlaylist, addSongToPlaylist } from "../../../store/playlist";
import ModalFormFooter from "../../ModalForm/ModalFormFooter";
import ModalFormInput from "../../ModalForm/ModalFormInput";

const CreatePlaylistAddSong = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const stateSongs = useSelector(state => state.songs);
  const [title, setTitle] = useState("");
  const [songsOrder, setSongsOrder] = useState([song?.id]);
  const [stagingList, setStagingList] = useState([song?.id, -3, -2, -1]);

  const [newPlaylistId, setNewPlaylistId] = useState("");

  const [playlistBtn, setPlaylistBtn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("title", title);

    const playlist = await dispatch(createPlaylist(formData));

    formData = new FormData();

    formData.append("playlist_id", playlist?.id);
    formData.append("song_id", song?.id);
    await dispatch(addSongToPlaylist(formData));
  };

  const removeSong = id => {
    const newSongsOrder = songsOrder.filter(songId => songId !== id);
    setSongsOrder(newSongsOrder);
    convertSongsOrder2StagingList(convertSongsOrder2StagingList(newSongsOrder));
  };

  const convertSongsOrder2StagingList = songsOrder => {
    const stagingList = [-4, -3, -2, -1];
    songsOrder.forEach((songId, idx) => stagingList[idx] = songId);
    setStagingList(stagingList);
  }

  const buttonGroupData = [
    {
      label: "Save",
      type: "submit",
    },
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="modal-form flex-column"
        style={{ minHeight: "100px" }}
      >
        <ModalFormInput
          label="Playlist title"
          value={title}
          setValue={setTitle}
        />
        <ModalFormFooter
          buttonGroupData={buttonGroupData}
          xPadding={0}
        />
      </form>

      {playlistBtn && (
        <NavLink to={`/playlists/${newPlaylistId}`} className="atp_bc atp_bsp">
          Go to playlist
        </NavLink>
      )}

      <ul className="new-playlist-staging">
        {stagingList?.map(songId => (
          <li
            className="full-width flex-row"
            key={songId}
          >
            {songId > 0 ? (
              <>
                <img
                  src={stateSongs[songId]?.image_url}
                  alt={stateSongs[songId]?.title}
                  style={{ width: "20px", height: "20px" }}
                />
                <div className="song-row-right full-width flex-row">
                  <div className="song-row-details">
                    <span className="song-row-artist">
                      {stateSongs[songId]?.description}
                    </span> - <span className="song-row-title">
                      {stateSongs[songId]?.title}
                    </span>
                  </div>
                  <button
                    className="song-row-actions"
                    onClick={() => removeSong(songId)}
                  >
                    <IoCloseOutline
                      className="cursor-pointer"
                      style={{ width: "18px", height: "18px" }}
                    />
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </li>
        ))}
      </ul>

      <footer className="recommendation">
        <p>Looking for more tracks? Add some from your likes.</p>
        <ul className="new-playlist-recommendation">

        </ul>
      </footer>
    </>
  );
};

export default CreatePlaylistAddSong;
