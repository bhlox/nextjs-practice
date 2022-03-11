import React, { useEffect, useState, useRef } from "react";
import {
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { db } from "../../firebase.config";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../components/context/auth-context";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebaseAdmin";
import { doc, getDoc, query, where } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

import { uiActions } from "../../components/store/ui-slice";
import { textActions } from "../../components/store/text-slice";
import ProfileCard from "../../components/ProfileCard";
import ProfilePosts from "../../components/ProfilePosts";

function Profile({ userData }) {
  // console.log(userData);

  const [currentUserData, setCurrentUser] = useState(userData);

  const {
    posts,
    username,
    name,
    email,
    uid,
    profilePic,
    coverPic,
    aboutMe,
    socials,
    timestamp,
  } = currentUserData;

  const [postsId, setPostsId] = useState(posts);

  console.log(postsId);

  const [previewProf, setPreviewProf] = useState(profilePic);
  const [previewCover, setPreviewCover] = useState(coverPic);
  const [currentAbout, setCurrentAbout] = useState(aboutMe);
  const [currentName, setCurrentName] = useState(name);
  const [currentUsername, setCurrentUsername] = useState(username);
  const [editingName, setEditingName] = useState(false);
  const [addSocials, setAddSocials] = useState(false);
  const [previewSocials, setPreviewSocials] = useState({
    facebook: socials?.facebook ?? "",
    twitter: socials?.twitter ?? "",
    instagram: socials?.instagram ?? "",
  });
  const [didDelete, setDidDelete] = useState(true);

  const auth = getAuth();

  const userRef = doc(db, "users", uid);

  const [userPosts, setPosts] = useState([]);

  const storage = getStorage();

  const dispatch = useDispatch();

  const showEdit = useSelector((state) => state.ui.showEdit);
  const textLength = useSelector((state) => state.text.textLength);
  // const isUpdating = useSelector((state) => state.ui.isUpdating);
  const isEditingUserName = useSelector((state) => state.ui.isEditingUserName);

  const aboutInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const facebookInputRef = useRef();
  const twitterInputRef = useRef();
  const instagramInputRef = useRef();

  const handleProfPic = (e) => {
    const file = e.target.files[0];

    if (e.target.id === "profPic") {
      if (file.size > 2227138) {
        alert("file is too big, pls upload 2mb or less only");
      }

      const uploadImgRef = ref(storage, `profile-picture/${file.name}`);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const uploadTask = await uploadString(
            uploadImgRef,
            reader.result,
            "data_url"
          );
          const url = getDownloadURL(uploadTask.ref);
          const downloadUrl = await url;

          setPreviewProf(reader.result);
          // dispatch(
          //   imageActions.setPreview({
          //     name: file.name,
          //     data_url: reader.result,
          //   })
          // );
          // console.log(reader.result);

          await updateDoc(userRef, { profilePic: downloadUrl });
        };
        reader.readAsDataURL(file);
      }
    }

    if (e.target.id === "coverPic") {
      if (file.size > 10227138) {
        alert("file is too big, pls upload 10mb or less only");
      }

      const uploadImgRef = ref(storage, `profile-cover/${file.name}`);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const uploadTask = await uploadString(
            uploadImgRef,
            reader.result,
            "data_url"
          );
          const url = getDownloadURL(uploadTask.ref);
          const downloadUrl = await url;

          setPreviewCover(reader.result);

          await updateDoc(userRef, { coverPic: downloadUrl });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCount = (e) => {
    dispatch(textActions.textCount(e.target.value.length));
    aboutInputRef.current.style.height =
      Math.min(aboutInputRef.current.scrollHeight, 500) + "px";
    setCurrentAbout(e.target.value);
  };

  const handleUsernameCount = (e) => {
    dispatch(textActions.textCount(e.target.value.length));
    setCurrentUsername(e.target.value);
  };

  const handleAboutMe = async () => {
    try {
      await updateDoc(userRef, { aboutMe: aboutInputRef.current.value });
      setCurrentAbout(aboutInputRef.current.value);
      dispatch(uiActions.edited());
      dispatch(textActions.reset());
      // dispatch(uiActions.updating());
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = (action) => {
    dispatch(uiActions.edited());
    dispatch(textActions.reset());
    if (action === "about") setCurrentAbout(aboutMe);
    if (action === "username") {
      dispatch(uiActions.editedUserName());
      setCurrentUsername(username);
    }
    if (action === "socials") {
      setAddSocials(false);
      setPreviewSocials({ ...socials });
    }
    if (action === "name") {
      setEditingName(false);
      setCurrentName(name);
    }
  };

  const handleEdit = () => {
    dispatch(uiActions.editing());
  };

  const handleUserName = () => {
    dispatch(uiActions.editingUserName());
  };

  const handleSaveUserName = async () => {
    const userProvidedPassword = passwordInputRef.current.value;
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      userProvidedPassword
    );

    try {
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      await updateDoc(userRef, { username: usernameInputRef.current.value });
      postsId.forEach(async (id, i) => {
        const colRef = doc(db, "posts", id);
        await updateDoc(colRef, { username: usernameInputRef.current.value });
        console.log("posts username updated");
      });
      dispatch(textActions.reset());
      dispatch(uiActions.editedUserName());
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleChangeSocials = (e) => {
    setPreviewSocials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSocials = async () => {
    try {
      await updateDoc(userRef, {
        socials: {
          facebook: facebookInputRef.current.value,
          twitter: twitterInputRef.current.value,
          instagram: instagramInputRef.current.value,
        },
      });
      setPreviewSocials((prev) => ({
        facebook: facebookInputRef.current.value,
        twitter: twitterInputRef.current.value,
        instagram: instagramInputRef.current.value,
      }));
      setAddSocials(false);
      console.log("socials updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveName = async () => {
    try {
      await updateDoc(userRef, { name: currentName });
      setEditingName(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (didDelete) {
    const allPosts = [];
    postsId.forEach(async (id, i) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);
      allPosts.push({ ...docData.data(), id: docData.id });

      if (i === postsId.length - 1) {
        setPosts((prev) => {
          //   return [...prev, { ...docData.data(), id: docData.id }].sort(
          //     (a, b) => b.timestamp - a.timestamp
          //   );
          const sorted = allPosts
            .map((post) => ({
              ...post,
              timestamp: post.timestamp.toDate().toDateString(),
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          return sorted;
        });
      }
    });
    // setDidDelete(false);
    console.log("fetching posts");
    // }
  }, [postsId]);

  return (
    <>
      {/* PROFILE CARD */}
      <ProfileCard
        handleChangeSocials={handleChangeSocials}
        self={true}
        handleProfPic={handleProfPic}
        previewCover={previewCover}
        previewProf={previewProf}
        username={username}
        currentName={currentName}
        handleCancel={handleCancel}
        showEdit={showEdit}
        currentAbout={currentAbout}
        aboutInputRef={aboutInputRef}
        handleCount={handleCount}
        textLength={textLength}
        handleAboutMe={handleAboutMe}
        handleEdit={handleEdit}
        handleUserName={handleUserName}
        isEditingUserName={isEditingUserName}
        handleSaveUserName={handleSaveUserName}
        usernameInputRef={usernameInputRef}
        currentUsername={currentUsername}
        setCurrentUsername={setCurrentUsername}
        handleUsernameCount={handleUsernameCount}
        passwordInputRef={passwordInputRef}
        addSocials={addSocials}
        setAddSocials={setAddSocials}
        facebookInputRef={facebookInputRef}
        twitterInputRef={twitterInputRef}
        instagramInputRef={instagramInputRef}
        handleSaveSocials={handleSaveSocials}
        previewSocials={previewSocials}
        timestamp={timestamp}
        email={email}
        setEditingName={setEditingName}
        editingName={editingName}
        setCurrentName={setCurrentName}
        handleSaveName={handleSaveName}
      />

      <ProfilePosts
        self={true}
        currentUsername={currentUsername}
        userPosts={userPosts}
        postsId={postsId}
        setDidDelete={setDidDelete}
        setPostsId={setPostsId}
      />
    </>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  try {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const userRef = doc(db, "users", uid);
    const userData = await getDoc(userRef);

    const name = userData.data().username;

    // DO FETCHING HERE

    const postsId = userData.data().posts;

    const data = {
      ...userData.data(),
      timestamp: userData.data().timestamp.toDate().toDateString(),
    };

    // postsId.forEach(async (id) => {
    //   const docRef = doc(db, "posts", id);

    //   const docData = await getDoc(docRef);

    //   userPosts.push({ ...docData.data(), id: docData.id });
    // });

    // console.log("cockers");

    return {
      props: {
        userData: { ...data, uid },
      },
    };
  } catch (error) {
    context.res.writeHead(302, { Location: "/sign-in" });
    context.res.end();

    return { props: {} };
  }
}

// REFERENCE TO HOW I SOLVE SERVER AUTH https://colinhacks.com/essays/nextjs-firebase-authentication

// RE-AUTHENTICATION FIREBASE V9: https://stackoverflow.com/questions/37811684/how-to-create-credential-object-needed-by-firebase-web-user-reauthenticatewith
