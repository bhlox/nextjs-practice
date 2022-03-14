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
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { imageActions } from "../../../components/store/image-slice";
import { textActions } from "../../../components/store/text-slice";
import Tiptap from "../../../components/Tiptap";
import { db } from "../../../firebase.config";

const limit = 300;

function EditPost({ data, id }) {
  // console.log(data);
  console.log(id);

  const titleInput = useRef();
  const imageInput = useRef();
  const categoryInput = useRef();
  // const descInput = useRef();
  const summaryInput = useRef();

  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const storage = getStorage();

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
    const docRef = doc(db, "posts", id);
    let downloadUrl;
    let uploadImgRef;

    if (previewImg.name) {
      uploadImgRef = ref(storage, `images/${previewImg.name}`);
    }
    // dispatch(userActions.verify());

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
        id,
      };

      console.log(dataForm);
      if (downloadUrl) dataForm.image = downloadUrl;

      const response = await fetch("/api/add-place", {
        method: "PATCH",
        body: JSON.stringify(dataForm),
      });

      const data = await response.json();
      console.log(data);

      router.push(`/post/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    titleInput.current.value = data.title;
    categoryInput.current.value = data.category;
    summaryInput.current.value = data.summary;
  }, []);

  console.log(previewImg);

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
            />
          </div>
          <button onClick={handleSubmit}>submit edit</button>
        </div>
      </div>
    </>
  );
}

export default EditPost;

export async function getStaticPaths() {
  const colRef = collection(db, "posts");
  try {
    const posts = await getDocs(colRef);
    const ids = [];
    posts.docs.forEach((doc) => {
      ids.push(doc.id);
    });

    return {
      fallback: false,
      paths: ids.map((id) => ({ params: { postId: id } })),
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getStaticProps(context) {
  const id = context.params.postId;
  const docRef = doc(db, "posts", id);
  try {
    const docData = await getDoc(docRef);
    const data = { ...docData.data(), timestamp: "" };
    return { props: { data, id } };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}
