import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editUserDetails } from "../../store/user";
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


  return (
    <form
      onSubmit={handleSubmit}
      id="edit-user"
      className="modal-form"
    >
      <h2>Edit Your Profile</h2>
      <fieldset className="edit-form-container flex-row">
        <div className="edit-user-left flex-column">
          <DynamicAvatar />
        </div>
        <div className="edit-song-left flex-column">
          <ModalFormInput
            label="Display name"
            value={displayName}
            setValue={setDisplayName}
          />
        </div>
      </fieldset>
      <footer>
        <div className="error-block">
          {errors?.map((error, idx) => (
            <div className="error-text" key={idx}>{error}</div>
          ))}
        </div>
        <div className="form-action flex-row">
          <div className="legend-required">Required fields</div>
          <div className="form-action-buttons flex-row">
            <button
              className="cursor-pointer simple-button button-cancel"
              onClick={handleCancel}
            >Cancel</button>
            <button
              className="cursor-pointer simple-button button-submit"
              type="submit"
            >Save Changes</button>
          </div>
        </div>
      </footer>
    </form>
  );
};

export default EditUserForm;
