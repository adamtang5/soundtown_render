import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { editUserDetails, getAllUsers } from "../../store/user";
import DropdownButton from "../Buttons/DropdownButton";
import DynamicAvatar from "./DynamicAvatar";
import "./UserPage.css";

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[userId]);
  const [showDropdown, setShowDropdown] = useState(false);

  if (history.location.pathname === `/users/${userId}`) {
    history.push(`/users/${userId}/songs`);
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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
    <>
      <header className="user-page-banner placeholder">
        <div
          className="banner-bg"
          style={bannerStyle}
        />
        <div
          className="banner-content flex-row"
        >
          <div className="user-page-banner-left flex-row">
            <DynamicAvatar />
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
      <div className="page-container flex-row">
        <main className="user-page-main flex-row">
          <nav className="sticky-nav">
            <ul className="flex-row">
              {/* TODO: Tracks, Playlists */}
            </ul>
          </nav>
        </main>
        <aside className="user-page-summary">
          {/* TODO: Stats */}
          {/* TODO: Likes */}
          {/* TODO: Following */}
          {/* TODO: Comments */}
          {/* TODO: Legal */}
        </aside>
      </div>
    </>
  );
};

export default UserPage;
