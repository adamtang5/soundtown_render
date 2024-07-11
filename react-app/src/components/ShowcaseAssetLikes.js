import { Link } from "react-router-dom";

const ShowcaseAssetLikes = ({ entity, asset, assetLikes }) => {
  return (
    <>
      {assetLikes?.map((user, idx) => (
        <article className="user-tile flex-column" key={idx}>
          <Link to={`/users/${user?.id}`}>
            <div className="full-box">
              <img
                className="circle full-box"
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

export default ShowcaseAssetLikes;