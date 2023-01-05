import { NavLink } from "react-router-dom";
import Logo from "../Icons/Logo";
import SearchBox from "./SearchBox";

const navLink = (label, url) => (
  <NavLink
    className={`navlinks flex-row-center nav-${label.toLowerCase()}`}
    to={url}
    exact={true}
    activeClassName="activeNav"
  >{label}</NavLink>
);

const NavBarLeft = () => {
  return (
    <div className="navbar-left flex-row">
      <NavLink
        className="nav-logo"
        to="/"
        exact={true}
        activeClassName="activeNav"
      >
        <Logo />
      </NavLink>
      {navLink("Home", "/")}
      {navLink("Stream", "/explore/songs")}
      {navLink("Library", "/library/songs")}
      {/* <NavLink
        className="navlinks nav-home flex-row"
        to="/"
        exact={true}
        activeClassName="activeNav"
      >
        Home
      </NavLink>
      <NavLink
        className="navlinks stream flex-row"
        to="/explore/songs"
        exact={true}
        activeClassName="activeNav"
      >
        Stream
      </NavLink>
      <NavLink
        className="navlinks library flex-row"
        to="/library/songs"
        exact={true}
        activeClassName="activeNav"
      >
        Library
      </NavLink> */}
      <SearchBox />
    </div>
  );
};

export default NavBarLeft;
