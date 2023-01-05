import { NavLink } from "react-router-dom";
import Logo from "../Icons/Logo";
import SearchBox from "./SearchBox";

const NavBarLeft = () => {
  return (
    <div className="HomeLinkDiv flex-row-center">
      <NavLink
        className="nav-logo flex-row-center"
        to="/"
        exact={true}
        activeClassName="activeNav"
      >
        <Logo />
      </NavLink>
      <NavLink
        className="navlinks nav-home flex-row-center"
        to="/"
        exact={true}
        activeClassName="activeNav"
      >
        Home
      </NavLink>
      <NavLink
        className="navlinks stream flex-row-center"
        to="/explore/songs"
        exact={true}
        activeClassName="activeNav"
      >
        Stream
      </NavLink>
      <NavLink
        className="navlinks library flex-row-center"
        to="/library/songs"
        exact={true}
        activeClassName="activeNav"
      >
        Library
      </NavLink>
      <SearchBox />
    </div>
  );
};

export default NavBarLeft;
