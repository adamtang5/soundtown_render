import { Link } from "react-router-dom";

const ShowcaseSongLikes = ({ song }) => {
  return (
    <>
      {song?.likes?.map((user, idx) => (
        <article className="user-tile flex-column" key={idx}>
          <Link to={`/users/${user?.id}`}>
            <div className="full-box">
              <img
                className="circle preview"
                src={user?.avatar_url}
                alt={user?.display_name}
              />
            </div>
          </Link>
          <Link to={`/users/${user?.id}`}>
            <footer className="user-tile-info">
              {user?.display_name}
            </footer>
          </Link>
        </article>
      ))}
    </>
  );
};

export default ShowcaseSongLikes;