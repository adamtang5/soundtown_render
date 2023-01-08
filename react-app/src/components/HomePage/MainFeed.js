import React from "react";
import { useSelector } from "react-redux";
import ResponsiveSlider from "../GalleryCard/ResponsiveSlider";

const MainFeed = () => {
  const songs = useSelector(state => state.songs);
  const songsArr = Object.values(songs).sort((a, b) => a.id - b.id);
  const songsArrRev = Object.values(songs).sort((a, b) => b.id - a.id);

  const data = [
    {
      type: "songs",
      description: "Up-and-coming tracks on SoundTown",
      title: "Charts: Hot & Trending",
      songs: songsArr,
    },
    {
      type: "songs",
      description: "The latest Uploads from around the world",
      title: "Discover Daily",
      songs: songsArrRev,
    },
    {
      type: "songs",
      description: "Emerging artists and tracks",
      title: "Bubbling Up",
      songs: songsArr,
    },
  ];

  return (
    <>
      {data.map((grp, idx) => (
        <section className="mainfeed-section" key={idx}>
          <ResponsiveSlider key={idx} {...grp} />
        </section>
      ))}
    </>
  );
};

export default MainFeed;
