import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dateFormat from "dateformat";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "apiCalendarGetV1"
);
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

interface DayAverage {
  date: string;
  average: number;
}

interface Mood {
  value: number;
  date: string;
  userId: string;
  id: string;
  note: string;
  tags: string[];
  description: string;
}

enum Mode {
  Default,
  Dark,
  Light,
}

interface Settings {
  remindersEnabled: boolean;
  randomReminders: boolean;
  frequencyMinutesMin: number;
  frequencyMinutesMax: number;
  nextNotification: string;
  colorPrimary: string;
  mode: Mode;
  timezone: string;
}

app.get("", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    let querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    let setting: Settings;

    if (querySnapshot.empty) {
      setting = {
        remindersEnabled: true,
        randomReminders: false,
        frequencyMinutesMin: 420,
        frequencyMinutesMax: 420,
        nextNotification: new Date().toString(),
        colorPrimary: "#4071fe",
        mode: Mode.Default,
        timezone: "Asia/Kolkata",
      };
    } else {
      const settingData = querySnapshot.docs[0].data();
      setting = {
        remindersEnabled: settingData.remindersEnabled,
        randomReminders: settingData.randomReminders,
        frequencyMinutesMin: settingData.frequencyMinutesMin,
        frequencyMinutesMax: settingData.frequencyMinutesMax,
        nextNotification: settingData.nextNotification,
        colorPrimary: settingData.colorPrimary,
        mode: settingData.mode,
        timezone: settingData.timezone ? settingData.timezone : "Asia/Kolkata",
      };
    }

    let moodQuerySnapshot = await db
      .collection("moods")
      .where("userId", "==", userId)
      .get();

    const moods: Mood[] = [];
    moodQuerySnapshot.forEach((doc) => {
      let mood = doc.data();
      let moodDate = new Date(mood.date).toISOString();
      moods.push({
        id: doc.id,
        value: mood.value,
        date: getTimezoneDate(moodDate, setting.timezone),
        userId: mood.userId,
        note: mood.note,
        tags: mood.tags,
        description: mood.description,
      });
    });

    console.log("getting into the good stuff");
    let dayAverages: DayAverage[] = [];

    let sortedMoods = moods.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let startDate = sortedMoods[0].date;
    console.log("start date calced");
    console.log(startDate);

    let today = getCurrentDateTimezone(setting.timezone);
    console.log("today");
    console.log(today);

    console.log("starting loop");
    while (
      new Date(dateFormat(startDate, "m/d/yyyy")) <=
      new Date(dateFormat(today, "m/d/yyyy"))
    ) {
      let average = dateAverage(
        moods,
        "dd-mm-yyyy",
        dateFormat(startDate, "dd-mm-yyyy")
      );
      dayAverages.push({ date: startDate, average: average });
      let nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 1);
      startDate = dateFormat(nextDate, "m/d/yyyy, h:M:s TT");
    }
    console.log("done");

    dayAverages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return response.json(dayAverages);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

function dateAverage(moods: Mood[], format: string, value: string): number {
  let dayList: Mood[] = moods.filter(
    (mood: Mood) => dateFormat(mood.date, format) === value
  );
  return dayList.length === 0
    ? -1
    : Math.round(
        (dayList.map((day: Mood) => day.value).reduce((a, b) => a + b) /
          dayList.length) *
          10
      ) / 10;
}

const getTimezoneDate = (date: string, timezone: string): string => {
  let basicDate = new Date(date);
  return basicDate.toLocaleString("en-US", {
    timeZone: timezone ? timezone : "America/New_York",
  });
};

const getCurrentDateTimezone = (timezone: string): string => {
  let currentTime = new Date();
  return getTimezoneDate(currentTime.toISOString(), timezone);
};

export const calendarGetV1 = app;
