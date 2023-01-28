const DropdownButton = ({
  toggleLabel,
  toggleClasses,
  showDropdown,
  setShowDropdown,
  dropdownUlClasses,
  dropdownItems,
}) => {
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
          style={{ position: "absolute" }}
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
