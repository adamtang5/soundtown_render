const ModalFormInput = ({
  label,
  value,
  setValue,
}) => {
  return (
    <>
      <label className="label-required">{label}</label>
      <input
        type="text"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        required
      />
    </>
  );
};

export default ModalFormInput;
