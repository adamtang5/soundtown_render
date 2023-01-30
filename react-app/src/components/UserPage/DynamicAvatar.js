import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editUserDetails } from "../../store/user";
import DropdownButton from "../Buttons/DropdownButton";
import "./UserPage.css";

const DynamicAvatar = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[+userId]);
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

  const updateImageToggleLabel = (
    <>
      <div className="upload-image-camera" />
      <span>Update image</span>
    </>
  );

  const deleteAvatarUrl = async (e) => {
    const formData = new FormData();
    formData.append('avatar_url', '');
    dispatch(editUserDetails(+userId, formData));
  };

  const updateAvatarUrl = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar_url', file);
      dispatch(editUserDetails(+userId, formData));
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById("avatar-url").click();
  };

  const dropdownItems = [
    {
      onClick: handleImageButtonClick,
      label: "Replace image",
    },
    {
      onClick: deleteAvatarUrl,
      label: "Delete image",
    },
  ];

  return (
    <>
      <div className="dynamic-avatar-placeholder placeholder">
        <img
          className={`dynamic-avatar-image ${user?.avatar_url ? 'white-bg' : ''}`}
          src={user?.avatar_url}
          alt=""
        />
        {sessionUser.id === +userId && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={updateAvatarUrl}
              name="avatar-url"
              id="avatar-url"
              hidden
            />
            {user?.avatar_url ? (
              <DropdownButton
                toggleLabel={updateImageToggleLabel}
                toggleClasses={['cursor-pointer', 'image-button', 'flex-row', 'update-image-button']}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownUlClasses={['menu', 'update-image-menu']}
                dropdownItems={dropdownItems}
              />
            ) : (
              <button
                className="cursor-pointer image-button flex-row upload-image-button"
                onClick={handleImageButtonClick}
              >
                <div className="upload-image-camera" />
                <span>Upload image</span>
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DynamicAvatar;