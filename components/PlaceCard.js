import React from "react";
import Image from "next/image";
import Link from "next/link";
// import parser from "html-react-parser";

function PlaceCard({ id, title, image, desc, username, timestamp, summary }) {
  // console.log(desc);
  // LINK IS LINKING TO THE POST ID
  return (
    <div className="p-4 block w-full sm:w-1/2 lg:w-1/3">
      <div className="relative rounded">
        <div className="overflow-hidden mb-3">
          <Link passHref href={`/post/${id}`}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="w-full h-60 object-center object-cover cursor-pointer hover:scale-110 transition-all rounded-2xl"
              />
            }
          </Link>
        </div>
        {/* INFO */}
        <div className="space-y-1">
          <span className="px-2 py-1 font-medium bg-blue-200 rounded-lg text-md text-blue-500">
            Latest
          </span>
          <Link passHref href={`/post/${id}`}>
            <h2 className="font-bold text-2xl capitalize cursor-pointer hover:underline">
              {title}
            </h2>
          </Link>
          <p className="hidden sm:block leading-tight capitalize font-light text-md">
            {summary.substring(0, 43)}...
            <Link passHref href={`/post/${id}`}>
              <span className="cursor-pointer text-blue-400 text-sm hover:underline">
                read more
              </span>
            </Link>
          </p>
          <div className="post-details">
            <h4 className="">
              Posted by:
              <Link passHref href={`/user/${username}`}>
                <span className="hover:underline cursor-pointer px-2">
                  {username}
                </span>
              </Link>
            </h4>
            <span>Published {timestamp}</span>
          </div>
        </div>
        {/* END OF INFO */}
      </div>
    </div>
  );
}

export default PlaceCard;
