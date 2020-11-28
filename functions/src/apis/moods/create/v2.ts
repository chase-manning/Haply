import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "moodsCreateV2"
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
      value,
      date,
      note,
      feelings,
      activities,
      places,
      people,
    } = request.body;
    const data = {
      value,
      date,
      note,
      feelings,
      activities,
      places,
      people,
      userId,
    };

    const moodRef = await db.collection("moods").add(data);
    const mood = await moodRef.get();

    let settingsRef = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    let settings: any[] = [];
    settingsRef.forEach((settingRef) =>
      settings.push({ id: settingRef.id, data: settingRef.data() })
    );

    let newSetting = settings[0].data;

    let randomNumber: number = Math.random();
    let minutesAdded: number =
      newSetting.frequencyMinutesMin * randomNumber +
      newSetting.frequencyMinutesMax * (1 - randomNumber);

    let now: Date = new Date();
    newSetting.nextNotification = new Date(
      now.getTime() + minutesAdded * 60000
    );

    await db
      .collection("settings")
      .doc(settings[0].id)
      .set(newSetting, { merge: true });

    return response.json({
      id: moodRef.id,
      ...mood.data(),
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

export const moodsCreateV2 = app;
