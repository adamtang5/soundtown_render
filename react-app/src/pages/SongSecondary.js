import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "../store/song";
import ShowcaseAssetLikes from "../components/ShowcaseAssetLikes";
import ShowcaseSongPlaylists from "../components/ShowcaseSongPlaylists";
import SecondaryHeader from "../components/SecondaryHeader";
import "./Secondary.css";

const SongSecondary = ({ secondary }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
      setLoaded(true);
    })();
  }, [dispatch, id]);

  if (secondary === "playlists") {
    document.title = `Listen to playlists featuring ${song?.title}`;
  } else if (secondary === "likes") {
    document.title = `See all likes of ${song?.title}`;
  }

  let songLikes = [];
  if (loaded) {
    songLikes = Object.values(song?.likes);
    if (secondary === "likes" && !songLikes?.length ||
      secondary === "playlists" && !song?.playlists?.length) {
      history.push(`/songs/${song?.id}`);
    }
  }

  let showcase;
  if (secondary === "likes") {
    showcase = <ShowcaseAssetLikes
      entity="song"
      asset={song}
      assetLikes={songLikes}
    />;
  } else if (secondary === "playlists") {
    showcase = <ShowcaseSongPlaylists song={song} />;
  }

  const navData = [];
  if (songLikes?.length) {
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