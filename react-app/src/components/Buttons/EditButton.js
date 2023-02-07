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
      >
        <div
          className="logo-before pencil-label"
        >Edit</div>
      </button>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          position="center"
          paddingTop={0}
        >{modalForm}</Modal>
      )}
    </>
  );
};

export default EditButton;
