import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(functions.config().firebase, "moodsGetV1");
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get("/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const id = request.params.id;

    if (!id) throw new Error("Mood ID is required");

    const mood = await db.collection("moods").doc(id).get();

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

    //Temporary Override for Tags Still Existing
    const feelings = [
      "Tired",
      "Stressed",
      "Energetic",
      "Well Rested",
      "In Pain",
      "Sick",
      "Tipsy",
      "Drunk",
      "Hungover",
      "High",
    ];
    const activities = [
      "Relaxing",
      "Exercising",
      "Working",
      "Holiday",
      "Eating Well",
      "Eating Poorly",
      "Haply",
      "Entertainment",
      "IAG",
      "Walking",
      "Music",
      "ASMR",
      "Instagram",
    ];
    const places = [
      "Home",
      "Work",
      "School",
      "Office",
      "Dads",
      "Mums",
      "Outside",
    ];
    const people = ["Friends", "Family", "Myself", "With Friends"];
    moods.forEach((mood: any) => {
      if (mood.data.tags) {
        if (!mood.data.feelings) mood.data.feelings = [];
        if (!mood.data.activities) mood.data.activities = [];
        if (!mood.data.places) mood.data.places = [];
        if (!mood.data.people) mood.data.people = [];
        mood.data.tags.forEach((tag: string) => {
          let newTag = tag;
          newTag = newTag.replace("With ", "");
          newTag = newTag.replace("At ", "");
          newTag = newTag.replace("On ", "");
          if (feelings.indexOf(newTag) >= 0) mood.data.feelings.push(newTag);
          if (activities.indexOf(newTag) >= 0)
            mood.data.activities.push(newTag);
          if (places.indexOf(newTag) >= 0) mood.data.places.push(newTag);
          if (people.indexOf(newTag) >= 0) mood.data.people.push(newTag);
        });
      }
    });

    return response.json(moods);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

export const moodsGetV1 = app;
