import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthenticationContext } from "../context/AuthenticationContext";

export default function PrivateRoute({ children }) {
  const { authenticating, user } = useContext(AuthenticationContext);

  if (authenticating) {
    return <p>Authenticating...</p>;
  }

  return user ? children : <Navigate to="/sign-in" />;
}
