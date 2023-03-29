import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "../../utilities/ProtectedRoute";
import StickyNav from "../Modules/StickyNav";
import ShowcaseSongs from "../Modules/ShowcaseSongs"
import ShowcasePlaylists from "../Modules/ShowcasePlaylists";

const ExplorePage = () => {
  const songsArr = useSelector(state => Object.values(state.songs));
  const playlistsArr = useSelector(state => Object.values(state.playlists));

  const navData = [
    {
      to: "/explore/songs",
      label: "Explore Songs",
    },
    {
      to: "/explore/playlists",
      label: "Explore Playlists",
    },
  ];

  const routes = [
    {
      path: "/explore/songs",
      component: <ShowcaseSongs
        songs={songsArr}
        h3="Every song from every user!"
      />,
    },
    {
      path: "/explore/playlists",
      component: <ShowcasePlaylists
        playlists={playlistsArr}
        h3="Check out playlists from around the town!"
      />,
    },
  ];

  return (
    <main className="container">
      <StickyNav navData={navData} />
      <section className="showcase">
        <Switch>
          <ProtectedRoute path="/explore" exact={true}>
            <Redirect to="/explore/songs" />
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

export default ExplorePage;
