import React, { useState, useEffect } from "react";
import CreatorCard from "../CreatorCard";
import creatorData from '../CreatorCard/creators.json';
import TechCard from "../TechCard";
import techs from '../TechCard/techs.json';
import { ImSpinner3 } from 'react-icons/im';

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

export default Sidebar;
