const ReplyCommentButton = ({
  onClick,
  buttonClasses,
}) => {
  return (
    <button
      onClick={onClick}
      className={buttonClasses.join(' ')}
    >
      <div>Reply</div>
    </button>
  )
};

export default ReplyCommentButton;