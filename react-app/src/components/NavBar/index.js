import NavBarLeft from "./NavBarLeft";
import NavBarRight from "./NavBarRight";
import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="navbar-bg">
      <div className="navbar flex-row">
        <NavBarLeft />
        <NavBarRight />
      </div>
    </header>
  );
};

export default NavBar;
