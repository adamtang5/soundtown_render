const ToggleButton = ({
  condition,
  buttonClasses,
  labelClasses,
  handleOff,
  onLabel,
  handleOn,
  offLabel,
}) => {
  return condition ? (
    <button
      onClick={handleOff}
      className={[...buttonClasses, 'button-toggle'].join(' ')}
    >
      <div
        className={['logo-before', 'label-toggle', ...labelClasses].join(' ')}
      >{onLabel}</div>
    </button>
  ) : (
    <button
      onClick={handleOn}
      className={[...buttonClasses, 'button-action'].join(' ')}
    >
      <div
        className={['logo-before', ...labelClasses].join(' ')}
      >{offLabel}</div>
    </button>
  );
};

export default ToggleButton;
