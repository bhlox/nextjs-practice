import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.config";
import { useAuthContext } from "./context/auth-context";
import { commentsActions } from "./store/comments-slice";

function Comment({
  content,
  author,
  timestamp,
  userCommentIds,
  id: commentId,
  postId,
}) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  // const [isUserCommentOwner, setisUserCommentOwner] = useState(false);

  const { userCommentOwner } = useSelector((state) => state.comments);
  const { commentsId } = useSelector((state) => state.comments);

  // console.log(userCommentOwner);
  // console.log(commentsId);
  // console.log(userCommentIds);

  useEffect(() => {
    // console.log("is usercommentowner effect running");
    if (commentsId && userCommentIds) {
      dispatch(
        commentsActions.isUserCommentOwner(
          commentsId.some((id) => {
            if (userCommentIds?.includes(id)) return true;
          })
        )
      );
    }
  }, [userCommentIds, commentsId]);

  const handleDelete = async () => {
    const userRef = doc(db, "users", user.uid);
    const commentRef = doc(db, "comments", commentId);
    const postRef = doc(db, "posts", postId);

    try {
      await deleteDoc(commentRef);
      await updateDoc(userRef, { comments: arrayRemove(commentId) });
      await updateDoc(postRef, { comments: arrayRemove(commentId) });
      dispatch(commentsActions.deleteIdFromComments(commentId));
      console.log("comment deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 border-b-[1px] pb-4 dark:border-gray-500 border-gray-300">
      <div>
        <img
          className="h-20 w-20 rounded-full object-cover"
          src={author.userpic}
          alt=""
        />
      </div>
      <div className="space-y-1">
        <div className="flex space-x-2 items-center">
          <h3>{author.username}</h3>
          <p className="font-light text-sm">{timestamp}</p>
        </div>
        <p className="">{content}</p>
        <div className="flex space-x-2 pt-3 dark:text-stone-300">
          {userCommentOwner && (
            <span className="hover:underline hover:text-blue-400 cursor-pointer">
              Edit
            </span>
          )}
          {userCommentOwner && (
            <span
              onClick={handleDelete}
              className="hover:underline hover:text-blue-400 cursor-pointer"
            >
              Delete
            </span>
          )}
          <span className="hover:underline hover:text-blue-400 cursor-pointer">
            Reply
          </span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
