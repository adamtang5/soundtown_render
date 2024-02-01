import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getSong } from "../store/song";
import SecondaryHeader from "../components/SecondaryHeader";
import "../pages/Secondary.css";

const SongLikes = () => {
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
          {song?.likes?.map((user, idx) => (
            <article className="user-tile flex-column" key={idx}>
              <Link to={`/users/${user?.id}`} exact={true}>
                <div className="full-box">
                  <img
                    className="circle preview"
                    src={user?.avatar_url}
                    alt={user?.display_name}
                  />
                </div>
              </Link>
              <Link to={`/users/${user?.id}`} exact={true}>
                <footer className="user-tile-info">
                  {user?.display_name}
                </footer>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SongLikes;