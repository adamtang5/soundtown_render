import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editUserDetails } from "../../store/user";
import DropdownButton from "../Buttons/DropdownButton";
import DynamicAvatar from "./DynamicAvatar";

const UserPageHeader = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[userId]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

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
    <header className="user-page-banner placeholder">
      <div
        className="banner-bg"
        style={bannerStyle}
      />
      <div
        className="banner-content flex-row"
      >
        <div className="user-page-banner-left flex-row">
          <div style={{ height: "200px", width: "200px" }}>
            <DynamicAvatar />
          </div>
          <h2>{user?.display_name}</h2>
        </div>
        {sessionUser.id === +userId && (
          <>
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
                toggleLabel={updateImageToggleLabel}
                toggleClasses={['cursor-pointer', 'flex-row', 'update-banner-button']}
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
          </>
        )}
      </div>
    </header>
  );
};

export default UserPageHeader;
