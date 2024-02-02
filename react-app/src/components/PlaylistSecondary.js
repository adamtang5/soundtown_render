import SecondaryHeader from "../components/SecondaryHeader";
import "../pages/Secondary.css";

const PlaylistSecondary = ({ playlist, showcase }) => {
  const navData = [];
  if (playlist?.likes?.length) {
    navData.push({
      to: `/playlists/${playlist?.id}/likes`,
      label: "Likes",
    });
  }

  return (
    <main className="container">
      <SecondaryHeader
        entity="playlist"
        asset={playlist}
        dimension={100}
        imageUrl={playlist?.image_url || playlist?.songs[0]?.image_url}
        navData={navData}
      />
      <section className="showcase">
        <div className="secondary-showcase-grid flex-row">
          {showcase}
        </div>
      </section>
    </main>
  );
};

export default PlaylistSecondary;