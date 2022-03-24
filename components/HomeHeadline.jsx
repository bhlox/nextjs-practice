import Link from "next/link";
import React from "react";
import { FiChevronsRight } from "react-icons/fi";

function HomeHeadline({ username, didPost }) {
  return (
    <div className="mx-auto flex flex-col md:flex-row md:justify-between items-center justify-center space-y-6 font-handLee">
      <div className="space-y-2">
        <h2 className="text-5xl">
          {!username ? "Readis Thoughts" : didPost ? "Welcome back" : "Welcome"}{" "}
        </h2>
        <h2 className="text-6xl italic font-semibold text-orange-400 text-center">
          &quot;{username ? username : "Blogs"}&quot;
        </h2>
        <p className="hidden sm:block max-w-sm text-center md:text-left font-sans">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
          aspernatur accusamus. Odit!
        </p>

        <Link passHref href={`${username ? "/add-post" : "/sign-up"} `}>
          <a className="nav-link flex items-center gap-x-1 border-4 dark:border-gray-200 border-slate-800 py-1 px-2 rounded-xl relative group max-w-max mx-auto md:mx-0 z-10 text-3xl">
            <span className="absolute top-0 left-0 w-0 group-hover:w-full -z-10 h-full bg-red-400 transition-all duration-700"></span>
            <FiChevronsRight />
            {!username
              ? "Sign me up now"
              : didPost
              ? "Have another thought?"
              : "Post your first now"}
          </a>
        </Link>
      </div>
      <div>
        <div className="w-full">
          <img
            className=" h-80 md:h-[40rem] w-full object-contain"
            src={
              !username
                ? "/images/Vector_Landing.png"
                : didPost
                ? "/images/Vector_landing-3.png"
                : "/images/Vector_landing-2.png"
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default HomeHeadline;
