import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "schedulesNotifications"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

export const notificationsV1 = functions.pubsub
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
