import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ setShowModal, handleDelete }) => {
  const handleCancel = e => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <article className="confirm-delete flex-column">
      <main>
        <h2>Are you sure?</h2>
        <p>
          Please confirm that you want to delete this image.<br />
          This action cannot be reversed.
        </p>
      </main>
      <footer>
        <div className="confirm-form-action">
          <button
            className="cursor-pointer modal-button button-cancel"
            onClick={handleCancel}
          >Cancel</button>
          <button
            className="cursor-pointer modal-button button-delete"
            onClick={handleDelete}
          >Delete</button>
        </div>
      </footer>
    </article>
  );
};

export default DeleteConfirmModal;
