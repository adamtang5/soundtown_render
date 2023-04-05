import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "../utilities/ProtectedRoute";
import StickyNav from "../components/StickyNav";
import ShowcaseSongs from "../components/ShowcaseSongs";
import ShowcasePlaylists from "../components/ShowcasePlaylists";

const Library = () => {
  const sessionUser = useSelector(state => state.session.user);
  const songsArr = useSelector(state => Object.values(state.songs));
  const userSongs = songsArr.filter(song => song.user_id === sessionUser.id);
  const userLikes = songsArr.filter(song => song.likes.includes(sessionUser.id));
  const playlistsArr = useSelector(state => Object.values(state.playlists));
  const userPlaylists = playlistsArr.filter(playlist => playlist.user_id === sessionUser.id);

  const navData = [
    {
      to: "/library/songs",
      label: "My Songs",
    },
    {
      to: "/library/likes",
      label: "My Likes",
    },
    {
      to: "/library/playlists",
      label: "My Playlists",
    },
  ];

  const routes = [
    {
      path: "/library/songs",
      component: <ShowcaseSongs songs={userSongs} h3="Hear your uploaded songs:" />,
    },
    {
      path: "/library/likes",
      component: <ShowcaseSongs songs={userLikes} h3="Hear the tracks you've liked:" />,
    },
    {
      path: "/library/playlists",
      component: <ShowcasePlaylists playlists={userPlaylists} h3="Hear your own playlists:" />,
    },
  ];

  return (
    <main className="container">
      <StickyNav navData={navData} />
      <section className="showcase">
        <Switch>
          <ProtectedRoute path="/library" exact={true}>
            <Redirect to="/library/songs" />
          </ProtectedRoute>
          {routes.map((route, idx) => (
            <ProtectedRoute path={route.path} key={idx}>
              {route.component}
            </ProtectedRoute>
          ))}
        </Switch>
      </section>
    </main>
  );
};

export default Library;
