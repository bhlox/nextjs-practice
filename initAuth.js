// // ./initAuth.js
// import { init } from "next-firebase-auth";

// const initAuth = () => {
//   init({
//     authPageURL: "/auth",
//     appPageURL: "/",
//     loginAPIEndpoint: "/api/login", // required
//     logoutAPIEndpoint: "/api/logout", // required
//     onLoginRequestError: (err) => {
//       console.error(err);
//     },
//     onLogoutRequestError: (err) => {
//       console.error(err);
//     },
//     firebaseAuthEmulatorHost: "localhost:9099",
//     firebaseAdminInitConfig: {
//       credential: {
//         projectId: "nextjs-practice-ab971",
//         clientEmail:
//           "firebase-adminsdk-t6dkb@nextjs-practice-ab971.iam.gserviceaccount.com",
//         // The private key must not be accessible on the client side.
//         privateKey: process.env.FIREBASE_PRIVATE_KEY,
//       },
//       databaseURL:
//         "https://nextjs-practice-ab971-default-rtdb.asia-southeast1.firebasedatabase.app/",
//     },
//     // Use application default credentials (takes precedence over fireaseAdminInitConfig if set)
//     // useFirebaseAdminDefaultCredential: true,
//     firebaseClientInitConfig: {
//       apiKey: "AIzaSyCj1I9Q4wxon9RpF6mUOtwuf_UuRzo_0cQ", // required
//       authDomain: "nextjs-practice-ab971.firebaseapp.com",
//       databaseURL:
//         "https://nextjs-practice-ab971-default-rtdb.asia-southeast1.firebasedatabase.app/",
//       projectId: "nextjs-practice-ab971",
//     },
//     cookies: {
//       name: "NextJSPractice", // required
//       // Keys are required unless you set `signed` to `false`.
//       // The keys cannot be accessible on the client side.
//       keys: [
//         process.env.COOKIE_SECRET_CURRENT,
//         process.env.COOKIE_SECRET_PREVIOUS,
//       ],
//       httpOnly: true,
//       maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
//       overwrite: true,
//       path: "/",
//       sameSite: "strict",
//       secure: true, // set this to false in local (non-HTTPS) development
//       signed: true,
//     },
//     onVerifyTokenError: (err) => {
//       console.error(err);
//     },
//     onTokenRefreshError: (err) => {
//       console.error(err);
//     },
//   });
// };

// export default initAuth;
