import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editUserDetails } from "../../store/user";
import DropdownButton from "../Buttons/DropdownButton";
import DynamicImage from "../DynamicImage";
import { Modal } from "../Context/Modal";
import ConfirmModal from "../ConfirmModal";

const UserPageHeader = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[userId]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const avatarInputId = "avatar-url";

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  const updateAvatar = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar_url', file);
      await dispatch(editUserDetails(+userId, formData));
    }
  };

  const confirmDelete = e => {
    setShowConfirmModal(true);
  };

  const deleteAvatarUrl = async (e) => {
    const formData = new FormData();
    formData.append('avatar_url', '');
    await dispatch(editUserDetails(+userId, formData));
    setShowConfirmModal(false);
  };

  const deleteBannerUrl = async (e) => {
    const formData = new FormData();
    formData.append('banner_url', '');
    dispatch(editUserDetails(+userId, formData));
  };

  const updateBannerUrl = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('banner_url', file);
      dispatch(editUserDetails(+userId, formData));
    }
  };

  const updateImageToggleLabel = (
    <>
      <div className="upload-image-camera" />
      <span>Update header image</span>
    </>
  );

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById('banner-url').click();
  };

  const dropdownItems = [
    {
      onClick: handleImageButtonClick,
      label: "Replace header image",
    },
    {
      onClick: deleteBannerUrl,
      label: "Delete header image",
    },
  ];

  const bannerStyle = {
    backgroundImage: `url(${user?.banner_url})`,
  };

  return (
    <header className="user-page-banner">
      <div
        className="banner-bg placeholder"
        style={bannerStyle}
      />
      <div
        className="banner-content flex-row"
      >
        <div className="user-page-banner-left flex-row">
          <DynamicImage
            dimension={200}
            standalone={true}
            entity="user"
            imageUrl={user?.avatar_url}
            hiddenInput={
              <input
                type="file"
                accept="image/*"
                onChange={updateAvatar}
                name={avatarInputId}
                id={avatarInputId}
                hidden
              />
            }
            isAuthorized={sessionUser.id === +userId}
            clickHidden={() => document.getElementById(avatarInputId).click()}
            styleClasses={['button-action', 'b2']}
            uploadLabel="Upload image"
            replaceLabel="Replace image"
            updateLabel="Update image"
            deleteLabel="Delete image"
            beforeLabel="camera-label"
            confirmDelete={confirmDelete}
          />
          <h2>{user?.display_name}</h2>
        </div>
        {sessionUser.id === +userId && (
          <div
            className="hover-animated"
            style={{ width: "200px", height: "200px" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={updateBannerUrl}
              name="banner-url"
              id="banner-url"
              hidden
            />
            {user?.banner_url ? (
              <DropdownButton
                toggleLabel="Update header image"
                toggleClasses={['update-banner-button', 'button-action', 'b2']}
                beforeLabel="camera-label"
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownUlClasses={['menu', 'update-banner-menu']}
                dropdownItems={dropdownItems}
              />
            ) : (
              <button
                className="cursor-pointer flex-row upload-banner-button"
                onClick={handleImageButtonClick}
              >
                <div className="upload-image-camera" />
                <span>Upload header image</span>
              </button>
            )}
          </div>
        )}
      </div>
      {showConfirmModal && (
        <Modal
          onClose={() => setShowConfirmModal(false)}
          position="top"
        >
          <ConfirmModal
            setShowModal={setShowConfirmModal}
            handleDelete={deleteAvatarUrl}
            body={<p>
              Please confirm that you want to delete this image.<br />
              This action cannot be reversed.
            </p>}
          />
        </Modal>
      )}
    </header>
  );
};

export default UserPageHeader;
