import { NavLink, useLocation } from "react-router-dom";
import Logo from "../Icons/Logo";
import SearchBox from "./SearchBox";

const NavBarLeft = () => {
  const location = useLocation();

  const navLink = (label, url) => {
    const className = `navlinks flex-row-center nav-${label.toLowerCase()}`;
    return (
      <NavLink
        className={location.pathname.startsWith(url) ? className + ' active' : className}
        to={url}
        exact={true}
        activeClassName="active"
      >{label}</NavLink>
    );
  };

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
