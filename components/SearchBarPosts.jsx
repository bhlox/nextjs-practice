import Link from "next/link";
import React from "react";
import { FaReadme } from "react-icons/fa";

function SearchBarPosts({ title, image, author, id, setSearchTerm }) {
  return (
    <>
      <Link passHref href={`/post/${id}`}>
        <div
          onClick={() => setSearchTerm("")}
          className="flex space-x-2 cursor-pointer pb-2  border-b-[1px] hover:opacity-80"
        >
          <div className="flex space-x-2 items-center">
            <FaReadme className="text-2xl" />
            <h3 className="text-md">{title}</h3>
          </div>
        </div>
      </Link>
    </>
  );
}

export default SearchBarPosts;
