import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    dispatch(userActions.verify());
    onAuthStateChanged(auth, (user) => {
      console.log("current user is:", user);

      if (user) {
        // console.log(auth.currentUser);
        setUser(user);
        dispatch(userActions.success());
      }
    });
  }, [auth, dispatch]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
