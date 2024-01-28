import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "./store/session";
import { getAllSongs } from "./store/song";
import ProtectedRoute from "./utilities/ProtectedRoute";
import { ModalProvider } from "./components/Context/Modal";
import AudioProvider from "./context/AudioContext";
import NavBar from "./components/NavBar";
import SplashPage from "./pages/SplashPage";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import UserPage from "./pages/UserPage";
import SingleSong from "./pages/SingleSong";
import SongPlaylists from "./pages/SongPlaylists";
import SinglePlaylist from "./pages/SinglePlaylist";
import Audio from "./components/AudioPlayer/Audio";
import Sandbox from "./pages/Sandbox";

const App = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await dispatch(getAllSongs());
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <ModalProvider>
      <AudioProvider>
        <BrowserRouter>
          {sessionUser !== null && <NavBar />}
          <Switch>
            <Route path="/" exact={true}>
              {sessionUser !== null ? <Redirect to="/home" /> : <Redirect to="/welcome" />}
            </Route>
            <Route path="/welcome">
              <SplashPage />
            </Route>
            <ProtectedRoute path="/home">
              <Home />
            </ProtectedRoute>
            <ProtectedRoute path="/explore">
              <Explore />
            </ProtectedRoute>
            <ProtectedRoute path="/library">
              <Library />
            </ProtectedRoute>
            <ProtectedRoute path="/users/:id">
              <UserPage />
            </ProtectedRoute>
            <ProtectedRoute path="/songs/:id" exact={true}>
              <SingleSong />
            </ProtectedRoute>
            <ProtectedRoute path="/songs/:id/playlists" exact={true}>
              <SongPlaylists />
            </ProtectedRoute>
            <ProtectedRoute path="/playlists/:id" exact={true}>
              <SinglePlaylist />
            </ProtectedRoute>
            <ProtectedRoute path="/sandbox">
              <Sandbox />
            </ProtectedRoute>
            <Route>
              <p>not found</p>
            </Route>
          </Switch>
          <Audio />
        </BrowserRouter>
      </AudioProvider>
    </ModalProvider>
  );
};

export default App;
