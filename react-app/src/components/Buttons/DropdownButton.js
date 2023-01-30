const DropdownButton = ({
  toggleLabel,
  toggleClasses,
  showDropdown,
  setShowDropdown,
  dropdownUlClasses,
  dropdownItems,
}) => {
  const ulStyle = {
    position: "absolute",
    top: "29px",
    left: "1px",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(true)}
        className={toggleClasses.join(' ')}
        style={{ justifyContent: "center", alignItems: "center" }}
      >{toggleLabel}</button>
      {showDropdown && (
        <ul
          className={dropdownUlClasses.join(' ')}
          style={ulStyle}
        >
          {dropdownItems.map(item => (
            <li
              key={item.label}
              className="flex-row cursor-pointer"
              onClick={item.onClick}
            >{item.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
