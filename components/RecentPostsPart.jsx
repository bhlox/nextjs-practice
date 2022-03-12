import Link from "next/link";

export default function RecentPostsPart({ recentPosts }) {
  console.log(recentPosts);
  return (
    <div>
      <h2 className="text-4xl my-4 font-bold">Recent Posts</h2>
      <div className="flex flex-wrap">
        {recentPosts.map((post) => (
          <div key={post.id} className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2">
            <div className="p-2">
              <div className="bg-slate-700 rounded-xl h-96 group">
                <div className="relative">
                  <div className="overflow-hidden">
                    <Link passHref href={`/post/${post.id}`}>
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-48 object-cover rounded-t-xl group-hover:scale-125 transition-all duration-300 cursor-pointer"
                      />
                    </Link>
                  </div>
                  <span className="absolute top-1 right-1 px-2 py-1 font-medium bg-blue-200 rounded-lg text-md text-blue-500 capitalize">
                    {post.category}
                  </span>
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
                  <p className="text-base font-extralight">{post.timestamp}</p>
                  <Link passHref href={`/user/${post.author.username}`}>
                    <img
                      className="absolute -top-12 right-5 rounded-full h-[4.5rem] w-[4.5rem] object-cover border-2 cursor-pointer"
                      src={post.author.userpic}
                      alt=""
                    />
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
