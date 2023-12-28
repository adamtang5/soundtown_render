import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { Modal } from "../Context/Modal";
import { clearPlayer } from "../../store/player";
import { logout } from "../../store/session";
import Logo from "../Icons/Logo";
import { GoChevronDown } from "react-icons/go";
import { ImUser } from "react-icons/im";
import { BiLogOut } from "react-icons/bi";
import { RiHeartsFill, RiFoldersFill } from "react-icons/ri";
import SearchBox from "./SearchBox";
import UploadButton from "./UploadButton";
import UploadSongForm from "../../modals/UploadSongForm";
import "./NavBar.css";

const Left = () => {
  const location = useLocation();

  const navLink = (label, url) => {
    return (
      <NavLink
        className="navlinks flex-row-center"
        to={url}
        exact={true}
        activeClassName="active"
      >{label}</NavLink>
    );
  };

  const navLinksData = [
    {
      label: 'Home',
      url: '/home',
    },
    {
      label: 'Explore',
      url: '/explore',
    },
    {
      label: 'Library',
      url: '/library',
    },
  ]

  return (
    <div className="navbar-left flex-row">
      <NavLink
        className="nav-logo"
        to="/"
        exact={true}
        activeClassName="active"
      >
        <Logo />
      </NavLink>

      <ul className="navbar-links flex-row">
        {navLinksData.map(data => (
          <li
            key={data.label}
            className={`navbar-link flex-row ${location.pathname.startsWith(data.url) ? 'active' : ''}`}
          >
            {navLink(data.label, data.url)}
          </li>
        ))}
      </ul>

      <SearchBox />
    </div>
  );
};

const Right = () => {
  const sessionUser = useSelector(state => state.session.user);
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="navbar-right">
      <UploadButton
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      {showUploadModal && (
        <Modal
          onClose={() => setShowUploadModal(false)}
          position="center"
          paddingTop={0}
        >
          <UploadSongForm setShowUploadModal={setShowUploadModal} />
        </Modal>
      )}
      <div className="user-navdrop-div">
        <ProfileDropdown user={sessionUser} />
      </div>
    </div>
  );
};

const ProfileDropdown = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const onLogout = () => {
    dispatch(clearPlayer());
    dispatch(logout());
  };

  return (
    <div>
      <div
        onClick={openMenu}
        className="user-profile-div"
        style={{ background: `${showMenu ? '#111' : ''}` }}
      >
        <div className="user-profile-dis-avtr flex-row-center">
          <img
            src={sessionUser?.avatar_url}
            alt={sessionUser?.display_name}
          />
        </div>
        <div
          className="user-profile-dis-name flex-row-center"
        > {sessionUser.display_name} <GoChevronDown className="go-icon" /> </div>
      </div>
      <div className="nav-dropdown">
        {showMenu && (
          <div className="nav-profile-dropdown">
            <div className="dropdown-links cursor-pointer">
              <NavLink
                to={`/users/${user?.id}`}
                exact={true}
                className='drop-nav-links'
              > <ImUser className="prof-icon" /> Profile </NavLink>
            </div>
            <div className="dropdown-links cursor-pointer">
              <NavLink
                to={`/library/likes`}
                exact={true}
                className='drop-nav-links'
              > <RiHeartsFill className="prof-icon" /> Likes </NavLink>
            </div>
            <div className="dropdown-links cursor-pointer">
              <NavLink
                to={`/library/playlists`}
                exact={true}
                className='drop-nav-links'
              > <RiFoldersFill className="prof-icon" /> Playlists </NavLink>
            </div>
            <div
              className="cursor-pointer dropdown-links"
              onClick={onLogout}
            >
              <span className='drop-nav-links'>
                <BiLogOut className="prof-icon" /> Log Out
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavBar = () => {
  return (
    <header className="navbar-bg">
      <div className="navbar flex-row">
        <Left />
        <Right />
      </div>
    </header>
  );
};

export default NavBar;
