import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import nookies from "nookies";
import { firebaseAdmin } from "../../../firebaseAdmin";

import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formActions } from "../../../components/store/form-slice";
import { imageActions } from "../../../components/store/image-slice";
import { textActions } from "../../../components/store/text-slice";
import { userActions } from "../../../components/store/user-slice";
import Tiptap from "../../../components/Tiptap";
import { db, storage } from "../../../firebase.config";
import { uiActions } from "../../../components/store/ui-slice";
// import { firebaseAdmin } from "../../../firebaseAdmin";

function EditPost({ data, postId }) {
  // console.log(data);

  const titleInput = useRef();
  const imageInput = useRef();
  const categoryInput = useRef();
  // const descInput = useRef();
  const summaryInput = useRef();

  // const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const checkingStatus = useSelector((state) => state.user.checkingStatus);
  const previewImg = useSelector((state) => state.image.previewImg);
  const postDesc = useSelector((state) => state.text.postDesc);
  const formInputs = useSelector((state) => state.form.formInputs);
  const validity = useSelector((state) => state.form.validity);
  const isFormValid = useSelector((state) => state.form.isFormValid);
  const postSent = useSelector((state) => state.ui.postSent);

  // console.log(validity);
  // console.log(isFormValid);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let downloadUrl;
    let uploadImgRef;

    const formIsValid =
      categoryInput.current.value.length &&
      titleInput.current.value.trim().length &&
      summaryInput.current.value.trim().length &&
      formInputs.descCount;

    // console.log(formIsValid);

    if (!formIsValid) {
      console.log("form not valid");
      const dataForm = {
        category: categoryInput.current.value,
        title: titleInput.current.value,
        summary: summaryInput.current.value,
        descCount: formInputs.descCount,
      };

      // console.log(dataForm);
      dispatch(formActions.missing(dataForm));

      return;
    }

    console.log("form is valid");

    if (previewImg.name) {
      uploadImgRef = ref(storage, `images/${previewImg.name}`);
    }
    dispatch(userActions.verify());

    try {
      if (uploadImgRef) {
        const uploadTask = await uploadString(
          uploadImgRef,
          previewImg.data_url,
          "data_url"
        );
        const url = getDownloadURL(uploadTask.ref);
        downloadUrl = await url;
      }
      const dataForm = {
        title: titleInput.current.value,
        category: categoryInput.current.value,
        desc: postDesc,
        summary: summaryInput.current.value,
        postId,
      };
      // console.log(dataForm);
      if (downloadUrl) dataForm.image = downloadUrl;
      const response = await fetch("/api/add-post", {
        method: "PATCH",
        body: JSON.stringify(dataForm),
      });
      const data = await response.json();
      // console.log(data);
      dispatch(userActions.verifyComplete());
      dispatch(uiActions.postSent());
      router.push(`/post/${postId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    titleInput.current.value = data.title;
    categoryInput.current.value = data.category;
    summaryInput.current.value = data.summary;

    return () => {
      dispatch(formActions.reset());
      dispatch(imageActions.reset());
      dispatch(uiActions.resetSent());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Edit your thoughts</title>
        <meta name="description" content="share your thoughts" />
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl">Edit your thoughts </h2>
        <div className="space-y-8 mt-12 p-4 border-4 border-purple-600 rounded-xl">
          <div>
            <Tiptap
              titleInput={titleInput}
              summaryInput={summaryInput}
              handleCount={handleCount}
              categoryInput={categoryInput}
              imageInput={imageInput}
              desc={data.desc}
              currentImage={data.image}
              currentCategory={data.category}
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
                {checkingStatus ? "Sending..." : "Save edit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPost;

// export async function getStaticPaths() {
//   const colRef = collection(db, "posts");
//   try {
//     const posts = await getDocs(colRef);
//     const ids = [];
//     posts.docs.forEach((doc) => {
//       ids.push(doc.id);
//     });

//     return {
//       fallback: false,
//       paths: ids.map((id) => ({ params: { postId: id } })),
//     };
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function getServerSideProps(context) {
  const postId = context.params.postId;
  const docRef = doc(db, "posts", postId);
  const cookies = nookies.get(context);

  try {
    if (!cookies) {
      context.res.writeHead(302, { Location: "/" });
      context.res.end();
    }
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid } = token;

    const userRef = doc(db, "users", uid);
    const userData = await getDoc(userRef);
    const userPosts = userData.data().posts;

    const isAuthor = userPosts.some((post) => post == postId);

    if (!isAuthor) {
      context.res.writeHead(302, { Location: "/" });
      context.res.end();
    }

    const docData = await getDoc(docRef);
    const data = { ...docData.data(), timestamp: "" };
    return { props: { data, postId, isAuthor } };
  } catch (error) {
    console.log(error);
    return { props: { data: {} } };
  }
}
