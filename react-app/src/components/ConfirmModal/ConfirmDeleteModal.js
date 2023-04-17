import { Modal } from "../Context/Modal";
import ConfirmModal from ".";

const ConfirmDeleteModal = ({
  showModal,
  setShowModal,
  handleDelete,
  entity,
}) => {
  const blurb = {
    "song": "Deleting this song is irreversible. You will lose all the likes and comments for this song with no way to get them back.",
    "playlist": "Are you sure you want to delete this playlist? This action cannot be undone.",
    "image": "Please confirm that you want to delete this image. This action cannot be reversed.",
  }
  return showModal && (
    <Modal
      onClose={() => setShowModal(false)}
      position="top"
    >
      <ConfirmModal
        setShowModal={setShowModal}
        handleDelete={handleDelete}
        body={<p>{blurb[entity]}</p>}
      />
    </Modal>
  );
};

export default ConfirmDeleteModal;
