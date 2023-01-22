const ModalFormTitle = ({ title, setTitle }) => {
  return (
    <>
      <label className="label-required">Title</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
      />
    </>
  );
};

export default ModalFormTitle;
