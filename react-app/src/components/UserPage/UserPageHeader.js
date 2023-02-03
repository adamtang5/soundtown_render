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
  const [showAvatarConfirmModal, setShowAvatarConfirmModal] = useState(false);
  const [showBannerConfirmModal, setShowBannerConfirmModal] = useState(false);
  const avatarInputId = "avatar-url";
  const bannerInputId = "banner-url";

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

  const deleteAvatarUrl = async (e) => {
    const formData = new FormData();
    formData.append('avatar_url', '');
    await dispatch(editUserDetails(+userId, formData));
    setShowAvatarConfirmModal(false);
  };

  const deleteBannerUrl = async (e) => {
    const formData = new FormData();
    formData.append('banner_url', '');
    await dispatch(editUserDetails(+userId, formData));
    setShowBannerConfirmModal(false);
  };

  const updateBannerUrl = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('banner_url', file);
      dispatch(editUserDetails(+userId, formData));
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById(bannerInputId).click();
  };

  const dropdownItems = [
    {
      onClick: handleImageButtonClick,
      label: "Replace header image",
    },
    {
      onClick: () => setShowBannerConfirmModal(true),
      label: "Delete header image",
    },
  ];

  const bannerStyle = {
    backgroundImage: `url(${user?.banner_url})`,
  };

  const ConfirmDeleteModal = ({
    showModal,
    setShowModal,
    handleDelete,
    entity,
  }) => {
    return showModal && (
      <Modal
        onClose={() => setShowModal(false)}
        position="top"
      >
        <ConfirmModal
          setShowModal={setShowModal}
          handleDelete={handleDelete}
          body={<p>
            Please confirm that you want to delete this {entity}.<br />
            This action cannot be reversed.
          </p>}
        />
      </Modal>
    );
  };

  return (
    <header className="user-page-banner">
      <div
        className="banner-bg placeholder"
        style={user?.banner_url ? bannerStyle : {}}
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
            styleClasses={['button-action', 'b1']}
            uploadLabel="Upload image"
            replaceLabel="Replace image"
            updateLabel="Update image"
            deleteLabel="Delete image"
            beforeLabel="camera-label"
            confirmDelete={() => setShowAvatarConfirmModal(true)}
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
              name={bannerInputId}
              id={bannerInputId}
              hidden
            />
            {user?.banner_url ? (
              <DropdownButton
                toggleLabel="Update header image"
                toggleClasses={['update-banner-button', 'button-action', 'b1']}
                beforeLabel="camera-label"
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownUlClasses={['menu', 'update-banner-menu']}
                dropdownItems={dropdownItems}
              />
            ) : (
              <button
                className="cursor-pointer composite-button upload-banner-button button-action b1"
                onClick={handleImageButtonClick}
              >
                <div className="logo-before camera-label">Upload header image</div>
              </button>
            )}
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        showModal={showAvatarConfirmModal}
        setShowModal={setShowAvatarConfirmModal}
        handleDelete={deleteAvatarUrl}
        entity="image"
      />
      <ConfirmDeleteModal
        showModal={showBannerConfirmModal}
        setShowModal={setShowBannerConfirmModal}
        handleDelete={deleteBannerUrl}
        entity="image"
      />
    </header>
  );
};

export default UserPageHeader;
