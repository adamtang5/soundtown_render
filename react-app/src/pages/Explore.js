import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "../utilities/ProtectedRoute";
import StickyNav from "../components/StickyNav";
import ShowcaseSongs from "../components/ShowcaseSongs"
import ShowcasePlaylists from "../components/ShowcasePlaylists";

const Explore = () => {
  const sessionUser = useSelector(state => state.session.user);
  const othersSongs = useSelector(state => Object.values(state.songs)
    .filter(song => song?.user_id !== sessionUser?.id));
  const othersPlaylists = useSelector(state => Object.values(state.playlists)
    .filter(pl => pl?.user_id !== sessionUser?.id));

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
        songs={othersSongs}
        h3="Check out songs from around the town!"
      />,
    },
    {
      path: "/explore/playlists",
      component: <ShowcasePlaylists
        playlists={othersPlaylists}
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

export default Explore;
