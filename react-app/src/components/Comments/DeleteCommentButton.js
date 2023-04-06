const DeleteCommentButton = ({
  handleClick,
  buttonClasses,
  showConfirm,
  cancelDelete,
  confirmDelete,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleClick}
        className={buttonClasses.join(' ')}
      >
        <div className="logo-before trash-label">Delete</div>
      </button>
      {showConfirm && (
        <div
          className="confirm-delete-form"
          style={{ position: "absolute" }}
        >
          <p>Do you really want to remove this comment?</p>
          <div className="confirm-delete-buttons flex-row">
            <div
              className="cancel-delete button"
              onClick={cancelDelete}
            >
              Cancel
            </div>
            <div
              className="yes-delete button"
              onClick={confirmDelete}
            >
              Yes
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default DeleteCommentButton;
