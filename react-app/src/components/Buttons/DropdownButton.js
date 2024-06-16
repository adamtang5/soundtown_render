import { useContext } from "react";
import { AnyDropdownContext } from "../../context/AnyDropdownContext";

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
  const { showAnyDropdown, setShowAnyDropdown } = useContext(AnyDropdownContext);
  const ulStyle = {
    position: "absolute",
  };

  const handleDropdownClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowAnyDropdown(!showDropdown);
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
      {showAnyDropdown && showDropdown && (
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
