import AchievementModel from "../models/AchievementModel";

import firstSteps from "../assets/svgs/RelaunchDay.svg";
import earlyBird from "../assets/svgs/Japan.svg";
import lunchDate from "../assets/svgs/EatingTogether.svg";
import nightOwl from "../assets/svgs/WorkingLate.svg";
import feelingAmazing from "../assets/svgs/SuperThankYou.svg";
import merryChristmas from "../assets/svgs/ChristmasTree.svg";
import happyHalloween from "../assets/svgs/Witch.svg";
import highFlyer from "../assets/svgs/InstantSupport.svg";
import lookingStylish from "../assets/svgs/MakingArt.svg";
import fullMoon from "../assets/svgs/Moonlight.svg";
import avidWriter from "../assets/svgs/Learning.svg";
import masterTagger from "../assets/svgs/Typewriter.svg";
import theJourney from "../assets/svgs/HomeCinema.svg";
import settleIn from "../assets/svgs/DecorativeFriends.svg";
import forBreakfast from "../assets/svgs/Breakfast.svg";
import aHabbit from "../assets/svgs/IconDesign.svg";
import aRoutine from "../assets/svgs/MyUniverse.svg";
import aLifestyle from "../assets/svgs/SnapTheMoment.svg";
import ApiService from "./ApiService";

const AchievementService = {
  async getAchievements(
    userToken: string,
    currentAchievements: AchievementModel[]
  ): Promise<AchievementModel[] | null> {
    try {
      const route =
        "https://us-central1-happiness-software.cloudfunctions.net/apisAchievementsGetV1";
      const response = await ApiService(route, userToken, "GET");

      let achievements: AchievementModel[] = await response!.json();
      achievements.forEach(
        (achievement: AchievementModel) =>
          (achievement.svg = getSvg(achievement.svg))
      );

      achievements = getAchievementsWithIsNew(
        currentAchievements,
        achievements
      );

      return achievements;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

const getSvg = (name: string): string => {
  switch (name) {
    case "firstSteps":
      return firstSteps;
    case "earlyBird":
      return earlyBird;
    case "lunchDate":
      return lunchDate;
    case "nightOwl":
      return nightOwl;
    case "feelingAmazing":
      return feelingAmazing;
    case "merryChristmas":
      return merryChristmas;
    case "happyHalloween":
      return happyHalloween;
    case "highFlyer":
      return highFlyer;
    case "lookingStylish":
      return lookingStylish;
    case "fullMoon":
      return fullMoon;
    case "avidWriter":
      return avidWriter;
    case "masterTagger":
      return masterTagger;
    case "theJourney":
      return theJourney;
    case "settleIn":
      return settleIn;
    case "forBreakfast":
      return forBreakfast;
    case "aHabbit":
      return aHabbit;
    case "aRoutine":
      return aRoutine;
    case "aLifestyle":
      return aLifestyle;
    default:
      return feelingAmazing;
  }
};

const getAchievementsWithIsNew = (
  currentAchievements: AchievementModel[],
  newAchievements: AchievementModel[]
): AchievementModel[] => {
  if (currentAchievements.length === 0) return newAchievements;
  newAchievements
    .filter(
      (newAchievement: AchievementModel) => newAchievement.percentComplete === 1
    )
    .forEach((newAchievement: AchievementModel) => {
      let currentAchievementList = currentAchievements.filter(
        (achievement: AchievementModel) =>
          achievement.title === newAchievement.title
      );
      if (currentAchievementList.length > 0) {
        let currentAchievement = currentAchievementList[0];
        if (
          currentAchievement &&
          currentAchievement.percentComplete < 1 &&
          newAchievement.percentComplete === 1
        )
          newAchievement.isNew = true;
      }
    });
  return newAchievements;
};

export default AchievementService;
