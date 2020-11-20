import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "moodsUpdateV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.put("/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");

    const moodId = request.params.id;
    const { value, date, note, tags } = request.body;
    const data = {
      value,
      date,
      tags,
      note,
    };

    if (!moodId) throw new Error("id is blank");

    await db.collection("moods").doc(moodId).set(data, { merge: true });

    return response.json({
      id: moodId,
      data,
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

export const moodsUpdateV1 = app;
