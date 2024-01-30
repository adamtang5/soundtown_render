import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SecondaryHeader from "../components/SecondaryHeader";
import "../pages/Secondary.css";

const SongPlaylists = () => {
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);

  const navData = [
    {
      to: `/songs/${id}/likes`,
      label: "Likes",
    },
    {
      to: `/songs/${id}/playlists`,
      label: "In playlists",
    },
  ];

  return (
    <main className="container">
      <SecondaryHeader
        entity="song"
        asset={song}
        dimension={100}
        imageUrl={song?.image_url}
        navData={navData}
      />
    </main>
  );
};

export default SongPlaylists;