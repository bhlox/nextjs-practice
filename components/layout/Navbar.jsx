import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { MdEmail } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoSignIn } from "react-icons/go";
import { BsPersonPlusFill, BsPersonSquare, BsGearFill } from "react-icons/bs";
import { RiSunLine, RiMoonClearLine } from "react-icons/ri";
import { FaCaretDown, FaPencilAlt, FaSearch } from "react-icons/fa";
import { navActions } from "../store/nav-slice";
import { categories } from "../Tiptap";
import { BiNotepad, BiExit } from "react-icons/bi";
import useDebounce from "../hooks/useDebounce";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import SearchBarPosts from "../SearchBarPosts";
import conjunctionsAndPreps from "../../utils/conjunctionList";
import { uiActions } from "../store/ui-slice";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth();

  const colRef = collection(db, "posts");

  const { isLoggedIn } = useSelector((state) => state.user);
  const { showSide } = useSelector((state) => state.nav);
  const { showProfileOptions } = useSelector((state) => state.nav);
  const { showBlogOptions } = useSelector((state) => state.nav);
  const { showSearch } = useSelector((state) => state.nav);
  const { isSearchBarFocus } = useSelector((state) => state.nav);
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPosts, setSearchPosts] = useState([]);

  const searchInputRef = useRef();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchTerm("");
    // dispatch(navActions.closeSearch());
    router.push(`/search?q=${searchTerm}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchSearch = async () => {
    if (
      !searchInputRef.current.value ||
      searchInputRef.current.value.trim().length <= 2
    ) {
      setSearchPosts([]);
      return;
    }

    try {
      const posts = await getDocs(colRef);
      const postsData = [];
      posts.docs.forEach((doc) => {
        postsData.push({
          title: doc
            .data()
            .title.split(" ")
            .map((word) => word.toLowerCase())
            .join(" "),
          id: doc.id,
        });
      });

      const matchedPostsId = [];
      postsData.forEach((data) => {
        searchTerm.split(" ").forEach((query) => {
          if (
            data.title.split(" ").includes(query) ||
            data.title.split(" ").some((word) => word.startsWith(query))
          ) {
            if (
              !conjunctionsAndPreps.includes(query) &&
              !matchedPostsId.includes(data.id) &&
              matchedPostsId.length <= 3
            ) {
              matchedPostsId.push(data.id);
              console.log(matchedPostsId.length);
            }
          }
        });
      });

      const matchedPosts = [];
      for (const postId of matchedPostsId) {
        const docRef = doc(db, "posts", postId);
        const post = await getDoc(docRef);
        matchedPosts.push({
          ...post.data(),
          timestamp: post.data().timestamp.toDate().toDateString(),
          id: post.id,
        });
      }
      setSearchPosts(matchedPosts);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      dispatch(uiActions.darkModeOn());
    } else {
      dispatch(uiActions.darkModeOff());
    }
  }, [dispatch]);

  useDebounce(() => fetchSearch(), 1000, [searchTerm]);

  return (
    <>
      <nav className={`bg-purple-500 px-4 py-1 relative font-handLee`}>
        <div className="flex justify-between max-w-7xl mx-auto py-2 text-slate-800 dark:text-zinc-200">
          <Link passHref href="/">
            <div
              onClick={() => {
                dispatch(navActions.closeProfile());
                dispatch(navActions.closeBlogs());
                dispatch(navActions.blurSearch());
              }}
              className="cursor-pointer flex items-center space-x-1 relative"
            >
              {
                // eslint-disable-next-line @next/next/no-img-element
              }
              <h2
                className={
                  router.pathname == "/"
                    ? "text-gray-100 dark:text-slate-800 text-5xl font-medium"
                    : "text-3xl font-light"
                }
              >
                Readis
              </h2>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={
                    router.pathname == "/"
                      ? "h-[4.25rem] w-[4.25rem] object-cover absolute -bottom-2 -right-12 hidden sm:inline"
                      : "h-[3.75rem] w-[3.75rem] object-cover absolute -bottom-2 -right-12"
                  }
                  src="/images/logo_website_2.png"
                  alt=""
                />
              }
            </div>
          </Link>
          <div className="flex space-x-6 items-center">
            <div
              className={`relative ${
                showSearch ? "w-56 md:w-80" : "w-[60px] overflow-hidden"
              } transition-all duration-500 rounded-full bg-transparent`}
            >
              <form onSubmit={handleSubmit}>
                <input
                  id="search"
                  type="text"
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onClick={() => {
                    dispatch(navActions.focusSearch());
                    dispatch(navActions.closeProfile());
                    dispatch(navActions.closeBlogs());
                  }}
                  autoComplete="none"
                  className={`pl-16 py-2 pr-8 appearance-none outline-none rounded-full w-full${
                    showSearch ? "" : ""
                  }`}
                />
                <div
                  onClick={(e) => {
                    dispatch(navActions.toggleSearch());
                    if (!showSearch) searchInputRef.current.focus();
                    if (searchInputRef.current.value) handleSubmit(e);
                  }}
                  className={`absolute text-2xl group ${
                    showSearch
                      ? "bg-red-400 top-1/2 left-0 -translate-y-1/2 cursor-pointer h-14 flex items-center w-14 justify-center rounded-full"
                      : "bg-purple-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-14 flex items-center w-full justify-center cursor-pointer"
                  } `}
                >
                  <FaSearch className="group-hover:opacity-80" />
                </div>
                {searchInputRef.current?.value && (
                  <span
                    onClick={() => {
                      setSearchTerm("");
                      searchInputRef.current.focus();
                    }}
                    className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-2xl cursor-pointer text-gray-500 hover:opacity-80"
                  >
                    X
                  </span>
                )}
              </form>
              {searchTerm && isSearchBarFocus && (
                <div className="absolute px-2 py-4 top-14 left-4 space-y-2 bg-red-400 md:w-80 rounded-xl z-10">
                  {searchPosts.map((post, i) => {
                    if (i > 3) return;
                    return (
                      <SearchBarPosts
                        key={post.id}
                        {...post}
                        setSearchTerm={setSearchTerm}
                        searchTerm={searchTerm}
                      />
                    );
                  })}
                  {searchTerm && (
                    <Link passHref href={`/search?q=${searchTerm}`}>
                      <div
                        onClick={() => {
                          dispatch(navActions.blurSearch());
                        }}
                        className="cursor-pointer hover:opacity-80 flex items-center space-x-2"
                      >
                        <FaSearch />
                        <h3>Search for: {searchTerm}</h3>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                handleToggle();
                dispatch(navActions.blurSearch());
              }}
              className={`${
                showSide ? "text-slate-900" : ""
              } lg:hidden text-4xl z-50 transition-all duration-200`}
            >
              <GiHamburgerMenu />
            </button>
            <div
              className={`absolute bg-purple-500 top-0 ${
                showSide ? "right-0" : "-right-[80%]"
              }  h-screen max-w-xs flex flex-col pt-24 px-4 space-y-6 z-30 lg:max-w-screen-xl lg:h-auto lg:pt-0 lg:px-0 lg:space-y-0 lg:static lg:flex-row lg:gap-x-5 transition-all duration-300 items-center`}
            >
              {auth.currentUser && (
                <Link passHref href="/add-post">
                  <h4
                    onClick={() => {
                      dispatch(navActions.closeProfile());
                      dispatch(navActions.closeBlogs());
                      dispatch(navActions.blurSearch());
                      dispatch(navActions.close());
                    }}
                    className={
                      router.pathname == "/add-post"
                        ? "nav-active flex items-center gap-x-1"
                        : "nav-link flex items-center gap-x-1 hover:scale-125"
                    }
                  >
                    <span>
                      <FaPencilAlt />
                    </span>
                    Post
                  </h4>
                </Link>
              )}
              <div
                onClick={() => {
                  dispatch(navActions.closeProfile());
                  dispatch(navActions.blurSearch());
                }}
                className="relative space-y-2"
              >
                <h2
                  onClick={() => dispatch(navActions.toggleBlogs())}
                  className={
                    router.pathname == "/blogs/[category]"
                      ? "nav-active flex items-center gap-x-1"
                      : "nav-link flex items-center gap-x-1 hover:scale-125"
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
                  } flex-wrap p-1 lg:p-2 gap-y-2 lg:absolute lg:w-[28rem] lg:top-10 lg:-left-44 lg:bg-purple-500`}
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

              {/* CONTACT LINK*/}
              <Link passHref href="/contact">
                <h4
                  onClick={() => {
                    dispatch(navActions.closeProfile());
                    dispatch(navActions.closeBlogs());
                    dispatch(navActions.blurSearch());
                    dispatch(navActions.close());
                  }}
                  className={
                    router.pathname == "/contact"
                      ? "nav-active flex items-center gap-x-1"
                      : "nav-link flex items-center gap-x-1 hover:scale-125"
                  }
                >
                  <span>
                    <MdEmail />
                  </span>
                  Contact
                </h4>
              </Link>
              {/* END CONTACT LINK */}

              {/* THEME BTN */}
              <div className="flex items-center text-2xl space-x-1">
                <div
                  className={`flex items-center relative w-13 h-7  rounded-full cursor-pointer ${
                    darkMode ? "bg-gray-800" : "bg-gray-300"
                  }`}
                >
                  <span>
                    <RiMoonClearLine />
                  </span>
                  <button
                    className={`text-3xl  w-6 h-6 rounded-full absolute transition-all duration-300 hover:bg-white ${
                      darkMode
                        ? "translate-x-0 bg-gray-200"
                        : "translate-x-6 bg-slate-700"
                    }`}
                    onClick={() => dispatch(uiActions.toggleDark())}
                  ></button>
                  <span>
                    <RiSunLine className="text-yellow-400" />
                  </span>
                </div>
              </div>
              {/* END THEME BTN */}

              {isLoggedIn && auth.currentUser && (
                <>
                  {/* <Link passHref href="/profile"> */}
                  <div
                    onClick={() => {
                      dispatch(navActions.closeBlogs());
                      dispatch(navActions.blurSearch());
                      dispatch(navActions.toggleProfile());
                    }}
                    className="cursor-pointer flex flex-col items-center space-x-1 relative space-y-2 "
                  >
                    <div className="flex space-x-1 items-center hover:opacity-80">
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="rounded-full w-10 h-10"
                          src={auth.currentUser.photoURL}
                          alt=""
                        />
                      }
                      <h3
                        // onClick={() => dispatch(navActions.close())}
                        className={
                          router.pathname == "/profile"
                            ? "nav-active"
                            : "text-xl"
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
                          className="nav-link dark:border-stone-200 border-slate-800 border-b-2 pb-2 flex items-center gap-x-3"
                          onClick={() => dispatch(navActions.close())}
                        >
                          <BsPersonSquare /> Profile
                        </h3>
                      </Link>
                      <Link passHref href="/login-info">
                        <h3
                          className="nav-link dark:border-stone-200 border-slate-800 border-b-2 pb-2 flex items-center gap-x-3"
                          onClick={() => dispatch(navActions.close())}
                        >
                          <BsGearFill className="text-2xl" /> Change password
                        </h3>
                      </Link>
                      <Link passHref href="/">
                        <h3
                          className="nav-link flex items-center gap-x-3"
                          onClick={handleSignOut}
                        >
                          <BiExit /> Sign-out
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
                      router.pathname == "/sign-in"
                        ? "nav-active flex items-center gap-x-1"
                        : "nav-link flex items-center gap-x-1 hover:scale-125"
                    }
                  >
                    <GoSignIn /> Sign-in
                  </a>
                </Link>
              )}
              {!isLoggedIn && (
                <Link passHref href="/sign-up">
                  <a
                    onClick={() => dispatch(navActions.close())}
                    className={
                      router.pathname == "/sign-up"
                        ? "nav-active flex items-center gap-x-1 border-4 dark:border-gray-200 border-slate-800 py-1 px-2 rounded-xl"
                        : "nav-link flex items-center gap-x-1 border-4 dark:border-gray-200 border-slate-800 py-1 px-2 rounded-xl relative group"
                    }
                  >
                    <span className="absolute top-0 left-0 w-0 group-hover:w-full -z-10 h-full bg-red-400 transition-all duration-700"></span>
                    <BsPersonPlusFill /> Sign-up
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

// NAVLINK ACTIVE COMPONENT LIKE IN REACT-ROUTER : https://dev.to/yuridevat/how-to-add-styling-to-an-active-link-in-nextjs-593e
