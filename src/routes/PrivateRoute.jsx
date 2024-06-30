import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import CircularInderteminate from "../components/CircularIndeterminate";
import { AuthenticationContext } from "../context/AuthenticationContext";

export default function PrivateRoute({ children }) {
  const { authenticating, user } = useContext(AuthenticationContext);

  if (authenticating) {
    return (
      <CircularInderteminate
        sx={{
          height: "100vh",
          alignItems: "center",
        }}
      />
    );
  }

  return user ? children : <Navigate to="/sign-in" />;
}
