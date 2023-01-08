import React from "react";
import ResponsiveSlider from "./ResponsiveSlider";

const GalleryCard = ({ type, title, description, songs }) => {
  if (type === "songs") {
    return (
      <article className="mainFeed_gallery_list_item">
        <ResponsiveSlider
          title={title}
          description={description}
          songs={songs}
        />
      </article>
    );
  }
};

export default GalleryCard;
