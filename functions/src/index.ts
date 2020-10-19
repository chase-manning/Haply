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

app.post("/v2/moods", async (request, response) => {
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
        .collection("pushNotificationTokens")
        .doc(pushNotificationToken.docs[0].id)
        .set(data, { merge: true });
    }

    response.json(pushNotificationToken);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/settings", async (request, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      nextNotification,
    } = request.body;
    const data = {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      userId,
      nextNotification: new Date(nextNotification),
    };

    let setting;
    setting = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (setting.empty) {
      const settingRef: any = await db.collection("settings").add(data);
      setting = await settingRef.get();
    } else {
      setting.forEach(async (qwe) => {
        await db.collection("settings").doc(qwe.id).set(data, { merge: true });
      });
    }

    response.json({ result: "All G" });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/v2/settings", async (request, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    const {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      nextNotification,
      tagOptions,
      colorPrimary,
      mode,
    } = request.body;
    const data = {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      userId,
      tagOptions,
      colorPrimary,
      mode,
      nextNotification: new Date(nextNotification),
    };

    let setting;
    setting = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (setting.empty) {
      const settingRef: any = await db.collection("settings").add(data);
      setting = await settingRef.get();
    } else {
      setting.forEach(async (qwe) => {
        await db.collection("settings").doc(qwe.id).set(data, { merge: true });
      });
    }

    response.json({ result: "All G" });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/settings", async (request: any, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

    let querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) response.status(404).send("Not Found");

    const setting = querySnapshot.docs[0].data();

    response.json(setting);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

export const notificationScheduler = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const titles: string[] = [
      "How Are You Feeling?",
      "How is Your Day?",
      "Hope You Are Having an Awesome Day!",
      "Time to Record Your Mood!",
      "Are You Feeling Great?",
      "Hope You're Doing Well?",
      "Don't Sweat The Small Stuff!",
      "You Are a Superhero!",
      "You Are Enough!",
      "You Are Whole!",
      "You Can Create Great Change!",
      "You Can do Anything!",
      "You Deserve The Best!",
    ];

    console.log("==== Starting the Notifications ====");

    console.log("==== Getting the Settings ====");
    const currentTime: Date = new Date();
    let settingsRef = await db
      .collection("settings")
      .where("remindersEnabled", "==", true)
      .where("nextNotification", "<=", currentTime)
      // .where("userId", "==", "maUx4vfwNxg7IgKW3CiEWdS1c9w2")
      .get();
    console.log("==== Got Settings ====");
    console.log(JSON.stringify(settingsRef));

    if (settingsRef.empty) return null;
    console.log("==== There are some settings ====");

    console.log("==== Added Settings to New List ====");
    let settings: any[] = [];
    settingsRef.forEach((setting) => {
      settings.push({ id: setting.id, data: setting.data() });
    });
    console.log(JSON.stringify(settings));

    console.log("==== Creating User ID List====");
    const userIds: string[] = settings.map(
      (setting: any) => setting.data.userId
    );
    console.log(JSON.stringify(userIds));

    console.log("==== Getting Tokens ====");
    let tokens: any[] = [];
    let userIndex: number = 0;
    console.log("User Index: " + userIndex);
    console.log("User Ids: " + userIds.length);
    while (userIndex < userIds.length) {
      console.log("User Index: " + userIndex);
      console.log("User Ids: " + userIds.length);

      console.log("==== Processing Batch " + userIndex + " ====");
      let userBatch: string[] = userIds.slice(
        userIndex,
        Math.min(userIndex + 10, userIds.length - userIndex)
      );
      console.log(userBatch);

      if (userBatch.length === 0) {
        console.log("==== No Ids in Batch Skipping Step ====");
        userIndex = userIndex + 10;
        continue;
      }

      console.log("==== Batch is Not Empty ====");

      let tokensRef = await db
        .collection("pushNotificationTokens")
        .where("userId", "in", userBatch)
        .get();
      console.log(JSON.stringify(tokensRef));

      if (tokensRef.empty) {
        console.log("==== No Tokens Skipping Step ====");
        userIndex = userIndex + 10;
        continue;
      }
      console.log("==== Tokens Not Empty ====");

      console.log("==== Populating Tokens List ====");
      tokensRef.forEach((token) => {
        tokens.push({ id: token.id, token: token.data().token });
      });
      userIndex = userIndex + 10;
    }

    console.log("==== Creating Payload ====");
    const payload = {
      notification: {
        title: titles[Math.round(Math.random() * (titles.length - 1))],
        body:
          "Reminder to record how you are feeling in Haply and what is happening in your day",
      },
    };
    console.log(payload);

    if (tokens.length > 0)
      console.log("==== There are some Tokens to Process ====");
    else {
      console.log("==== There are no tokens to process ===");
      return null;
    }

    console.log("==== Getting Token Ids ====");
    let tokenIds: string[] = tokens.map((token: any) => token.token);
    console.log(JSON.stringify(tokenIds));

    console.log("==== Sending Messages ====");
    const response = await admin.messaging().sendToDevice(tokenIds, payload);
    console.log("==== Send Messages ====");
    console.log(JSON.stringify(response));
    console.log(JSON.stringify(response.results));

    const tokensToRemove: any[] = [];
    response.results.forEach((result, index) => {
      console.log("==== Token Result ====");
      console.log(tokens[index]);
      const error = result.error;
      if (error) {
        console.error(
          "Failure sending notification to",
          tokens[index].token,
          error
        );
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          tokensToRemove.push(tokens[index]);
        }
      } else {
        console.log("==== Sent fine ====");
      }
    });

    console.log("==== Populated Token Removal List ====");
    console.log(JSON.stringify(tokensToRemove));

    console.log("==== Updating Settings with new Time ====");
    settings.forEach(async (setting: any) => {
      let newSetting: any = setting.data;

      let randomNumber: number = Math.random();
      let minutesAdded: number = Math.round(
        newSetting.frequencyMinutesMin * randomNumber +
          newSetting.frequencyMinutesMax * (1 - randomNumber)
      );

      let now: Date = new Date();
      newSetting.nextNotification = new Date(
        now.getTime() + minutesAdded * 60000
      );

      await db
        .collection("settings")
        .doc(setting.id)
        .set(newSetting, { merge: true });
    });

    console.log("==== Removing Tokens ====");
    let tokenRemovals: any[] = [];
    tokens.forEach((token) => {
      if (
        tokensToRemove
          .map((tokenToRemove: any) => tokenToRemove.token)
          .indexOf(token.token) > -1
      ) {
        console.log("==== Removing token: " + token + " ====");
        tokenRemovals.push(
          db.collection("pushNotificationTokens").doc(token.id).delete()
        );
      }
    });

    console.log("==== Awating all token removals ====");
    await Promise.all(tokenRemovals);
    console.log("==== Finished awaiting token removals ====");

    return null;
  });
