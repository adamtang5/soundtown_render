import React, { useEffect } from "react";
import CreatorCard from "../CreatorCard";
import creators from '../CreatorCard/creators.json';
import TechCard from "../TechCard";
import techs from '../TechCard/techs.json';
import { ImSpinner3 } from 'react-icons/im';

const updateCreator = async (creator) => {
  const res = await fetch(`https://api.github.com/users/${creator.github_username}`);
  const data = await res.json();
  return {
    ...creator,
    avatar_url: data.avatar_url,
    github_url: data.html_url,
  };
};

const Sidebar = () => {
  useEffect(() => {
    for (let i = 0; i < creators.length; i++) {
      updateCreator(creators[i])
        .then(newData => creators[i] = newData);
    }
  }, []);

  return (
    <div className="sidebar_container flex-column">
      {creators.every(detail => detail.avatar_url) ?
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
