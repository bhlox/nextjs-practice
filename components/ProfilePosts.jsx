import PlaceCard from "./PlaceCard";

export default function ProfilePosts({
  self,
  currentUsername,
  userPosts,
  postsId,
  setDidDelete,
}) {
  const fixedPosts = userPosts.map((post) => ({
    ...post,
    timestamp: post.timestamp.toDate().toDateString(),
  }));

  return (
    <div>
      <h2 className="text-3xl font-semibold">
        {self ? "Your" : currentUsername} Posts{" "}
      </h2>
      <div className="flex flex-wrap">
        {fixedPosts.map((post) => (
          <PlaceCard
            key={post.id}
            {...post}
            self={true}
            setDidDelete={setDidDelete}
            postsId={postsId}
          />
        ))}
      </div>
    </div>
  );
}
