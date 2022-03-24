import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.config";
import { useAuthContext } from "./context/auth-context";
import { commentsActions } from "./store/comments-slice";

function ReplyTextarea({
  replyIdList,
  setReplyIdList,
  setActiveReplyId,
  toBeEditedContent,
  setToBeEditedContent,
  activeReplyId,
  setReplyList,
}) {
  const { user } = useAuthContext();
  const replyInputRef = useRef();
  const editReplyInputRef = useRef();
  const dispatch = useDispatch();

  const { currentUserData } = useSelector((state) => state.comments);
  const { activeCommentId } = useSelector((state) => state.comments);

  const [replyContent, setReplyContent] = useState("");

  const fetchUpdatedReplies = async () => {
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
          .toDateString()} at ${entry.timestamp.toDate().toLocaleTimeString()}`,
      }));
    setReplyList(fixedList);
  };

  const handleCancel = () => {
    setActiveReplyId("");
    dispatch(commentsActions.setIsReplying(false));
  };

  const handleSubmit = async () => {
    if (!replyContent.trim().length) {
      dispatch(commentsActions.setIsReplying(false));
      // dispatch(textActions.submitErrorMsg("Pls Enter at least 2 characters"));
      return;
    }

    if (replyContent.trim().length < 2) {
      // dispatch(textActions.submitErrorMsg("Pls Enter at least 2 characters"));
      return;
    }

    const colRef = collection(db, "replies");
    const commentRef = doc(db, "comments", activeCommentId);
    const userRef = doc(db, "users", user.uid);

    try {
      const userSnapshot = await getDoc(userRef);
      const userData = { ...userSnapshot.data(), id: userSnapshot.id };
      const formData = {
        author: {
          username: userData.username,
          userpic: userData.profilePic,
          useruid: user.uid,
        },
        content: replyContent.trim(),
        timestamp: serverTimestamp(),
        commentId: activeCommentId,
      };

      const reply = await addDoc(colRef, formData);
      await updateDoc(userRef, { replies: arrayUnion(reply.id) });
      await updateDoc(commentRef, { replies: arrayUnion(reply.id) });
      setReplyContent("");
      setReplyIdList((prev) => [...prev, reply.id]);
      dispatch(commentsActions.setIsReplying(false));
      dispatch(
        commentsActions.updateCurrentUserDataField({ repliesIds: reply.id })
      );
    } catch (error) {
      // console.log(error);
    }
  };

  const handleSubmitEdit = async () => {
    if (!toBeEditedContent.trim().length) {
      dispatch(commentsActions.setIsReplying(false));
      return;
    }

    if (toBeEditedContent.trim().length < 2) {
      return;
    }

    const replyRef = doc(db, "replies", activeReplyId);
    try {
      await updateDoc(replyRef, {
        content: toBeEditedContent.trim(),
      });
      dispatch(commentsActions.setIsReplying(false));
      fetchUpdatedReplies();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    if (!toBeEditedContent) {
      setReplyContent(e.target.value);
      replyInputRef.current.style.height =
        Math.min(replyInputRef.current.scrollHeight, 300) + "px";
    } else {
      setToBeEditedContent(e.target.value);
      editReplyInputRef.current.style.height =
        Math.min(editReplyInputRef.current.scrollHeight, 300) + "px";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      <div className="flex ">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="w-10 h-10 rounded-full object cover"
            src={currentUserData.userpic}
            alt=""
          />
        }
      </div>
      <div>
        <div className="flex space-x-4">
          <p>
            {toBeEditedContent ? toBeEditedContent.length : replyContent.length}{" "}
            / 60
          </p>
          {/* <p className="text-red-400 text-lg">{message.error}</p> */}

          <p onClick={handleCancel} className="cursor-pointer hover:underline">
            cancel reply
          </p>
        </div>
        <div>
          <textarea
            ref={toBeEditedContent ? editReplyInputRef : replyInputRef}
            className={`resize w-full overflow-auto bg-transparent text-xl font-semibold border-slate-800 dark:border-stone-200 border-b-2 focus:outline-none p-2 dark:text-gray-200 dark:bg-slate-600 bg-gray-300`}
            name="addReply"
            id="addReply"
            rows="1"
            cols="35"
            placeholder="Enter reply..."
            onChange={handleChange}
            value={toBeEditedContent ? toBeEditedContent : replyContent}
            maxLength="60"
          />
          <button
            onClick={toBeEditedContent ? handleSubmitEdit : handleSubmit}
            className="w-full bg-red-400 text-2xl rounded p-1"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReplyTextarea;
