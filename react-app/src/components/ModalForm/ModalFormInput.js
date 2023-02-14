const ModalFormInput = ({
  label,
  value,
  setValue,
}) => {
  return (
    <>
      <label className="label-required full-width">{label}</label>
      <input
        type="text"
        className="full-width"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        required
      />
    </>
  );
};

export default ModalFormInput;
