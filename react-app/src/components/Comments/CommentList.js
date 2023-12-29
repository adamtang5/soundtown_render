import SingleComment from "./SingleComment";

const CommentList = ({ comments }) => {
  return comments?.map(comment => (
    <SingleComment key={comment?.id} comment={comment} />
  ));
};

export default CommentList;