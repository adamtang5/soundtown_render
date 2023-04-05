import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ImSpinner3 } from 'react-icons/im';
import ResponsiveSlider from "../components/GalleryCard/ResponsiveSlider";
import CreatorCard from "../components/CreatorCard";
import creatorData from '../components/CreatorCard/creators.json';
import TechCard from "../components/TechCard";
import techs from '../components/TechCard/techs.json';
import "./Home.css";

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

const Sidebar = () => {
  const [creators, setCreators] = useState([]);
  useEffect(() => {
    const updateCreator = async (creator) => {
      const res = await fetch(`https://api.github.com/users/${creator.github_username}`);
      if (res.ok) {
        const data = await res.json();
        return {
          ...creator,
          avatar_url: data.avatar_url,
          github_url: data.html_url,
        };
      }
    };
    Promise.all(creatorData.map(creator => updateCreator(creator)))
      .then(newCreators => setCreators(newCreators));
  }, []);

  return (
    <div className="sidebar-container flex-column">
      {creators.length === creatorData.length && creators.every(detail => detail.avatar_url) ?
        (
          <>
            <div className="tech-icon">
              <a href="https://github.com/adamtang5/soundtown_render" target="_blank" rel="noreferrer">
                <img src="https://raw.githubusercontent.com/devicons/devicon/v2.15.1/icons/github/github-original.svg" alt="project on github" />
              </a>
            </div>
            <h3 className="sidebar-text">Creators</h3>
            {creators?.map(creator => (
              <CreatorCard
                key={creator.github_username}
                creator={creator}
              />
            ))}
            <h3 className="sidebar-text">Built with</h3>
            <div className="techs flex-row">
              {techs?.map(tech => (
                <TechCard key={tech.name} tech={tech} />
              ))}
            </div>
          </>
        ) : (
          <ImSpinner3 className="spinning pinwheel" />
        )}
    </div>
  );
};

const Home = () => {
  return (
    <main className="container flex-row two-columns">
      <div className="mainfeed">
        <MainFeed />
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
    </main>
  );
};

export default Home;
