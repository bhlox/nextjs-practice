import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
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

function postId({ data }) {
  // console.log(data);
  const { id, image, title, username, timestamp, summary, desc } = data;

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>{title}</h2>
      <Link href={`/user/${username}`}>{username}</Link>
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} />
      }
      <h2>posted at: {timestamp}</h2>
      <div className="prose prose-invert prose-base sm:prose-lg md:prose-2xl bg-red-400">
        {parser(desc)}
      </div>
    </div>
  );
}

export default postId;

export async function getServerSideProps(context) {
  const id = context.params.postId;
  const docRef = doc(db, "posts", id);

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

    return {
      props: {
        data: {
          ...docData.data(),
          timestamp: docData.data().timestamp.toDate().toDateString(),
          desc,
        },
        // title: docData.data().title,
        // image: docData.data().image,
        // username: docData.data().username,
        // id: docData.id,
        // timestamp: docData.data().timestamp.toDate().toDateString(),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
