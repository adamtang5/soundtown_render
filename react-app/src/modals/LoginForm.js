import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../store/session";
import { FaUserAlt } from 'react-icons/fa';
import { IoLogOutSharp } from 'react-icons/io5';
import SimpleButton from "../components/Buttons/SimpleButton";
import "./auth.css";

const AuthFormInput = ({
  name,
  type = "text",
  placeholder,
  value,
  setValue,
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => setValue(e.target.value)}
      required
    />
  );
};

const LoginForm = ({ setShowLoginModal, setShowSignUpModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));

    if (data) {
      setErrors(data);
      return;
    }

    return () => {
      history.push("/");
      setShowLoginModal(false);
    };
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
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const buttonData = {
    demo: {
      label: (<><FaUserAlt /> Continue with Demo User</>),
      onClick: demoLogin,
      classes: ['demo'],
    },
    toggle: {
      label: (<><IoLogOutSharp className="proF-icon" /> Create Account Here</>),
      onClick: toggleModals,
      classes: ['toggle'],
    },
    login: {
      label: "Continue to SoundTown",
      type: "submit",
      classes: ['submit'],
    },
  }

  return (
    <form className="flex-column" onSubmit={onLogin}>
      <SimpleButton
        label={buttonData.demo.label}
        onClick={buttonData.demo.onClick}
        classes={buttonData.demo.classes}
      />

      <SimpleButton
        label={buttonData.toggle.label}
        onClick={buttonData.toggle.onClick}
        classes={buttonData.toggle.classes}
      />

      <div className="divider flex-column">
        <div className="div-line" />
        <h3>or</h3>
      </div>

      <AuthFormInput
        name="email"
        placeholder="Your email address"
        value={email}
        setValue={setEmail}
      />

      <AuthFormInput
        name="password"
        type="password"
        placeholder="Your password"
        value={password}
        setValue={setPassword}
      />

      <div>
        {errors.map((error, ind) => (
          <div key={ind} className="error-text" >{error}</div>
        ))}
      </div>

      <SimpleButton
        label={buttonData.login.label}
        type={buttonData.login.type}
        classes={buttonData.login.classes}
      />

      <p className="legal">
        When registering, you agree that we will not use your provided
        data from the registration and we won't send you notifications on
        our products and services. You can not unsubscribe from our non-existent
        notifications at this time in your settings. For non-existent additional
        info please do not refer to our fake <span style={{ color: 'blue', cursor: 'not-allowed' }}>Privacy Policy</span>.
      </p>
    </form>
  );
};

export default LoginForm;
