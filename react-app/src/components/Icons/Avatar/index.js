import { Link } from "react-router-dom";
import "./Avatar.css";

const Avatar = ({ user, isLink }) => {
  const Visual = () => {
    return user?.avatar_url ? (
      <img src={user?.avatar_url} alt={user?.display_name} />
    ) : (
      <div className="avatar-placeholder" />
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
