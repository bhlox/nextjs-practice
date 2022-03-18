import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

function PlaceCard({
  id,
  title,
  image,
  desc,
  username,
  timestamp,
  summary,
  self,
  postsId,
  setDidDelete,
  setPostsId,
  category,
}) {
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);

  const handleDeletePost = async () => {
    const auth = getAuth();
    const userRef = doc(db, "users", auth.currentUser.uid);
    const docRef = doc(db, "posts", id);
    try {
      // const userData = await getDoc(userRef);
      // const posts = userData.data().posts;
      const newPosts = postsId.filter((post) => post !== id);
      // console.log(postsId);

      await deleteDoc(docRef);
      await updateDoc(userRef, { posts: newPosts });
      setPostsId(newPosts);
      // setDidDelete(true);
      console.log("post deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  return (
    <div className="p-4 block w-full sm:w-1/2 lg:w-1/3">
      <div
        onMouseLeave={() => setShowPostOptions(false)}
        className="relative rounded bg-slate-700 group"
      >
        <div className="overflow-hidden mb-3">
          <Link passHref href={`/post/${id}`}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="w-full h-60 object-center object-cover cursor-pointer group-hover:scale-110 transition-all rounded-t-2xl"
              />
            }
          </Link>
        </div>
        {/* INFO */}
        <div className="space-y-2 p-4 pt-1">
          <span className="px-2 py-1 font-medium bg-blue-200 rounded-lg text-md text-blue-500 capitalize">
            {category}
          </span>
          <Link passHref href={`/post/${id}`}>
            <h2 className="font-bold text-2xl capitalize cursor-pointer hover:underline">
              {title}
            </h2>
          </Link>
          <p className="hidden sm:block leading-tight capitalize font-light text-md">
            {summary.substring(0, 43)}...
            <Link passHref href={`/post/${id}`}>
              <span className="cursor-pointer text-blue-400 text-sm hover:underline">
                read more
              </span>
            </Link>
          </p>
          <div className="post-details">
            <div className="flex justify-between relative">
              <span>Published {timestamp}</span>
              {self && (
                <button
                  onClick={() => setShowPostOptions((prev) => !prev)}
                  className="text-4xl absolute bottom-0 right-0 hover:opacity-80"
                >
                  <HiDotsHorizontal />
                </button>
              )}
              {showPostOptions && (
                <div className="flex flex-col space-y-2 absolute bottom-9 right-9 p-2 bg-slate-500 divide-y-2 rounded-xl z-10">
                  <button onClick={() => router.push(`/add-place/${id}`)}>
                    Edit post
                  </button>
                  <button onClick={() => setShowDeleteMsg((prev) => !prev)}>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* END OF INFO */}
      </div>
      {showDeleteMsg && (
        <div
          className="fixed top-0 left-0 h-screen w-screen z-10 flex justify-center items-center bg-slate-800 bg-opacity-40 backdrop-blur-[1px]"
          onClick={() => setShowDeleteMsg(false)}
        >
          <div className="bg-slate-700 p-6 flex flex-col justify-center items-center space-y-8 max-w-sm rounded-xl">
            <h2>
              You are about this delete this post &lsquo;
              <span className="font-bold text-lg">{title}</span>&lsquo;
            </h2>
            <div className="flex space-x-4 items-center">
              <button
                className="rounded-xl p-2 border-2 hover:opacity-80"
                onClick={() => setShowDeleteMsg(false)}
              >
                Hold on for now
              </button>
              <button
                onClick={handleDeletePost}
                className="rounded-xl p-2 border-2 hover:opacity-80"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaceCard;
