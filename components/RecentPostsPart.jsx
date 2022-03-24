import Link from "next/link";

export default function RecentPostsPart({ recentPosts, headline }) {
  // console.log(recentPosts);
  return (
    <div className="font-handLee">
      {headline && <h2 className="text-4xl my-4 font-bold">Recent Posts</h2>}
      <div className="flex flex-wrap">
        {recentPosts.map((post) => (
          <div
            key={Math.random() * 2767313}
            className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 dark:text-gray-200 shadow-xl"
          >
            <div className="p-2">
              <div className="dark:bg-slate-700 bg-stone-200 rounded-xl h-96 group">
                <div className="relative">
                  <div className="overflow-hidden">
                    <Link passHref href={`/post/${post.id}`}>
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-48 object-cover rounded-t-xl group-hover:scale-125 transition-all duration-300 cursor-pointer"
                        />
                      }
                    </Link>
                  </div>
                  <Link passHref href={`/blogs/${post.category}`}>
                    <div className="absolute top-1 right-1 px-2 py-1 font-medium bg-blue-200 rounded-lg text-md text-blue-500 capitalize cursor-pointer hover:bg-transparent outline outline-2 outline-blue-200 transition-all duration-300">
                      <h2>{post.category}</h2>
                    </div>
                  </Link>
                </div>
                <div className="relative space-y-3 p-4">
                  <Link passHref href={`/user/${post.author.username}`}>
                    <span className="text-xl font-light hover:text-blue-400 hover:underline cursor-pointer">
                      {post.author.username}
                    </span>
                  </Link>
                  <Link passHref href={`/post/${post.id}`}>
                    <h2 className="text-2xl font-semibold hover:underline cursor-pointer">
                      {post.title.substring(0, 45)}...
                    </h2>
                  </Link>
                  <p className="text-base font-extralight font-sans">
                    {post.timestamp}
                  </p>
                  <Link passHref href={`/user/${post.author.username}`}>
                    {
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="absolute -top-12 right-5 rounded-full h-[4.5rem] w-[4.5rem] object-cover border-2 cursor-pointer"
                        src={post.author.userpic}
                        alt=""
                      />
                    }
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
