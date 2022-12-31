import React from "react";
import GalleryCard from "../GalleryCard";
import { useSelector } from "react-redux";

const MainFeed = () => {
  const songs = useSelector((state) => state.songs);
  const songsArr = Object.values(songs);
  const songsArrRev = songsArr.slice().reverse();
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
