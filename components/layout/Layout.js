import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { navActions } from "../store/nav-slice";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

function Layout({ children }) {
  return (
    <>
      <div className="pancake">
        <Navbar />
        <BackDrop />
        <section className="max-w-7xl mx-auto my-8 space-y-16 py-8 px-4 min-h-[80vh]">
          {children}
        </section>
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
      } fixed top-0 left-0 bg-black opacity-50 w-screen h-screen z-[5]`}
    ></div>
  );
}

export default Layout;
