import CreatorAvatar from "./CreatorAvatar";
import "./CreatorCard.css";

const CreatorCard = ({ creator }) => {
  if (!creator?.avatar_url) return null;
  return (
    <a href={creator.github_url} target="_blank" rel="noreferrer">
      <div className="creator-card flex-column">
        <CreatorAvatar creator={creator} />
        <div className="creator-name-tag">
          {`${creator.first_name} ${creator.last_name}`}
        </div>
      </div>
    </a>
  );
};

export default CreatorCard;
