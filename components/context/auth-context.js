import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import nookies from "nookies";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    dispatch(userActions.verify());
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // console.log(auth.currentUser);
        setUser(user);
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
        dispatch(userActions.success());
      } else {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
      }
    });
  }, [auth, dispatch]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
