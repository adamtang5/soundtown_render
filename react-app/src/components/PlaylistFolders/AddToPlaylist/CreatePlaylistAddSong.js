import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPlaylist } from "../../../store/playlist";
import { randomSample } from "../../../util";
import ModalFormFooter from "../../ModalForm/ModalFormFooter";
import ModalFormInput from "../../ModalForm/ModalFormInput";
import AssetCard from "../../Modules/AssetCard";
import PlayCover from "../../Modules/PlayCover";

const CreatePlaylistAddSong = ({ song, setShowModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const stateUsers = useSelector(state => state.users);
  const stateSongs = useSelector(state => state.songs);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const [songsOrder, setSongsOrder] = useState([song?.id]);
  const [stagingList, setStagingList] = useState([song?.id, -3, -2, -1]);
  const [likedSamples, setLikedSamples] = useState(
    randomSample(stateUsers[sessionUser.id].likes
      .filter(id => !songsOrder.includes(id))
      .map(id => stateSongs[id]), 3));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("user_id", sessionUser.id);
    formData.append("title", title);
    formData.append("songs_order", JSON.stringify(songsOrder));

    const res = await dispatch(createPlaylist(formData));
    if (res) {
      if (res.errors) {
        setErrors(res.erros);
      } else {
        setShowModal(false);
        history.push(`/playlists/${res.id}`);
      }
    }
  };

  const addSong = id => {
    const newSongsOrder = [...songsOrder, id];
    setSongsOrder(newSongsOrder);
    convertSongsOrder2StagingList(newSongsOrder);
    setLikedSamples(orig => orig.filter(song => song.id !== id));
  };

  const removeSong = id => {
    const newSongsOrder = songsOrder.filter(songId => songId !== id);
    setSongsOrder(newSongsOrder);
    convertSongsOrder2StagingList(newSongsOrder);
    if (stateUsers[sessionUser.id].likes.includes(id)) {
      setLikedSamples(orig => [...orig, stateSongs[id]]);
    }
  };

  const convertSongsOrder2StagingList = songsOrder => {
    const stagingList = [-4, -3, -2, -1];
    songsOrder.forEach((songId, idx) => stagingList[idx] = songId);
    setStagingList(stagingList);
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
        style={{ minHeight: "130px" }}
      >
        <ModalFormInput
          label="Playlist title"
          value={title}
          setValue={setTitle}
        />
        <ModalFormFooter
          buttonGroupData={buttonGroupData}
          xPadding={0}
          errors={errors}
        />
      </form>

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
        <ul className="asset-ul">
          {likedSamples?.slice(0, 3).map(song => (
            <AssetCard
              key={song?.id}
              entity="song"
              asset={song}
              assetCover={
                <PlayCover
                  entity="song"
                  asset={song}
                  dimension={50}
                  isOverlay={false}
                />}
              user={stateUsers[song?.user_id]}
              buttonGroupData={[{
                label: "Add to playlist",
                onClick: () => addSong(song?.id),
              }]}
            />
          ))}
        </ul>
      </footer>
    </>
  );
};

export default CreatePlaylistAddSong;
