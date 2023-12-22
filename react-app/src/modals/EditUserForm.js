import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editUser } from "../store/user";
import DynamicImage from "../components/DynamicImage";
import ModalForm from "../components/ModalForm/ModalForm";
import ModalFormInput from "../components/ModalForm/ModalFormInput";

const EditUserForm = ({ setShowEditUserModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const user = useSelector(state => state.users[id]);
  const [errors, setErrors] = useState([]);
  const [displayName, setDisplayName] = useState(user?.display_name);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url);
  const [newAvatar, setNewAvatar] = useState();
  const previewId = "form-preview";

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setDisplayName(user?.display_name);
    setAvatarUrl(user?.avatar_url);
    setShowEditUserModal(false);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("display_name", displayName);
    formData.append("avatar_url", newAvatar || avatarUrl);

    const res = dispatch(editUser(id, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setShowEditUserModal(false);
        history.push(`/users/${id}`);
      }
    }
  };

  const updateImageFile = async (e) => {
    const file = await e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewAvatar(file);
      const img = document.getElementById(previewId);
      fr.onload = () => img.src = fr.result;
    }
  };

  const deleteImageFile = e => {
    setNewAvatar();
    setAvatarUrl('');
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById("image-url").click();
  };

  const buttonGroupData = [
    {
      label: "Save Changes",
      type: "submit",
    },
    {
      label: "Cancel",
      onClick: handleCancel,
      type: "cancel",
    },
  ];

  return (
    <>
      <ModalForm
        entity="user"
        handleSubmit={handleSubmit}
        h2="Edit Your Profile"
        formLeft={<DynamicImage
          dimension={260}
          standalone={false}
          entity="user"
          imageUrl={avatarUrl}
          stagedFile={newAvatar}
          previewId={previewId}
          hiddenInput={<input
            type="file"
            accept="image/*"
            onChange={updateImageFile}
            name="image-url"
            id="image-url"
            hidden
          />}
          isAuthorized={true}
          clickHidden={handleImageButtonClick}
          styleClasses={['button-action', 'b1']}
          uploadLabel="Upload image"
          replaceLabel="Replace Image"
          updateLabel="Update image"
          deleteLabel="Delete image"
          beforeLabel="camera-label"
          handleDelete={deleteImageFile}
        />}
        formRight={<ModalFormInput
          label="Display name"
          value={displayName}
          setValue={setDisplayName}
        />}
        errors={errors}
        buttonGroupData={buttonGroupData}
      />
    </>
  );
};

export default EditUserForm;
