import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "../store/song";
import SecondaryHeader from "../components/SecondaryHeader";
import PlaylistTile from "../components/Tile/PlaylistTile";
import "../pages/Secondary.css";

const SongPlaylists = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
    })();
  }, [dispatch, id]);

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
      <section className="showcase">
        <div className="secondary-showcase-grid flex-row">
          {song?.playlists?.map((pl, idx) => (
            <PlaylistTile
              key={idx}
              playlist={pl}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default SongPlaylists;