import React, { useRef, useState } from "react";
import nookies from "nookies";
import { FaPencilAlt } from "react-icons/fa";

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

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

import { db } from "../../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { textActions } from "../../components/store/text-slice";
import Tiptap from "../../components/Tiptap";
import { imageActions } from "../../components/store/image-slice";

const limit = 300;

function AddPlace() {
  const titleInput = useRef();
  const imageInput = useRef();
  const categoryInput = useRef();
  // const descInput = useRef();
  const summaryInput = useRef();

  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const colRef = collection(db, "posts");

  const storage = getStorage();
  const storageRef = ref(storage);

  const checkingStatus = useSelector((state) => state.user.checkingStatus);
  const previewImg = useSelector((state) => state.image.previewImg);
  const postDesc = useSelector((state) => state.text.postDesc);

  const handleCount = (e) => {
    if (e.target.id === "title") {
      dispatch(textActions.titleCount(e.target.value.length));
      titleInput.current.style.height =
        Math.min(titleInput.current.scrollHeight, limit) + "px";
    }

    if (e.target.id === "summary") {
      dispatch(textActions.summaryCount(e.target.value.length));
      summaryInput.current.style.height =
        Math.min(summaryInput.current.scrollHeight, limit) + "px";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const uploadImgRef = ref(storage, `images/${previewImg.name}`);
    dispatch(userActions.verify());

    try {
      const uploadTask = await uploadString(
        uploadImgRef,
        previewImg.data_url,
        "data_url"
      );
      const data = getDownloadURL(uploadTask.ref);
      const downloadUrl = await data;
      // console.log(downloadUrl);
      const post = await addDoc(colRef, {
        title: titleInput.current.value,
        image: downloadUrl,
        category: categoryInput.current.value,
        desc: postDesc,
        summary: summaryInput.current.value,
        username: auth.currentUser.displayName,
        useruid: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
      await updateDoc(userRef, { posts: arrayUnion(post.id) });
      dispatch(userActions.verifyComplete());
      dispatch(textActions.reset());
      dispatch(imageActions.reset());
      console.log("document added");
      router.push("/");
    } catch (error) {
      dispatch(userActions.verifyComplete());

      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl">Share your thoughts </h2>
      <div className="space-y-8 mt-12 p-4 border-4 border-purple-600 rounded-xl">
        {/* <div className="relative">
          <textarea
            id="title"
            rows="1"
            ref={titleInput}
            placeholder="...enter title"
            className="styled-input resize max-w-xs overflow-hidden sm:max-w-full"
            onChange={handleCount}
            maxLength="100"
          />
          <FaPencilAlt className="input-icon" />
          <span className="absolute top-2 -right-5">{count}/ 100</span>
        </div> */}
        {/* <div>
          <input type="text" id="image" ref={imageInput} />
        </div> */}
        {/* <div>
          <select
            name="category"
            id="category"
            ref={categoryInput}
            className="text-black"
          >
            <option value="business">business</option>
            <option value="lifestyle">lifestyle</option>
            <option value="mental">mental health</option>
            <option value="freelance">freelance</option>
            <option value="casual">casual</option>
            <option value="travel">travel</option>
            <option value="love">love</option>
          </select>
        </div> */}
        <div>
          <Tiptap
            titleInput={titleInput}
            summaryInput={summaryInput}
            handleCount={handleCount}
            categoryInput={categoryInput}
            imageInput={imageInput}
          />
        </div>
        <button disabled={checkingStatus} onClick={handleSubmit}>
          {checkingStatus ? "sending" : "submit"}
        </button>
      </div>
    </div>
  );
}

export default AddPlace;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    context.res.writeHead(302, { Location: "/sign-in  " });
    context.res.end();

    return { props: {} };
  } else {
    return { props: {} };
  }
}

// TO UPDATE AN ARRAY IN DATABASE USE ARRAYUNION. TO REMOVE USE arrayRemove
// REFERENCE : https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_11

// AUTOGROW HEIGHT TEXTAREA REF: https://stackoverflow.com/questions/46777446/textarea-auto-height-increase

// get downloadUrl after uploadString in firebase v9: https://stackoverflow.com/questions/69622592/how-to-get-downloadurl-after-uploadstring-in-firebase-v9
