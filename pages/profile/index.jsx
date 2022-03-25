import React, { useEffect, useState, useRef } from "react";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { db } from "../../firebase.config";
import { useDispatch, useSelector } from "react-redux";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebaseAdmin";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
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
import Head from "next/head";
import { userActions } from "../../components/store/user-slice";

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

  // console.log(postsId);

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
  const { message } = useSelector((state) => state.text);

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

          const userSnapshot = await getDoc(userRef);

          const commentsIdList = userSnapshot.data().comments;
          for (const commentId of commentsIdList) {
            const commentRef = doc(db, "comments", commentId);
            const commentSnapshot = await getDoc(commentRef);
            // console.log({ ...commentSnapshot.data() });
            await updateDoc(commentRef, {
              "author.userpic": downloadUrl,
            });

            const repliesIdList = commentSnapshot.data().replies;
            for (const replyId of repliesIdList) {
              const replyRef = doc(db, "replies", replyId);
              await updateDoc(replyRef, {
                "author.userpic": downloadUrl,
              });
              // const replySnapshot = await getDoc(replyRef);
              // console.log({ ...replySnapshot.data() });
            }
          }

          await updateDoc(userRef, { profilePic: downloadUrl });
          updateProfile(auth.currentUser, { photoURL: downloadUrl });
          // console.log("profile pic updated");

          postsId.forEach(async (id, i) => {
            const colRef = doc(db, "posts", id);
            await updateDoc(colRef, { "author.userpic": downloadUrl });
          });
          // console.log("posts userpic updated");
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
          // console.log("cover pic updated");
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

  const handleCancel = async (action) => {
    const previousUserDataRef = doc(db, "users", auth.currentUser.uid);

    try {
      const snapshot = await getDoc(previousUserDataRef);
      if (action === "about") setCurrentAbout(snapshot.data().aboutMe);
      if (action === "username") {
        dispatch(uiActions.editedUserName());
        dispatch(userActions.hide());
        setCurrentUsername(snapshot.data().username);
      }
      if (action === "name") {
        setEditingName(false);
        setCurrentName(snapshot.data().name);
      }
      if (action === "socials") {
        setAddSocials(false);
        setPreviewSocials(snapshot.data().socials);
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(uiActions.edited());
    dispatch(textActions.reset());
  };

  const handleEdit = () => {
    dispatch(uiActions.editing());
  };

  const handleUserName = () => {
    dispatch(uiActions.editingUserName());
  };

  const handleSaveUserName = async (e) => {
    e.preventDefault();

    dispatch(uiActions.loading());
    const userProvidedPassword = passwordInputRef.current.value;
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      userProvidedPassword
    );

    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("username", "==", usernameInputRef.current.value.trim())
    );

    try {
      const snapshot = await getDocs(userQuery);
      const taken = snapshot.docs.length !== 0;

      if (taken) {
        throw new Error("Firebase: Error (auth/username-is-taken)");
      }

      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      const isUsernameValid = usernameInputRef.current.value.length > 5;

      if (!isUsernameValid)
        throw new Error("Firebase: Error (auth/username-is-too-short)");

      const userSnapshot = await getDoc(userRef);

      const commentsIdList = userSnapshot.data().comments;
      for (const commentId of commentsIdList) {
        const commentRef = doc(db, "comments", commentId);
        const commentSnapshot = await getDoc(commentRef);
        // console.log({ ...commentSnapshot.data() });
        await updateDoc(commentRef, {
          "author.username": usernameInputRef.current.value,
        });

        const repliesIdList = commentSnapshot.data().replies;
        for (const replyId of repliesIdList) {
          const replyRef = doc(db, "replies", replyId);
          await updateDoc(replyRef, {
            "author.username": usernameInputRef.current.value,
          });
          // const replySnapshot = await getDoc(replyRef);
          // console.log({ ...replySnapshot.data() });
        }
      }

      await updateDoc(userRef, { username: usernameInputRef.current.value });
      updateProfile(auth.currentUser, {
        displayName: usernameInputRef.current.value,
      });
      // console.log("username updated");

      postsId.forEach(async (id, i) => {
        const colRef = doc(db, "posts", id);
        await updateDoc(colRef, {
          "author.username": usernameInputRef.current.value,
        });
        // console.log("posts username updated");
      });
      dispatch(textActions.reset());
      dispatch(uiActions.loaded());
      dispatch(uiActions.editedUserName());
    } catch (error) {
      const errorMsg = error
        .toString()
        ?.split(" ")
        ?.slice(-1)
        ?.toString()
        ?.replace(/[^a-zA-Z ]/g, " ");
      dispatch(textActions.submitErrorMsg(errorMsg));
      dispatch(uiActions.loaded());
      console.log(error);
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
      // console.log("socials updated");
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
    if (!postsId.length) {
      setPosts([]);
      return;
    }

    postsId.forEach(async (id, i) => {
      const docRef = doc(db, "posts", id);

      const docData = await getDoc(docRef);
      allPosts.push({ ...docData.data(), id: docData.id });

      if (i === postsId.length - 1) {
        setPosts(() => {
          const sorted = allPosts

            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => ({
              ...post,
              timestamp: post.timestamp.toDate().toDateString(),
            }));
          // console.log(sorted);
          return sorted;
        });
      }
    });
    // setDidDelete(false);
    // console.log("fetching posts");
    // }
  }, [postsId]);

  // console.log(userPosts);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/readdis_favicon.ico" />
      </Head>

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
        message={message}
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
