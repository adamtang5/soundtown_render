import React, { useState } from "react";
import { NavLink, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import ShowcaseSongs from "../SongFolders/SongList/ShowcaseSongs";
import ShowcasePlaylists from "../ExplorePage/ShowcasePlaylists";
import SongsList from "../SongFolders/SongList";
import Playlist from "./Playlist";
import Likes from "./Likes";
import "./LibraryPage.css";

const LibraryPage = () => {
  const history = useHistory();
  const [selected, setSelected] = useState("songs");

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
      <div className="library_container flex-column">
        <div className="inner_library_container flex-column">
          <Switch>
            <ProtectedRoute path={"/library/songs"} exact={true}>
              <SongsList />
            </ProtectedRoute>
            <ProtectedRoute path={"/library/likes"} exact={true}>
              <Likes />
            </ProtectedRoute>
            <ProtectedRoute path={"/library/playlists"} exact={true}>
              <Playlist />
            </ProtectedRoute>
          </Switch>
        </div>
      </div>
    </main>
  );
};

export default LibraryPage;
