import React from "react";
import Slider from "react-slick";
import SongTile from "./SongTile";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SongSlider = ({ songs }) => {
  const settings = {
    dots: false,
    aarows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };
  return (
    <div className="song_slider_surrounding_div">
      <Slider className="song_slider_component" {...settings}>
        {songs.map((song) => (
          <SongTile song={song} key={song.id} />
        ))}
      </Slider>
    </div>
  );
};

export default SongSlider;
