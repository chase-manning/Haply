import * as functions from "firebase-functions";

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

export const create = functions.https.onRequest(async (request, response) => {
  const col = db.collection("happiness");
  const happiness = {
    date: new Date(),
    value: 8,
  };
  const res = await col.set(happiness);
  response.send(res);
});

export const update = functions.https.onRequest(async (request, response) => {
  const docRef = db.collection("happiness").doc("qweqwe");
  const happiness = {
    date: new Date(),
    value: 8,
  };
  const res = await docRef.set(happiness);
  response.send(res);
});
