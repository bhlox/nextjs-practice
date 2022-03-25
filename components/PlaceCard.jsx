import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import DeleteModal from "./DeleteModal";

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
      const newPosts = postsId.filter((post) => post !== id);
      // console.log(postsId);

      const docSnapshot = await getDoc(docRef);
      const commentsIdList = docSnapshot.data().comments;

      for (const commentId of commentsIdList) {
        const commentRef = doc(db, "comments", commentId);
        const commentSnapshot = await getDoc(commentRef);
        // console.log({ ...commentSnapshot.data() });

        const commenterUseruid = commentSnapshot.data().author.useruid;
        const commenterRef = doc(db, "users", commenterUseruid);
        // console.log({ ...commenterSnapshot.data() });
        // console.log(
        //   "this is commenterCommentsIdList",
        //   commenterCommentsIdList,
        //   "this is commentId",
        //   commentId
        // );
        await updateDoc(commenterRef, { comments: arrayRemove(commentId) });

        const repliesIdList = commentSnapshot.data().replies;
        for (const replyId of repliesIdList) {
          const replyRef = doc(db, "replies", replyId);
          await deleteDoc(replyRef);
          await updateDoc(commenterRef, { replies: arrayRemove(replyId) });
          // console.log(
          //   "this is commenterRepliesIdList",
          //   commenterRepliesIdList,
          //   "this is replyId",
          //   replyId
          // );
        }
        await deleteDoc(commentRef);
      }

      await deleteDoc(docRef);
      await updateDoc(userRef, { posts: newPosts });
      setPostsId(newPosts);
      setDidDelete(true);
      // console.log("post deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  return (
    <div className="p-4 block w-full sm:w-1/2 lg:w-1/3">
      <div
        onMouseLeave={() => setShowPostOptions(false)}
        className="relative rounded dark:text-stone-200 text-slate-800 bg-gray-300 dark:bg-slate-700 group"
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
          <Link passHref href={`/blogs/${category}`}>
            <span className="px-2 py-1 font-medium bg-blue-200 rounded-lg text-md text-blue-500 capitalize cursor-pointer hover:bg-transparent transition-all outline outline-2 outline-blue-200">
              {category}
            </span>
          </Link>
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
                  className="text-4xl dark:text-stone-200 text-slate-800 absolute bottom-0 right-0 hover:opacity-80"
                >
                  <HiDotsHorizontal />
                </button>
              )}
              {showPostOptions && (
                <div className="flex flex-col space-y-2 absolute bottom-9 right-9 p-2 bg-slate-500 divide-y-2 rounded-xl z-10">
                  <button
                    className="hover:underline text-xl"
                    onClick={() => router.push(`/add-post/${id}`)}
                  >
                    Edit post
                  </button>
                  <button
                    className="hover:underline text-xl"
                    onClick={() => setShowDeleteMsg(true)}
                  >
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
        <DeleteModal
          setShowDeleteMsg={setShowDeleteMsg}
          handleDelete={handleDeletePost}
          title={title}
        />
      )}
    </div>
  );
}

export default PlaceCard;
