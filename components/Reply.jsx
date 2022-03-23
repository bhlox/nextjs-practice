import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.config";
import { useAuthContext } from "./context/auth-context";
import { commentsActions } from "./store/comments-slice";

function Reply({ author, content, timestamp, id, setReplyIdList, commentId }) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { currentUserData } = useSelector((state) => state.comments);
  // const { activeCommentId } = useSelector((state) => state.comments);

  const [isReplyOwner, setIsReplyOwner] = useState(false);

  // console.log(currentUserData);

  useEffect(() => {
    if (currentUserData.repliesIds.includes(id)) {
      setIsReplyOwner(true);
    }
  }, []);

  const handleDelete = async () => {
    const replyRef = doc(db, "replies", id);
    const commentRef = doc(db, "comments", commentId);
    const userRef = doc(db, "users", user.uid);
    try {
      await deleteDoc(replyRef);
      await updateDoc(commentRef, { replies: arrayRemove(id) });
      await updateDoc(userRef, { replies: arrayRemove(id) });
      console.log("reply deleted");
      setReplyIdList((prev) => prev.filter((entry) => entry !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {};

  return (
    <div className="flex space-x-2">
      <div>
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={author.userpic}
          alt=""
        />
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex space-x-2">
            <h3>{author.username}</h3>
            <p>{timestamp}</p>
          </div>
          <p>{content}</p>
        </div>
        {isReplyOwner && (
          <div className="space-x-2">
            <span
              onClick={handleEdit}
              className="cursor-pointer hover:underline hover:text-blue-400"
            >
              Edit
            </span>
            <span
              onClick={handleDelete}
              className="cursor-pointer hover:underline hover:text-blue-400"
            >
              Delete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reply;
