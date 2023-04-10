import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../Context/Modal";
import UploadButton from "./UploadButton";
import UploadSongForm from "../../modals/UploadSongForm";
import UserProfile from "./UserProfile";

const NavBarRight = () => {
  const sessionUser = useSelector(state => state.session.user);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="navbar-right">
      <UploadButton
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      {showUploadModal && (
        <Modal
          onClose={() => setShowUploadModal(false)}
          position="center"
          paddingTop={0}
        >
          <UploadSongForm setShowUploadModal={setShowUploadModal} />
        </Modal>
      )}
      <div className="user-navdrop-div">
        <UserProfile user={sessionUser} />
      </div>
    </div>
  );
};

export default NavBarRight;
