import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto my-8">{children}</section>
    </>
  );
}

export default Layout;
