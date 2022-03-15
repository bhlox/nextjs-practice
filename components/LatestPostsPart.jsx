import Link from "next/link";

export default function LatestPostsPart({ latestPosts }) {
  // console.log(latestPosts);

  return (
    <div className="flex space-x-8">
      <div className="md:w-2/3 relative group">
        <div>
          <Link passHref href={`/post/${latestPosts[0].id}`}>
            <img
              className="w-full h-[33rem] md:h-[28rem] object-cover rounded-2xl object-center cursor-pointer transition-all duration-300 group-hover:brightness-75"
              src={latestPosts[0].image}
              alt=""
            />
          </Link>
        </div>
        <div className="absolute top-0 left-0 p-4 space-y-8 overflow-hidden">
          <Link passHref href={`/post/${latestPosts[0].id}`}>
            <h2 className="text-2xl md:text-3xl max-w-md font-bold cursor-pointer hover:underline hover:opacity-80">
              {latestPosts[0].title}
            </h2>
          </Link>
          <p className="max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-1000 capitalize text-xl font-light -translate-y-24 group-hover:translate-y-0">
            {latestPosts[0].summary}
          </p>
        </div>
        <div className="absolute bottom-0 sm:bottom-20 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 flex flex-col md:flex-row justify-center items-center sm:items-start space-y-2 md:space-y-0 md:space-x-3 py-2 px-4">
          <div>
            <Link passHref href={`/user/${latestPosts[0].author.username}`}>
              <img
                className="rounded-full w-14 h-14 cursor-pointer "
                src={latestPosts[0].author.userpic}
                alt=""
              />
            </Link>
          </div>
          <div className="text-center sm:text-left">
            <Link passHref href={`/user/${latestPosts[0].author.username}`}>
              <h4 className="text-xl font-medium cursor-pointer hover:underline hover:opacity-80">
                {latestPosts[0].author.username}
              </h4>
            </Link>
            <p className="text-base font-light">{latestPosts[0].timestamp}</p>
          </div>
        </div>
        <Link passHref href={`/blogs/${latestPosts[0].category}`}>
          <div className="hidden sm:block absolute bottom-0 right-0 px-4 py-2 cursor-pointer hover:scale-110 transition-all">
            <p className="text-lg bg-slate-500 text-gray-50 rounded-xl px-2 py-1 capitalize">
              {latestPosts[0].category}
            </p>
          </div>
        </Link>
      </div>

      <div className="relative md:w-1/3 group">
        <div>
          <Link passHref href={`/post/${latestPosts[1].id}`}>
            <img
              className="w-full h-[33rem] md:h-[28rem] object-cover rounded-2xl object-center cursor-pointer transition-all duration-300 group-hover:brightness-75"
              src={latestPosts[1].image}
              alt=""
            />
          </Link>
        </div>
        <div className="absolute top-0 left-0 p-4 space-y-8">
          <Link passHref href={`/post/${latestPosts[1].id}`}>
            <h2 className="text-2xl md:text-3xl max-w-md font-bold hover:underline hover:opacity-80 cursor-pointer">
              {latestPosts[1].title}
            </h2>
          </Link>
          <p className="max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-1000 capitalize text-xl font-light -translate-y-24 group-hover:translate-y-0">
            {latestPosts[1].summary}
          </p>
        </div>
        <div className="absolute bottom-0 sm:bottom-20 md:bottom-10 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 flex flex-col sm:flex-col-reverse justify-center items-center sm:items-start space-y-2 sm:gap-2 py-2 px-4">
          <div>
            <Link passHref href={`/user/${latestPosts[1].author.username}`}>
              <img
                className="rounded-full w-14 h-14 cursor-pointer"
                src={latestPosts[1].author.userpic}
                alt=""
              />
            </Link>
          </div>
          <div className="text-center sm:text-left">
            <Link passHref href={`/user/${latestPosts[0].author.username}`}>
              <h4 className="text-xl font-medium cursor-pointer hover:underline hover:opacity-80">
                {latestPosts[1].author.username}
              </h4>
            </Link>
            <p className="text-base font-light">{latestPosts[1].timestamp}</p>
          </div>
        </div>
        <Link passHref href={`/blogs/${latestPosts[1].category}`}>
          <div className="hidden sm:block absolute bottom-0 right-0 px-4 py-2 cursor-pointer hover:scale-110 transition-all">
            <p className="text-lg bg-slate-500 text-gray-50 rounded-xl px-2 py-1 capitalize">
              {latestPosts[1].category}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
