import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSongs } from "../../store/song";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../auth/SignUpForm";
import { Modal } from "../Context/Modal";
import Logo from "../Icons/Logo";
import ShowcaseSongs from "../SongFolders/SongList/ShowcaseSongs";
import "./SplashPage.css";

const SplashPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const songsArr = useSelector(state => Object.values(state.songs));

  useEffect(() => {
    if (sessionUser) history.push('/home');
  }, []);

  const openLoginModal = () => {
    if (showLoginModal) return;
    setShowLoginModal(true);
  };
  const openSignUpModal = () => {
    if (showSignUpModal) return;
    setShowSignUpModal(true);
  };

  useEffect(() => {
    dispatch(getAllSongs());
  }, [dispatch]);

  return (
    <main className="page-container one-column flex-column">
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
                  onClick={openLoginModal}
                >Sign In</button>
              </li>
              <li>
                <button
                  className="signup-button cursor-pointer"
                  onClick={openSignUpModal}
                >Create account</button>
              </li>
            </ul>
            {showLoginModal && (
              <Modal onClose={() => setShowLoginModal(false)}>
                <div className="login_modal_container">
                  <LoginForm
                    setShowLoginModal={setShowLoginModal}
                    setShowSignUpModal={setShowSignUpModal}
                  />
                </div>
              </Modal>
            )}
            {showSignUpModal && (
              <Modal onClose={() => setShowSignUpModal(false)}>
                <div className="login_modal_container">
                  <SignUpForm
                    setShowSignUpModal={setShowSignUpModal}
                    setShowLoginModal={setShowLoginModal}
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
      <section className="splash-showcase flex-column">
        <ShowcaseSongs
          songs={songsArr}
          h3="Hear what's trending for free in the SoundTown community"
          setShowLoginModal={setShowLoginModal}
        />
      </section>
    </main>
  );
};

export default SplashPage;
