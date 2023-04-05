import { NavLink } from "react-router-dom";

const StickyNav = ({
  navData,
  optComp,
}) => {
  const spaceBtnStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  return (
    <>
      <nav
        className="sticky-nav"
        style={optComp ? spaceBtnStyle : {}}
      >
        <ul className="flex-row">
          {navData.map(data => (
            <li key={data.label}>
              <NavLink to={data.to} activeClassName="active">
                {data.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {optComp || null}
      </nav>
    </>
  );
};

export default StickyNav;
