import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

async function getUserId(req: any): Promise<string> {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    return "";
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    idToken = req.cookies.__session;
  } else {
    return "";
  }

  try {
    const user = await admin.auth().verifyIdToken(idToken);
    return user.uid;
  } catch (error) {
    return "";
  }
}

app.use(cors({ origin: true }));
main.use("/api", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.post("/moods", async (request, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const { value, date, note } = request.body;
    const data = {
      value,
      date,
      note,
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

app.post("/v1/moods", async (request, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const { value, date, note, tags } = request.body;
    const data = {
      value,
      date,
      note,
      tags,
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
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const moodId = request.params.id;

    if (!moodId) throw new Error("Mood ID is required");

    const mood = await db.collection("moods").doc(moodId).get();

    if (!mood.exists) {
      throw new Error("Mood doesnt exist.");
    }

    if (mood.data()?.userId !== userId)
      response.status(403).send("Unauthorized");

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
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const order: string = request.query.order;
    const limit: number = request.query.limit;

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
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

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
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

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

app.post("/pushNotificationTokens/:token", async (request, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const token: string = request.params.token;
    if (!token) response.status(400).send("Token Not Provided");

    let pushNotificationToken: any = await db
      .collection("pushNotificationTokens")
      .where("token", "==", token)
      .limit(1)
      .get();

    const data = {
      token: token,
      userId: userId,
    };

    if (pushNotificationToken.empty) {
      const pushNotificationTokenRef: any = await db
        .collection("pushNotificationTokens")
        .add(data);
      pushNotificationToken = await pushNotificationTokenRef.get();
    } else {
      await db
        .collection("moods")
        .doc(pushNotificationToken[0].id)
        .set(data, { merge: true });
      pushNotificationToken = await db
        .collection("pushNotificationTokens")
        .where("token", "==", token)
        .limit(1)
        .get();
    }

    response.json(pushNotificationToken);
  } catch (error) {
    response.status(500).send(error);
  }
});

export const notificationScheduler = functions.pubsub
  .schedule("every 1 day")
  .onRun(async () => {
    // const tokens: any = await db.collection("pushNotificationTokens").get();
    // tokens.forEach(async (token: any) => {
    //   const latestMood: any = await db
    //     .collection("moods")
    //     .orderBy("date", "desc")
    //     .limit(1)
    //     .get();

    //   if (!latestMood.empty) {
    //     const mood: any = latestMood[0].data();
    //     const date: number = Date.parse(mood.date);
    //     const now: number = Date.now();
    //     const yesterday: number = now - 23 * 60 * 60 * 1000;
    //     if (date <= yesterday) {
    //     }
    //   }
    // });

    const payload = {
      notification: {
        title: "Test Title",
        body: "Test Body",
      },
    };

    await admin
      .messaging()
      .sendToDevice(
        "fHEl0KDjQXS--KGX8oANjy:APA91bFRRFlDFXudB7pyIdJYrazpgx15PTgTPq5krY7H0i55l_zNJ0T_ZyBANSWu6mA4G2AbiGyu0MRzsTGAI0DQUWxbyYNmOPTEIm9JYNTEcZTMV11sSCgNBu33go1OhSHAJjPHpd_E",
        payload
      );
    return null;
  });
