import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { signUp } from "../store/session";
import { FaUserAlt } from 'react-icons/fa';
import { IoLogOutSharp } from 'react-icons/io5';
import { login } from "../store/session";
import "./auth.css";

const SignUpForm = ({ setShowSignUpModal, setShowLoginModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(email, password));
      if (!data.sucess) {
        setErrors(data);
        return;
      }

      return () => {
        history.push("/");
        setShowSignUpModal(false);
      };
    } else {
      setErrors(['Passwords must match.']);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("demo@aa.io", "password"));
    if (data) {
      setErrors(data);
      return;
    }
    history.push("/");
    setShowLoginModal(false);
  };

  const toggleModals = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <form className="flex-column" onSubmit={onSignUp}>
      <button
        className="login_form_btn cursor-pointer or-shdw-hov"
        type="submit"
        onClick={demoLogin}
      >
        <FaUserAlt /> Continue with Demo User
      </button>
      <button
        className="login_form_btn cursor-pointer toggle-sign-up or-shdw-hov "
        type="submit"
        onClick={toggleModals}
      >
        <IoLogOutSharp className="proF-icon" /> Continue to Log In
      </button>

      <div className="half-Div">
        <div className="half-line"></div>
        <h3>or</h3>
        <div className="half-line"></div>
      </div>

      <div className="form_field">
        <input
          placeholder="email"
          style={{ marginBottom: '10px' }}

          className="field"
          type="text"
          name="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>
      <div className="form_field">
        <input
          placeholder="password"
          style={{ marginBottom: '10px' }}

          className="field"
          type="password"
          name="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>
      <div className="form_field">
        <input
          className="field"

          type="password"
          name="repeat_password"
          onChange={e => setRepeatPassword(e.target.value)}
          value={repeatPassword}
          required={true}
          placeholder="confirm password"
        />
      </div>

      <div>
        {errors.map((error, ind) => (
          <div key={ind} className="error-text">{error}</div>
        ))}
      </div>

      <div className="form_button flex-row">
        <button className="login_form_btn cursor-pointer cnt-login or-shdw-hov" type="submit">
          Accept {'&'} Continue
        </button>
      </div>

      <div className="priv-tag-div">
        <p className="priv-tag">
          When registering, you agree that we will not use your provided
          data from the registration and we won't send you notifications on
          our products and services. You can not unsubscribe from our non-existent
          notifications at this time in your settings. For non-existent additional
          info please do not refer to our fake <span style={{ color: 'blue', cursor: 'not-allowed' }}>Privacy Policy</span>.
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
