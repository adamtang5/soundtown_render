const SimpleButton = ({
  label,
  onClick,
  type,
  classes = [],
}) => {
  const defaultClasses = ['cursor-pointer', 'simple-button'];

  if (type) defaultClasses.push(`button-${type}`);
  return (
    <button
      className={[...defaultClasses, ...classes].join(' ')}
      onClick={onClick}
      type={type === 'submit' ? type : ''}
    >{label}</button>
  );
};

export default SimpleButton;
