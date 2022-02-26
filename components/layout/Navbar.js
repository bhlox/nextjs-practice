import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth();

  const { isLoggedIn } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    signOut(auth);
    dispatch(userActions.noUser());
    router.push("/");
    console.log("ok signed out");
  };

  return (
    <nav className="bg-orange-500">
      <div className="flex justify-between max-w-7xl mx-auto py-2">
        <Link href="/">logo</Link>
        <div className="space-x-4">
          <Link passHref href="/add-place">
            <a
              className={
                router.pathname == "/add-place" ? "nav-active" : "nav-link"
              }
            >
              Add-place
            </a>
          </Link>
          <Link passHref href="/profile">
            <a
              className={
                router.pathname == "/profile" ? "nav-active" : "nav-link"
              }
            >
              Profile
            </a>
          </Link>
          {!isLoggedIn && (
            <Link passHref href="/sign-in">
              <a
                className={
                  router.pathname == "/sign-in" ? "nav-active" : "nav-link"
                }
              >
                Sign-in
              </a>
            </Link>
          )}
          {!isLoggedIn && (
            <Link passHref href="/sign-up">
              <a
                className={
                  router.pathname == "/sign-up" ? "nav-active" : "nav-link"
                }
              >
                Sign-up
              </a>
            </Link>
          )}
          {isLoggedIn && (
            <Link passHref href="/">
              <a className="nav-link" onClick={handleSignOut}>
                Sign-out
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
