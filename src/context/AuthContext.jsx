import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

import { getStorageItem, removeStorageItem } from "../utils/local-storage";
import { signIn, signUp } from "../services/authService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    authenticateUser();
  }, []);

  /* auth handlers */
  const handleSignIn = async (formData) => {
    try {
      const user = await signIn(formData.email, formData.password);
      setUser(user);
      navigate("/");
    } catch (error) {
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSignUp = async (formData) => {
    try {
      const user = await signUp(formData.email, formData.password);
      setUser(user);
      navigate("/");
    } catch (error) {
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSignOut = () => {
    try {
      removeStorageItem("accessToken");
      setUser(null);
      navigate("/sign-in");
    } catch (error) {
      throw error;
    } finally {
      setAuthenticating(false);
    }
  };

  const authenticateUser = () => {
    const token = getStorageItem("accessToken");
    if (token) {
      setUser({ name: "John Doe", email: "johndoe@siscomp.br" });
    }
    setAuthenticating(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticating,
        user,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
