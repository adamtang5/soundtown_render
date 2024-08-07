import { Link } from "react-router-dom";
import "./Avatar.css";

const Avatar = ({ user, isLink=false }) => {
  const Visual = () => {
    return user?.avatar_url ? (
      <img
        className="full-box"  
        src={user?.avatar_url}
        alt={user?.display_name}
      />
    ) : (
      <div className="avatar-placeholder full-box" />
    );
  };

  return isLink ? (
    <Link to={`/users/${user?.id}`} className="avatar">
      <Visual />
    </Link>
  ) : (
    <div className="avatar">
      <Visual />
    </div>
  )
};

export default Avatar;
