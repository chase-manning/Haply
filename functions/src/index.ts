import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

const cors = require("cors");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

app.use(cors({ origin: true }));
main.use("/api", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.post("/moods", async (request, response) => {
  try {
    const { value, date, userId } = request.body;
    const data = {
      value,
      date,
      userId,
    };

    const moodRef = await db.collection("moods").add(data);
    const mood = await moodRef.get();

    response.json({
      id: moodRef.id,
      data: mood.data(),
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/moods/:id", async (request, response) => {
  try {
    const moodId = request.params.id;

    if (!moodId) throw new Error("Mood ID is required");

    const mood = await db.collection("moods").doc(moodId).get();

    if (!mood.exists) {
      throw new Error("Mood doesnt exist.");
    }

    response.json({
      id: mood.id,
      data: mood.data(),
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/moods", async (request: any, response) => {
  try {
    const order: string = request.query.order;
    const limit: number = request.query.limit;
    const userId: string = request.query.userId;
    console.log(order);
    console.log(limit);
    console.log(!!order);
    console.log(!!limit);

    let moodQuerySnapshot;
    if (!!order && !!limit) {
      moodQuerySnapshot = await db
        .collection("moods")
        .where("userId", "==", userId)
        .orderBy(order, "desc")
        .limit(20)
        .get();
    } else if (!!order) {
      moodQuerySnapshot = await db
        .collection("moods")
        .where("userId", "==", userId)
        .orderBy(order, "desc")
        .get();
    } else if (!!limit) {
      moodQuerySnapshot = await db
        .collection("moods")
        .where("userId", "==", userId)
        .limit(20)
        .get();
    } else {
      moodQuerySnapshot = await db
        .collection("moods")
        .where("userId", "==", userId)
        .get();
    }
    console.log(moodQuerySnapshot);

    const moods: any[] = [];
    moodQuerySnapshot.forEach((doc) => {
      moods.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    response.json(moods);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.put("/moods/:id", async (request, response) => {
  try {
    const moodId = request.params.id;
    const { value, date } = request.body;
    const data = {
      value,
      date,
    };

    if (!moodId) throw new Error("id is blank");

    await db.collection("moods").doc(moodId).set(data, { merge: true });

    response.json({
      id: moodId,
      data,
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/moods/:id", async (request, response) => {
  try {
    const moodId = request.params.id;

    if (!moodId) throw new Error("id is blank");

    await db.collection("moods").doc(moodId).delete();

    response.json({
      id: moodId,
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/meow", async (request, response) => {
  try {
    const moodQuerySnapshot = await db.collection("moods").get();

    const batch = db.batch();
    moodQuerySnapshot.forEach((doc) => {
      const nycRef = db.collection("moods").doc(doc.id);
      batch.set(nycRef, {
        userId: "L49gTrfL5rbqLBZkniffrrrFETg1",
      });
    });

    // Commit the batch
    await batch.commit();

    response.json({
      meow: "woof",
    });
  } catch (error) {
    response.status(500).send(error);
  }
});
