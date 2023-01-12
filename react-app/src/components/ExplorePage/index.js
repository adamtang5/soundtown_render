import React from "react";
import { NavLink, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import ShowcaseSongs from "../SongFolders/SongList/ShowcaseSongs"
import ShowcasePlaylists from "./ShowcasePlaylists";

const ExplorePage = () => {
  const history = useHistory();

  if (history.location.pathname === `/explore`) {
    history.push(`/explore/songs`);
  }

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

  return (
    <main className="page-container">
      <nav className="sticky-nav">
        <ul className="flex-row">
          {navData.map(data => (
            <li key={data.label}>
              <NavLink
                to={data.to}
                activeClassName="active"
              >{data.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <section className="library-showcase">
        <Switch>
          <ProtectedRoute path={"/explore/songs"} exact={true}>
            <ShowcaseSongs />
          </ProtectedRoute>
          <ProtectedRoute path={"/explore/playlists"} exact={true}>
            <ShowcasePlaylists />
          </ProtectedRoute>
        </Switch>
      </section>
    </main>
  );
};

export default ExplorePage;
