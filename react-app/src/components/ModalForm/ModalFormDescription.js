const ModalFormDescription = ({ description, setDescription }) => {
  return (
    <>
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
      />
    </>
  );
};

export default ModalFormDescription;
