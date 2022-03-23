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

function ReplyTextarea({ edit, setReplyIdList }) {
  const { user } = useAuthContext();
  const replyInputRef = useRef();
  const editReplyInputRef = useRef();
  const dispatch = useDispatch();

  const { currentUserData } = useSelector((state) => state.comments);
  const { activeCommentId } = useSelector((state) => state.comments);

  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = async () => {
    if (!replyContent.trim().length) {
      console.log("no characters");
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

  const handleChange = (e) => {
    if (!edit) {
      // dispatch(commentsActions.setContent(e.target.value));
      setReplyContent(e.target.value);
      replyInputRef.current.style.height =
        Math.min(replyInputRef.current.scrollHeight, 300) + "px";
    } else {
      //   dispatch(commentsActions.setContentToEdit(e.target.value));
      editReplyInputRef.current.style.height =
        Math.min(editReplyInputRef.current.scrollHeight, 300) + "px";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      <div className="flex ">
        <img
          className="w-10 h-10 rounded-full object cover"
          src={currentUserData.userpic}
          alt=""
        />
      </div>
      <div>
        <div className="flex space-x-4">
          <p>{replyContent.length} / 60</p>
          {/* <p className="text-red-400 text-lg">{message.error}</p> */}

          <p
            onClick={() => dispatch(commentsActions.setIsReplying(false))}
            className="cursor-pointer hover:underline"
          >
            cancel reply
          </p>
        </div>
        <div>
          <textarea
            ref={edit ? editReplyInputRef : replyInputRef}
            className={`resize w-full overflow-auto bg-transparent text-xl font-semibold border-slate-800 dark:border-stone-200 border-b-2 focus:outline-none p-2 dark:text-gray-200 dark:bg-slate-600 bg-gray-300`}
            name="addReply"
            id="addReply"
            rows="1"
            cols="35"
            placeholder="Enter reply..."
            onChange={handleChange}
            value={edit ? contentToEdit : replyContent}
            maxLength="60"
          />
          <button
            onClick={handleSubmit}
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
