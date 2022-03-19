import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { FaTwitter, FaFacebook, FaShareAlt } from "react-icons/fa";

import { db } from "../../../firebase.config";

import parser from "html-react-parser";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import HardBreak from "@tiptap/extension-hard-break";
import NumberList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";
import SidePosts from "../../../components/SidePosts";
import PostInfo from "../../../components/PostInfo";
import Head from "next/head";

function PostId({ data, recentPosts }) {
  console.log(data);
  const { id, image, title, username, timestamp, summary, desc, category } =
    data;

  // console.log(recentPosts);

  const [categoryPosts, setCategoryPosts] = useState([]);
  const [othersPosts, setOthersPosts] = useState([]);

  const colRef = collection(db, "posts");
  const categoryQuery = query(
    colRef,
    where("category", "==", category),
    orderBy("timestamp", "desc"),
    limit(3)
  );
  const othersQuery = query(
    colRef,
    where("type", "==", "post"),
    where("category", "!=", category),
    limit(3)
  );

  const getCategoryPosts = async () => {
    const posts = await getDocs(categoryQuery);
    const postsData = [];
    posts.docs.forEach((doc) => {
      postsData.push({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate().toDateString(),
      });
    });
    setCategoryPosts(postsData);
  };

  const getOthersPosts = async () => {
    // console.log("others async running");
    try {
      const posts = await getDocs(othersQuery);
      const postsData = [];
      posts.docs.forEach((doc) => {
        postsData.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.toDate().toDateString(),
        });
      });
      // console.log(postsData);
      setOthersPosts(postsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryPosts();
    getOthersPosts();
  }, [category]);

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.summary} />
        <link rel="icon" href="/newreadit.png" />
      </Head>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:justify-between md:space-x-12">
        {/* FIRST COLUMN */}
        <div className="space-y-10">
          {/* POST TITLE */}
          <div className="space-y-7">
            <h2 className="font-extrabold text-5xl md:text-6xl max-w-3xl">
              {title}
            </h2>
            <div className="max-w-[53rem]">
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rounded-xl h-[30rem] md:h-[35rem] w-full object-cover"
                  src={image}
                  alt={title}
                />
              }
            </div>
          </div>
          {/* END POST TITLE */}

          {/* POST DESC */}
          <div className="prose prose-invert prose-xl md:prose-2xl bg-slate-700 p-4">
            {parser(desc)}
          </div>
        </div>
        {/* END POST DESC */}

        {/* END FIRST COLUMN */}

        {/* SECOND COLUMN */}

        <div className="space-y-6 p-2 md:w-1/4  ">
          <PostInfo
            username={data.author.username}
            timestamp={timestamp}
            userpic={data.author.userpic}
            title={data.title}
          />

          {/* RECENT POSTS */}
          <div>
            <h2 className="text-3xl font-semibold">Recent posts</h2>
            <div className="flex flex-wrap md:flex-col md:flex-nowrap">
              {recentPosts.map((post) => (
                <SidePosts key={post.id} {...post} />
              ))}
            </div>
          </div>
          {/* END RECENT POSTS */}

          {/* CATEGORY POSTS */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-semibold">More {category} posts</h2>
            <div className="flex flex-wrap md:flex-col md:flex-nowrap">
              {categoryPosts.map((post) => (
                <SidePosts key={post.id} {...post} />
              ))}
            </div>
          </div>
          {/* END CATEGORY POSTS */}

          {/* OTHER SIDE POSTS */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-semibold">Non-related posts</h2>
            <div className="flex flex-wrap md:flex-col md:flex-nowrap">
              {othersPosts.map((post) => (
                <SidePosts key={post.id} {...post} />
              ))}
            </div>
          </div>
          {/* END OTHER SIDE POSTS */}
        </div>

        {/* END SECOND COLUMN */}
      </div>
    </>
  );
}

export default PostId;

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
  const colRef = collection(db, "posts");

  try {
    const docData = await getDoc(docRef);
    const desc = generateHTML(docData.data().desc, [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Blockquote,
      BulletList,
      HardBreak,
      NumberList,
      Strike,
      HorizontalRule,
      ListItem,
      Heading,
      Image,
    ]);

    const recentQuery = query(colRef, orderBy("timestamp", "desc"), limit(4));
    const posts = await getDocs(recentQuery);

    const recentPosts = [];
    posts.docs.forEach((doc) => {
      recentPosts.push({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate().toDateString(),
      });
    });

    return {
      props: {
        data: {
          ...docData.data(),
          timestamp: docData.data().timestamp.toDate().toDateString(),
          desc,
        },
        recentPosts,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
