import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Modal } from "../Context/Modal";
import Logo from "../Icons/Logo";
import UserProfile from "../UserProfile";
import UploadSong from "../SongFolders/UploadSongForm";
import "./NavBar.css";

const NavBar = () => {
  const sessionUser = useSelector(state => state.session.user);
  const rawSongs = useSelector(state => state.songs);
  const rawPlaylists = useSelector(state => state.playlists);
  const songs = Object.values(rawSongs);
  const playlists = Object.values(rawPlaylists);
  const playlistsAndSongs = songs.concat(playlists);

  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (searchInput.length) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchInput]);

  useEffect(() => {
    if (!showResults) return;

    const closeResults = () => {
      setShowResults(false);
    };

    document.addEventListener("click", closeResults);

    return () => document.removeEventListener("click", closeResults);
  }, [showResults]);

  let sessionLinks = (
    <nav className="navbar">
      <nav className="HomeLinkDiv flex-row-center" >
        <NavLink
          className="nav-logo flex-row-center"
          to="/"
          exact={true}
          activeClassName="activeNav"
        >
          <Logo />
        </NavLink>
        <NavLink
          className="navlinks nav-home flex-row-center"
          to="/"
          exact={true}
          activeClassName="activeNav"
        >
          Home
        </NavLink>
        <NavLink
          className="navlinks stream flex-row-center"
          to="/explore/songs"
          exact={true}
          activeClassName="activeNav"
        >
          Stream
        </NavLink>
        <NavLink
          className="navlinks library flex-row-center"
          to="/library/songs"
          exact={true}
          activeClassName="activeNav"
        >
          Library
        </NavLink>
        <div className="flex-row-center navbar_input_container">
          <div className="navbar-search-container">
            <input
              className="navbar_search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {showResults && (
              <div className="search_results">
                <ul>
                  {playlistsAndSongs
                    ?.filter((playlistOrSong) =>
                      playlistOrSong.title.toLowerCase().startsWith(searchInput.toLowerCase())
                    ).length ?
                    playlistsAndSongs
                      ?.filter((playlistOrSong) =>
                        playlistOrSong.title.toLowerCase().startsWith(searchInput.toLowerCase())
                      )
                      .map((playlistOrSong) =>
                        playlistOrSong.songs ?
                          (
                            <li key={playlistOrSong.id} className="flex-row search_results_li">
                              <img
                                className="search_results_img"
                                src={playlistOrSong.image_url}
                                alt={playlistOrSong.title}
                              />
                              <a
                                href={`/playlists/${playlistOrSong.id}`}
                                className="search_results_a"
                              >
                                {playlistOrSong.title}
                              </a>
                            </li>
                          ) :
                          rawSongs[playlistOrSong.id] && rawSongs[playlistOrSong.id].title === playlistOrSong.title &&
                          (
                            <li key={playlistOrSong.id} className="flex-row search_results_li">
                              <img
                                className="search_results_img"
                                src={playlistOrSong.image_url}
                                alt={playlistOrSong.title}
                              />
                              <a
                                href={`/songs/${playlistOrSong.id}`}
                                className="search_results_a"
                              >
                                {playlistOrSong.title}
                              </a>
                            </li>
                          )
                      ) :
                    playlistsAndSongs
                      ?.filter((playlistOrSong) =>
                        playlistOrSong.title.toLowerCase().includes(searchInput.toLowerCase())
                      ).length ?
                      playlistsAndSongs
                        ?.filter((playlistOrSong) =>
                          playlistOrSong.title.toLowerCase().includes(searchInput.toLowerCase())
                        )
                        .map((playlistOrSong) =>
                          playlistOrSong.songs ?
                            (
                              <li key={playlistOrSong.id} className="flex-row search_results_li">
                                <img
                                  className="search_results_img"
                                  src={playlistOrSong.image_url}
                                  alt={playlistOrSong.title}
                                />
                                <a
                                  href={`/playlists/${playlistOrSong.id}`}
                                  className="search_results_a"
                                >
                                  {playlistOrSong.title}
                                </a>
                              </li>
                            ) :
                            rawSongs[playlistOrSong.id] && rawSongs[playlistOrSong.id].title === playlistOrSong.title &&
                            (
                              <li key={playlistOrSong.id} className="flex-row search_results_li">
                                <img
                                  className="search_results_img"
                                  src={playlistOrSong.image_url}
                                  alt={playlistOrSong.title}
                                />
                                <a
                                  href={`/songs/${playlistOrSong.id}`}
                                  className="search_results_a"
                                >
                                  {playlistOrSong.title}
                                </a>
                              </li>
                            )
                        ) :
                      (
                        <>
                          <li className="flex-row search_results_li">

                            <a
                              className="search_results_a"
                            >
                              Nothing Found
                            </a>
                          </li>
                        </>
                      )

                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="UploadUser">

        <div onClick={() => setShowUploadModal(true)} className="navlinks upload cursor-pointer flex-row-center"
          style={{ background: `${showUploadModal ? '#111' : ''}` }}>
          Upload
        </div>

        <div className="user-navdrop-div">
          <UserProfile user={sessionUser} />
        </div>
      </div>
      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)} >
          {/* <div className="upload-modal-container"> */}
          <UploadSong setShowUploadModal={setShowUploadModal} />
          {/* </div> */}
        </Modal>
      )}

    </nav>
  );
  return (
    <>{sessionLinks}</>
  );
};

export default NavBar;
