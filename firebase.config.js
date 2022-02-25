import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj1I9Q4wxon9RpF6mUOtwuf_UuRzo_0cQ",
  authDomain: "nextjs-practice-ab971.firebaseapp.com",
  projectId: "nextjs-practice-ab971",
  storageBucket: "nextjs-practice-ab971.appspot.com",
  messagingSenderId: "714896816393",
  appId: "1:714896816393:web:6c6e98b8c6e2191430bbd8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
