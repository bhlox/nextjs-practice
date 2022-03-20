import Link from "next/link";
import React from "react";
import { FaHandPointRight } from "react-icons/fa";

function SearchCard({
  author,
  image,
  title,
  category,
  summary,
  id,
  searchQuery,
}) {
  const re = new RegExp(`\\b${searchQuery.split(" ").join("|")}\\b`, "gi");

  return (
    <div className="mx-auto max-w-max flex flex-col items-center md:items-start md:flex-row dark:bg-slate-700 bg-gray-300 rounded-b-xl md:rounded-r-xl md:space-x-1">
      {/* POST IMAGE */}
      <Link passHref href={`/post/${id}`}>
        <div className="cursor-pointer overflow-hidden group">
          <img
            className="w-96 h-72 md:h-96 object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl group-hover:scale-110 transition-all"
            src={image}
            alt=""
          />
        </div>
        {/* END POST IMAGE */}
      </Link>

      {/* POST INFO */}
      <div className="md:h-96 md:flex md:flex-col md:justify-between">
        <div className="space-y-4 p-4 md:pt-2 w-96">
          <div className="relative">
            <Link passHref href={`/post/${id}`}>
              <h2
                className="text-2xl font-medium cursor-pointer hover:underline"
                dangerouslySetInnerHTML={{
                  __html: title.replace(re, (match) => {
                    return `<span class='font-extrabold'>${match}</span>`;
                  }),
                }}
              >
                {/* {title} */}
              </h2>
            </Link>
            <Link passHref href={`/blogs/${category}`}>
              <span className=" text-lg capitalize font-light bg-blue-400 px-1 rounded cursor-pointer absolute -bottom-7 right-4 outline outline-2 outline-blue-400 hover:bg-transparent transition-all">
                {category}
              </span>
            </Link>
          </div>

          <Link passHref href={`/user/${author.username}`}>
            <div className="flex max-w-max items-center space-x-2 cursor-pointer group">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={author.userpic}
                alt=""
              />
              <h4 className="text-xl group-hover:underline">
                {author.username}
              </h4>
            </div>
          </Link>

          <div className=" border-t-2 pt-2">
            <h4
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: summary.replace(re, (match) => {
                  return `<span class='font-extrabold'>${match}</span>`;
                }),
              }}
            ></h4>
          </div>
        </div>

        <div className="p-4 j">
          <Link passHref href={`/post/${id}`}>
            <button className="bg-green-600 w-full rounded text-lg flex items-center justify-center gap-x-2 hover:bg-transparent outline outline-2 outline-green-600 transition-all duration-300">
              <FaHandPointRight /> Read more
            </button>
          </Link>
        </div>
      </div>
      {/* END POST INFO */}
    </div>
  );
}

export default SearchCard;

// REGEXP AND REPLACE WITH JSX
// https://stackoverflow.com/questions/8644428/how-to-highlight-text-using-javascript
// https://stackoverflow.com/questions/65974063/react-js-jsx-returns-object-object-instead-of-string
// https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
// https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
