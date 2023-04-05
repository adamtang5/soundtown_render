import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory, Switch } from "react-router-dom";
import { getAllUsers } from "../../store/user";
import UserPageHeader from "./UserPageHeader";
import ShowcaseSongs from "../ShowcaseSongs";
import ShowcasePlaylists from "../ShowcasePlaylists";
import StickyNav from "../StickyNav";
import ProtectedRoute from "../../utilities/ProtectedRoute";
import UserPageButtonGroup from "./UserPageButtonGroup";
import "./UserPage.css";

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[userId]);
  const userSongsArr = useSelector(state => Object.values(state.songs).filter(song => song.user_id === +userId));
  const userPlaylistsArr = useSelector(state => Object.values(state.playlists).filter(pl => pl.user_id === +userId));

  const sortKey = (a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    } else if (a.description.toLowerCase() !== b.description.toLowerCase()) {
      return a.description.toLowerCase() < b.description.toLowerCase() ? -1 : 1;
    } else {
      return 0;
    }
  };

  userSongsArr.sort(sortKey);
  userPlaylistsArr.sort(sortKey);

  if (history.location.pathname === `/users/${userId}`) {
    history.push(`/users/${userId}/songs`);
  }

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const navData = [
    {
      to: `/users/${userId}/songs`,
      label: "Songs",
    },
    {
      to: `/users/${userId}/playlists`,
      label: "Playlists",
    },
  ];

  const routes = [
    {
      path: `/users/${userId}/songs`,
      component: <ShowcaseSongs
        songs={userSongsArr}
        h3={sessionUser.id === +userId ? "Songs you uploaded"
          : (user?.display_name ? `Check out ${user?.display_name}'s tracks!` : '')}
      />,
    },
    {
      path: `/users/${userId}/playlists`,
      component: <ShowcasePlaylists
        playlists={userPlaylistsArr}
        h3={sessionUser.id === +userId ? "Your playlists"
          : (user?.display_name ? `Check out ${user?.display_name}'s playlists!` : '')}
      />,
    },
  ];

  return (
    <>
      <UserPageHeader />
      <div className="container flex-row">
        <main className="user-page-main full-width">
          <StickyNav
            navData={navData}
            optComp={<UserPageButtonGroup />}
          />
          <section className="showcase">
            <Switch>
              <ProtectedRoute path={`/users/${userId}`} exact={true}>
                <Redirect to={`/users/${userId}/songs`} />
              </ProtectedRoute>
              {routes.map((route, idx) => (
                <ProtectedRoute path={route.path} key={idx}>
                  {route.component}
                </ProtectedRoute>
              ))}
            </Switch>
          </section>
        </main>
        <aside className="user-page-summary">
          {/* TODO: Stats */}
          {/* TODO: Likes */}
          {/* TODO: Following */}
          {/* TODO: Comments */}
          {/* TODO: Legal */}
        </aside>
      </div>
    </>
  );
};

export default UserPage;
