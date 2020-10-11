import Mood from "./mood";
import { StatModel } from "../models/StatModel";
import AchievementModel from "./AchievementModel";

export enum Mode {
  Default,
  Dark,
  Light,
}

export class Persist {
  moods: Mood[] = [];
  stats: StatModel[] = [];
  achievements: AchievementModel[] = [];
  tagOptions: string[] = [
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
  colorPrimary: string = "#4071fe";
  mode: Mode = Mode.Default;
  pushNotificationToken?: string;
}

export default class State {
  persist: Persist = new Persist();
}
