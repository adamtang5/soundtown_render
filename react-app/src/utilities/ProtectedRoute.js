import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = (props) => {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <Route {...props}>
      {sessionUser ? props.children : <Redirect to="/welcome" />}
    </Route>
  );
};

export default ProtectedRoute;
