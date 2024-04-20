import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylist } from "../store/playlist";
import ShowcaseAssetLikes from "../components/ShowcaseAssetLikes";
import SecondaryHeader from "../components/SecondaryHeader";
import "./Secondary.css";

const PlaylistSecondary = ({ secondary }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await dispatch(getPlaylist(id));
      setLoaded(true);
    })();
  }, [dispatch, id]);

  let plLikes = [];
  if (loaded) {
    plLikes = Object.values(playlist?.likes);
    if (!plLikes?.length) {
      history.push(`playlists/${playlist?.id}`);
    }
  }

  let showcase;
  if (secondary === "likes") {
    showcase = <ShowcaseAssetLikes
      entity="playlist"
      asset={playlist}
      assetLikes={plLikes}
    />;
  }

  const navData = [];
  if (plLikes?.length) {
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