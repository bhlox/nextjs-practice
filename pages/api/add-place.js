import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
}

export default handler;
