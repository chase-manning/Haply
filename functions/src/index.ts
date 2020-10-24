import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dateFormat from "dateformat";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

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

app.get("/achievements", async (request: any, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

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
        tagOptions: [],
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
        (mood: Mood) => dateFormat(mood.date, "d - m") === "25 = 12"
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
        (mood: Mood) => dateFormat(mood.date, "d - m") === "31 = 10"
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

app.get("/stats", async (request: any, response) => {
  try {
    const userId = await getUserId(request);
    if (userId === "") response.status(403).send("Unauthorized");

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
        tagOptions: [],
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
    percentComplete: dataPoints.length / 3,
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
