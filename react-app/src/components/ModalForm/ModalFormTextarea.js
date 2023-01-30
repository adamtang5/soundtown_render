import './ModalForm.css';

const ModalFormTextarea = ({
  label,
  value,
  setValue,
}) => {
  return (
    <>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
      />
    </>
  );
};

export default ModalFormTextarea;
