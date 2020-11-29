import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "moodsDeleteV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.delete("/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");

    const id = request.params.id;

    if (!id) throw new Error("id is blank");

    await db.collection("moods").doc(id).delete();

    return response.json({
      id: id,
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

export const moodsDeleteV1 = app;
