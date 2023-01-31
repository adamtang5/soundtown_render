import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editUserDetails } from "../../store/user";
import ModalForm from "../ModalForm/ModalForm";
import ModalFormInput from "../ModalForm/ModalFormInput";
import DynamicAvatar from "./DynamicAvatar";

const EditUserForm = ({ setShowEditUserModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const user = useSelector(state => state.users[+userId]);
  const [errors, setErrors] = useState([]);
  const [displayName, setDisplayName] = useState(user?.display_name);

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setDisplayName(user?.display_name);
    setShowEditUserModal(false);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("display_name", displayName);

    const res = dispatch(editUserDetails(+userId, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setShowEditUserModal(false);
        history.push(`/users/${userId}`);
      }
    }
  };

  const buttonGroupData = [
    {
      label: "Save Changes",
      type: "submit",
    },
    {
      label: "Cancel",
      type: handleCancel,
    },
  ];

  return (
    <>
      <ModalForm
        entity="user"
        handleSubmit={handleSubmit}
        h2="Edit Your Profile"
        formLeft={<DynamicAvatar />}
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
