import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { createPlaylist, editPlaylist } from "../store/playlist";
import { randomSample } from "../util";
import { IoCloseOutline } from "react-icons/io5";
import ModalFormFooter from "../components/ModalForm/ModalFormFooter";
import ModalFormInput from "../components/ModalForm/ModalFormInput";
import ToggleButton from "../components/Buttons/ToggleButton";
import AssetCard from "../components/Modules/AssetCard";
import PlayCover from "../components/Modules/PlayCover";
import "./ModalNav.css";
import "./AddSongToPlaylist.css";
import { authenticate } from "../store/session";

const AddToExistingPlaylist = ({
  term,
  setTerm,
  playlists,
  song,
  handleToggle,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
    })();
  }, [dispatch]);  

  const baseClasses = ['cursor-pointer', 'composite-button'];

  return (
    <main>
      <input
        className="playlist-modal-search full-width"
        value={term}
        placeholder="Filter playlist"
        onChange={(e) => setTerm(e.target.value.toLowerCase())}
      />
      <ul className="playlist-modal-results flex-column">
        {playlists?.filter(pl => pl?.title?.toLowerCase()?.includes(term))
          .map((pl, idx) => (
            <li key={idx} className="full-width flex-row">
              <img
                className="modal-results-left"
                src={pl?.image_url || pl?.alt_image_url}
                alt={pl?.title}
              />
              <div className="modal-results-right flex-row full-width">
                <div className="modal-results-data flex-column">
                  <Link to={`/playlists/${pl?.id}`}>
                    {pl?.title}
                  </Link>
                  <Link
                    className="info-text l3"
                    to={`/playlists/${pl?.id}`}
                  >
                    <div className="logo-before flex-row waveform-label">
                      {pl?.songs?.length}
                    </div>
                  </Link>
                </div>
                <div className="modal-results-action">
                  <ToggleButton
                    condition={pl?.songs_order.includes(song?.id)}
                    buttonClasses={[...baseClasses, 'b2']}
                    handleToggle={() => handleToggle(pl, song)}
                    onLabel="Added"
                    offLabel="Add to playlist"
                  />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </main>
  );
};

const AddToNewPlaylist = ({ song, setShowModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const stateSongs = useSelector(state => state.songs);
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const [songsOrder, setSongsOrder] = useState([song?.id]);
  const [stagingList, setStagingList] = useState([song?.id, 1, 2, 3]);
  const [likedSamples, setLikedSamples] = useState(
    randomSample(sessionUser?.likes
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
        setErrors(res.errors);
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
    setLikedSamples(orig => orig.filter(song => song?.id !== id));
  };

  const removeSong = id => {
    const newSongsOrder = songsOrder.filter(songId => songId !== id);
    setSongsOrder(newSongsOrder);
    convertSongsOrder2StagingList(newSongsOrder);
    if (sessionUser?.likes?.includes(id)) {
      setLikedSamples(orig => [...orig, stateSongs[id]]);
    }
  };

  const convertSongsOrder2StagingList = songsOrder => {
    const stagingList = [0, 1, 2, 3];
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
            {typeof(songId) === "string" ? (
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
              user={song?.user}
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

const AddSongToPlaylist = ({ song, setShowModal }) => {
  const dispatch = useDispatch();
  const [term, setTerm] = useState("");
  const [mode, setMode] = useState("add");
  const sessionUser = useSelector(state => state.session.user);

  const handleToggle = async (playlist, song) => {
    const formData = new FormData();
    formData.append("user_id", sessionUser?.id);
    formData.append("title", playlist?.title);
    formData.append("description", playlist?.description || '');

    const newSongsOrder = playlist?.songs_order?.includes(song?.id) ?
      playlist?.songs_order?.filter(id => id !== song?.id) :
      [...playlist?.songs_order, song?.id];
    formData.append("songs_order", JSON.stringify(newSongsOrder));

    const res = await dispatch(editPlaylist(playlist?.id, formData));
    if (res) await dispatch(authenticate());
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
    <div className="playlist-modal-container">
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
        <AddToExistingPlaylist
          term={term}
          setTerm={setTerm}
          playlists={sessionUser?.playlists}
          song={song}
          handleToggle={handleToggle}
        />
      ) : (
        <AddToNewPlaylist
          song={song}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default AddSongToPlaylist;
