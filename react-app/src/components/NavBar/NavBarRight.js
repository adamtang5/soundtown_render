import UserProfile from "./UserProfile";
import UploadButton from "./UploadButton";
import { useSelector } from "react-redux";


const NavBarRight = ({ showUploadModal, setShowUploadModal }) => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="UploadUser">
      <UploadButton
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      <div className="user-navdrop-div">
        <UserProfile user={sessionUser} />
      </div>
    </div>
  );
};

export default NavBarRight;
