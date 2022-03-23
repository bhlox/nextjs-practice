import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase.config";
import { useAuthContext } from "./context/auth-context";
import { commentsActions } from "./store/comments-slice";
import { textActions } from "./store/text-slice";

function CommentTextArea({ edit, fetchComments }) {
  const dispatch = useDispatch();
  const commentInputRef = useRef();
  const editCommentInputRef = useRef();
  const router = useRouter();

  const { user } = useAuthContext();
  const { postId } = router.query;
  const { commentsId } = useSelector((state) => state.comments);
  const { message } = useSelector((state) => state.text);
  const { content } = useSelector((state) => state.comments);
  const { currentUserData } = useSelector((state) => state.comments);
  const { contentToEdit } = useSelector((state) => state.comments);
  const { activeCommentId } = useSelector((state) => state.comments);

  const fetchEditedComments = async () => {
    const list = [];
    for (const id of commentsId) {
      const docRef = doc(db, "comments", id);
      const docSnapshot = await getDoc(docRef);
      list.push({
        ...docSnapshot.data(),
        id: docSnapshot.id,
      });
    }
    const fixedList = list
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((entry) => ({
        ...entry,
        timestamp: `${entry.timestamp
          .toDate()
          .toDateString()} at ${entry.timestamp.toDate().toLocaleTimeString()}`,
      }));
    dispatch(commentsActions.setCommentList(fixedList));
  };

  const handleChange = (e) => {
    if (!edit) {
      dispatch(commentsActions.setContent(e.target.value));
      // setcontent(e.target.value);
      commentInputRef.current.style.height =
        Math.min(commentInputRef.current.scrollHeight, 300) + "px";
    } else {
      dispatch(commentsActions.setContentToEdit(e.target.value));
      editCommentInputRef.current.style.height =
        Math.min(editCommentInputRef.current.scrollHeight, 300) + "px";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim().length) {
      console.log("no characters");
      dispatch(textActions.submitErrorMsg("Pls Enter at least 2 characters"));
      return;
    }

    if (content.trim().length < 2) {
      console.log("only 1 character");
      dispatch(textActions.submitErrorMsg("Pls Enter at least 2 characters"));
      return;
    }

    const colRef = collection(db, "comments");
    const docRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", user.uid);

    try {
      const userSnapshot = await getDoc(userRef);
      const userData = { ...userSnapshot.data(), id: userSnapshot.id };
      const formData = {
        content: content.trim(),
        author: {
          userpic: userData.profilePic,
          username: userData.username,
          useruid: user.uid,
        },
        postId,
        timestamp: serverTimestamp(),
        replies: [],
      };

      const comment = await addDoc(colRef, formData);
      await updateDoc(docRef, { comments: arrayUnion(comment.id) });
      await updateDoc(userRef, { comments: arrayUnion(comment.id) });

      console.log("comment submited");
      dispatch(commentsActions.addIdToComments(comment.id));
      dispatch(commentsActions.resetContent());
      dispatch(textActions.reset());
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!contentToEdit.trim().length) {
      dispatch(commentsActions.cancelEditing());
      return;
    }

    if (contentToEdit.trim().length < 2) {
      dispatch(textActions.submitErrorMsg("Pls Enter at least 2 characters"));
      return;
    }

    const commentRef = doc(db, "comments", activeCommentId);
    // console.log(contentToEdit);
    try {
      await updateDoc(commentRef, { content: contentToEdit });
      console.log("comment updated");
      dispatch(textActions.reset());
      dispatch(commentsActions.cancelEditing());
      fetchEditedComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 pb-8">
      <div>
        {!edit && (
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={currentUserData.userpic}
            alt=""
          />
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-4">
          <p>{edit ? contentToEdit.length : content.length} / 300</p>
          <p className="text-red-400 text-lg">{message.error}</p>
          {edit && (
            <p
              onClick={() => dispatch(commentsActions.cancelEditing())}
              className="cursor-pointer hover:underline"
            >
              cancel edit
            </p>
          )}
        </div>
        <textarea
          ref={edit ? editCommentInputRef : commentInputRef}
          className={`resize w-full overflow-auto bg-transparent text-3xl font-semibold border-slate-800 dark:border-stone-200 border-b-2 focus:outline-none p-2 dark:text-gray-200 dark:bg-slate-600 bg-gray-300`}
          name="addComment"
          id="addComment"
          rows="1"
          cols="40"
          placeholder="Enter comment..."
          onChange={handleChange}
          value={edit ? contentToEdit : content}
          maxLength="300"
        />
        {(edit ? contentToEdit : content) && (
          <button
            disabled={edit ? !contentToEdit : !content.length}
            className="w-full bg-red-400 text-2xl rounded p-1"
            onClick={edit ? handleSubmitEdit : handleSubmit}
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentTextArea;
