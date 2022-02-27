import React, { useRef } from "react";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase.config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

function AddPlace() {
  const titleInput = useRef();
  const imageInput = useRef();
  const placeInput = useRef();
  const descInput = useRef();

  const auth = getAuth();
  const router = useRouter();

  const colRef = collection(db, "posts");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(colRef, {
      title: titleInput.current.value,
      image: imageInput.current.value,
      place: placeInput.current.value,
      desc: descInput.current.value,
      username: auth.currentUser.displayName,
      useruid: auth.currentUser.uid,
    });
    console.log("document added");
    router.push("/");
  };

  return (
    <div className="flex justify-center">
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
        <button>submit</button>
      </form>
    </div>
  );
}

export default AddPlace;
