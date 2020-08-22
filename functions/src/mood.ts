import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Mood } from "../../shared/models/mood";

admin.initializeApp();
const db = admin.firestore();

export const create = functions.https.onRequest(async (request, response) => {
  const col = db.collection("mood");
  const happiness = new Mood(6);
  const res = await col.add(happiness.json);
  response.send(res);
});

export const update = functions.https.onRequest(async (request, response) => {
  const col = db.collection("mood").doc("qweqwe");
  const happiness = new Mood(6);
  const res = await col.set(happiness.json);
  response.send(res);
});
