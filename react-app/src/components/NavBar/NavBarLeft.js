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
      <SearchBox />
    </div>
  );
};

export default NavBarLeft;
