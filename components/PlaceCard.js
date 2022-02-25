import React from "react";
import Image from "next/image";
import Link from "next/link";

function PlaceCard({ id, title, photo }) {
  return (
    <Link passHref href="/:profileId/:postId">
      <div className="p-4 block w-1/2 lg:w-1/3  ">
        <div className="relative rounded css-console">
          <div className="">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={title}
                className="w-full h-60 object-center object-cover cursor-pointer"
              />
            }
          </div>
          <div className="absolute bottom-0">
            <h2>title</h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
