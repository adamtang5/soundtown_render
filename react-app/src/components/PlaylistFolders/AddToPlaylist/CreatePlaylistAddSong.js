import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { createPlaylist, addSongToPlaylist } from "../../../store/playlist";
import ModalFormFooter from "../../ModalForm/ModalFormFooter";
import ModalFormInput from "../../ModalForm/ModalFormInput";

const CreatePlaylistAddSong = ({ song }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const [title, setTitle] = useState("");

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

      <div className="atp_ul_conatiner">
        <ul>
          <li className="atp_li_container">
            <div className="flex-row inner_create_playlist_song">
              <div className="flex-row">
                <img
                  src={song?.image_url}
                  className="create_playlist_song_img"
                  alt={song?.title}
                />
                <p>{song?.title}</p>
              </div>
              {/* <span onClick={test(idx)}>&#10005;</span> */}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default CreatePlaylistAddSong;
