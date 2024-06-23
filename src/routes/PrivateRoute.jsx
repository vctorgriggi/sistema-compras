import { Navigate } from "react-router-dom";

import { checkUserAuthenticated } from "../functions/check-user-authenticated";

export function PrivateRoute({ children }) {
  const user = checkUserAuthenticated();

  return user ? children : <Navigate to="/sign-in" />;
}
