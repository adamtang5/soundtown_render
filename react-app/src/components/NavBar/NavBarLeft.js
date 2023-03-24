import { NavLink, useLocation } from "react-router-dom";
import Logo from "../Icons/Logo";
import SearchBox from "./SearchBox";

const NavBarLeft = () => {
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

export default NavBarLeft;
