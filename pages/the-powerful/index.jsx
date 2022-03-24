import React, { useState } from "react";
import nookies from "nookies";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { firebaseAdmin } from "../../firebaseAdmin";

function ThePowerful({ isAdmin }) {
  const [toDeleteId, setToDeleteId] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    const toDeleteRef = doc(db, "posts", toDeleteId);

    try {
      const toDeleteSnapshot = await getDoc(toDeleteRef);
      const postAuthorId = toDeleteSnapshot.data().author.useruid;
      const postAuthorRef = doc(db, "users", postAuthorId);
      const postAuthorSnapshot = await getDoc(postAuthorRef);
      // const postAuthorCommentsIdList = postAuthorSnapshot.data().comments;
      // const postAuthorRepliesIdList = postAuthorSnapshot.data().replies;

      const commentsIdList = toDeleteSnapshot.data().comments;
      for (const commentId of commentsIdList) {
        const commentRef = doc(db, "comments", commentId);
        const commentSnapshot = await getDoc(commentRef);
        const repliesIdList = commentSnapshot.data().replies;
        for (const replyId of repliesIdList) {
          const replyRef = doc(db, "replies", replyId);
          await deleteDoc(replyRef);
          await updateDoc(postAuthorRef, { replies: arrayRemove(replyId) });
        }
        await deleteDoc(commentRef);
        await updateDoc(postAuthorRef, { comments: arrayRemove(commentId) });
      }
      await deleteDoc(toDeleteRef);
      setToDeleteId("");
      console.log("post deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setToDeleteId(e.target.value);
  };

  return (
    <>
      {isAdmin && (
        <div className="flex flex-col items-center space-y-8">
          <div>
            <h2 className="text-5xl font-bold">Delete Post</h2>
          </div>
          <div>
            <form onSubmit={handleDelete} className="flex flex-col space-y-8">
              <input
                value={toDeleteId}
                onChange={handleChange}
                placeholder="enter id"
                className="styled-input"
                type="text"
              />
              <button
                onClick={handleDelete}
                className="bg-red-400 px-2 py-1 rounded-xl hover:opacity-80"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ThePowerful;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  try {
    if (!cookies) {
      throw new Error("nope");
    }

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid } = token;
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);
    const isAdmin = userSnapshot.data().admin;
    if (!isAdmin) {
      throw new Error("still nope");
    }

    return {
      props: { isAdmin },
    };
  } catch (error) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return { props: {} };
  }
}
