import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "apisMoodsGetV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get("/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const moodId = request.params.id;

    if (!moodId) throw new Error("Mood ID is required");

    const mood = await db.collection("moods").doc(moodId).get();

    if (!mood.exists) {
      throw new Error("Mood doesnt exist.");
    }

    if (mood.data()?.userId !== userId)
      response.status(403).send("Unauthorized");

    return response.json({
      id: mood.id,
      data: mood.data(),
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const order: string = request.query.order;
    const limit: number = request.query.limit;
    const startDate: string = request.query.startdate;
    const endDate: string = request.query.enddate;

    console.log("start Date");
    console.log(startDate);
    console.log(new Date(startDate));
    console.log("end date");
    console.log(endDate);
    console.log(new Date(endDate));

    let moodQuerySnapshot;
    if (order) {
      if (limit) {
        if (startDate && endDate) {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .where("date", ">=", new Date(startDate).toISOString())
            .where("date", "<", new Date(endDate).toISOString())
            .orderBy(order, "desc")
            .limit(32)
            .get();
        } else {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .orderBy(order, "desc")
            .limit(32)
            .get();
        }
      } else {
        if (startDate && endDate) {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .where("date", ">=", new Date(startDate).toISOString())
            .where("date", "<", new Date(endDate).toISOString())
            .orderBy(order, "desc")
            .get();
        } else {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .orderBy(order, "desc")
            .get();
        }
      }
    } else {
      if (limit) {
        if (startDate && endDate) {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .where("date", ">=", new Date(startDate).toISOString())
            .where("date", "<", new Date(endDate).toISOString())
            .limit(32)
            .get();
        } else {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .limit(32)
            .get();
        }
      } else {
        if (startDate && endDate) {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .where("date", ">=", new Date(startDate).toISOString())
            .where("date", "<", new Date(endDate).toISOString())
            .get();
        } else {
          moodQuerySnapshot = await db
            .collection("moods")
            .where("userId", "==", userId)
            .get();
        }
      }
    }

    console.log(moodQuerySnapshot);

    const moods: any[] = [];
    moodQuerySnapshot.forEach((doc) => {
      moods.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return response.json(moods);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

export const moodsGetV1 = app;
