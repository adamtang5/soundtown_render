import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import creatorData from "../CreatorCard/creators.json";
import techData from "../TechCard/techs.json";
import { updateCreator } from "../../store/creator";
import { ImSpinner3 } from "react-icons/im";

const CreatorsList = () => {
  const dispatch = useDispatch();
  const creators = useSelector(state => Object.values(state.creators))
    .toSorted((a, b) => {
      if (a?.last_name?.toLowerCase() > b?.last_name?.toLowerCase()) {
        return 1;
      } else if (a?.last_name?.toLowerCase() < b?.last_name?.toLowerCase()) {
        return -1;
      } else {
        if (a?.first_name?.toLowerCase() > b?.first_name?.toLowerCase()) {
          return 1;
        } else if (a?.first_name?.toLowerCase() < b?.first_name?.toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      }
    });

  useEffect(() => {
    const fetchCreator = async (creator) => {
      const res = await fetch(`https://api.github.com/users/${creator.github_username}`);
      if (res.ok) {
        const data = await res.json();
        const newCreator = await {
          ...creator,
          avatar_url: data?.avatar_url,
          github_url: data?.html_url,
        };
        await dispatch(updateCreator(newCreator));
      }
    };
    if (creators?.length === creatorData?.length && creators?.every(detail => detail?.avatar_url)) return;
    Promise.all(creatorData.map(creator => fetchCreator(creator)));
  }, [])

  if (creators?.length !== creatorData?.length || !creators?.every(detail => detail?.avatar_url)) {
    return <ImSpinner3 className="spinning pinwheel" />
  }

  return (
    <ul className="sidebar-list flex-row">
      {creators?.map(creator => (
        <li key={creator?.github_url}>
          <a className="avatar" href={creator?.github_url} target="_blank" rel="noreferrer">
            <img src={creator?.avatar_url} alt={`${creator?.first_name} ${creator?.last_name}`} />
          </a>
        </li>
      ))}
    </ul>
  );
};

const TechList = () => {
  return (
    <ul className="sidebar-tech-list flex-row">
      {techData?.map(tech => (
        <li key={tech?.name}>
          <img src={tech?.badge_url} alt={tech?.name} title={tech?.name} />
        </li>
      ))}
    </ul>
  )
};

const Credits = () => {
  return (
    <>
      <article className="sidebar-credits">
        <header>
          <h3 className="sidebar-header">About Project</h3>
        </header>
        <a href="https://github.com/adamtang5/soundtown_render" target="_blank" rel="noreferrer">
          <div className="github-badge flex-row">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="source code on GitHub" />
            <span>project code</span>
          </div>
        </a>
      </article>
      <article className="sidebar-credits">
        <header>
          <h3 className="sidebar-header">Creators</h3>
        </header>
        <CreatorsList />
      </article>
      <article className="sidebar-credits">
        <header>
          <h3 className="sidebar-header">Technologies Used</h3>
        </header>
        <TechList />
      </article>
    </>
  )
};

export default Credits;