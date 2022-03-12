import PlaceCard from "./PlaceCard";

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
    <div>
      <h2 className="text-3xl font-semibold">
        {self ? "Your" : currentUsername} Posts
      </h2>
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
    </div>
  );
}
