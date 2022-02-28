import React, { useRef } from "react";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";

function AddPlace() {
  const titleInput = useRef();
  const imageInput = useRef();
  const placeInput = useRef();
  const descInput = useRef();

  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const colRef = collection(db, "posts");

  const checkingStatus = useSelector((state) => state.user.checkingStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRef = doc(db, "users", auth.currentUser.uid);
    dispatch(userActions.verify());
    try {
      const post = await addDoc(colRef, {
        title: titleInput.current.value,
        image: imageInput.current.value,
        place: placeInput.current.value,
        desc: descInput.current.value,
        username: auth.currentUser.displayName,
        useruid: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });

      await updateDoc(userRef, { posts: arrayUnion(post.id) });

      dispatch(userActions.verifyComplete());
      console.log("document added");
      router.push("/");
    } catch (error) {
      dispatch(userActions.verifyComplete());

      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">name of title</label>
          <input type="text" id="title" ref={titleInput} />
        </div>
        <div>
          <label htmlFor="image">upload image</label>
          <input type="text" id="image" ref={imageInput} />
        </div>
        <div>
          <label htmlFor="place">enter place</label>
          <input type="text" id="place" ref={placeInput} />
        </div>
        <div>
          <label htmlFor="description">describe description</label>
          <textarea
            name="description"
            id="description"
            rows="5"
            ref={descInput}
          />
        </div>
      </form>
      <button disabled={checkingStatus} onClick={handleSubmit}>
        {checkingStatus ? "sending" : "submit"}
      </button>
    </div>
  );
}

export default AddPlace;

// TO UPDATE AN ARRAY IN DATABASE USE ARRAYUNION. TO REMOVE USE arrayRemove
// REFERENCE : https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_11
