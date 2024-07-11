const CreatorAvatar = ({ creator }) => {
  return (
    <div className="creator-avatar">
      <img
        src={creator?.avatar_url}
        alt={`${creator.first_name} ${creator.last_name}`}
        className="full-box"
      />
    </div>
  )
}

export default CreatorAvatar;
