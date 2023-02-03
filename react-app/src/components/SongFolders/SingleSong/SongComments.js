import SpeechBubble from "../../Icons/SpeechBubble";
import SingleComment from "./Comments/SingleComment";

const SongComments = ({ song }) => {

  return song?.comments?.length ? (
    <section className="song-comments-list flex-column">
      <header className="comments-count flex-row">
        <SpeechBubble classes={['comment-icon', 'small-icon']} />
        <span className="comments-count-text">
          {song?.comments?.length}
          {song?.comments?.length > 1 ? " comments" : " comment"}
        </span>
      </header>
      <ul>
        {song?.comments.map(comment => (
          <SingleComment key={comment.id} comment={comment} />
        ))}
      </ul>
    </section>
  ) : (
    <article className="no-comments flex-column">
      <div className="big-icon">
        <SpeechBubble classes={['comment-icon', 'big-icon']} />
      </div>
      <h3>Seems a little quiet here</h3>
      <h4>Be the first to comment on this track</h4>
    </article>
  );
};

export default SongComments;
