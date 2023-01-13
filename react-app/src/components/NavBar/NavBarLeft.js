import { NavLink } from "react-router-dom";
import Logo from "../Icons/Logo";
import SearchBox from "./SearchBox";

const navLink = (label, url) => (
  <NavLink
    className={`navlinks flex-row-center nav-${label.toLowerCase()}`}
    to={url}
    exact={true}
    activeClassName="active"
  >{label}</NavLink>
);

const NavBarLeft = () => {
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
      {navLink("Home", "/home")}
      {navLink("Explore", "/explore")}
      {navLink("Library", "/library")}
      <SearchBox />
    </div>
  );
};

export default NavBarLeft;
