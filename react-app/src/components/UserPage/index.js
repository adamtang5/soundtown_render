import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { getAllUsers } from "../../store/user";
import { editDetails } from "../../store/user-details";
import Avatar from "../Icons/Avatar";
import DynamicAvatar from "./DynamicAvatar";
import "./UserPage.css";

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[+userId]);

  if (history.location.pathname === `/users/${userId}`) {
    history.push(`/users/${userId}/songs`);
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const updateAvatar = async (e) => {
    e.preventDefault();

    const avatarFile = e.target.files[0];
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('display_name', user.display_name);
    formData.append('avatar_url', avatarFile);

    dispatch(editDetails(formData));
  };

  const updateBanner = async (e) => {
    e.preventDefault();

    const bannerFile = e.target.files[0];
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('display_name', user.display_name);
    formData.append('banner_url', bannerFile);

    dispatch(editDetails(formData));
  };

  const bannerStyle = {
    backgroundImage: `url(${user?.banner_url})`,
  };

  return (
    <>
      <header className="user-page-banner">
        <div
          className="banner-bg"
          style={bannerStyle}
        />
        <div
          className="banner-content flex-row"
        >
          <div className="user-page-banner-left flex-row">
            {/* <Avatar user={user} isLink={false} /> */}
            <DynamicAvatar />
            <h2>{user?.display_name}</h2>
          </div>
          <button className="update-banner-button">Upload header image</button>
          <input type="file" hidden />
        </div>
      </header>
      <div className="page-container flex-row">
        <main className="user-page-main flex-row">
          <nav className="sticky-nav">
            <ul className="flex-row">
              {/* TODO: Tracks, Playlists */}
            </ul>
          </nav>
        </main>
        <aside className="user-page-summary">
          {/* TODO: Stats */}
          {/* TODO: Likes */}
          {/* TODO: Following */}
          {/* TODO: Comments */}
          {/* TODO: Legal */}
        </aside>
      </div>
    </>
  );
};

export default UserPage;
