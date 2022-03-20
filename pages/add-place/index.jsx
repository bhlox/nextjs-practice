import React, { useEffect, useRef } from "react";
import Head from "next/head";
import nookies from "nookies";
import { FaPencilAlt } from "react-icons/fa";

import {
  // addDoc,
  arrayUnion,
  // collection,
  doc,
  // getDoc,
  // serverTimestamp,
  // setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

import { db, storage } from "../../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "../../components/store/user-slice";
import { textActions } from "../../components/store/text-slice";
import Tiptap from "../../components/Tiptap";
import { imageActions } from "../../components/store/image-slice";
import { formActions } from "../../components/store/form-slice";
import { uiActions } from "../../components/store/ui-slice";

function AddPlace() {
  const titleInput = useRef();
  const imageInput = useRef();
  const categoryInput = useRef();
  // const descInput = useRef();
  const summaryInput = useRef();

  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  // const colRef = collection(db, "posts");

  const checkingStatus = useSelector((state) => state.user.checkingStatus);
  const previewImg = useSelector((state) => state.image.previewImg);
  const postDesc = useSelector((state) => state.text.postDesc);
  const validity = useSelector((state) => state.form.validity);
  const formInputs = useSelector((state) => state.form.formInputs);
  const isFormValid = useSelector((state) => state.form.isFormValid);
  const postSent = useSelector((state) => state.ui.postSent);

  const handleCount = (e) => {
    if (e.target.id === "title") {
      dispatch(textActions.titleCount(e.target.value.length));
      titleInput.current.style.height =
        Math.min(titleInput.current.scrollHeight, 300) + "px";
      if (!validity.title) {
        console.log("submitting for validity");
        dispatch(formActions.submit({ [e.target.id]: e.target.value }));
      }
    }

    if (e.target.id === "summary") {
      dispatch(textActions.summaryCount(e.target.value.length));
      summaryInput.current.style.height =
        Math.min(summaryInput.current.scrollHeight, 300) + "px";
      if (!validity.summary) {
        console.log("submitting for validity");
        dispatch(formActions.submit({ [e.target.id]: e.target.value }));
      }
    }
  };

  // console.log(validity);
  // console.log(isFormValid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRef = doc(db, "users", auth.currentUser.uid);

    const formIsValid =
      categoryInput.current.value.length &&
      titleInput.current.value.trim().length &&
      summaryInput.current.value.trim().length &&
      previewImg.data_url?.length &&
      formInputs.descCount;

    // console.log(formInputs);

    if (!formIsValid) {
      console.log("form not valid");
      const dataForm = {
        category: categoryInput.current.value,
        title: titleInput.current.value,
        summary: summaryInput.current.value,
        descCount: formInputs.descCount,
        image: previewImg?.data_url,
      };

      // console.log(dataForm);
      dispatch(formActions.missing(dataForm));

      return;
    }

    console.log("form is valid");

    const uploadImgRef = ref(storage, `images/${previewImg.name}`);
    dispatch(userActions.verify());

    try {
      const uploadTask = await uploadString(
        uploadImgRef,
        previewImg.data_url,
        "data_url"
      );
      const url = getDownloadURL(uploadTask.ref);
      const downloadUrl = await url;
      const dataForm = {
        title: titleInput.current.value.trim(),
        image: downloadUrl,
        category: categoryInput.current.value,
        desc: postDesc,
        summary: summaryInput.current.value.trim(),
        type: "post",
        author: {
          username: auth.currentUser.displayName,
          useruid: auth.currentUser.uid,
          userpic: auth.currentUser.photoURL,
        },
      };
      const response = await fetch("/api/add-place", {
        method: "POST",
        body: JSON.stringify(dataForm),
      });
      const data = await response.json();
      // console.log(data);
      await updateDoc(userRef, { posts: arrayUnion(data.id) });
      dispatch(textActions.reset());
      dispatch(imageActions.reset());
      console.log("document added");
      dispatch(userActions.verifyComplete());
      dispatch(uiActions.postSent());
      router.push(`/post/${data.id}`);
    } catch (error) {
      dispatch(userActions.verifyComplete());

      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(imageActions.reset());
      dispatch(formActions.reset());
      dispatch(uiActions.resetSent());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Share your thoughts</title>
        <meta name="description" content="share your thoughts" />
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl">Share your thoughts </h2>
        <div className="space-y-8 mt-12 p-4 border-4 border-purple-600 rounded-xl">
          <div>
            <Tiptap
              titleInput={titleInput}
              summaryInput={summaryInput}
              handleCount={handleCount}
              categoryInput={categoryInput}
              imageInput={imageInput}
            />
          </div>
          <div>
            {!isFormValid && (
              <button
                disabled
                className="w-full p-2 outline-2 outline outline-purple-500 hover:bg-transparent transition-all capitalize text-3xl"
              >
                Pls fill out all entries
              </button>
            )}
            {isFormValid && !postSent && (
              <button
                className="w-full bg-purple-500 p-2 outline-2 outline outline-purple-500 hover:bg-transparent transition-all capitalize text-3xl"
                disabled={checkingStatus}
                onClick={handleSubmit}
              >
                {checkingStatus ? "sending" : "submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
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
