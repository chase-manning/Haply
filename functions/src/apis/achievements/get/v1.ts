import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dateFormat from "dateformat";
import { getUser } from "../../../get-user";

const firebase = admin.initializeApp(
  functions.config().firebase,
  "achievementGetV1"
);
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

interface Mood {
  value: number;
  date: string;
  userId: string;
  id: string;
  note: string;
  tags: string[];
  description: string;
}

interface Achievement {
  svg: string;
  percentComplete: number;
  title: string;
  description: string;
  colorPrimary: string;
  unlocks: string[];
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

    let achievements: Achievement[] = [];

    // First Steps
    achievements.push({
      svg: "firstSteps",
      percentComplete: moods.length >= 1 ? 1 : 0,
      title: "First Steps",
      description: "Record your first feeling",
      colorPrimary: "#3F3D56",
      unlocks: [],
    });

    // Early Bird
    achievements.push({
      svg: "earlyBird",
      percentComplete: moods.some((mood: Mood) => {
        const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
        return hour >= 5 && hour <= 6;
      })
        ? 1
        : 0,
      title: "Early Bird",
      description: "Record a Feeling in The Early Morning between 5am and 7am",
      colorPrimary: "#FF0000",
      unlocks: [],
    });

    // Lunch Date
    achievements.push({
      svg: "lunchDate",
      percentComplete: moods.some((mood: Mood) => {
        const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
        return hour === 12;
      })
        ? 1
        : 0,
      title: "Lunch Date",
      description: "Record a Feeling at Luch Time between 12am and 1pm",
      colorPrimary: "#FFD700",
      unlocks: [],
    });

    // Night Owl
    achievements.push({
      svg: "nightOwl",
      percentComplete: moods.some((mood: Mood) => {
        const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
        return hour >= 23 || hour <= 3;
      })
        ? 1
        : 0,
      title: "Night Owl",
      description: "Record a Feeling late at Night between 11pm and 4am",
      colorPrimary: "#ccffff",
      unlocks: ["Dark Mode"],
    });

    // Feeling Amazing
    achievements.push({
      svg: "feelingAmazing",
      percentComplete: moods.some((mood: Mood) => mood.value === 10) ? 1 : 0,
      title: "Feeling Amazing",
      description: "Record a Feeling when you are feeling Amazing!",
      colorPrimary: "#284498",
      unlocks: [],
    });

    // Merry Christmas
    achievements.push({
      svg: "merryChristmas",
      percentComplete: moods.some(
        (mood: Mood) => dateFormat(mood.date, "d - m") === "25 - 12"
      )
        ? 1
        : 0,
      title: "Merry Christmas",
      description: "Record a Feeling on Christmas Day",
      colorPrimary: "#7CFC00",
      unlocks: [],
    });

    // Happy Halloween
    achievements.push({
      svg: "happyHalloween",
      percentComplete: moods.some(
        (mood: Mood) => dateFormat(mood.date, "d - m") === "31 - 10"
      )
        ? 1
        : 0,
      title: "Happy Halloween",
      description: "Record a Feeling on Halloween",
      colorPrimary: "#FF8C00",
      unlocks: [],
    });

    // Avid Writer
    achievements.push({
      svg: "avidWriter",
      percentComplete: Math.min(
        moods.filter((mood: Mood) => mood.note && mood.note.length > 0).length /
          100,
        1
      ),
      title: "Avid Writer",
      description: "Record 100 Feelings with a Note",
      colorPrimary: "#ccffcc",
      unlocks: [],
    });

    // Master Tagger
    achievements.push({
      svg: "masterTagger",
      percentComplete: Math.min(
        moods.filter((mood: Mood) => mood.tags && mood.tags.length > 0).length /
          100,
        1
      ),
      title: "Master Tagger",
      description: "Record 100 Feelings with a Tag",
      colorPrimary: "#FA8072",
      unlocks: [],
    });

    // High Flyer
    achievements.push({
      svg: "highFlyer",
      percentComplete: user.email ? 1 : 0,
      title: "High Flyer",
      description: "Enable Cloud Sync",
      colorPrimary: "#ccffe0",
      unlocks: [],
    });

    // Looking Stylish
    achievements.push({
      svg: "lookingStylish",
      percentComplete: setting.colorPrimary === "#4071fe" ? 0 : 1,
      title: "Looking Stylish",
      description: "Change the Theme to a new color",
      colorPrimary: "#8A2BE2",
      unlocks: [],
    });

    // Tag Tinkerer
    achievements.push({
      svg: "tagTinkerer",
      percentComplete:
        setting.tagOptions &&
        setting.tagOptions.some(
          (tagOption: string) => defaultTags.indexOf(tagOption) < 0
        )
          ? 1
          : 0,
      title: "Tag Tinkerer",
      description: "Create your own Custom Tags",
      colorPrimary: "#FF69B4",
      unlocks: [],
    });

    // Full Moon
    achievements.push({
      svg: "fullMoon",
      percentComplete: setting.mode === Mode.Default ? 0 : 1,
      title: "Full Moon",
      description: "Try out Dark Mode",
      colorPrimary: "#ffcccc",
      unlocks: [],
    });

    // The Journey
    achievements.push({
      svg: "theJourney",
      percentComplete: Math.min(moods.length / 10, 1),
      title: "The Journey",
      description: "Record 10 Feelings",
      colorPrimary: "#40E0D0",
      unlocks: [],
    });

    // Settle In
    achievements.push({
      svg: "settleIn",
      percentComplete: Math.min(moods.length / 100, 1),
      title: "Settle In",
      description: "Record 100 Feelings",
      colorPrimary: "#00BFFF",
      unlocks: [],
    });

    // For Breakfast
    achievements.push({
      svg: "forBreakfast",
      percentComplete: Math.min(moods.length / 1000, 1),
      title: "For Breakfast",
      description: "Record 1,000 Feelings",
      colorPrimary: "#483D8B",
      unlocks: [],
    });

    let maxDays: number = 0;
    let currentDays: number = 1;
    let lastDate: number = -1;

    moods.forEach((mood: Mood) => {
      let day: number = Number.parseInt(dateFormat(mood.date, "d"));
      if (day === lastDate - 1) currentDays++;
      lastDate = day;
      if (currentDays > maxDays) maxDays = currentDays;
    });

    // A Habbit
    achievements.push({
      svg: "aHabbit",
      percentComplete: Math.min(maxDays / 7, 1),
      title: "A Habbit",
      description: "Record your Feelings every day for a Week",
      colorPrimary: "#7B68EE",
      unlocks: [],
    });

    // A Routine
    achievements.push({
      svg: "aRoutine",
      percentComplete: Math.min(maxDays / 30, 1),
      title: "A Routine",
      description: "Record your Feelings every day for a Month",
      colorPrimary: "#EE82EE",
      unlocks: [],
    });

    // A Lifestyle
    achievements.push({
      svg: "aLifestyle",
      percentComplete: Math.min(maxDays / 365, 1),
      title: "A Lifestyle",
      description: "Record your Feelings every day for a Year",
      colorPrimary: "#FF00FF",
      unlocks: [],
    });

    // #008000
    // #808000
    // #00FFFF
    // #FFFF00 Yellow
    // #8B008B Purple
    // #FFA500 Orange
    // #FFFFFF
    // #FF1493
    // #F0F8FF
    // #C0C0C0
    // #F5F5F5
    // #808080
    // #FFF5EE
    // #708090
    // #F5F5DC
    // #2F4F4F
    // #FFFAF0
    // #000000
    // #FFFFF0
    // #DEB887
    // #FAEBD7
    // #BC8F8F
    // #FFF0F5
    // #DAA520
    // #FFE4E1
    // #D2691E
    // #A52A2A

    achievements.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });

    return response.json(achievements);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

const getTimezoneDate = (date: string, timezone: string): string => {
  let basicDate = new Date(date);
  return basicDate.toLocaleString("en-US", {
    timeZone: timezone ? timezone : "America/New_York",
  });
};

export const achievementGetV1 = app;
