const EditCommentButton = ({
  handleClick,
  buttonClasses,
}) => {
  return (
    <button
      onClick={handleClick}
      className={buttonClasses.join(' ')}
    >
      <div className="logo-before pencil-label">Edit</div>
    </button>
  )
};

export default EditCommentButton;
