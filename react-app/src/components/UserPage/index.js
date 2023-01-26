import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, useHistory } from "react-router-dom";
import { editDetails } from "../../store/user-details";
import GridDisplay from "../LibraryPage/Likes/GridDisplay";
import Avatar from "./Avatar";
import BackGroundImage from "./BackgroundHeader";
import "./userpage.css";
import "./user_page.scss";

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[+userId]);

  if (history.location.pathname === `/users/${userId}`) {
    history.push(`/users/${userId}/songs`);
  }

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

  return (
    <>
      <header className="user-page-banner flex-row">
        <div className="user-page-banner-left flex-row">
          {/* TODO: Dynamic Avatar Component*/}
          <h2>{user?.display_name}</h2>
        </div>
        <button className="update-banner-button"></button>
        <input type="file" hidden />
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
