import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSongs } from "../store/song";
import AuthForm from "../modals/AuthForm";
import { Modal } from "../components/Context/Modal";
import Logo from "../components/Icons/Logo";
import ShowcaseSongs from "../components/ShowcaseSongs";
import "./SplashPage.css";

const SplashPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [authMode, setAuthMode] = useState("login");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const songsArr = useSelector(state => Object.values(state.songs));

  useEffect(() => {
    if (sessionUser) history.push('/home');
  }, []);

  useEffect(() => {
    dispatch(getAllSongs());
  }, [dispatch]);

  return (
    <>
      <header className="splash-banner flex-column">
        <header className="splash-banner-header flex-row">
          <div className="splash-banner-header-logo flex-row">
            <Logo />
            <h2 className="splash-banner-header-logo-text">SoundTown</h2>
          </div>
          <nav className="splash-banner-header-nav">
            <ul className="flex-row">
              <li>
                <button
                  className="login-button cursor-pointer"
                  onClick={() => {
                    setAuthMode("login")
                    setShowAuthModal(true)
                  }}
                >Sign In</button>
              </li>
              <li>
                <button
                  className="signup-button cursor-pointer"
                  onClick={() => {
                    setAuthMode("signup")
                    setShowAuthModal(true)
                  }}
                >Create account</button>
              </li>
            </ul>
            {showAuthModal && (
              <Modal
                onClose={() => setShowAuthModal(false)}
                position="top"
              >
                <div className="login_modal_container">
                  <AuthForm
                    mode={authMode}
                    setMode={setAuthMode}
                    setShowModal={setShowAuthModal}
                  />
                </div>
              </Modal>
            )}
          </nav>
        </header>
        <section className="splash-blurb flex-column">
          <h3>What's next in music is first on SoundTown</h3>
          <p>
            Upload your first track and begin your journey. SoundTown gives you
            space to create, find your fans, and connect with other artists.
          </p>
          <Logo />
        </section>
      </header>

      <main className="container flex-column">
        <section className="splash-showcase flex-column">
          <ShowcaseSongs
            songs={songsArr}
            h3="Hear what's trending for free in the SoundTown community"
            setShowModal={() => {
              setAuthMode("login")
              setShowAuthModal(true)
            }}
          />
        </section>
      </main>
    </>
  );
};

export default SplashPage;
