import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserDetails } from "../store/user";
import DynamicImage from "./DynamicImage";

const Sandbox = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const songs = useSelector(state => state.songs);
  const [newImage, setNewImage] = useState();

  const updateAvatar = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar_url', file);
      alert(formData);
      setNewImage(file);
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = () => document.getElementById('preview').src = fr.result;
      // dispatch(editUserDetails(sessionUser?.id, formData));
    }
  };

  const confirmDelete = e => {
    alert("Confirm Delete Modal!");
  };

  return (
    <DynamicImage
      dimension={340}
      entity="song"
      imageUrl={songs[1]?.image_url}
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
      isAuthorized={true}
      clickHidden={() => document.getElementById("avatar-url").click()}
      styleClasses={['button-action', 'b2']}
      uploadLabel="Upload image"
      replaceLabel="Replace image"
      updateLabel="Update image"
      deleteLabel="Delete image"
      beforeLabel="camera-label"
      confirmDelete={confirmDelete}
    />
  );
};

export default Sandbox;
