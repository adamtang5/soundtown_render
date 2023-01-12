import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import ShowcaseSongs from "../SongFolders/SongList/ShowcaseSongs";
import ShowcasePlaylists from "../ExplorePage/ShowcasePlaylists";

const LibraryPage = () => {
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const songsArr = useSelector(state => Object.values(state.songs));
  const userSongs = songsArr.filter(song => song.user_id === sessionUser.id);
  const userLikes = songsArr.filter(song => song.likes.includes(sessionUser.id));
  const playlistsArr = useSelector(state => Object.values(state.playlists));
  const userPlaylists = playlistsArr.filter(playlist => playlist.user_id === sessionUser.id);

  if (history.location.pathname === `/library`) {
    history.push(`/library/songs`);
  }

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
  ]

  return (
    <main className="page-container">
      <nav className="sticky-nav">
        <ul className="flex-row">
          {navData.map(data => (
            <li key={data.label}>
              <NavLink to={data.to} activeClassName="active">
                {data.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <section className="showcase">
        <Switch>
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

export default LibraryPage;
