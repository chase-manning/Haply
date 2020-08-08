import * as functions from "firebase-functions";

// const admin = require("firebase-admin");
// admin.initializeApp();
// const db = admin.firestore();

export const create = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
