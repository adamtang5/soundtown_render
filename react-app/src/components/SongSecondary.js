import SecondaryHeader from "../components/SecondaryHeader";
import "../pages/Secondary.css";

const SongSecondary = ({ song, showcase }) => {
  const navData = [];
  if (song?.likes?.length) {
    navData.push({
      to: `/songs/${song?.id}/likes`,
      label: "Likes",
    });
  }
  if (song?.playlists?.length) {
    navData.push({
      to: `/songs/${song?.id}/playlists`,
      label: "In playlists",
    });
  }

  return (
    <main className="container">
      <SecondaryHeader
        entity="song"
        asset={song}
        dimension={100}
        imageUrl={song?.image_url}
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

export default SongSecondary;