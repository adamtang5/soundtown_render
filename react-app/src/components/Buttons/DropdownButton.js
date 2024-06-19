import { useDispatch, useSelector } from "react-redux";
import { showAllDropdowns, hideAllDropdowns } from "../../store/dropdown";

const DropdownButton = ({
  toggleLabel,
  toggleClasses = [],
  labelSize = "",
  beforeLabel,
  showDropdown,
  setShowDropdown,
  dropdownUlClasses,
  dropdownItems,
}) => {
  const dispatch = useDispatch();
  const showing = useSelector(state => state.dropdown.showing);
  const ulStyle = {
    position: "absolute",
  };

  const handleDropdownClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (showDropdown) {
      dispatch(hideAllDropdowns());
    } else {
      dispatch(showAllDropdowns());
    }
    setShowDropdown(!showDropdown);
  };

  const toggleBaseClasses = ['cursor-pointer', 'composite-button'];
  const toggleLabelBaseClasses = ['logo-before'];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleDropdownClick}
        className={[...toggleBaseClasses, ...toggleClasses].join(' ')}
        style={{ height: "100%" }}
      >
        <div
          className={[...toggleLabelBaseClasses, beforeLabel].join(' ')}
        >{toggleLabel}</div>
      </button>
      {showing && showDropdown && (
        <ul
          className={[...dropdownUlClasses, labelSize].join(' ')}
          style={ulStyle}
        >
          {dropdownItems.map((item, idx) =>
            (item.cond === undefined || item.cond) ? (
              <li
                key={idx}
                className={`flex-row cursor-pointer`}
                onClick={item.onClick}
              >{item.label}</li>
            ) : null)}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
