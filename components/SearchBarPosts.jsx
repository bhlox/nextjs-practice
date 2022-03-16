import Link from "next/link";
import React from "react";

function SearchBarPosts({ title, image, author, id, setSearchTerm }) {
  console.log(title);
  return (
    <>
      <Link passHref href={`/post/${id}`}>
        <div
          onClick={() => setSearchTerm("")}
          className="flex space-x-2 cursor-pointer"
        >
          <div>
            <img
              className="h-10 w-20 object-cover rounded"
              src={image}
              alt=""
            />
          </div>
          <div>
            <h3 className=" text-xs">{title}</h3>
          </div>
        </div>
      </Link>
    </>
  );
}

export default SearchBarPosts;
