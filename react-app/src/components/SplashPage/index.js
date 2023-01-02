import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSongs } from "../../store/song";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../auth/SignUpForm";
import { Modal } from "../Context/Modal";
import Logo from "../Icons/Logo";
import GridDisplay from "../LibraryPage/Likes/GridDisplay";

import "./SplashPage.css";

const SplashPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const songs = useSelector((state) => Object.values(state.songs));

  useEffect(() => {
    if (sessionUser != null) history.push('/');
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
    <div className="splashpage_container">
      <div className="imagebox">
        <div className="imagetoptitle">
          <div className="splash-header-logo-div">
            <div className="splash-header-wrapper flex-row-center">
              <Logo />
              <h2> SoundTown</h2>
            </div>
          </div>

          <div className="soundcloudbuttons">
            <button
              className="signuptitle cursor-pointer"
              onClick={openLoginModal}
            >Sign In</button>
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
            <button
              className="caccounttitle cursor-pointer"
              onClick={openSignUpModal}
            >Create account</button>
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
          </div>
        </div>
        <h3 className="imagebox_inner_title">
          What's next in music is first on SoundTown
        </h3>
        <p className="imagebox_inner_para">
          Upload your first track and begin your journey. SoundTown gives you
          space to create, find your fans, and connect with other artists.
        </p>
        <div className="splash_logo">
          <Logo />
        </div>
      </div>
      <div className="flex-column splashpage_title_songs_container">
        <div className="splashpage_inner_title_container">
          Hear what’s trending for free in the SoundTown community
        </div>
        <div className="splashpage_song_container flex-row" onClick={() => setShowLoginModal(true)}>
          <GridDisplay likedSongs={songs?.slice(0, 8)} />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
