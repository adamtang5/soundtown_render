import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SecondaryHeader from "../components/SecondaryHeader";
import "../pages/Secondary.css";

const SongLikes = () => {
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);

  return (
    <main className="container">
      <SecondaryHeader
        entity="song"
        asset={song}
        dimension={100}
        imageUrl={song?.image_url}
      />
    </main>
  );
};

export default SongLikes;