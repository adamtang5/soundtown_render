import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SearchBox = () => {
  const songs = useSelector(state => state.songs);
  const playlists = useSelector(state => state.playlists);
  const songsArr = Object.values(songs);
  const playlistsArr = Object.values(playlists);
  const playlistsAndSongs = songsArr.concat(playlistsArr);

  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");

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

  return (
    <div className="flex-row-center navbar-input-container">
      <div className="navbar-search-container">
        <input
          className="navbar-search"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {showResults && (
          <div className="search-results">
            <ul>
              {playlistsAndSongs?.filter((playlistOrSong) =>
                playlistOrSong.title.toLowerCase().startsWith(searchInput.toLowerCase())
              ).length ? playlistsAndSongs?.filter((playlistOrSong) =>
                playlistOrSong.title.toLowerCase().startsWith(searchInput.toLowerCase())
              )
                .map((playlistOrSong) =>
                  playlistOrSong.songs ? (
                    <li key={playlistOrSong?.id} className="flex-row search-results-li">
                      <img
                        className="search-results-img"
                        src={playlistOrSong?.image_url}
                        alt={playlistOrSong?.title}
                      />
                      <a
                        href={`/playlists/${playlistOrSong?.id}`}
                        className="search-results-a"
                      >
                        {playlistOrSong?.title}
                      </a>
                    </li>
                  ) : songs[playlistOrSong?.id] && songs[playlistOrSong?.id]?.title === playlistOrSong?.title && (
                    <li key={playlistOrSong?.id} className="flex-row search-results-li">
                      <img
                        className="search-results-img"
                        src={playlistOrSong?.image_url}
                        alt={playlistOrSong?.title}
                      />
                      <a
                        href={`/songs/${playlistOrSong?.id}`}
                        className="search-results-a"
                      >
                        {playlistOrSong?.title}
                      </a>
                    </li>
                  )
                ) : playlistsAndSongs?.filter((playlistOrSong) =>
                  playlistOrSong?.title?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length ? playlistsAndSongs?.filter((playlistOrSong) =>
                  playlistOrSong?.title?.toLowerCase()?.includes(searchInput?.toLowerCase())
                )
                  .map((playlistOrSong) => playlistOrSong.songs ? (
                    <li key={playlistOrSong?.id} className="flex-row search-results-li">
                      <img
                        className="search-results-img"
                        src={playlistOrSong?.image_url}
                        alt={playlistOrSong?.title}
                      />
                      <a
                        href={`/playlists/${playlistOrSong?.id}`}
                        className="search-results-a"
                      >
                        {playlistOrSong?.title}
                      </a>
                    </li>
                  ) :
                    songs[playlistOrSong?.id] && songs[playlistOrSong?.id].title === playlistOrSong?.title &&
                    (
                      <li key={playlistOrSong?.id} className="flex-row search-results-li">
                        <img
                          className="search-results-img"
                          src={playlistOrSong?.image_url}
                          alt={playlistOrSong?.title}
                        />
                        <a
                          href={`/songs/${playlistOrSong?.id}`}
                          className="search-results-a"
                        >
                          {playlistOrSong?.title}
                        </a>
                      </li>
                    )
                  ) : (
                <>
                  <li className="flex-row search-results-empty">
                    <div className="search-results-a">
                      Nothing Found
                    </div>
                  </li>
                </>
              )
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
