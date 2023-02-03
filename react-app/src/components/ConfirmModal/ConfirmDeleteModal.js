import { Modal } from "../Context/Modal";
import ConfirmModal from ".";

const ConfirmDeleteModal = ({
  showModal,
  setShowModal,
  handleDelete,
  entity,
}) => {
  return showModal && (
    <Modal
      onClose={() => setShowModal(false)}
      position="top"
    >
      <ConfirmModal
        setShowModal={setShowModal}
        handleDelete={handleDelete}
        body={<p>
          Please confirm that you want to delete this {entity}.<br />
          This action cannot be reversed.
        </p>}
      />
    </Modal>
  );
};

export default ConfirmDeleteModal;
