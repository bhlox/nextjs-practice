import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { navActions } from "../store/nav-slice";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import ScrollToTop from "./ScrollToTop";

function Layout({ children }) {
  const dispatch = useDispatch();

  const { darkMode } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(navActions.closeProfile());
    dispatch(navActions.closeBlogs());
    dispatch(navActions.blurSearch());
  };

  return (
    <>
      <div
        className={`${
          darkMode
            ? "dark overflow-hidden relative"
            : "overflow-hidden relative"
        }`}
      >
        <Navbar />
        <BackDrop />
        <div
          className={`dark:bg-slate-800 py-8 dark:text-zinc-200 bg-stone-200`}
        >
          <section
            onClick={handleClose}
            className="max-w-7xl mx-auto space-y-16 py-8 px-4 min-h-[80vh] relative overflow-hidden"
          >
            {children}
            <ScrollToTop />
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

function BackDrop() {
  const { showSide } = useSelector((state) => state.nav);
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(navActions.close())}
      className={`${
        showSide ? "block" : "hidden"
      } fixed top-0 left-0 bg-black opacity-50 w-screen h-screen z-20`}
    ></div>
  );
}

export default Layout;
