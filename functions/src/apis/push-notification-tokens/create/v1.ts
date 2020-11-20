import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "pushNotificationTokensCreateV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.post("/pushNotificationTokens/:token", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

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

    return response.json(pushNotificationToken);
  } catch (error) {
    return response.status(500).send(error);
  }
});

export const pushNotificationTokensCreateV1 = app;
