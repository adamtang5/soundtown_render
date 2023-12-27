import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { editPlaylist } from "../../../store/playlist";

const AllTracksModal = ({ songArr }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const statePlaylists = useSelector(state => state.playlists);

  const handleDelist = async (playlistId, songId) => {
    const formData = new FormData();
    const playlist = statePlaylists[playlistId];

    formData.append("title", playlist?.title);
    formData.append("description", playlist?.description || '');
    formData.append(
      "songs_order",
      JSON.stringify(playlist?.songs_order.filter(id => id !== songId))
    );

    const res = await dispatch(editPlaylist(playlistId, formData));
    if (res) return res;
  };

  return (
    <div className="AEP_track_container">
      <ul>
        {songArr?.map((song) => (
          <li key={song?.id} className="AEP_li flex-row">
            <div className="flex-row">
              <img src={song?.image_url} className="AEP_li_img" alt={song?.title} />
              <NavLink to={`/songs/${song?.id}`}>{song?.title}</NavLink>
            </div>
            <p
              onClick={handleDelist}
              className="AEP_li_x"
            >
              &#10005;
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllTracksModal;
