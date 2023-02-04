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
  const ulStyle = {
    position: "absolute",
  };

  const handleDropdownClick = e => {
    e.preventDefault();
    e.stopPropagation();
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
      {showDropdown && (
        <ul
          className={[...dropdownUlClasses, labelSize].join(' ')}
          style={ulStyle}
        >
          {dropdownItems.map((item, idx) => (
            <li
              key={idx}
              className={`flex-row cursor-pointer`}
              onClick={item.onClick}
            >{item.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
