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
import CommentTextArea from "./CommentTextArea";
import { useAuthContext } from "./context/auth-context";
import Reply from "./Reply";
import ReplyTextarea from "./ReplyTextarea";
import { commentsActions } from "./store/comments-slice";
import { FaFeatherAlt } from "react-icons/fa";
import Link from "next/link";
import DeleteModal from "./DeleteModal";

function Comment({
  content,
  author,
  timestamp,
  id: commentId,
  postId,
  replies,
}) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();

  const [replyIdList, setReplyIdList] = useState([]);
  const [replyList, setReplyList] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState("");
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);

  // console.log(replyIdList);

  const { userCommentOwner } = useSelector((state) => state.comments);
  const { commentsId } = useSelector((state) => state.comments);
  const { currentUserData } = useSelector((state) => state.comments);
  const { isEditing } = useSelector((state) => state.comments);
  const { activeCommentId } = useSelector((state) => state.comments);
  const { isReplying } = useSelector((state) => state.comments);
  const { postAuthorUsername } = useSelector((state) => state.comments);

  useEffect(() => {
    setReplyIdList(replies);
  }, [replies]);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!replyIdList) {
        setReplyList([]);
        return;
      }

      const list = [];
      for (const id of replyIdList) {
        const snapshot = await getDoc(doc(db, "replies", id));
        list.push({ ...snapshot.data(), id: snapshot.id });
      }
      const fixedList = list
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((entry) => ({
          ...entry,
          timestamp: `${entry.timestamp
            .toDate()
            .toDateString()} at ${entry.timestamp
            .toDate()
            .toLocaleTimeString()}`,
        }));
      setReplyList(fixedList);
    };
    fetchReplies();
  }, [replyIdList]);

  useEffect(() => {
    if (commentsId && currentUserData.commentIds) {
      dispatch(
        commentsActions.isUserCommentOwner(
          commentsId.some((id) => {
            if (currentUserData.commentIds?.includes(id)) return true;
          })
        )
      );
    }
  }, [currentUserData.commentIds, commentsId, dispatch]);

  const handleEdit = async () => {
    dispatch(commentsActions.editingContent());
    dispatch(commentsActions.setActiveCommentId(commentId));
    const commentRef = doc(db, "comments", commentId);
    try {
      const snapshot = await getDoc(commentRef);
      dispatch(commentsActions.setContentToEdit(snapshot.data().content));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const userRef = doc(db, "users", user.uid);
    const commentRef = doc(db, "comments", commentId);
    const postRef = doc(db, "posts", postId);

    try {
      await deleteDoc(commentRef);
      await updateDoc(userRef, { comments: arrayRemove(commentId) });
      await updateDoc(postRef, { comments: arrayRemove(commentId) });

      for (const id of replyIdList) {
        const docRef = doc(db, "replies", id);
        await deleteDoc(docRef);
        await updateDoc(userRef, { replies: arrayRemove(id) });
      }
      dispatch(commentsActions.deleteIdFromComments(commentId));
      // console.log("comment deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddReply = () => {
    dispatch(commentsActions.setActiveCommentId(commentId));
    dispatch(commentsActions.setIsReplying(true));
  };

  return (
    <>
      <div className="border-b-[1px] pb-4 dark:border-gray-500 border-gray-300">
        <div className="flex flex-row md:space-x-4">
          <div>
            <Link passHref href={`/user/${author.username}`}>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="h-20 w-20 rounded-full object-cover cursor-pointer"
                  src={author.userpic}
                  alt=""
                />
              }
            </Link>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex space-x-2 items-center">
                <div className="flex gap-x-[0.15rem]">
                  <Link passHref href={`/user/${author.username}`}>
                    <h3 className="text-lg hover:underline cursor-pointer hover:text-blue-400">
                      {author.username}
                    </h3>
                  </Link>
                  {author.username === postAuthorUsername && (
                    <p className="">
                      <FaFeatherAlt />
                    </p>
                  )}
                </div>
                <p className="font-light text-sm dark:text-gray-400 text-gray-500">
                  {timestamp}
                </p>
              </div>
              {isEditing && activeCommentId === commentId ? (
                <CommentTextArea edit={isEditing} />
              ) : (
                <p className="">{content}</p>
              )}

              <div className="flex space-x-2 pt-3 dark:text-stone-300">
                {userCommentOwner && !isEditing && user && (
                  <span
                    onClick={handleEdit}
                    className="hover:underline hover:text-blue-400 cursor-pointer"
                  >
                    Edit
                  </span>
                )}
                {userCommentOwner && !isEditing && user && (
                  <span
                    onClick={() => setShowDeleteMsg(true)}
                    className="hover:underline hover:text-blue-400 cursor-pointer"
                  >
                    Delete
                  </span>
                )}
                {!isEditing && user && (
                  <span
                    onClick={handleAddReply}
                    className="hover:underline hover:text-blue-400 cursor-pointer"
                  >
                    Reply
                  </span>
                )}
              </div>
            </div>
            {isReplying && activeCommentId === commentId && (
              <ReplyTextarea
                setReplyIdList={setReplyIdList}
                setActiveReplyId={setActiveReplyId}
              />
            )}
            {replyList &&
              replyList.map((reply) => (
                <Reply
                  key={reply.id}
                  {...reply}
                  setReplyIdList={setReplyIdList}
                  commentId={commentId}
                  setActiveReplyId={setActiveReplyId}
                  activeReplyId={activeReplyId}
                  setReplyList={setReplyList}
                  replyIdList={replyIdList}
                />
              ))}
          </div>
        </div>
      </div>
      {showDeleteMsg && (
        <DeleteModal
          comment={content}
          setShowDeleteMsg={setShowDeleteMsg}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

export default Comment;
