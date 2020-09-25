import Mood from "../models/mood";
import dateFormat from "dateformat";
import AchievementModel from "../models/AchievementModel";

import firstSteps from "../assets/svgs/undraw_relaunch_day_902d.svg";
import earlyBird from "../assets/svgs/undraw_japan_ubgk.svg";
import lunchDate from "../assets/svgs/undraw_eating_together_tjhx.svg";
import nightOwl from "../assets/svgs/undraw_working_late_pukg.svg";
import feelingAmazing from "../assets/svgs/undraw_super_thank_you_obwk.svg";
import merryChristmas from "../assets/svgs/undraw_christmas_tree_56sw.svg";
import happyHalloween from "../assets/svgs/undraw_witch_7uk7.svg";
import slowDay from "../assets/svgs/undraw_book_reading_kx9s.svg";
import activeDay from "../assets/svgs/undraw_hiking_d24r.svg";
import meatyDay from "../assets/svgs/undraw_Hamburger_8ge6.svg";
import theJourney from "../assets/svgs/undraw_home_cinema_l7yl.svg";
import settleIn from "../assets/svgs/undraw_decorative_friends_q2np.svg";
import forBreakfast from "../assets/svgs/undraw_breakfast_psiw.svg";
import aHabbit from "../assets/svgs/undraw_icon_design_qvdf.svg";
import aRoutine from "../assets/svgs/undraw_my_universe_lxnl.svg";
import aLifestyle from "../assets/svgs/undraw_snap_the_moment_oyn6.svg";

const AchievementService = {
  getAchievements(moods: Mood[]): AchievementModel[] {
    // TODO Change this to only run once
    let achievements: AchievementModel[] = [];

    // First Steps
    achievements.push(
      new AchievementModel(
        firstSteps,
        moods.length >= 1 ? 1 : 0,
        "First Steps",
        "Record your first feeling",
        "#4071FE"
      )
    );

    // Early Bird
    achievements.push(
      new AchievementModel(
        earlyBird,
        moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 5 && hour <= 6;
        })
          ? 1
          : 0,
        "Early Bird",
        "Record a Feeling in The Early Morning between 5am and 7am",
        "#FF0000"
      )
    );

    // Lunch Date
    achievements.push(
      new AchievementModel(
        lunchDate,
        moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour === 12;
        })
          ? 1
          : 0,
        "Lunch Date",
        "Record a Feeling at Luch Time between 12am and 1pm",
        "#FFD700"
      )
    );

    // Night Owl
    achievements.push(
      new AchievementModel(
        nightOwl,
        moods.some((mood: Mood) => {
          const hour: number = Number.parseInt(dateFormat(mood.date, "H"));
          return hour >= 23 || hour <= 3;
        })
          ? 1
          : 0,
        "Night Owl",
        "Record a Feeling late at Night between 11pm and 4am",
        "#FFA500",
        ["Dark Mode"]
      )
    );

    // Feeling Amazing
    achievements.push(
      new AchievementModel(
        feelingAmazing,
        moods.some((mood: Mood) => mood.value === 10) ? 1 : 0,
        "Feeling Amazing",
        "Record a Feeling when you are feeling Amazing!",
        "#FF8C00"
      )
    );

    // Merry Christmas
    achievements.push(
      new AchievementModel(
        merryChristmas,
        moods.some((mood: Mood) => dateFormat(mood.date, "d - m") === "25 = 12")
          ? 1
          : 0,
        "Merry Christmas",
        "Record a Feeling on Christmas Day",
        "#FFFF00"
      )
    );

    // Happy Halloween
    achievements.push(
      new AchievementModel(
        happyHalloween,
        moods.some((mood: Mood) => dateFormat(mood.date, "d - m") === "31 = 10")
          ? 1
          : 0,
        "Happy Halloween",
        "Record a Feeling on Halloween",
        "#7CFC00"
      )
    );

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
    achievements.push(
      new AchievementModel(
        slowDay,
        dayCount >= 5 ? 1 : todaysCount / 5,
        "Slow Day",
        "Record 5 Feelings in a Day",
        "#008000"
      )
    );

    // Active Day
    achievements.push(
      new AchievementModel(
        activeDay,
        dayCount >= 20 ? 1 : todaysCount / 20,
        "Active Day",
        "Record 20 Feelings in a Day",
        "#808000"
      )
    );

    // Meaty Day
    achievements.push(
      new AchievementModel(
        meatyDay,
        dayCount >= 50 ? 1 : todaysCount / 50,
        "Meaty Day",
        "Record 50 Feelings in a Day",
        "#00FFFF"
      )
    );

    // The Journey
    achievements.push(
      new AchievementModel(
        theJourney,
        Math.min(moods.length / 10, 1),
        "The Journey",
        "Record 10 Feelings",
        "#40E0D0"
      )
    );

    // Settle In
    achievements.push(
      new AchievementModel(
        settleIn,
        Math.min(moods.length / 100, 1),
        "Settle In",
        "Record 100 Feelings",
        "#00BFFF"
      )
    );

    // For Breakfast
    achievements.push(
      new AchievementModel(
        forBreakfast,
        Math.min(moods.length / 1000, 1),
        "For Breakfast",
        "Record 1,000 Feelings",
        "#483D8B"
      )
    );

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
    achievements.push(
      new AchievementModel(
        aHabbit,
        Math.min(maxDays / 7, 1),
        "A Habbit",
        "Record your Feelings every day for a Week",
        "#7B68EE"
      )
    );

    // A Routine
    achievements.push(
      new AchievementModel(
        aRoutine,
        Math.min(maxDays / 30, 1),
        "A Routine",
        "Record your Feelings every day for a Month",
        "#EE82EE"
      )
    );

    // A Lifestyle
    achievements.push(
      new AchievementModel(
        aLifestyle,
        Math.min(maxDays / 365, 1),
        "A Lifestyle",
        "Record your Feelings every day for a Year",
        "#FF00FF"
      )
    );

    // #8A2BE2
    // #FFFAFA
    // #FA8072
    // #F0FFF0
    // #8B008B
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

    return achievements;
  },
};

export default AchievementService;
