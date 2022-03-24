import Link from "next/link";
import PlaceCard from "./PlaceCard";
import { BiRightArrowCircle } from "react-icons/bi";

export default function ProfilePosts({
  self,
  currentUsername,
  userPosts,
  postsId,
  setDidDelete,
  setPostsId,
}) {
  // console.log(userPosts);
  const fixedPosts = userPosts;

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold">
        {self ? "Your" : currentUsername}&apos;s Posts
      </h2>
      {!fixedPosts.length && (
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-light">
            You have not posted yet. Why not give it a shot
          </h2>
          <Link passHref href="/add-post">
            <h3 className="cursor-pointer hover:underline hover:text-blue-400 flex items-center gap-x-1 text-xl">
              take me there now
              <span>
                <BiRightArrowCircle />
              </span>
            </h3>
          </Link>
        </div>
      )}
      {fixedPosts && (
        <div className="flex flex-wrap">
          {fixedPosts.map((post) => (
            <PlaceCard
              key={post.id}
              {...post}
              self={self}
              setDidDelete={setDidDelete}
              postsId={postsId}
              setPostsId={setPostsId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
