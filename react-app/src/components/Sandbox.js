import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserDetails } from "../store/user";
import DynamicImage from "./DynamicImage";

const Sandbox = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [newImage, setNewImage] = useState();

  const updateAvatar = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar_url', file);
      dispatch(editUserDetails(sessionUser?.id, formData));
    }
  };

  return (
    <div style={{ height: "200px", width: "200px" }}>
      <DynamicImage
        entity="user"
        imageUrl={sessionUser?.avatar_url}
        stagedFile={newImage}
        hiddenInput={
          <input
            type="file"
            accept="image/*"
            onChange={updateAvatar}
            name="avatar-url"
            id="avatar-url"
            hidden
          />
        }
        clickHidden={() => document.getElementById("avatar-url").click()}
        styleClasses={['button-action', 'b2']}
        uploadLabel="Upload image"
        replaceLabel="Update image"
        beforeLabel="camera-label"
      />
    </div>
  );
};

export default Sandbox;
