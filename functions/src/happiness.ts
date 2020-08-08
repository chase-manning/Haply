import * as functions from "firebase-functions";

import { Happiness } from "../../shared/models/happiness";

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

export const create = functions.https.onRequest(async (request, response) => {
  const docRef = db.collection("happiness").doc("qweqwe");
  const happiness = new Happiness(6);
  const res = await docRef.set(happiness);
  response.send(res);
});
