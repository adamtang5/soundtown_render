import React, { useState } from "react";
import EditPlaylistForm from "../EditPlaylistForm";
import AllTracksModal from "./AllTracksModal";
import "./AddEditPlaylist.css";

const EditPlaylistModal = ({ setShowModal, songArr }) => {
  const [mode, setMode] = useState("basic");

  const navData = [
    {
      mode: 'basic',
      label: 'Basic info',
    },
    {
      mode: 'tracks',
      label: 'Tracks',
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

      {mode === "basic" ? (
        <EditPlaylistForm setShowModal={setShowModal} />
      ) : (
        <AllTracksModal songArr={songArr} />
      )}
    </>
  );
};

export default EditPlaylistModal;
