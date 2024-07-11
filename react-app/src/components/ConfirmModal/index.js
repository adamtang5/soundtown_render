import './ConfirmModal.css';

const ConfirmModal = ({
  setShowModal,
  handleDelete,
  body,
}) => {
  const handleCancel = e => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <article className="confirm-delete full-width flex-column">
      <main>
        <h2>Are you sure?</h2>
        {body}
      </main>
      <footer>
        <div className="confirm-form-action">
          <button
            className="cursor-pointer simple-button button-cancel"
            onClick={handleCancel}
          >Cancel</button>
          <button
            className="cursor-pointer simple-button button-delete"
            onClick={handleDelete}
          >Delete</button>
        </div>
      </footer>
    </article>
  );
};

export default ConfirmModal;
