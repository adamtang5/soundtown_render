import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner3 } from 'react-icons/im';
import { getAllSongs } from "../store/song";
import Slider from "react-slick";
import SongTile from "../components/Tile/SongTile";
import CreatorCard from "../components/CreatorCard";
import creatorData from '../components/CreatorCard/creators.json';
import TechCard from "../components/TechCard";
import techs from '../components/TechCard/techs.json';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import Credits from "../components/SidebarModules/Credits";

const MainFeed = () => {
  const PCT_OF_TRENDING = 0.25;
  const PCT_OF_RECOMMENDATION = 0.15;
  const PCT_OF_BUBBLING_UP = 0.35;

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const trendingSongs = useSelector(state => Object.values(state.songs)
    .toSorted((a, b) => {
      if (a.id < b.id) {
        return 1;
      } else if (a.id > b.id) {
        return -1;
      } else {
        return 0;
      }
    })
    .slice(0, Math.floor(Object.keys(state.songs).length * PCT_OF_TRENDING)));

  const recommendedSongs = useSelector(state => Object.values(state.songs)
    .toSorted((a, b) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      } else {
        return 0;
      }
    })
    .slice(0, Math.floor(Object.keys(state.songs).length * PCT_OF_RECOMMENDATION)));

  const bubblingSongs = useSelector(state => Object.values(state.songs)
    .toSorted((a, b) => {
      if (Object.keys(a.likes).length < Object.keys(b.likes).length) {
        return 1;
      } else if (Object.keys(a.likes).length > Object.keys(b.likes).length) {
        return -1;
      } else {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        } else {
          return 0;
        }
      }
    })
    .slice(0, Math.floor(Object.keys(state.songs).length * PCT_OF_BUBBLING_UP)));

  useEffect(() => {
    (async () => {
      await dispatch(getAllSongs());
      document.title = "Discover the top streamed music and songs online on Sound Town";
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  const data = [
    {
      type: "songs",
      description: "Up-and-coming tracks on SoundTown",
      title: "Charts: Hot & Trending",
      songs: trendingSongs,
    },
    {
      type: "songs",
      description: "The latest Uploads from around the world",
      title: "Discover Daily",
      songs: recommendedSongs,
    },
    {
      type: "songs",
      description: "Emerging artists and tracks",
      title: "Bubbling Up",
      songs: bubblingSongs,
    },
  ];

  return (
    <>
      {data.map((grp, idx) => (
        <section className="mainfeed-section" key={idx}>
          <SliderCard key={idx} {...grp} />
        </section>
      ))}
    </>
  );
};

const SliderCard = ({ title, description, songs }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1240,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <h2>{title}</h2>
      <h3>{description}</h3>
      <div className="carousel-wrapper">
        <Slider {...settings}>
          {songs?.map((song) => (
            <SongTile song={song} key={song?.id} />
          ))}
        </Slider>
      </div>
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
          avatar_url: data?.avatar_url,
          github_url: data?.html_url,
        };
      }
    };
    Promise.all(creatorData.map(creator => updateCreator(creator)))
      .then(newCreators => setCreators(newCreators));
  }, []);

  return (
    <div className="sidebar-container flex-column">
      {creators?.length === creatorData?.length && creators.every(detail => detail?.avatar_url) ?
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
                key={creator?.github_username}
                creator={creator}
              />
            ))}
            <h3 className="sidebar-text">Built with</h3>
            <div className="techs flex-row">
              {techs?.map(tech => (
                <TechCard key={tech?.name} tech={tech} />
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
      {/* <aside className="asset-sidebar">
        <Credits />
      </aside> */}
    </main>
  );
};

export default Home;
