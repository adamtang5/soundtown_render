import React from "react";
import Slider from "react-slick";
import SongTile from "./SongTile";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ResponsiveSlider = ({ title, description, songs }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
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
            <SongTile song={song} key={song.id} />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default ResponsiveSlider;
