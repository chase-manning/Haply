import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dateFormat from "dateformat";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(functions.config().firebase, "statsGetV1");
const db = firebase.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

const defaultTags = [
  "With Friends",
  "With Family",
  "Tired",
  "Well Rested",
  "In Pain",
  "Sick",
  "Working",
  "At Home",
  "On Holiday",
  "Eating Well",
  "Eating Poorly",
  "Exercising",
];

enum StatType {
  Bar,
  Chart,
  Percent,
}

type DataPoint = {
  value: number;
  label: string;
};

type Stat = {
  title: string;
  type: StatType;
  locked: boolean;
  lockedMessage: string;
  percentComplete: number;
  dataPoints: DataPoint[];
};

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
  tagOptions: string[];
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
        tagOptions: defaultTags,
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
        tagOptions: settingData.tagOptions,
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

    let stats: Stat[] = [];

    stats.push(createStatLine(moods, "d/m/yyyy", 1, "Day", setting.timezone));
    stats.push(createStatLine(moods, "W/yyyy", 7, "Week", setting.timezone));
    stats.push(
      createStatLine(moods, "m/yyyy", 365 / 12, "Month", setting.timezone)
    );
    stats.push(createStatLine(moods, "yyyy", 365, "Year", setting.timezone));

    stats.push(
      createStatBar(
        moods,
        "ddd",
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "Day",
        true
      )
    );

    stats.push(
      createStatBar(
        moods,
        "mmm",
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        "Month",
        true
      )
    );

    stats.push(
      createStatBar(
        moods,
        "H",
        [
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
        ],
        "Hour",
        false
      )
    );

    setting.tagOptions.forEach((tagOption: string) =>
      stats.push(createStatPercent(moods, tagOption))
    );

    stats.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });

    return response.json(stats);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

function createStatPercent(moods: Mood[], tag: string) {
  const moodsWithoutTag = moods.filter(
    (mood: Mood) => !mood.tags || mood.tags.indexOf(tag) < 0
  );
  const averageWithoutTag = averageMood(moodsWithoutTag);
  const moodsWithTag = moods.filter(
    (mood: Mood) => mood.tags && mood.tags.indexOf(tag) >= 0
  );
  const averageWithTag = averageMood(moodsWithTag);

  return {
    title: "Feeling Change With " + tag,
    type: StatType.Percent,
    locked: moodsWithoutTag.length < 10 || moodsWithTag.length < 10,
    lockedMessage:
      moodsWithTag.length < 10
        ? "Record 10 feelings using '" + tag + "' to unlock"
        : "Record 10 feelings using '" + tag + "' to unlock",
    percentComplete:
      (Math.min(moodsWithoutTag.length / 10, 1) +
        Math.min(moodsWithTag.length / 10, 1)) /
      2,
    dataPoints: [{ label: "", value: averageWithTag / averageWithoutTag - 1 }],
  };
}

const averageMood = (moods: Mood[]) => {
  return moods.length === 0
    ? -1
    : moods.map((mood: Mood) => mood.value).reduce((a, b) => a + b) /
        moods.length;
};

function createStatLine(
  moods: Mood[],
  format: string,
  daysIncrement: number,
  periodName: string,
  timezone: string
): Stat {
  let periods: string[] = [];

  for (let i: number = 0; i < 20; i++) {
    let currentTime = new Date(getCurrentDateTimezone(timezone));
    periods.push(
      dateFormat(
        currentTime.setDate(currentTime.getDate() - i * daysIncrement),
        format
      )
    );
  }

  const dataPoints: DataPoint[] = periods
    .map((period: string) => {
      return {
        label: "",
        value: dateAverage(moods, format, period),
      };
    })
    .filter((dataPoint: DataPoint) => dataPoint.value >= 0)
    .reverse();

  return {
    title: "Feeling by " + periodName,
    type: StatType.Chart,
    locked: dataPoints.length < 3,
    lockedMessage:
      "Record your Feeling three " + periodName + "s in a row to unlock",
    percentComplete: Math.min(dataPoints.length / 3, 1),
    dataPoints: dataPoints,
  };
}

function createStatBar(
  moods: Mood[],
  format: string,
  periods: string[],
  periodName: string,
  truncateLabel: boolean
): Stat {
  let dataPoints: DataPoint[] = periods
    .map((period: string) => {
      return {
        label: truncateLabel ? period.substring(0, 1) : period,
        value: dateAverage(moods, format, period),
      };
    })
    .filter((dataPoint: DataPoint) => dataPoint.value >= 0);

  return {
    title: "Average Feeling by " + periodName,
    type: StatType.Bar,
    locked: dataPoints.length < periods.length,
    lockedMessage: "Record a feeling for every " + periodName + " to unlock",
    percentComplete: dataPoints.length / periods.length,
    dataPoints: dataPoints,
  };
}

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

export const statsGetV1 = app;
