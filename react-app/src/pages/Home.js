import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSongs } from "../store/song";
import Slider from "react-slick";
import SongTile from "../components/Tile/SongTile";
import Credits from "../components/SidebarModules/Credits";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

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
      setLoaded(true);
    })();
  }, [dispatch]);
  
  document.title = "Discover the top streamed music and songs online on Sound Town";
  
  if (!loaded) return null;

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

const Home = () => {
  return (
    <main className="container flex-row two-columns full-width">
      <div className="mainfeed">
        <MainFeed />
      </div>
      <aside className="sidebar">
        <div className="sidebar-container flex-column">
          <Credits />
        </div>
      </aside>
    </main>
  );
};

export default Home;
