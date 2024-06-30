import React, { useEffect, useState, createContext } from "react";

import { getStorageItem, removeStorageItem } from "../utils/local-storage";

const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = getStorageItem("@user:accessToken");

      //   if(token) {
      //     try {
      //       const user = await validateToken(token);
      //       setUser(user);
      //     } catch (error) {
      //       console.log("error validating token:", error);
      //       removeStorageItem("@user:accessToken");
      //     }
      //   }

      if (token) {
        setUser({ name: "Victor", email: "victor.gsilva@siscomp.br" });
      }

      setAuthenticating(false);
    };

    checkToken();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ authenticating, user, setUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
