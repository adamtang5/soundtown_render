import React, { useState } from "react";
import { Modal } from "../Context/Modal";
import NavBarLeft from "./NavBarLeft";
import UploadSong from "../SongFolders/UploadSongForm";
import "./NavBar.css";
import NavBarRight from "./NavBarRight";

const NavBar = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <header className="navbar flex-row">
      <NavBarLeft />
      <NavBarRight
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <UploadSong setShowUploadModal={setShowUploadModal} />
        </Modal>
      )}
    </header>
  );
};

export default NavBar;
