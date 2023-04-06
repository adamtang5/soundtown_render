const NewCommentForm = ({
  handleNewCommentSubmit,
  content,
  setContent,
  errors,
}) => {
  return (
    <>
      <div className="new-comment-wrapper flex-row">
        <div className="new-comment-placeholder" />
        <form
          className="new-comment-form flex-row"
          onSubmit={handleNewCommentSubmit}
        >
          <input
            type="text"
            onChange={e => setContent(e.target.value)}
            value={content}
            placeholder="Write a comment"
            name="comment-input"
            id="comment-input"
            className="comment-input"
            autoComplete="off"
          />
        </form>
      </div>
      <div className="form-errors">
        {errors.map((error, idx) => (
          <div key={idx}>{error}</div>
        ))}
      </div>
    </>
  );
};

export default NewCommentForm;
