import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dateFormat from "dateformat";
import { moodsCreateV1 } from "./apis/moods/create/v1";
import { moodsGetV1 } from "./apis/moods/get/v1";
import { moodsDeleteV1 } from "./apis/moods/delete/v1";
import { moodsUpdateV1 } from "./apis/moods/update/v1";
import { pushNotificationTokensCreateV1 } from "./apis/push-notification-tokens/create/v1";
import { settingsCreateV1 } from "./apis/settings/create/v1";
import { settingsGetV1 } from "./apis/settings/get/v1";
import { statsGetV1 } from "./apis/stats/get/v1";
import { achievementGetV1 } from "./apis/achievements/get/v1";
import { calendarGetV1 } from "./apis/calendar/get/v1";
import { notificationsV1 } from "./schedules/notifications/v1";
import { statsGetV2 } from "./apis/stats/get/v2";
import { moodsCreateV2 } from "./apis/moods/create/v2";
import { achievementGetV2 } from "./apis/achievements/get/v2";
import { statsGetV3 } from "./apis/stats/get/v3";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

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

async function getUser(req: any): Promise<admin.auth.DecodedIdToken | null> {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    return null;
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
    return null;
  }

  try {
    const user = await admin.auth().verifyIdToken(idToken);
    return user;
  } catch (error) {
    return null;
  }
}

app.use(cors({ origin: true }));
main.use("/api", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.post("/moods", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

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

    return response.json({
      id: moodRef.id,
      data: mood.data(),
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.post("/v3/moods", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

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

    return response.json({
      id: moodRef.id,
      data: mood.data(),
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("/v2/moods", async (request: any, response) => {
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

app.get("/moods", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const order: string = request.query.order;
    const limit: number = request.query.limit;

    let moodQuerySnapshot;
    if (!!order && !!limit) {
      moodQuerySnapshot = await db
        .collection("moods")
        .where("userId", "==", userId)
        .orderBy(order, "desc")
        .limit(32)
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
        .limit(32)
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

    return response.json(moods);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

app.put("/moods/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");

    const id = request.params.id;
    const { value, date, note, tags } = request.body;
    const data = {
      value,
      date,
      tags,
      note,
    };

    if (!id) throw new Error("id is blank");

    await db.collection("moods").doc(id).set(data, { merge: true });

    return response.json({
      id: id,
      data,
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.delete("/moods/:id", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");

    const id = request.params.id;

    if (!id) throw new Error("id is blank");

    await db.collection("moods").doc(id).delete();

    return response.json({
      id: id,
    });
  } catch (error) {
    return response.status(500).send(error);
  }
});

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

app.post("/settings", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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

    const querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (querySnapshot.empty) {
      await db.collection("settings").add(data);
    } else {
      await db
        .collection("settings")
        .doc(querySnapshot.docs[0].id)
        .set(data, { merge: true });
    }

    response.json({ result: "All G" });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/v3/settings", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      nextNotification,
      tagOptions,
      colorPrimary,
      mode,
      timezone,
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
      timezone,
    };

    const querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (querySnapshot.empty) {
      await db.collection("settings").add(data);
    } else {
      await db
        .collection("settings")
        .doc(querySnapshot.docs[0].id)
        .set(data, { merge: true });
    }

    return response.json({ result: "All G" });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.post("/v4/settings", async (request, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    const {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      nextNotification,
      tagOptions,
      colorPrimary,
      colorSecondary,
      mode,
      timezone,
    } = request.body;
    const data = {
      remindersEnabled,
      randomReminders,
      frequencyMinutesMin,
      frequencyMinutesMax,
      userId,
      tagOptions,
      colorPrimary,
      colorSecondary,
      mode,
      nextNotification: new Date(nextNotification),
      timezone,
    };

    const querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .get();

    if (querySnapshot.empty) {
      await db.collection("settings").add(data);
    } else {
      await db
        .collection("settings")
        .doc(querySnapshot.docs[0].id)
        .set(data, { merge: true });
    }

    return response.json({ result: "All G" });
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("/settings", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) return response.status(403).send("Unauthorized");
    const userId = user.uid;

    let querySnapshot = await db
      .collection("settings")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) response.status(404).send("Not Found");

    const setting = querySnapshot.docs[0].data();

    return response.json(setting);
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
});

app.get("/achievements", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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
      colorPrimary: "#8B008B",
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
      colorPrimary: "#FFA500",
      unlocks: ["Dark Mode"],
    });

    // Feeling Amazing
    achievements.push({
      svg: "feelingAmazing",
      percentComplete: moods.some((mood: Mood) => mood.value === 10) ? 1 : 0,
      title: "Feeling Amazing",
      description: "Record a Feeling when you are feeling Amazing!",
      colorPrimary: "#FF8C00",
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
      colorPrimary: "#FFFF00",
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
      colorPrimary: "#7CFC00",
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

    // Looking Stylish
    achievements.push({
      svg: "lookingStylish",
      percentComplete: setting.colorPrimary === "#4071fe" ? 0 : 1,
      title: "Looking Stylish",
      description: "Change the Theme to a new color",
      colorPrimary: "#8A2BE2",
      unlocks: [],
    });

    // Full Moon
    achievements.push({
      svg: "fullMoon",
      percentComplete: setting.mode === Mode.Default ? 0 : 1,
      title: "Full Moon",
      description: "Try out Dark Mode",
      colorPrimary: "#FFFAFA",
      unlocks: [],
    });

    const days: string[] = moods.map((mood: Mood) =>
      dateFormat(mood.date, "d - m - yyyy")
    );

    let dayCount: number = 0;
    days.forEach((day: string) => {
      let count: number = days.filter((day2: string) => day2 === day).length;
      if (count > dayCount) dayCount = count;
    });

    const todaysCount: number = days.filter(
      (day: string) => day === dateFormat(new Date(), "d - m - yyyy")
    ).length;

    // Slow Day
    achievements.push({
      svg: "slowDay",
      percentComplete: dayCount >= 5 ? 1 : todaysCount / 5,
      title: "Slow Day",
      description: "Record 5 Feelings in a Day",
      colorPrimary: "#008000",
      unlocks: [],
    });

    // Active Day
    achievements.push({
      svg: "activeDay",
      percentComplete: dayCount >= 20 ? 1 : todaysCount / 20,
      title: "Active Day",
      description: "Record 20 Feelings in a Day",
      colorPrimary: "#808000",
      unlocks: [],
    });

    // Meaty Day
    achievements.push({
      svg: "meatyDay",
      percentComplete: dayCount >= 50 ? 1 : todaysCount / 50,
      title: "Meaty Day",
      description: "Record 50 Feelings in a Day",
      colorPrimary: "#00FFFF",
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

    // #F0FFF0
    // #F5FFFA
    // #FF69B4
    // #FFFFFF
    // #F0FFFF
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

    response.json(achievements);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/v2/achievements", async (request: any, response) => {
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

    const days: string[] = moods.map((mood: Mood) =>
      dateFormat(mood.date, "d - m - yyyy")
    );

    let dayCount: number = 0;
    days.forEach((day: string) => {
      let count: number = days.filter((day2: string) => day2 === day).length;
      if (count > dayCount) dayCount = count;
    });

    const todaysCount: number = days.filter(
      (day: string) => day === dateFormat(new Date(), "d - m - yyyy")
    ).length;

    // Slow Day
    achievements.push({
      svg: "slowDay",
      percentComplete: dayCount >= 5 ? 1 : todaysCount / 5,
      title: "Slow Day",
      description: "Record 5 Feelings in a Day",
      colorPrimary: "#008000",
      unlocks: [],
    });

    // Active Day
    achievements.push({
      svg: "activeDay",
      percentComplete: dayCount >= 20 ? 1 : todaysCount / 20,
      title: "Active Day",
      description: "Record 20 Feelings in a Day",
      colorPrimary: "#808000",
      unlocks: [],
    });

    // Meaty Day
    achievements.push({
      svg: "meatyDay",
      percentComplete: dayCount >= 50 ? 1 : todaysCount / 50,
      title: "Meaty Day",
      description: "Record 50 Feelings in a Day",
      colorPrimary: "#00FFFF",
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

app.get("/v3/achievements", async (request: any, response) => {
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

app.get("/stats", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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

    stats.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });

    response.json(stats);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/v2/stats", async (request: any, response) => {
  try {
    const user = await getUser(request);
    if (!user) response.status(403).send("Unauthorized");
    const userId = user!.uid;

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

    stats.sort(function (a, b) {
      return b.percentComplete - a.percentComplete;
    });

    response.json(stats);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/v3/stats", async (request: any, response) => {
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

app.get("/v1/calendar", async (request: any, response) => {
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

/*
 *
 * APIs
 * 
 * /
/* Mood */
//Create
export const apisMoodsCreateV1 = functions.https.onRequest(moodsCreateV1);
export const apisMoodsCreateV2 = functions.https.onRequest(moodsCreateV2);
//Get
export const apisMoodsGetV1 = functions.https.onRequest(moodsGetV1);
//Update
export const apisMoodsUpdateV1 = functions.https.onRequest(moodsUpdateV1);
//Delete
export const apisMoodsDeleteV1 = functions.https.onRequest(moodsDeleteV1);

/* Settings */
//Create
export const apisSettingsCreateV1 = functions.https.onRequest(settingsCreateV1);
//Get
export const apisSettingsGetV1 = functions.https.onRequest(settingsGetV1);

/* Push Notification Tokens */
//Create
export const apisPushNotificationTokensCreateV1 = functions.https.onRequest(
  pushNotificationTokensCreateV1
);

/* Stats */
//Get
export const apisStatsGetV1 = functions.https.onRequest(statsGetV1);
export const apisStatsGetV2 = functions.https.onRequest(statsGetV2);
export const apisStatsGetV3 = functions.https.onRequest(statsGetV3);

/* Achievements */
//Get
export const apisAchievementsGetV1 = functions.https.onRequest(
  achievementGetV1
);
export const apisAchievementsGetV2 = functions.https.onRequest(
  achievementGetV2
);

/* Calendar */
//Get
export const apisCalendarGetV1 = functions.https.onRequest(calendarGetV1);

/*
 *
 * Schedules
 *
 */
/* Notifications */
export const schedulesNotificationsV1 = notificationsV1;
