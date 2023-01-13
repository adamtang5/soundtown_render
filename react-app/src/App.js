import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "./store/session";
import { getAllUsers } from "./store/user";
import { getAllSongs } from "./store/song";
import { getAllPlaylists } from "./store/playlist";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ModalProvider } from "./components/Context/Modal";
import NavBar from "./components/NavBar";
import SplashPage from "./components/SplashPage";
import HomePage from "./components/HomePage";
import ExplorePage from "./components/ExplorePage";
import LibraryPage from "./components/LibraryPage";
import UploadSong from "./components/SongFolders/UploadSongForm";
import EditSongForm from "./components/SongFolders/EditSongForm";
import SingleSong from "./components/SongFolders/SingleSong";
import Audio from "./components/AudioPlayer/Audio";
import PlaylistsPage from "./components/PlaylistFolders/PlaylistsPage";
import NewUsersPage from "./components/NewUserPage";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await dispatch(getAllSongs());
      await dispatch(getAllPlaylists());
      await dispatch(getAllUsers());
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <ModalProvider>
      <BrowserRouter>
        {sessionUser != null && <NavBar />}
        <Switch>
          <Route path="/" exact={true}>
            {sessionUser != null ? <Redirect to="/home" /> : <Redirect to="/welcome" />}
          </Route>
          <Route path="/welcome">
            <SplashPage />
          </Route>
          <ProtectedRoute path="/home">
            <HomePage />
          </ProtectedRoute>
          <ProtectedRoute path="/explore">
            <ExplorePage />
          </ProtectedRoute>
          <ProtectedRoute path="/library">
            <LibraryPage />
          </ProtectedRoute>
          <Route path="/upload-song" exact={true}>
            <UploadSong />
          </Route>
          <Route path="/songs/:id/edit" exact={true}>
            <EditSongForm />
          </Route>
          <ProtectedRoute path="/songs/:id" exact={true}>
            <SingleSong />
          </ProtectedRoute>
          <ProtectedRoute path="/users/:userId">
            {/* <UserPage />  noels users page */}
            <NewUsersPage />
          </ProtectedRoute>
          <ProtectedRoute path="/playlists/:id" exact={true}>
            <PlaylistsPage />
          </ProtectedRoute>
          <Route>
            <p>not found</p>
          </Route>
        </Switch>
        <Audio />
      </BrowserRouter>
    </ModalProvider>
  );
};

export default App;
