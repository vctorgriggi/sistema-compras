import { Navigate } from "react-router-dom";
import { useContext } from "react";

import CircularIndeterminate from "../components/CircularIndeterminate";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { authenticating, user } = useContext(AuthContext);

  if (authenticating) {
    return (
      <CircularIndeterminate
        sx={{
          height: "100vh",
          alignItems: "center",
        }}
      />
    );
  }

  return user ? children : <Navigate to="/sign-in" />;
}
