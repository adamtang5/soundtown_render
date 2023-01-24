import { Modal } from "../Context/Modal";

const EditButton = ({
  showModal,
  setShowModal,
  buttonClasses,
  modalForm,
}) => {
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={buttonClasses.join(' ')}
      >Edit</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalForm}</Modal>
      )}
    </>
  );
};

export default EditButton;
