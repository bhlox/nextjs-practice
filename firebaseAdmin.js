import * as firebaseAdmin from "firebase-admin";

// get this JSON from the Firebase board
// you can also store the values in environment variables
import serviceAccount from "./utils/db/serviceAccountKey.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL:
      "https://nextjs-practice-ab971-default-rtdb.asia-southeast1.firebasedatabase.app/",
  });
}

export { firebaseAdmin };
