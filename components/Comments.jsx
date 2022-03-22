import React, { useEffect, useState, useRef } from "react";
import Comment from "./Comment";
import { useAuthContext } from "./context/auth-context";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { textActions } from "./store/text-slice";
import CommentTextArea from "./CommentTextArea";
import { commentsActions } from "./store/comments-slice";
import { useRouter } from "next/router";

function Comments({ postId, comments }) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  // const router = useRouter();

  // console.log(comments);

  const [currentUserData, setCurrentUserData] = useState({});

  // console.log(commentsId);

  const { message } = useSelector((state) => state.text);
  const { commentList } = useSelector((state) => state.comments);
  const { content } = useSelector((state) => state.comments);
  const { commentsId } = useSelector((state) => state.comments);

  // console.log(currentUserData);

  // console.log(commentList);

  useEffect(() => {
    console.log("changing to different post");
    dispatch(commentsActions.setCommentsId(comments));

    return () => {
      dispatch(commentsActions.reset());
      console.log("time to reset");
    };
  }, [comments, dispatch]);

  useEffect(() => {
    if (user) {
      const fetchCurrentUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        const userData = { ...userSnapshot.data(), id: userSnapshot.id };
        setCurrentUserData(userData);
      };
      fetchCurrentUserData();
    }
  }, [user, commentsId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!comments) {
        console.log("no comments id found");
        return;
      }

      // console.log("commensing fetch");
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
            .toDateString()} at ${entry.timestamp
            .toDate()
            .toLocaleTimeString()}`,
        }));
      // console.log(fixedList);
      dispatch(commentsActions.setCommentList(fixedList));
    };
    fetchComments();
  }, [commentsId, dispatch, comments]);

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
      };

      // CHECK IF OWNER COMMENT HERE
      // const commentOwner = commentsId.some((id) => {
      //   if (currentUserData.comments?.includes(id)) return true;
      // });
      // console.log(commentOwner);

      const comment = await addDoc(colRef, formData);
      await updateDoc(docRef, { comments: arrayUnion(comment.id) });
      await updateDoc(userRef, { comments: arrayUnion(comment.id) });

      console.log("comment submited");
      dispatch(commentsActions.addIdToComments(comment.id));
      dispatch(commentsActions.resetContent());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl">Comments</h2>
      </div>

      {user && (
        <CommentTextArea
          pic={currentUserData.profilePic}
          message={message}
          handleSubmit={handleSubmit}
        />
      )}

      {/* COMMENT SECTION */}
      {!commentsId.length > 0 && (
        <div className="flex justify-center">
          <h2 className="text-3xl font-semibold">Be the first to comment</h2>
        </div>
      )}

      {commentList && (
        <div className="space-y-6">
          {commentList.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              userCommentIds={currentUserData.comments}
              // postCommentIds={comments}
              postId={postId}
            />
          ))}
        </div>
      )}
      {/* END COMMENT SECTION */}
    </div>
  );
}

export default Comments;
