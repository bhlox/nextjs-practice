import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";

import { GiHamburgerMenu } from "react-icons/gi";
import { FaCaretDown, FaPencilAlt } from "react-icons/fa";
import { navActions } from "../store/nav-slice";
import { categories } from "../Tiptap";
import { BiNotepad } from "react-icons/bi";

// import logo from "../../public/newreadit.png";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth();

  const { isLoggedIn } = useSelector((state) => state.user);
  const { showSide } = useSelector((state) => state.nav);
  const { showProfileOptions } = useSelector((state) => state.nav);
  const { showBlogOptions } = useSelector((state) => state.nav);

  const searchInput = useRef();

  const firstName = auth.currentUser?.displayName?.split(" ")[0] ?? "";

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

  const handleSearch = (e) => {
    e.preventDefault();

    router.push(`/search?title=${searchInput.current.value}`);
  };

  return (
    <nav className="bg-purple-500 px-4 py-2 font-sans relative">
      <div className="flex justify-between max-w-7xl mx-auto py-2 ">
        <Link passHref href="/">
          <div
            onMouseEnter={() => {
              dispatch(navActions.closeProfile());
              dispatch(navActions.closeBlogs());
            }}
            className="cursor-pointer flex items-center space-x-1"
          >
            <img
              className="h-10 w-10 object-cover"
              src="/newreadit.png"
              alt=""
            />
            <h2
              className={
                router.pathname == "/"
                  ? "text-black text-3xl font-medium"
                  : "text-2xl font-light"
              }
            >
              Readis
            </h2>
          </div>
        </Link>
        <div className="flex space-x-6 items-center">
          <div className="relative">
            <form onSubmit={handleSearch}>
              <input
                ref={searchInput}
                id="search"
                type="text"
                placeholder="Search..."
              />
            </form>
          </div>
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
            }  h-screen max-w-xs flex flex-col pt-24 px-4 space-y-6 z-10 md:space-x-0 md:max-w-screen-xl md:h-auto md:pt-0 md:px-0 md:space-y-0 md:static md:flex-row md:gap-x-8 transition-all duration-300 items-center`}
          >
            <Link passHref href="/add-place">
              <h4
                onMouseEnter={() => {
                  dispatch(navActions.closeProfile());
                  dispatch(navActions.closeBlogs());
                }}
                className={
                  router.pathname == "/add-place"
                    ? "nav-active flex items-center gap-x-1"
                    : "nav-link flex items-center gap-x-1"
                }
              >
                <span>
                  <FaPencilAlt />
                </span>
                Post thought
              </h4>
            </Link>
            <div
              onMouseEnter={() => dispatch(navActions.closeProfile())}
              className="relative space-y-2"
            >
              <h2
                onClick={() => dispatch(navActions.toggleBlogs())}
                // className="nav-link flex gap-x-1 items-center"
                className={
                  router.pathname == "/blogs/[category]"
                    ? "nav-active flex items-center gap-x-1"
                    : "nav-link flex items-center gap-x-1"
                }
              >
                <span>
                  <BiNotepad />
                </span>
                Blogs
                <span>
                  <FaCaretDown
                    className={`${
                      showBlogOptions ? "rotate-180" : "rotate-0"
                    } transition-all text-xl`}
                  />
                </span>
              </h2>
              <div
                className={`${
                  showBlogOptions ? "flex" : "hidden"
                } flex-wrap p-1 md:p-2 gap-y-2 md:absolute md:w-[28rem] md:top-10 md:-left-44 md:bg-purple-500`}
              >
                {categories.map((category) => (
                  <Link
                    key={Math.random() * 15353}
                    passHref
                    href={`/blogs/${category}`}
                  >
                    <h4
                      className="capitalize text-xl font-base cursor-pointer hover:underline w-1/2 md:w-1/3"
                      onClick={() => {
                        dispatch(navActions.closeBlogs());
                        dispatch(navActions.close());
                      }}
                    >
                      {category}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            {isLoggedIn && auth.currentUser && (
              <>
                {/* <Link passHref href="/profile"> */}
                <div
                  onMouseEnter={() => dispatch(navActions.closeBlogs())}
                  onClick={() => dispatch(navActions.toggleProfile())}
                  className="cursor-pointer flex flex-col items-center space-x-1 relative space-y-2 "
                >
                  <div className="flex space-x-1 items-center hover:opacity-80">
                    <img
                      className="rounded-full w-10 h-10"
                      src={auth.currentUser.photoURL}
                      alt=""
                    />
                    <h3
                      // onClick={() => dispatch(navActions.close())}
                      className={
                        router.pathname == "/profile" ? "nav-active" : "text-xl"
                      }
                    >
                      {firstName}
                    </h3>

                    <FaCaretDown
                      className={`${
                        showProfileOptions ? "rotate-180" : "rotate-0"
                      } transition-all text-xl`}
                    />
                  </div>
                  <div
                    className={`${
                      showProfileOptions ? "block md:top-12" : "hidden"
                    } space-y-4 md:absolute md:bg-purple-500 transition-all duration-300 md:p-2`}
                  >
                    <Link passHref href="/profile">
                      <h3
                        className="nav-link border-b-2 pb-2"
                        onClick={() => dispatch(navActions.close())}
                      >
                        Profile
                      </h3>
                    </Link>
                    <Link passHref href="/login-info">
                      <h3
                        className="nav-link border-b-2 pb-2"
                        onClick={() => dispatch(navActions.close())}
                      >
                        Change password
                      </h3>
                    </Link>
                    <Link passHref href="/">
                      <h3 className="nav-link " onClick={handleSignOut}>
                        Sign-out
                      </h3>
                    </Link>
                  </div>
                </div>
                {/* </Link> */}
              </>
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
            {/* {isLoggedIn && (
            <Link passHref href="/">
              <a className="nav-link" onClick={handleSignOut}>
                Sign-out
              </a>
            </Link>
          )} */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

// NAVLINK ACTIVE COMPONENT LIKE IN REACT-ROUTER : https://dev.to/yuridevat/how-to-add-styling-to-an-active-link-in-nextjs-593e
