import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaShareAlt } from "react-icons/fa";

export default function PostInfo({ username, timestamp, userpic, title }) {
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLocation(window.location.href);
  }, []);

  return (
    <div className="flex md:flex-col justify-between items-center md:items-start space-y-8 dark:bg-slate-700 bg-gray-300 p-4 rounded-xl">
      <div className="post-details flex flex-col dark:text-stone-200 text-slate-800 ">
        <div className="flex items-center space-x-2">
          <h4>Post by:</h4>
          <Link passHref href={`/user/${username}`}>
            <img
              className="rounded-full w-10 h-10 cursor-pointer object-cover"
              src={userpic}
              alt=""
            />
          </Link>
          <Link passHref href={`/user/${username}`}>
            <span className="post-user font-handLee">{username}</span>
          </Link>
        </div>
        <p>posted at: {timestamp}</p>
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="text-lg font-base">Share Post</h2>
        <div className="flex space-x-4">
          <Link
            passHref
            href={`https://www.facebook.com/sharer/sharer.php?u=${location}`}
          >
            <a target="_blank">
              <FaFacebook className="share-icon text-blue-500" />
            </a>
          </Link>
          <Link
            passHref
            href={`https://twitter.com/intent/tweet?text="${title}..."&url=${location}`}
          >
            <a target="_blank">
              <FaTwitter className="share-icon text-blue-400" />
            </a>
          </Link>
        </div>
        {/* <FaShareAlt className="share-icon text-yellow-300" /> */}
      </div>
    </div>
  );
}
