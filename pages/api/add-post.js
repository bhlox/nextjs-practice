import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

async function handler(req, res) {
  if (req.method === "POST") {
    const json = req.body;

    const colRef = collection(db, "posts");

    const data = JSON.parse(json);

    const post = await addDoc(colRef, {
      ...data,
      timestamp: serverTimestamp(),
    });

    const id = post.id;

    res.status(201).json({ message: "post added", id });
  }
  if (req.method === "PATCH") {
    const json = req.body;

    const data = JSON.parse(json);

    const docRef = doc(db, "posts", data.postId);

    try {
      delete data.id;
      await updateDoc(docRef, data);
      res.status(201).json({ message: "post updated" });
    } catch (error) {
      console.log(error);
    }
  }
}

export default handler;
