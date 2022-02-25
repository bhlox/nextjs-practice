import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Navbar() {
  const router = useRouter();

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
          <Link passHref href="/register">
            <a
              className={
                router.pathname == "/register" ? "nav-active" : "nav-link"
              }
            >
              Register
            </a>
          </Link>
          <Link passHref href="/sign-up">
            <a
              className={
                router.pathname == "/sign-up" ? "nav-active" : "nav-link"
              }
            >
              Sign-up
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
