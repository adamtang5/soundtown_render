import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SidebarPlaylist = ({ playlist }) => {
  const user = useSelector(state => state.users[playlist?.user_id]);
  return (
    <li className="sidebar-row flex-row">
      <div className="sidebar-cover-bg">
        <img
          src={playlist?.image_url}
          className="sidebar-cover"
          alt=""
        />
      </div>
      <div className="sidebar-details flex-column">
        <Link to={`/users/${playlist?.user_id}`}>
          <h3>{user?.display_name}</h3>
        </Link>
        <Link to={`/playlists/${playlist?.id}`}>
          {playlist?.title}
        </Link>
        <Link to={`/playlists/${playlist?.id}`}>
          <footer className="logo-before heart-label">
            {playlist?.likes?.length}
          </footer>
        </Link>
      </div>
    </li>
  );
};

export default SidebarPlaylist;
