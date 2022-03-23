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
import CommentTextArea from "./CommentTextArea";
import { commentsActions } from "./store/comments-slice";
import { useRouter } from "next/router";

function Comments({ postId, comments }) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  // const router = useRouter();

  const { commentList } = useSelector((state) => state.comments);
  // const { content } = useSelector((state) => state.comments);
  const { commentsId } = useSelector((state) => state.comments);

  // console.log(commentList);

  useEffect(() => {
    dispatch(commentsActions.setCommentsId(comments));
  }, [comments, dispatch]);

  useEffect(() => {
    if (user) {
      const fetchCurrentUserData = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        const userData = { ...userSnapshot.data(), id: userSnapshot.id };
        // console.log(userData);
        dispatch(
          commentsActions.setCurrentUserData({
            userpic: userData.profilePic,
            commentIds: userData.comments,
            repliesIds: userData.replies,
          })
        );
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
      dispatch(commentsActions.setCommentList(fixedList));
    };
    fetchComments();
  }, [commentsId, dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl">Comments</h2>
      </div>

      {user && <CommentTextArea />}

      {/* COMMENT SECTION */}
      {!commentsId.length > 0 && (
        <div className="flex justify-center">
          <h2 className="text-3xl font-semibold">Be the first to comment</h2>
        </div>
      )}

      {commentList && (
        <div className="space-y-6">
          {commentList.map((comment) => (
            <Comment key={comment.id} {...comment} postId={postId} />
          ))}
        </div>
      )}
      {/* END COMMENT SECTION */}
    </div>
  );
}

export default Comments;
