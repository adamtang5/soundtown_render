import React, { useState } from "react";
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
  // const currentDetails = useSelector((state) => state.details[userId]);

  // const [displayName, setDisplayName] = useState(currentDetails?.display_name);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url);
  const [newAvatar, setNewAvatar] = useState();
  const [activity, setActivity] = useState(false);
  const [displayBox, setDisplayBox] = useState(false);

  const updateImageToggleLabel = (
    <>
      <div className="upload-image-camera" />
      <span>Update image</span>
    </>
  );

  const deleteAvatarUrl = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar_url', '');
    dispatch(editUserDetails(+userId, formData));
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
  ]
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("avatar_url", avatarUrl);

    dispatch(editUserDetails(+userId, formData));

    // setAvatarUrl("")
    setActivity(false)
    setDisplayBox(false);
  };

  const updateAvatarUrl = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewAvatar(file);
      const img = document.getElementById("upload-image");
      fr.onload = () => img.src = fr.result;
    }
    // setAvatarUrl(file);
  };

  const updateActivity = (e) => {
    if (e.target.files) {
      setActivity(true);
    } else {
      setActivity(false);
    }
  };

  const checkDisplayName = (e) => {
    if (e) {
      setDisplayBox(true);
    } else {
      setDisplayBox(false);
    }
  };

  return (
    <>
      <div className="dynamic-avatar-placeholder placeholder">
        <img
          id="upload-image"
          alt=""
          className="dynamic-avatar-image"
          src={user?.avatar_url}
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
            {newAvatar || user?.avatar_url ? (
              <DropdownButton
                toggleLabel={updateImageToggleLabel}
                toggleClasses={['cursor-pointer', 'image-button', 'flex-row', 'update-image-button']}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownUlClasses={['menu', 'update-image-menu']}
                dropdownItems={dropdownItems}
              />
              // <button
              //   className="cursor-pointer image-button flex-row update-image-button"
              //   onClick={handleImageButtonClick}
              // >
              //   <div className="upload-image-camera" />
              //   <span>Update image</span>
              // </button>
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

      {/* <div className="avatardiv placeholderDiv">
        <form onSubmit={(e) => handleSubmit(e)} id="submitDetailsForm">
          <img
            src={currentDetails?.avatar_url}
            className="userImage "
            onChange={(e) => (updateAvatarUrl(e), updateActivity(e))}
          />
          {sessionUser.id === +userId ?
            <>
              <input
                className="chooseFileAvatar"
                type="file"
                accept="image/*"
                onChange={(e) => (updateAvatarUrl(e), updateActivity(e))}
                name="avatar-url"
                id="avatar-url"
              />
            </>
            :
            <>
            </>
          }
          {activity ?
            <>
              <div className="submitFormDiv">
                <button
                  className="btn"
                  type="submit"
                  onClick={() => (
                    checkDisplayName(displayName)
                  )}
                >
                  Submit
                </button>
              </div>
            </>
            : (
              <></>
            )}
        </form>
        <DisplayName />
      </div> */}
    </>
  );
};

export default DynamicAvatar;
