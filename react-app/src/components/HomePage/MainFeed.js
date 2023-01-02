import React from "react";
import GalleryCard from "../GalleryCard";
import { useSelector } from "react-redux";

const MainFeed = () => {
  const songs = useSelector(state => state.songs);
  const songsArr = Object.values(songs).sort((a, b) => a.id - b.id);
  const songsArrRev = Object.values(songs).sort((a, b) => b.id - a.id);

  return (
    <div className="mainfeed">
      <div className="mainFeed_gallery_list">
        <GalleryCard
          type="songs"
          description="Up-and-coming tracks on SoundTown"
          title={"Charts: Hot & Trending"}
          songs={songsArr}
        />
      </div>
      <div className="mainFeed_gallery_list">
        <GalleryCard
          type="songs"
          description="The latest Uploads from around the world"
          title={"Discover Daily"}
          songs={songsArrRev}
        />
      </div>
      <div className="mainFeed_gallery_list">
        <GalleryCard
          type="songs"
          description="Emerging artists and tracks"
          title={"Bubbling Up"}
          songs={songsArr}
        />
      </div>
    </div>
  );
};

export default MainFeed;
