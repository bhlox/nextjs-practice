import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";

import { GiHamburgerMenu } from "react-icons/gi";
import { navActions } from "../store/nav-slice";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth();

  const { isLoggedIn } = useSelector((state) => state.user);
  const { showSide } = useSelector((state) => state.nav);

  const handleSignOut = async () => {
    signOut(auth);
    dispatch(userActions.noUser());
    dispatch(navActions.toggle());
    dispatch(navActions.close());
    router.push("/");
    console.log("ok signed out");
  };

  const handleToggle = () => {
    dispatch(navActions.toggle());
  };

  return (
    <nav className="bg-purple-500 font-mono px-4 py-2">
      <div className="flex justify-between max-w-7xl mx-auto py-2">
        <Link href="/">logo</Link>
        <button
          onClick={handleToggle}
          className={`${
            showSide ? "text-slate-900" : ""
          } md:hidden text-4xl z-20 transition-all duration-200`}
        >
          <GiHamburgerMenu />
        </button>
        <div
          className={`absolute bg-purple-500 top-0 ${
            showSide ? "right-0" : "-right-[80%]"
          }  h-screen max-w-xs flex flex-col pt-24 px-4 space-y-6 z-10 md:space-x-0 md:max-w-screen-xl md:h-auto md:pt-0 md:px-0 md:space-y-0 md:static md:flex-row md:gap-x-8 transition-all duration-300`}
        >
          <Link passHref href="/add-place">
            <a
              onClick={() => dispatch(navActions.close())}
              className={
                router.pathname == "/add-place" ? "nav-active" : "nav-link"
              }
            >
              Post thought
            </a>
          </Link>
          {isLoggedIn && (
            <Link passHref href="/profile">
              <a
                onClick={() => dispatch(navActions.close())}
                className={
                  router.pathname == "/profile" ? "nav-active" : "nav-link"
                }
              >
                Profile
              </a>
            </Link>
          )}
          {!isLoggedIn && (
            <Link passHref href="/sign-in">
              <a
                onClick={() => dispatch(navActions.close())}
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
                onClick={() => dispatch(navActions.close())}
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

// NAVLINK ACTIVE COMPONENT LIKE IN REACT-ROUTER : https://dev.to/yuridevat/how-to-add-styling-to-an-active-link-in-nextjs-593e
