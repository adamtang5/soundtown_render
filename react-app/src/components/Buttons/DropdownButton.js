const DropdownButton = ({
  toggleLabel,
  toggleClasses = [],
  beforeLabel,
  showDropdown,
  setShowDropdown,
  dropdownUlClasses,
  dropdownItems,
}) => {
  const ulStyle = {
    position: "absolute",
    top: "28px",
    left: "1px",
  };

  const toggleBaseClasses = ['cursor-pointer', 'composite-button'];
  const toggleLabelBaseClasses = ['logo-before'];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(true)}
        className={[...toggleBaseClasses, ...toggleClasses].join(' ')}
      >
        <div
          className={[...toggleLabelBaseClasses, beforeLabel].join(' ')}
        >{toggleLabel}</div>
      </button>
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
