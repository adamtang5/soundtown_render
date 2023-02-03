import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditButton from "../Buttons/EditButton";
import EditUserForm from "./EditUserForm";

const UserPageButtonGroup = () => {
  const sessionUser = useSelector(state => state.session.user);
  const { userId } = useParams();
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

  return (
    <div className="user-page-button-group flex-row">
      {sessionUser?.id === +userId ? (
        <EditButton
          showModal={showEditUserModal}
          setShowModal={setShowEditUserModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={<EditUserForm setShowEditUserModal={setShowEditUserModal} />}
        />
      ) : (
        <>
          {/* TODO: FollowButton */}
        </>
      )}
    </div>
  );
};

export default UserPageButtonGroup;
