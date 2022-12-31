import React from "react";
import ResponsiveSlider from "./ResponsiveSlider";

const GalleryCard = ({ type, title, description, songs }) => {
  if (type === "songs") {
    return (
      <div className="mainFeed_gallery_list_item">
        <ResponsiveSlider
          title={title}
          description={description}
          songs={songs}
        />
      </div>
    );
  }
};

export default GalleryCard;
