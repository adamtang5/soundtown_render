const ToggleButton = ({
  condition,
  buttonClasses,
  labelClasses = [],
  handleToggle,
  onLabel,
  offLabel,
}) => {
  return (
    <button
      onClick={handleToggle}
      className={`${buttonClasses.join(' ')} 
        ${condition ? 'button-toggle' : 'button-action'}`}
    >
      <div
        className={`${['logo-before', ...labelClasses].join(' ')} 
          ${condition ? 'label-toggle' : ''}`}
      >{condition ? onLabel : offLabel}</div>
    </button>
  );
};

export default ToggleButton;
