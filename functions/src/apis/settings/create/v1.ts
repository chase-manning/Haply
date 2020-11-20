import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "settingsCreateV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.post("", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      nextNotification,
      feelings,
      activities,
      places,
      people,
      colorPrimary,
      colorSecondary,
      mode,
      timezone,
    } = request.body;
    const data = {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      userId,
      feelings,
      activities,
      places,
      people,
      colorPrimary,
      colorSecondary,
      mode,
      nextNotification: new Date(nextNotification),
      timezone,
    };

    const querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (querySnapshot.empty) {
      await db.collection("settings").add(data);
    } else {
      await db
        .collection("settings")
        .doc(querySnapshot.docs[0].id)
        .set(data, { merge: true });
    }

    return response.json({ result: "All G" });
  } catch (error) {
    return response.status(500).send(error);
  }
});

export const settingsCreateV1 = app;
