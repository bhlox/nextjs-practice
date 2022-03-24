import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.config";
import { useAuthContext } from "./context/auth-context";
import { commentsActions } from "./store/comments-slice";
import ReplyTextarea from "./ReplyTextarea";
import { FaFeatherAlt } from "react-icons/fa";
import Link from "next/link";

function Reply({
  setActiveReplyId,
  activeReplyId,
  author,
  content,
  timestamp,
  id,
  setReplyIdList,
  commentId,
  setReplyList,
  replyIdList,
}) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  const { currentUserData } = useSelector((state) => state.comments);
  const { isReplying } = useSelector((state) => state.comments);
  const { postAuthorUsername } = useSelector((state) => state.comments);

  // const { activeCommentId } = useSelector((state) => state.comments);

  const [isReplyOwner, setIsReplyOwner] = useState(false);
  const [toBeEditedContent, setToBeEditedContent] = useState("");

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

  const handleEdit = async () => {
    setActiveReplyId(id);
    dispatch(commentsActions.setIsReplying(true));
    dispatch(commentsActions.setActiveCommentId(""));
    const replyRef = doc(db, "replies", id);
    try {
      const snapshot = await getDoc(replyRef);
      setToBeEditedContent(snapshot.data().content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex space-x-2">
      <div>
        <Link passHref href={`/user/${author.username}`}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              src={author.userpic}
              alt=""
            />
          }
        </Link>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex space-x-2">
            <div className="flex gap-x-[0.15rem]">
              <Link passHref href={`/user/${author.username}`}>
                <h3 className="text-lg hover:underline cursor-pointer hover:text-blue-400">
                  {author.username}
                </h3>
              </Link>
              {postAuthorUsername === author.username && (
                <p>
                  <FaFeatherAlt />
                </p>
              )}
            </div>
            <p className="font-light text-sm dark:text-gray-400 text-gray-500">
              {timestamp}
            </p>
          </div>
          {isReplying && activeReplyId === id ? (
            <ReplyTextarea
              setReplyIdList={setReplyIdList}
              setActiveReplyId={setActiveReplyId}
              toBeEditedContent={toBeEditedContent}
              setToBeEditedContent={setToBeEditedContent}
              activeReplyId={activeReplyId}
              replyIdList={replyIdList}
              setReplyList={setReplyList}
            />
          ) : (
            <p>{content}</p>
          )}
        </div>
        {isReplyOwner && !isReplying && (
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
