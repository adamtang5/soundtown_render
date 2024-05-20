import { Link } from "react-router-dom";
import SidebarCollection from "./SidebarCollection";
import AssetCard from "../Modules/AssetCard";

const SidebarSongsCollection = ({
  collectionLink,
  styleClasses,
  h3,
  songs,
}) => {
  return (
    <SidebarCollection
      collectionLink={collectionLink}
      styleClasses={styleClasses}
      h3={h3}
      collection={
        <ul className="sidebar-list">
          {songs?.slice(0, 3)?.map(song => (
            <AssetCard
              key={song?.id}
              entity="song"
              asset={song}
              assetCover={
                <Link to={`/songs/${song?.id}`}>
                  <div className="sidebar-cover-bg">
                    <img
                      src={song?.image_url}
                      className="sidebar-cover"
                      alt={song?.title}
                    />
                  </div>
                </Link>
              }
              assetFooter={
                <footer className="flex-row">
                  {Object.values(song?.likes)?.length > 0 && (
                    <Link to={`/songs/${song?.id}/likes`}>
                      <div className="logo-before heart-label">
                        {Object.values(song?.likes)?.length}
                      </div>
                    </Link>
                  )}
                  {song?.comments_count > 0 && (
                    <Link to={`/songs/${song?.id}`}>
                      <div className="logo-before speech-bubble-label">
                        {song?.comments_count}
                      </div>
                    </Link>
                  )}
                </footer>
              }
              user={song?.user}
            />
          ))}
        </ul>
      }
    />
  )
};

export default SidebarSongsCollection;