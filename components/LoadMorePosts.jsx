import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { homePostsActions } from "./store/home-posts-slice";

function LoadMorePosts({ setRecentPosts }) {
  const colRef = collection(db, "posts");

  const [lastPost, setLastPost] = useState({});
  const [isNextAvailable, setIsNextAvailable] = useState(true);

  const handleFetchMore = async () => {
    try {
      const nextSet = query(
        colRef,
        orderBy("timestamp", "desc"),
        startAfter(lastPost),
        limit(14)
      );
      const snapshot = await getDocs(nextSet);

      console.log(snapshot.docs.length);

      const posts = [];
      snapshot.forEach((doc) =>
        posts.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.toDate().toDateString(),
        })
      );
      // console.log(posts);

      setRecentPosts((prev) => [...prev, ...posts]);
      if (snapshot.docs.length <= 14) {
        throw new Error("no more posts");
      }
      setLastPost(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      setIsNextAvailable(false);
      console.log(error);
    }
  };

  const firstSet = async () => {
    const q = query(colRef, orderBy("timestamp", "desc"), limit(14));

    const snapshot = await getDocs(q);
    setLastPost(snapshot.docs[snapshot.docs.length - 1]);
  };

  useEffect(() => {
    firstSet();
  }, []);

  return (
    <>
      {isNextAvailable && (
        <div className="flex justify-center border-t-2 relative">
          <button
            onClick={handleFetchMore}
            className="rounded-2xl p-2 bg-slate-500 text-2xl font-light absolute -top-7 left-1/2 -translate-x-1/2 hover:scale-110 transition-all"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}

export default LoadMorePosts;
