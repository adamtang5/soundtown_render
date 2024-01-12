import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "../utilities/ProtectedRoute";
import StickyNav from "../components/StickyNav";
import ShowcaseSongs from "../components/ShowcaseSongs";
import ShowcasePlaylists from "../components/ShowcasePlaylists";

const Library = () => {
  const sessionUser = useSelector(state => state.session.user);
  const userLikes = useSelector(state => sessionUser.likes.map(id => state.songs[id]));

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
      component: <ShowcaseSongs songs={sessionUser.songs} h3="Hear your uploaded songs:" />,
    },
    {
      path: "/library/likes",
      component: <ShowcaseSongs likeDisabled songs={userLikes} h3="Hear the tracks you've liked:" />,
    },
    {
      path: "/library/playlists",
      component: <ShowcasePlaylists playlists={sessionUser.playlists} h3="Hear your own playlists:" />,
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
